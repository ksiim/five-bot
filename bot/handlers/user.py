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
    await message.answer(greeting_message)