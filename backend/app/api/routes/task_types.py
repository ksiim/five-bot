import datetime
import uuid
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import col, delete, func, select

from app.crud import task_type as crud_task_type
from app.api.deps import (
    SessionDep,
)
from app.models import (
    TaskType,
    TaskTypeCreate,
    TaskTypePublic,
    TaskTypesPublic,
)

router = APIRouter()


@router.get(
    '/',
    response_model=TaskTypesPublic,
)
async def read_task_types(
    session: SessionDep,
    skip: int = 0,
    limit: int = 100,
    sort_by: Optional[str] = Query(None, regex="^(name|description|created_at|updated_at)$"),
    sort_order: Optional[str] = Query("asc", regex="^(asc|desc)$")
):
    statement = select(TaskType)
    
    if sort_by:
        column = getattr(TaskType, sort_by)
        if sort_order == "asc":
            statement = statement.order_by(column.asc())
        else:
            statement = statement.order_by(column.desc())
            
    statement = statement.offset(skip).limit(limit)
    
    count_statement = select(func.count()).select_from(statement.subquery())
    count = (await session.execute(count_statement)).scalar()
            
    task_types = (await session.execute(statement)).scalars().all()

    return TaskTypesPublic(data=task_types, count=count)


@router.post(
    '/',
    response_model=TaskTypePublic,
)
async def create_task_type(
    task_type_create: TaskTypeCreate,
    session: SessionDep,
):
    task_type = await crud_task_type.create_task_type(session=session, task_type_create=task_type_create)
    return task_type


@router.delete(
    '/{task_type_id}',
)
async def delete_task_type_by_id(
    task_type_id: uuid.UUID,
    session: SessionDep,
):
    task_type = await crud_task_type.get_task_type_by_id(session, task_type_id)
    if not task_type:
        raise HTTPException(status_code=404, detail="TaskType not found")
    await crud_task_type.delete_task_type(session=session, task_type=task_type)
    return 'TaskType deleted'


@router.get(
    '/{task_type_id}',
    response_model=TaskTypePublic,
)
async def read_task_type_by_id(
    task_type_id: uuid.UUID,
    session: SessionDep,
):
    task_type = await crud_task_type.get_task_type_by_id(session, task_type_id)
    if not task_type:
        raise HTTPException(status_code=404, detail="TaskType not found")
    return task_type


@router.put(
    '/{task_type_id}',
    response_model=TaskTypePublic,
)
async def update_task_type(
    task_type_id: uuid.UUID,
    task_type_update: TaskTypeCreate,
    session: SessionDep,
):
    task_type = await crud_task_type.get_task_type_by_id(session, task_type_id)
    if not task_type:
        raise HTTPException(status_code=404, detail="TaskType not found")
    task_type = await crud_task_type.update_task_type(session=session, task_type=task_type, task_type_update=task_type_update)
    return task_type
