import { TG, request } from '../api/request';

export type RegistrationData = {
  username: string | null;
  telegram_id: number;
  balance: number | null;
  premium: boolean | null;
  from_user_id: string | null;
  admin: boolean | null;
};

async function registerUser(referralUserId: string | null): Promise<any> {
  try {
    // Получаем данные пользователя из Telegram WebApp
    const userData = TG.initDataUnsafe.user;
    
    //if (!userData) {
      //throw new Error('Не удалось получить данные пользователя из Telegram');
    //}
    
    const registrationData: RegistrationData = {
      username: userData.username || null, // Используем id как запасной вариант, если username не задан
      telegram_id: userData.id,
      balance: 0,
      premium: userData.is_premium || false, // Получаем премиум статус из TG если доступен
      from_user_id: referralUserId || null,
      admin: false,
    };
    
    // Отправляем запрос на регистрацию
    const response = await request('users', 'POST', registrationData);
    return response;
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    throw error;
  }
}

export { registerUser };
