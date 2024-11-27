import {request, TG} from '../api/request';

export type UserData = {
  username: string | null;
  telegram_id: number;
  balance: number | null;
  premium: boolean | null;
  from_user_telegram_id: string | null;
};

async function getUserByTelegramId(telegramId: number): Promise<any> {
  try {
    console.log(`Запрос данных пользователя с Telegram ID: ${telegramId}`);
    const response = await request(`users/${telegramId}`, 'GET', null);
    console.log('Ответ от сервера для getUserByTelegramId:', response);
    return response; // Если запрос успешен, возвращаем данные пользователя
  } catch (error: any) {
    if (error.message.includes('404')) {
      console.log('Пользователь не найден, начинается регистрация...');
      return await registerUser(); // Вызываем регистрацию и возвращаем результат
    }
    console.error(`Ошибка при запросе данных пользователя с ID ${telegramId}:`, error);
    throw error; // Все остальные ошибки выбрасываем
  }
}

function getStartParam(): string | null {
  const params = new URLSearchParams(TG.initData); // TG.initData содержит строку с параметрами
  return params.get('start_param'); // Извлекаем значение start_param
}



async function registerUser(): Promise<UserData | null> {
  try {
    console.log('Начало регистрации нового пользователя');
    console.log('Данные из Telegram Web App:', TG.initDataUnsafe);
    const userData = TG.initDataUnsafe.user;
    
    if (!userData) {
      throw new Error('Не удалось получить данные пользователя из Telegram');
    }
    
    // Извлечение ID пригласившего пользователя
    const referrerParam = getStartParam();
    const referrerId = referrerParam && referrerParam.startsWith('ref')
      ? referrerParam.replace('ref', '')
      : null;
    
    const registrationData: UserData = {
      username: userData.username || '',
      telegram_id: userData.id,
      balance: 0,
      premium: Boolean(userData.is_premium) || false,
      from_user_telegram_id: referrerId, // Может быть null
    };
    
    console.log('Данные для регистрации:', registrationData);
    
    const response = await request('users/', 'POST', registrationData);
    console.log('Ответ от сервера для registerUser:', response);
    return response;
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    throw error;
  }
}




export {getUserByTelegramId, registerUser };
