from aiogram.types import (
    InlineKeyboardMarkup, InlineKeyboardButton,
    ReplyKeyboardMarkup, ReplyKeyboardRemove,
    KeyboardButton, WebAppInfo
)
from config import WEB_APP_URL


greeting_message = "Hello, world!"

web_app_inline_markup = InlineKeyboardMarkup(
    inline_keyboard=[
        [
            InlineKeyboardButton(text="Web App", web_app=WebAppInfo(
                url=WEB_APP_URL,
                )),
        ],
    ]
)