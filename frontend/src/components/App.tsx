import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import FiveBot from '../pages/Clicker/FiveBot';
import Friends from '../pages/Friends/Friends';
import Airdrop from '../pages/Airdrop/Airdrop';
import Rating from '../pages/Rating/Rating';
import Tasks from '../pages/Tasks/Tasks';
import { getUserByTelegramId } from '../services/userService';
import { IUser } from '../interfaces/User.ts';
import { TG } from '../api/request.ts';

TG.expand();
TG.disableVerticalSwipes();
TG.enableClosingConfirmation();

TG.CloudStorage.getItem('external_links_enabled', (error: any, value: any) => {
  if (!error && value !== 'true') {
    TG.CloudStorage.setItem('external_links_enabled', 'true');
  }
});

function App() {
  const [user, setUser] = useState<IUser>({
    username: 'guest',
    telegram_id: 0,
    balance: 0,
    premium: false,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Проверяем, работает ли приложение на мобильной платформе
    const platform = TG.platform;
    if (platform === 'android' || platform === 'ios') {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
    
    const initUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserByTelegramId(TG.initDataUnsafe.user.id);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка при инициализации');
        console.error('Ошибка инициализации пользователя:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (isMobile) {
      initUser();
    } else {
      setLoading(false); // Прекращаем загрузку, если не мобильная платформа
    }
  }, [isMobile]);
  
  if (!isMobile) {
    return <div>Приложение доступно только на мобильных устройствах Telegram</div>;
  }
  
  if (loading) {
    return <div>Загрузка...</div>;
  }
  
  if (error) {
    console.log({ error });
  }
  
  return (
    <TonConnectUIProvider manifestUrl="https://five-bot.com/manifest.json">
      <Router>
        <Routes>
          <Route path="/" element={<FiveBot data={user} setUser={setUser} />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/airdrop" element={<Airdrop />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </Router>
    </TonConnectUIProvider>
  );
}

export default App;
