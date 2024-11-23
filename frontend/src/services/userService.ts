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


async function registerUser(): Promise<UserData | null> {
  try {
    console.log('Начало регистрации нового пользователя');
    console.log('Данные из Telegram Web App:', TG.initDataUnsafe);
    const userData = TG.initDataUnsafe.user;
    
    if (!userData) {
      throw new Error('Не удалось получить данные пользователя из Telegram');
    }
    
    const registrationData: UserData = {
      username: userData.username || '',
      telegram_id: userData.id,
      balance: 0,
      premium: Boolean(userData.is_premium) || false,
      from_user_telegram_id: null,
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

// async function initializeUser(): Promise<any> {
//   console.log('Инициализация пользователя через Telegram Web App');
//
//   const userData = TG.initDataUnsafe.user;
//
//   if (!userData) {
//     console.error('Не удалось получить данные пользователя из Telegram');
//     throw new Error('Не удалось получить данные пользователя из Telegram');
//   }
//
//   try {
//     console.log('Проверка существующего пользователя с ID:', userData.id);
//     const existingUser = await getUserByTelegramId(userData.id);
//
//     if (existingUser) {
//       console.log('Пользователь найден, вход в существующий аккаунт:', existingUser);
//       return existingUser; // Возвращаем найденного пользователя
//     }
//   } catch (error: any) {
//     if (error?.response?.status === 404) {
//       console.log('Пользователь отсутствует (404), продолжаем регистрацию.');
//     } else {
//       console.error('Ошибка при поиске пользователя:', error);
//       throw error; // Прерываем выполнение на других ошибках
//     }
//   }
//
//   // Если мы дошли до этой точки, регистрируем нового пользователя
//   console.log('Регистрация нового пользователя началась...');
//   try {
//     const newUser = await registerUser();
//     console.log('Регистрация завершена успешно:', newUser);
//     return newUser;
//   } catch (registrationError) {
//     console.error('Ошибка при регистрации пользователя:', registrationError);
//     throw registrationError; // Прерываем выполнение, если регистрация не удалась
//   }
// }


export {getUserByTelegramId, registerUser };
