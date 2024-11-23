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
        // Добавьте заголовок, если требуется авторизация
        'Authorization': `Bearer ${TG.initData || ''}`,
      },
      mode: "cors", // Убедитесь, что сервер поддерживает CORS
      body: method !== 'GET' ? JSON.stringify(body) : null, // Тело только для методов POST/PUT
    });
    
    console.log(response);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ошибка запроса: ${response.status} - ${errorText}`);
    }
    
    // Обработка успешного JSON-ответа
    return await response.json();
  } catch (error) {
    console.error(`Ошибка API запроса (${endpoint}):`, error);
    throw error;
  }
}


export { TG, request };