import datetime
import uuid
from typing import Any

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select

from app.models import UserTask, UserTaskCreate, UserTaskUpdate, UserTaskPublic, UserTasksPublic


async def create_user_task(session: AsyncSession, user_task: UserTaskCreate) -> UserTaskPublic:
    db_obj = UserTask.model_validate(user_task)
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj

async def get_user_tasks(
    session: AsyncSession,
    user_id: uuid.UUID,
    task_id: uuid.UUID = None,
    completed_at: datetime.datetime = None,
    limit: int = 20,
    offset: int = 0,
) -> UserTasksPublic:
    statement = select(UserTask).filter(UserTask.user_id == user_id)
    if task_id:
        statement = statement.filter(UserTask.task_id == task_id)
    if completed_at:
        statement = statement.filter(UserTask.completed_at == completed_at)
    statement = statement.offset(offset).limit(limit)
    user_tasks = await session.execute(statement)
    user_tasks = user_tasks.scalars().all()
    return UserTasksPublic(data=user_tasks, count=len(user_tasks))

async def get_all_user_tasks(session: AsyncSession) -> Any:
    user_tasks = await session.execute(select(UserTask))
    user_tasks_list = user_tasks.scalars().all()
    
    user_tasks_count = await session.execute(select(func.count(UserTask.id)))
    user_tasks_count = user_tasks_count.scalar()
    
    return UserTasksPublic(data=user_tasks_list, count=user_tasks_count)

async def get_user_task_by_id(session: AsyncSession, user_task_id) -> UserTask:
    user_task = await session.get(UserTask, user_task_id)
    return user_task
