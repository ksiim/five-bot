import asyncio
import logging
from aiogram.types import (
    InlineKeyboardMarkup, InlineKeyboardButton,
    ReplyKeyboardMarkup, ReplyKeyboardRemove,
    KeyboardButton, WebAppInfo, Message
)
from config import WEB_APP_URL

from .db import (
    get_count_of_users,
    get_refs_count,
    get_top_refs
)


async def generate_greeting_message(message: Message):
    greeting_message = f"""
Привет, {message.from_user.full_name}!✌️

Добро пожаловать в FIVE! 🥳

Здесь ты можешь давать пять и получать токены $FIVE каждый день. Приглашай друзей и получай 500 $FIVE за каждого друга, в будущем $FIVE можно будет обменять на реальные деньги.
"""
    return greeting_message

web_app_inline_markup = InlineKeyboardMarkup(
    inline_keyboard=[
        [
            InlineKeyboardButton(text="🖐 ИГРАТЬ 🖐", web_app=WebAppInfo(
                url=WEB_APP_URL,
                )),
        ],
        [
            InlineKeyboardButton(
                text="✨ Подписаться на канал ✨",
                url="https://t.me/highfive_community"
            )
        ]
    ]
)

async def generate_statistic_text():
    count_of_users, top_refs = await asyncio.gather(
        get_count_of_users(),
        get_top_refs()
    )
    
    statistic_text = f'Всего пользователей: {count_of_users}\n\nТоп рефералов:\n'
    for i, user in enumerate(top_refs):
        statistic_text += f"{i + 1}. {user['user']['username']} - {user['referral_count']} шт.\n"
    return statistic_text
    