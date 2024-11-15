import datetime
import uuid
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import col, delete, func, select

from app.crud import user as crud_user
from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_active_superuser,
)
from app.models import (
    User,
    UserCreate,
    UserPublic,
    UsersPublic,
)

router = APIRouter()

@router.get(
    '/',
    response_model=UsersPublic,
)
async def read_users(
    session: SessionDep,
    skip: int = 0,
    limit: int = 100,
    sort_by: Optional[str] = Query(None, regex="^(username|telegram_id|balance|premium|created_at|last_activity_at)$"),
    sort_order: Optional[str] = Query("asc", regex="^(asc|desc)$")
):
    statement = select(User)
    
    if sort_by:
        column = getattr(User, sort_by)
        if sort_order == "asc":
            statement = statement.order_by(column.asc())
        else:
            statement = statement.order_by(column.desc())
            
    statement = statement.offset(skip).limit(limit)
    
    count_statement = select(func.count()).select_from(statement.subquery())
    count = (await session.execute(count_statement)).scalar()
            
    users = (await session.execute(statement)).scalars().all()

    return UsersPublic(data=users, count=count)

@router.get(
    '/{user_id}',
    response_model=UserPublic,
)
async def read_user_by_id(
    user_id: uuid.UUID,
    session: SessionDep,
):
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post(
    '/'
)
async def create_user(
    *,
    user_in: UserCreate,
    session: SessionDep,
):
    return await crud_user.create_user(session=session, user_create=user_in)

@router.get(
    '/balance/{user_id}',
    response_model=int,
)
async def get_balance(
    user_id: uuid.UUID,
    session: SessionDep
):
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.balance

@router.get(
    '/last_five_timestamp/{user_id}',
    response_model=datetime.datetime,
)
async def get_last_five_timestamp(
    user_id: uuid.UUID,
    session: SessionDep
):
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.last_five_timestamp