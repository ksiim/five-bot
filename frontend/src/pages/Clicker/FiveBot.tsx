import React, { useState, useEffect } from 'react';
import styles from './FiveBot.module.scss';
import { FiveBotProps } from '../../interfaces/FiveBotProps.ts';
import handImage from '../../assets/images/hand group.webp';
import airdrop from '../../assets/images/airdrop.svg';
import burger from '../../assets/images/burger.svg';
import friends from '../../assets/images/friends.svg';
import highFive from '../../assets/images/highFive_active.svg';
import rating from '../../assets/images/rating.svg';
import tasks from '../../assets/images/tasks.svg';
import BurgerMenu from '../../components/BurgerMenu/BurgerMenu.tsx';
import { useNavigate } from 'react-router-dom';
import { request, TG } from '../../api/request.ts'; // Убедитесь, что путь правильный

const FiveBot: React.FC<FiveBotProps> = ({ data, setUser }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<string>('Загрузка...');
  const [canGiveFive, setCanGiveFive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  
  const checkLastFiveTimestamp = async () => {
    try {
      const lastTimestamp = await request(
        `users/last-five-timestamp/${data.telegram_id}`,
        'GET',
        null
      );
      
      if (!lastTimestamp) {
        setCanGiveFive(true);
        setTimeLeft('Можно дать пять!');
        return;
      }
      
      const utcTimestamp = lastTimestamp.endsWith('Z') ? lastTimestamp : lastTimestamp + 'Z';
      const lastFiveTime = new Date(utcTimestamp).getTime();
      const now = Date.now();
      const cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const timeDiff = now - lastFiveTime;
      
      if (timeDiff >= cooldownPeriod) {
        setCanGiveFive(true);
        setTimeLeft('Можно дать пять!');
      } else {
        setCanGiveFive(false);
        startCountdown(cooldownPeriod - timeDiff);
      }
    } catch (error) {
      console.error('Error checking last five timestamp:', error);
      setCanGiveFive(true);
      setTimeLeft('Можно дать пять!');
    }
  };
  
  const startCountdown = (initialRemainingTime: number) => {
    let remainingTime = initialRemainingTime;
    
    const countdownInterval = setInterval(() => {
      if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        setTimeLeft('Можно дать пять!');
        setCanGiveFive(true);
        return;
      }
      
      remainingTime -= 1000;
      
      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
  };
  
  useEffect(() => {
    const fetchBalanceAndCheckTimestamp = async () => {
      try {
        // Обновляем баланс
        const updatedBalance = await request(`users/balance/${data.telegram_id}`, 'GET', null);
        if (typeof updatedBalance === 'number') {
          setUser((prev: any) => ({
            ...prev,
            balance: updatedBalance, // Обновляем баланс в состоянии
          }));
        } else {
          console.error('Invalid balance received:', updatedBalance);
        }
        
        // Проверяем возможность дать "пять"
        await checkLastFiveTimestamp();
      } catch (error) {
        console.error('Error during balance or timestamp check:', error);
      }
    };
    
    // Немедленный вызов функции при загрузке компонента
    fetchBalanceAndCheckTimestamp();
    
    // Устанавливаем интервал для обновления данных
    const intervalId = setInterval(() => {
      fetchBalanceAndCheckTimestamp();
    }, 60000); // Каждую минуту
    
    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [data.telegram_id, setUser]); // Добавляем зависимости
  
  
  const handleGiveFive = async () => {
    try {
      console.log('Attempting to give five. Can give five:', canGiveFive);
      
      if (!canGiveFive) {
        TG.showAlert('Пока нельзя дать пять. Попробуйте позже.');
        return;
      }
      
      setIsLoading(true);
      
      // Запрос для дачи "пять"
      await request(`users/give-five/${data.telegram_id}`, 'POST', null);
      
      // Получение нового баланса
      const newBalance = await request(
        `users/balance/${data.telegram_id}`,
        'GET',
        null
      );
      
      console.log('New balance:', newBalance);
      
      // Убедимся, что получен валидный баланс и обновляем состояние
      if (typeof newBalance === 'number') {
        setUser((prev: any) => ({
          ...prev,
          balance: newBalance, // Обновляем баланс в состоянии
        }));
      } else {
        console.error('Invalid balance received:', newBalance);
        TG.showAlert('Ошибка при обновлении баланса. Попробуйте позже.');
      }
      
      // Сброс состояния
      setCanGiveFive(false);
      
      // Показ сообщения об успешном действии
      TG.showAlert('Вы успешно дали пять!');
      
      // Перезапуск проверки времени
      await checkLastFiveTimestamp();
    } catch (error) {
      console.error('Error giving five:', error);
      TG.showAlert('Не удалось дать пять. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const handleAirdrop = () => navigate('/airdrop');
  const handleFriends = () => navigate('/friends');
  const handleClicker = () => navigate('/');
  const handleTasks = () => navigate('/tasks');
  const handleRating = () => navigate('/rating');
  
  return (
    <div className={styles.container}>
      <div className={styles.topnav}>
        <img src={burger} alt="" className=""/>
      </div>
      
      <div className={styles.handcontainer}>
        <div className={styles.currencyinfo}>
          <h2 className="textwhite">$FIVE</h2>
        </div>
        
        <div className={styles.balanceinfo}>
          <h1>{data.balance}</h1>
        </div>
        <button
          onClick={handleGiveFive}
          disabled={!canGiveFive || isLoading}
          className={`${styles.handButton} ${!canGiveFive ? styles.disabled : ''}`}
        >
          <img src={handImage} alt="hand" className={styles.handimage} loading={'lazy'} fetchPriority={'high'}/>
        </button>
        <p className={styles.infotext}>{timeLeft}</p>
      </div>
      
      <div className={styles.bottomnav}>
        <div className={styles.navitem}><button onClick={handleAirdrop}><img src={airdrop} alt="" className=""/>Airdrop</button></div>
        <div className={styles.navitem}><button onClick={handleTasks}><img src={tasks} alt="" className="" />Задания</button></div>
        <div className={styles.navitem}><button onClick={handleClicker}><img src={highFive} alt="" className="" />Дай пять</button></div>
        <div className={styles.navitem}><button onClick={handleFriends}><img src={friends} alt="" className="" />Друзья</button></div>
        <div className={styles.navitem}><button onClick={handleRating}><img src={rating} alt="" className="" />Рейтинг</button></div>
      </div>
      
      {isMenuOpen && <BurgerMenu onClose={toggleMenu} />}
      
    </div>
  );
};

export default FiveBot;