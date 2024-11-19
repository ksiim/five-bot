import datetime
import uuid
from typing import Any, Optional

import aiohttp
import urllib
from app.core import config
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import col, delete, func, select

from app.crud import user as crud_user
from app.crud import setting as crud_setting
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
    '/{telegram_id}',
    response_model=UserPublic,
)
async def read_user_by_telegram_id(
    telegram_id: int,
    session: SessionDep,
):
    user = await crud_user.get_user_by_telegram_id(session, telegram_id)
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
    '/balance/{telegram_id}',
    response_model=int,
)
async def get_balance_by_telegram_id(
    telegram_id: int,
    session: SessionDep
):
    user = await crud_user.get_user_by_telegram_id(session, telegram_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.balance

@router.get(
    '/last-five-timestamp/{telegram_id}',
    response_model=datetime.datetime,
)
async def get_last_five_timestamp_by_telegram_id(
    telegram_id: int,
    session: SessionDep
):
    user = await crud_user.get_user_by_telegram_id(session, telegram_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.last_five_timestamp

@router.put(
    '/{telegram_id}',
    response_model=UserPublic,
)
async def update_user(
    telegram_id: int,
    user_in: UserCreate,
    session: SessionDep,
):
    user = await crud_user.get_user_by_telegram_id(session, telegram_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return await crud_user.update_user(session=session, user=user, user_update=user_in)


@router.get(
    '/referral-link/{telegram_id}',
)
async def get_referral_link_by_telegram_id(
    telegram_id: int,
    session: SessionDep
):
    user = await crud_user.get_user_by_telegram_id(session, telegram_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    async with aiohttp.ClientSession() as session:
        async with session.get(f"https://api.telegram.org/bot{config.BOT_TOKEN}/getMe") as response:
            data = await response.json()
            bot_username = data["result"]["username"]
    
    return f"https://t.me/{bot_username}/game?startapp=ref{user.telegram_id}"


@router.get(
    '/referral-share-link/{telegram_id}&{description}',
)
async def get_referral_link_with_description_by_telegram_id(
    telegram_id: int,
    description: str,
    session: SessionDep
):
    referral_link = await get_referral_link_by_telegram_id(telegram_id, session)
    user = await crud_user.get_user_by_telegram_id(session, telegram_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    description = urllib.parse.quote(f"{description}\n")
    
    return f"t.me/share/url?url={referral_link}&text={description}"


@router.post(
    '/give-five/{telegram_id}',
)
async def give_five(
    telegram_id: int,
    session: SessionDep,
):
    user = await crud_user.get_user_by_telegram_id(session, telegram_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.last_five_timestamp:
        if (datetime.datetime.now() - user.last_five_timestamp).days < 1:
            raise HTTPException(status_code=400, detail="You can give five only once a day")
    
    give_five_value = await crud_setting.get_setting_by_name(session, "give_five_value")
    
    if user.from_user_telegram_id:
        from_user = await crud_user.get_user_by_telegram_id(session, user.from_user_telegram_id)
        if not from_user:
            raise HTTPException(status_code=404, detail="From user not found")
        
        give_five_to_referrer_value = crud_setting.get_setting_by_name(
            session, "give_five_to_referrer_value"
        )
        
        await crud_user.update_balance(
            session, from_user,
            int(give_five_to_referrer_value.value)
        )
    
    user = await crud_user.update_balance(session, user, int(give_five_value.value))
    user.last_five_timestamp = datetime.datetime.now()
    
    await session.commit()
    await session.refresh(user)
    
    return user

@router.get(
    '/user/rate/{telegram_id}',
)
async def get_user_rate(
    telegram_id: int,
    session: SessionDep
):
    user = await crud_user.get_user_by_telegram_id(session, telegram_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    count = await session.execute(select(func.count(User.id)).where(User.balance > user.balance))
    rate = count.scalar()
    
    return rate + 1