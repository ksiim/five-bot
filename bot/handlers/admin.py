from aiogram.types import (
    Message, CallbackQuery
)
from aiogram.filters.command import Command
from aiogram.fsm.context import FSMContext
from aiogram import F

from bot import dp, bot

from .utils import send_spam_photo_with_url_button
from .markups import *
from .filters import *
from .states import *


@dp.message(Command('stat'), IsAdmin())
async def statistic_handler(message: Message, state: FSMContext):
    await state.clear()
    
    await send_statistic(message.from_user.id)
    

async def send_statistic(telegram_id: int):
    await bot.send_message(
        chat_id=telegram_id,
        text=await generate_statistic_text()
    )


@dp.message(Command('spam'), IsAdmin())
async def spam_command(message: Message, state: FSMContext):
    await message.answer(
        text=get_spam_pic_text
    )
    
    await state.set_state(SpamState.waiting_for_pic)
    
@dp.message(SpamState.waiting_for_pic)
async def spam_pic_handler(message: Message, state: FSMContext):
    try:
        photo_id = message.photo[-1].file_id
    except:
        return await message.answer(
            text='Вам нужно отправить мне корректное изображение'
        )
        
    await state.update_data(
        photo_id=photo_id
    )
    
    await message.answer(
        text=get_spam_text
    )
    
    await state.set_state(SpamState.waiting_for_text)
    
@dp.message(SpamState.waiting_for_text)
async def spam_text_handler(message: Message, state: FSMContext):
    text = message.text
    
    if len(text) > 1000:
        return await message.answer(
            text='Текст не должен превышать 1000 символов'
        )
    
    await state.update_data(
        text=text
    )
    
    await message.answer(
        text=get_spam_button_text
    )
    
    await state.set_state(SpamState.waiting_for_button_text)
    

@dp.message(SpamState.waiting_for_button_text)
async def spam_button_text_handler(message: Message, state: FSMContext):
    button_text = message.text
    
    if len(button_text) > 50:
        return await message.answer(
            text='Текст кнопки не должен превышать 50 символов'
        )
        
    await state.update_data(
        button_text=button_text
    )
    
    await message.answer(
        text=get_spam_button_url
    )
    
    await state.set_state(SpamState.waiting_for_button_url)
    
@dp.message(SpamState.waiting_for_button_url)
async def spam_button_url_handler(message: Message, state: FSMContext):
    button_url = message.text
    
    await state.update_data(
        button_url=button_url
    )
    
    data = await state.get_data()
    
    await message.answer(
        text='Происходит рассылка...'
    )
    
    await send_spam_photo_with_url_button(data['photo_id'], data['text'], data['button_text'], data['button_url'])
    
    await state.clear()
    
    await message.answer(
        text='Рассылка завершена!'
    )
    