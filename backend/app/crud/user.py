import datetime
import uuid
from typing import Any

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import User, UserCreate
from app.crud import setting as crud_setting


async def create_user(*, session: AsyncSession, user_create: UserCreate) -> User:
    username_query_result = await session.execute(select(User).filter(User.username == user_create.username))
    username_query_result = username_query_result.scalars().all()
    if username_query_result:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    telegram_id_query_result = await session.execute(select(User).filter(User.telegram_id == user_create.telegram_id))
    telegram_id_query_result = telegram_id_query_result.scalars().all()
    if telegram_id_query_result:
        raise HTTPException(status_code=400, detail="Telegram ID already exists")
    
        
    db_obj = User(**user_create.model_dump())
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    
    if db_obj.from_user_telegram_id:
        await process_user_bonus(session, db_obj)
        
    return db_obj

async def process_user_bonus(session, user_create: User):
    from_user = await get_user_by_telegram_id(session, user_create.from_user_telegram_id)
    if not from_user:
        raise HTTPException(status_code=400, detail="From user not found")
    
    initial_bonus = await get_initial_bonus(session, user_create)
        
    initial_bonus_amount = int(initial_bonus.value)
    
    await session.refresh(from_user)
    await update_balance(session, from_user, initial_bonus_amount)
    
    await session.refresh(user_create)
    await update_balance(session, user_create, initial_bonus_amount)

async def get_initial_bonus(session, user_create):
    if user_create.premium:
        initial_bonus = await crud_setting.get_setting_by_name(session, "initial_bonus_with_premium")
    else:
        initial_bonus = await crud_setting.get_setting_by_name(session, "initial_bonus")
    return initial_bonus

async def get_users(*, session: AsyncSession) -> Any:
    users = await session.execute(select(User))
    return users.scalars().all()

async def get_user_by_telegram_id(session: AsyncSession, telegram_id) -> User:
    statement = select(User).filter(User.telegram_id == telegram_id)
    return (await session.execute(statement)).scalar_one_or_none()

async def get_user_by_id(session: AsyncSession, user_id: uuid.UUID) -> User:
    statement = select(User).filter(User.id == user_id)
    return (await session.execute(statement)).scalar_one_or_none()

async def update_user(*, session: AsyncSession, user: User, user_update: UserCreate) -> User:
    user_update_data = user_update.model_dump(exclude_unset=True, exclude={"telegram_id", "from_user"})
    for key, value in user_update_data.items():
        setattr(user, key, value)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user

async def update_balance(session: AsyncSession, user: User, balance: int) -> User:
    user.balance += balance
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user

async def delete_user(session: AsyncSession, user: User) -> None:
    await session.delete(user)
    await session.commit()
    return 