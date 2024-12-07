from aiogram.types import (
    InlineKeyboardMarkup, InlineKeyboardButton,
    ReplyKeyboardMarkup, ReplyKeyboardRemove,
    KeyboardButton, WebAppInfo, Message
)
from config import WEB_APP_URL


async def generate_greeting_message(message: Message):
    greeting_message = f"""
Привет, {message.from_user.full_name}!✌️

Добро пожаловать в Five!🥳

Здесь ты можешь получать волшебную печеньку с предсказаниями каждый день. 
Приглашай друзей, зарабатывай токены $FIVE с каждого друга и заработай реальные деньги в будущем на Airdrop.
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
                text="✨ Подписать на канал ✨",
                url="https://t.me/givefive_community"
            )
        ]
    ]
)