const DEFAULT_URL = ''

//@ts-ignore
const TG = window.Telegram.WebApp

async function request(endpoint: string, method: string = 'GET', data?: any){
  const options: RequestInit = {
    method: method,
    headers: {
      Authorization: TG.initData,
      ContentType: "application/json",
      Access: "application/json"
    },
    body: data ? JSON.stringify(data) : undefined,
  }
  
  const response = await fetch(`${DEFAULT_URL}/api/${endpoint}`, options);
  const jsonData = await response.json();
  
  if (response.ok) return jsonData;
}

export {TG, request}