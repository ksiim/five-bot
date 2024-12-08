import datetime
import uuid
from typing import Any

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import User, Task, TaskCreate, TaskUpdate, TaskPublic, TasksPublic


async def create_task(*, session: AsyncSession, task_create: TaskCreate) -> Task:
    db_obj = Task.model_validate(
        task_create,
    )
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj

async def get_tasks(*, session: AsyncSession) -> Any:
    tasks = await session.execute(select(Task).order_by(Task.created_at))
    return tasks.scalars().all()

async def get_task_by_id(session: AsyncSession, task_id) -> Task:
    statement = select(Task).filter(Task.id == task_id)
    return (await session.execute(statement)).scalar_one_or_none()

async def update_task(*, session: AsyncSession, task: Task, task_update: TaskUpdate) -> Task:
    task_update_data = task_update.model_dump(exclude_unset=True)
    for key, value in task_update_data.items():
        setattr(task, key, value)
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task

async def delete_task(*, session: AsyncSession, task: Task) -> Task:
    await session.delete(task)
    await session.commit()
    # await session.refresh(task)
    # return task
