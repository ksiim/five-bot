import aiohttp

from config import API_V1_STR, WEB_APP_URL


async def get_count_of_users():
    async with aiohttp.ClientSession() as session:
        async with session.get(f'{WEB_APP_URL}{API_V1_STR}/users/count_of_users/') as response:
            if response.status != 200:
                return False
            count = await response.json()
            return count
        
async def get_top_refs():
    async with aiohttp.ClientSession() as session:
        async with session.get(f'{WEB_APP_URL}{API_V1_STR}/users/top_referrals_users/') as response:
            if response.status != 200:
                return False
            top_refs = await response.json()
            return top_refs
        
async def get_refs_count(telegram_id):
    async with aiohttp.ClientSession() as session:
        async with session.get(f'{WEB_APP_URL}{API_V1_STR}/users/count_of_referrals/{telegram_id}') as response:
            if response.status != 200:
                return False
            count = await response.json()
            return count