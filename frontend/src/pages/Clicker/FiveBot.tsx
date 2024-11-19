import React, { useState, useEffect } from 'react';
import styles from './FiveBot.module.scss';
import { FiveBotProps } from '../../interfaces/FiveBotProps.ts';
import handImage from '../../assets/images/hand group.webp';
import airdrop from '../../assets/images/airdrop.svg';
import burger from '../../assets/images/burger.svg';
import friends from '../../assets/images/friends.svg';
import highFive from '../../assets/images/highFive.svg';
import rating from '../../assets/images/rating.svg';
import tasks from '../../assets/images/tasks.svg';
import { useNavigate } from 'react-router-dom';
import { request, TG } from '../../api/request.ts'; // Убедитесь, что путь правильный

const FiveBot: React.FC<FiveBotProps> = ({ data, setUser }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<string>('Загрузка...');
  const [canGiveFive, setCanGiveFive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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
      
      const lastFiveTime = new Date(lastTimestamp).getTime();
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
    checkLastFiveTimestamp();
    const timer = setInterval(() => {
      checkLastFiveTimestamp();
    }, 60000); // Обновляем раз в минуту, чтобы не перегружать API
    
    return () => clearInterval(timer);
  }, [data.telegram_id]);
  
  const handleGiveFive = async () => {
    try {
      console.log('Attempting to give five. Can give five:', canGiveFive);
      
      if (!canGiveFive) {
        TG.showAlert('Пока нельзя дать пять. Попробуйте позже.');
        return;
      }
      
      setIsLoading(true);
      
      // Modify the request to pass telegram_id as a query parameter
      const giveFiveResponse = await request(`users/give-five/${data.telegram_id}`, 'POST', null);
      
      console.log('Give five response:', giveFiveResponse);
      
      // Fetch updated balance
      const balanceData = await request(
        `users/balance/${data.telegram_id}`,
        'GET',
        null
      );
      
      console.log('New balance:', balanceData);
      
      // Update user balance
      setUser(prev => ({
        ...prev,
        balance: balanceData.balance
      }));
      
      // Reset state
      setCanGiveFive(false);
      
      // Show success message
      TG.showAlert('Вы успешно дали пять!');
      
      // Restart timestamp check
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
    </div>
  );
};

export default FiveBot;