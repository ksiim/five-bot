//const DEFAULT_URL = '';

//@ts-ignore
const TG = window.Telegram.WebApp;
TG.expand();

async function request(endpoint: string, method: string, body: any): Promise<any> {
  const response = await fetch(`https://lx6v2rq8-5173.euw.devtunnels.ms/api/v1/${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    const errorText = await response.text(); // Прочитать текст ошибки
    throw new Error(`Ошибка: ${response.status} - ${errorText}`);
  }
  
  return response.json(); // Убедитесь, что тело читается только один раз
}


export { TG, request };
