import asyncio
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from bot import bot
from .db import get_all_user_ids


async def send_photo_with_url_button(photo_id, message_text, keyboard, user_id):
    try:
        await bot.send_photo(
            chat_id=user_id,
            caption=message_text,
            photo=photo_id,
            reply_markup=keyboard
        )
    except Exception as e:
        print(e)


async def send_spam_photo_with_url_button(photo_id, message_text, button_text, button_url, chunk_size=30):
    user_ids = await get_all_user_ids()
    
    keyboard = build_url_button_keyboard(button_text, button_url)
    
    tasks = []
    
    for user_id in user_ids:
            tasks.append(send_photo_with_url_button(photo_id, message_text, keyboard, user_id))
            
    for i in range(0, len(tasks), chunk_size):
        await asyncio.gather(*tasks[i:i + chunk_size])
        await asyncio.sleep(3)

def build_url_button_keyboard(button_text, button_url):
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text=button_text,
                    url=button_url
                )
            ]
        ]
    )