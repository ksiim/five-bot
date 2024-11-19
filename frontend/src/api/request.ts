const DEFAULT_URL = 'https://lx6v2rq8.euw.devtunnels.ms:8000/api/v1/';
//@ts-ignore
const TG = window.Telegram.WebApp;
TG.expand();

async function request(endpoint: string, method: string, body: any): Promise<any> {
  try {
    const response = await fetch(`${DEFAULT_URL}${endpoint}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      mode: "cors",
      body: method !== 'GET' ? JSON.stringify(body) : null, // Тело для методов POST/PUT
    });

    console.log(response);
    
    // Обработка ответа
    if (!response.ok) {
      const errorText = await response.text(); // Считываем текст ошибки
      throw new Error(`Ошибка запроса: ${response.status} - ${errorText}`);
    }
    
    // Пытаемся разобрать JSON-ответ
    try {
      return await response.json();
    } catch (jsonError) {
      throw new Error('Ошибка при обработке JSON-ответа: ' + jsonError);
    }
  } catch (error) {
    console.error(`Ошибка API запроса (${endpoint}):`, error);
    throw error;
  }
}

export { TG, request };