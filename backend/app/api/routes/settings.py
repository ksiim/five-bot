

from sqlalchemy import func, select
from fastapi import APIRouter

from app.models import (
    Setting, SettingCreate, SettingsPublic,
    SettingUpdate, SettingPublic
)
from app.api.deps import SessionDep

from app.crud import settings as crud_settings

router = APIRouter()

@router.get(
    '/',
    response_model=SettingsPublic,
)
async def read_settings(
    *,
    skip: int = 0,
    limit: int = 100,
    session: SessionDep,
):
    statement = select(Setting)
    count_statement = select(func.count()).select_from(statement.subquery())
    count = (await session.execute(count_statement)).scalar()
    statement = statement.offset(skip).limit(limit)
    settings = (await session.execute(statement)).scalars().all()
    return SettingsPublic(count=count, data=settings)

@router.post(
    '/',
    response_model=SettingPublic,
)
async def create_setting(
    setting_create: SettingCreate,
    session: SessionDep,
):
    setting = await crud_settings.create_setting(session=session, setting_create=setting_create)
    return setting

@router.get(
    '/{setting_id}',
    response_model=SettingPublic,
)
async def read_setting_by_id(
    setting_id: int,
    session: SessionDep,
):
    setting = await crud_settings.get_setting_by_id(session=session, setting_id=setting_id)
    return setting

@router.put(
    '/{setting_id}',
    response_model=SettingPublic,
)
async def update_setting(
    setting_id: int,
    setting_update: SettingUpdate,
    session: SessionDep,
):
    setting = await crud_settings.get_setting_by_id(session=session, setting_id=setting_id)
    setting = await crud_settings.update_setting(session=session, setting=setting, setting_update=setting_update)
    return setting

@router.get(
    '/name/{name}',
    response_model=SettingPublic,
)
async def read_setting_by_name(
    name: str,
    session: SessionDep,
):
    setting = await crud_settings.get_setting_by_name(session=session, name=name)
    return setting