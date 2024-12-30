import asyncio
from bot import dp, bot

from aiogram.types import (
    Message, CallbackQuery,
)

from aiogram.filters.command import Command
from aiogram.fsm.context import FSMContext
from aiogram import F

from .markups import *


@dp.message(Command("start"))
async def start(message: Message):
    await message.answer(
        text=await generate_greeting_message(message),
        reply_markup=web_app_inline_markup
    )
    
    
@dp.message()
async def get_channel_id(message: Message):
    await message.answer(
        text=f"Channel ID: {message.forward_from_chat.id}"
    )