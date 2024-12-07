from collections.abc import Generator, Coroutine
from typing import Annotated

import aiohttp
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import *
from app.core.db import engine
from app.models import User

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{API_V1_STR}/login/access-token"
)


async def get_db():
    async with AsyncSession(engine) as session:
        yield session


SessionDep = Annotated[AsyncSession, Depends(get_db)]


async def get_current_user(session: SessionDep, ):
    user = await session.get(User)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.admin:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


async def get_current_active_superuser(current_user: CurrentUser) -> User:
    if not current_user.admin:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user

async def is_in_channel_func(channel_id, telegram_id):
    bot_token = BOT_TOKEN
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