import asyncio
import logging

from sqlalchemy import Engine, text
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed

from core.db import engine, DATABASE_URL

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

max_tries = 60 * 5  # 5 minutes
wait_seconds = 1


@retry(
    stop=stop_after_attempt(max_tries),
    wait=wait_fixed(wait_seconds),
    before=before_log(logger, logging.INFO),
    after=after_log(logger, logging.WARN),
)
async def init(db_engine: Engine) -> None:
    try:
        async with AsyncSession(bind=db_engine) as session:
            # Try to create session to check if DB is awake
            await session.execute(text('DROP TABLE IF EXISTS alembic_version;'))
            await session.commit()
            await session.execute(select(1))
    except Exception as e:
        logger.error(e)
        raise e


async def main() -> None:
    logger.info("Initializing service")
    logger.info(str(DATABASE_URL))
    await init(engine)
    logger.info("Service finished initializing")


if __name__ == "__main__":
    asyncio.run(main())
