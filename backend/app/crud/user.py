import datetime
import uuid
from typing import Any

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import User


async def create_user(*, session: AsyncSession, user_create: User) -> User:
    username_query_result = await session.execute(select(User).filter(User.username == user_create.username))
    username_query_result = username_query_result.scalars().all()
    if username_query_result:
        raise HTTPException(status_code=400, detail="Username already exists")
    telegram_id_query_result = await session.execute(select(User).filter(User.telegram_id == user_create.telegram_id))
    telegram_id_query_result = telegram_id_query_result.scalars().all()
    if telegram_id_query_result:
        raise HTTPException(status_code=400, detail="Telegram ID already exists")
    
    db_obj = User.model_validate(
        user_create,
    )
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj

async def get_users(*, session: AsyncSession) -> Any:
    users = await session.execute(select(User))
    return users.scalars().all()