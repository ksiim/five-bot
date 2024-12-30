from aiogram.fsm.state import StatesGroup, State


class SpamState(StatesGroup):
    waiting_for_pic = State()
    waiting_for_text = State()
    waiting_for_button_text = State()
    waiting_for_button_url = State()