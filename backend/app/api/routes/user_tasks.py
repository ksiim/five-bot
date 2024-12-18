import datetime
import uuid
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import col, delete, func, select

from app.crud import task as crud_task
from app.crud import user as crud_user
from app.crud import user_task as crud_user_task
from app.api.deps import (
    SessionDep,
)
from app.models import (
    UserTask,
    UserTaskCreate,
    UserTaskUpdate,
    UserTaskPublic,
    UserTasksPublic,
)

router = APIRouter()

@router.post(
    '/',
    response_model=UserTaskPublic
)
async def create_user_task(
    *,
    session: SessionDep,
    user_task: UserTaskCreate
):
    task = (await crud_task.get_task_by_id(session, user_task.task_id))
    reward = task.reward
    user = (await crud_user.get_user_by_id(session, user_task.user_id))
    await crud_user.update_balance(session, user, reward)
    user_task = await crud_user_task.create_user_task(session, user_task)
    return user_task
    
@router.get(
    '/user/{telegram_id}',
    response_model=UserTasksPublic
)
async def get_user_tasks_by_telegram_id(
    *,
    session: SessionDep,
    telegram_id: int,
    task_id: Optional[uuid.UUID] = None,
    completed_at: Optional[datetime.datetime] = None,
    limit: int = 20,
    offset: int = 0
):
    user = await crud_user.get_user_by_telegram_id(session, telegram_id)
    user_tasks = await crud_user_task.get_user_tasks(session, user.id, task_id, completed_at, limit, offset)
    return user_tasks


@router.get(
    '/',
    response_model=UserTasksPublic
)
async def get_all_user_tasks(
    *,
    session: SessionDep
):
    user_tasks = await crud_user_task.get_all_user_tasks(session)
    return user_tasks

@router.delete(
    '/{user_task_id}',
)
async def delete_user_task_by_id(
    user_task_id: uuid.UUID,
    session: SessionDep,
):
    user_task = await crud_user_task.get_user_task_by_id(session, user_task_id)
    if not user_task:
        raise HTTPException(status_code=404, detail="User Task not found")
    await session.delete(user_task)
    await session.commit()
    return 'User Task deleted'