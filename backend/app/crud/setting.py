import datetime
import uuid
from typing import Any

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import (
    Setting, SettingPublic,
    SettingCreate, SettingUpdate,
    SettingsPublic,
)


async def create_setting(*, session: AsyncSession, setting_create: SettingCreate) -> Setting:
    db_obj = Setting.model_validate(
        setting_create,
    )
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj

async def get_settings(*, session: AsyncSession) -> Any:
    settings = await session.execute(select(Setting))
    return settings.scalars().all()

async def get_setting_by_id(session: AsyncSession, setting_id) -> Setting:
    statement = select(Setting).filter(Setting.id == setting_id)
    return (await session.execute(statement)).scalar_one_or_none()

async def update_setting(*, session: AsyncSession, setting: Setting, setting_update: SettingUpdate) -> Setting:
    setting_update_data = setting_update.model_dump(exclude_unset=True)
    for key, value in setting_update_data.items():
        setattr(setting, key, value)
    setting.updated_at = datetime.datetime.now()
    session.add(setting)
    await session.commit()
    await session.refresh(setting)
    return setting

async def delete_setting(*, session: AsyncSession, setting: Setting) -> Setting:
    await session.delete(setting)
    await session.commit()
    # await session.refresh(setting)
    # return setting
    
async def get_setting_by_name(session: AsyncSession, name) -> Setting:
    statement = select(Setting).filter(Setting.name == name)
    result = (await session.execute(statement)).scalar_one_or_none()
    return result