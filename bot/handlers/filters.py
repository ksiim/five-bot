from aiogram.filters import Filter
from aiogram.types import Message
import aiohttp

from config import WEB_APP_URL, API_V1_STR

class IsAdmin(Filter):

    async def __call__(self, message: Message):
        
        async with aiohttp.ClientSession() as session:
            async with session.get(f'{WEB_APP_URL}{API_V1_STR}/users/{message.from_user.id}') as response:
                if response.status != 200:
                    return False
                user = await response.json()
                return user['admin']
