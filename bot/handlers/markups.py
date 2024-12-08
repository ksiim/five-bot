from aiogram.types import (
    InlineKeyboardMarkup, InlineKeyboardButton,
    ReplyKeyboardMarkup, ReplyKeyboardRemove,
    KeyboardButton, WebAppInfo, Message
)
from config import WEB_APP_URL


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