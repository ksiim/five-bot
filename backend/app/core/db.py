from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from app.crud import setting

from .config import *
from app.models import Setting, User, SQLModel
from app.crud.user import create_user


engine = create_async_engine(DATABASE_URL)

async def init_db(session: AsyncSession) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines

    # from app.core.engine import engine
    # This works because the models are already imported and registered from app.models
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
        
    settings = (await session.execute(select(Setting))).scalars().all()
    
    if not settings:
        give_five = Setting(name="give_five_value", value=GIVE_FIVE_VALUE)
        give_five_to_referrer = Setting(name="give_five_to_referrer_value", value=GIVE_FIVE_TO_REFERRER_VALUE)
        initial_bonus = Setting(name="initial_bonus", value=INITIAL_BONUS_VALUE)
        initial_bonus_with_premium = Setting(name="initial_bonus_with_premium", value=INITIAL_BONUS_WITH_PREMIUM_VALUE)
        
        
        session.add(give_five)
        session.add(give_five_to_referrer)
        session.add(initial_bonus)
        session.add(initial_bonus_with_premium)
        
        await session.commit()
