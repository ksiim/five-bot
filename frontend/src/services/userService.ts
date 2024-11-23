import { TG, request } from '../api/request';

export type UserData = {
  username: string | null;
  telegram_id: number;
  balance: number | null;
  premium: boolean | null;
  from_user_telegram_id: string | null;
};

async function getUserByTelegramId(telegramId: number): Promise<UserData | null> {
  try {
    const response = await request(`users/${telegramId}`, 'GET', null);
    return response;
  } catch (error) {
    // Если пользователь не найден, вернем null
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    throw error;
  }
}

async function registerUser(): Promise<any> {
  try {
    console.log(TG.initDataUnsafe)
    const userData = TG.initDataUnsafe.user;
    
    if (!userData) {
      throw new Error('Не удалось получить данные пользователя из Telegram');
    }
    
    const registrationData: UserData = {
      username: userData.username || '',
      telegram_id: userData.id,
      balance: 0,
      premium: Boolean(userData.is_premium) || false,
      from_user_telegram_id: null
    };
    
    const response = await request('users', 'POST', registrationData);
    return response;
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    throw error;
  }
}

async function initializeUser(): Promise<any> {
  try {
    const userData = TG.initDataUnsafe.user;
    
    if (!userData) {
      throw new Error('Не удалось получить данные пользователя из Telegram');
    }
    
    // Сначала пробуем получить существующего пользователя
    const existingUser = await getUserByTelegramId(userData.id);
    
    if (existingUser) {
      console.log('Пользователь найден, входим в существующий аккаунт');
      return existingUser;
    }
    
    // Если пользователь не найден, регистрируем нового
    console.log('Пользователь не найден, регистрируем нового');
    return await registerUser();
  } catch (error) {
    console.error('Ошибка при инициализации пользователя:', error);
    throw error;
  }
}

export { initializeUser, getUserByTelegramId, registerUser };