// App.tsx

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FiveBot from '../pages/Clicker/FiveBot';
import Friends from '../pages/Friends/Friends';
import Airdrop from '../pages/Airdrop/Airdrop';
import Rating from '../pages/Rating/Rating';
import Tasks from '../pages/Tasks/Tasks';
import { registerUser} from '../services/userService';
import {IUser} from '../interfaces/User.ts';

function App() {
  const [user, setUser] = useState<IUser>({
    username: "guest",
    telegram_id: 0,
    balance: 0,
    premium: false,
    from_user_id: null,
    admin: false
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const initUser = async () => {
      try {
        setLoading(true);
        // Получаем referralUserId из URL если есть
        const urlParams = new URLSearchParams(window.location.search);
        const referralUserId = urlParams.get('ref');
        
        const userData = await registerUser(referralUserId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка при инициализации');
        console.error('Ошибка инициализации пользователя:', err);
      } finally {
        setLoading(false);
      }
    };
    
    initUser();
  }, []);
  
  if (loading) {
    return <div>Загрузка...</div>;
  }
  
  if (error) {
    console.log({error});
  }
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FiveBot data={user} setUser={setUser} />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/airdrop" element={<Airdrop />} />
        <Route path="/rating" element={<Rating />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </Router>
  );
}

export default App;