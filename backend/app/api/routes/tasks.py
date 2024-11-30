import datetime
import logging
import uuid
from typing import Any, Optional

import aiohttp
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import col, delete, func, select

from app.crud import task as crud_task
from app.crud import user as crud_user
from app.api.deps import (
    SessionDep,
)
from app.models import (
    Task,
    TaskCreate,
    TaskPublic,
    TasksPublic,
    UserTask,
)
from app.core import config

router = APIRouter()

@router.get(
    '/',
    response_model=TasksPublic,
)
async def read_tasks(
    session: SessionDep,
    skip: int = 0,
    limit: int = 100,
    sort_by: Optional[str] = Query(None, regex="^(name|description|created_at|updated_at)$"),
    sort_order: Optional[str] = Query("asc", regex="^(asc|desc)$")
):
    statement = select(Task)
    
    if sort_by:
        column = getattr(Task, sort_by)
        if sort_order == "asc":
            statement = statement.order_by(column.asc())
        else:
            statement = statement.order_by(column.desc())
            
    statement = statement.offset(skip).limit(limit)
    
    count_statement = select(func.count()).select_from(statement.subquery())
    count = (await session.execute(count_statement)).scalar()
            
    tasks = (await session.execute(statement)).scalars().all()

    return TasksPublic(data=tasks, count=count)

@router.post(
    '/',
    response_model=TaskPublic,
)
async def create_task(
    task_create: TaskCreate,
    session: SessionDep,
):
    task = await crud_task.create_task(session=session, task_create=task_create)
    return task

@router.delete(
    '/{task_id}',
)
async def delete_task_by_id(
    task_id: uuid.UUID,
    session: SessionDep,
):
    task = await crud_task.get_task_by_id(session=session, task_id=task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    await crud_task.delete_task(session=session, task=task)
    return 'Task deleted'

@router.get(
    '/{task_id}',
    response_model=TaskPublic,
)
async def read_task_by_id(
    task_id: uuid.UUID,
    session: SessionDep,
):
    task = await crud_task.get_task_by_id(session=session, task_id=task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put(
    '/{task_id}',
    response_model=TaskPublic,
)
async def update_task(
    task_id: uuid.UUID,
    task_update: TaskCreate,
    session: SessionDep,
):
    task = await crud_task.update_task(session=session, task_id=task_id, task_update=task_update)
    return task


@router.get(
    '/user/{telegram_id}',
    response_model=TasksPublic,
)
async def read_tasks_for_telegram_id(
    telegram_id: int,
    session: SessionDep,
):
    user = await crud_user.get_user_by_telegram_id(session, telegram_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    completed_tasks_statement = select(UserTask).where(UserTask.user_id == user.id)
    completed_tasks = (await session.execute(completed_tasks_statement)).scalars().all()
    completed_task_ids = [task.task_id for task in completed_tasks]

    uncompleted_tasks_statement = select(Task).where(Task.id.notin_(completed_task_ids))
    uncompleted_tasks = (await session.execute(uncompleted_tasks_statement)).scalars().all()

    return TasksPublic(data=uncompleted_tasks, count=len(uncompleted_tasks))

async def is_in_channel_func(channel_id, telegram_id):
    bot_token = config.BOT_TOKEN
    async with aiohttp.ClientSession() as session:
        async with session.get(
            f"https://api.telegram.org/bot{bot_token}/getChatMember?chat_id={channel_id}&user_id={telegram_id}"
        ) as response:
            data = await response.json()
            chat_member_status = data.get("result", {}).get("status")
            print(f"TG_ID: {telegram_id}; chat_member_status: {chat_member_status}")
            if chat_member_status is None:
                return False
            return chat_member_status != "left"
            
@router.get(
    '/is_in_channel/{channel_id}&{telegram_id}',
)
async def is_in_channel(
    channel_id: str,
    telegram_id: int,
):
    return await is_in_channel_func(channel_id, telegram_id)
    
    