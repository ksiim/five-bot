from aiogram.types import (
    Message, CallbackQuery
)
from aiogram.filters.command import Command
from aiogram.fsm.context import FSMContext
from aiogram import F

from bot import dp, bot


from .markups import *
from .filters import *



@dp.message(Command('stat'), IsAdmin())
async def statistic_handler(message: Message, state: FSMContext):
    await state.clear()
    
    await send_statistic(message.from_user.id)
    

async def send_statistic(telegram_id: int):
    await bot.send_message(
        chat_id=telegram_id,
        text=await generate_statistic_text()
    )
