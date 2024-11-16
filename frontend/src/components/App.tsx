import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { request } from '../api/request';
import { useEffect, useState } from 'react';
import FiveBot from '../pages/Clicker/FiveBot';
import Friends from '../pages/Friends/Friends';
import Airdrop from '../pages/Airdrop/Airdrop';
import Rating from '../pages/Rating/Rating';
import Tasks from '../pages/Tasks/Tasks';

// Типизация для user (если используется TypeScript)
type User = {
  id: number;
  username: string;
  energy: number;
  balance: number;
};

function App() {
  // Состояние пользователя
  const [user, setUser] = useState<User>({
    id: 0,
    username: 'Unknown',
    energy: 0,
    balance: 0,
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: User = await request('user'); // Типизация ответа API
        setUser(response);
      } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
      }
    };
    
    fetchData();
  }, []);
  
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
