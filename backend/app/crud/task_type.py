import datetime
import uuid
from typing import Any

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import TaskType, TaskTypeCreate, TaskTypeUpdate, TaskTypePublic, TaskTypesPublic


async def create_task_type(*, session: AsyncSession, task_type_create: TaskTypeCreate) -> TaskType:
    db_obj = TaskType.model_validate(
        task_type_create,
    )
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj

async def get_task_types(*, session: AsyncSession) -> Any:
    task_types = await session.execute(select(TaskType))
    return task_types.scalars().all()

async def get_task_type_by_id(session: AsyncSession, task_type_id) -> TaskType:
    statement = select(TaskType).filter(TaskType.id == task_type_id)
    return (await session.execute(statement)).scalar_one_or_none()

async def update_task_type(*, session: AsyncSession, task_type: TaskType, task_type_update: TaskTypeUpdate) -> TaskType:
    task_type_update_data = task_type_update.model_dump(exclude_unset=True)
    for key, value in task_type_update_data.items():
        setattr(task_type, key, value)
    session.add(task_type)
    await session.commit()
    await session.refresh(task_type)
    return task_type

async def delete_task_type(*, session: AsyncSession, task_type: TaskType):
    await session.delete(task_type)
    await session.commit()