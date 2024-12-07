import React, { useState, useEffect } from 'react';
import styles from './Friends.module.scss';
import Button from '../../components/Button/Button.tsx';
import linkIcon from '../../assets/images/link.svg';
import airdrop from '../../assets/images/airdrop.svg';
import tasks from '../../assets/images/tasks.svg';
import highFive from '../../assets/images/highFive.svg';
import friends from '../../assets/images/friends_active.svg';
import rating from '../../assets/images/rating.svg';
import { useNavigate } from 'react-router-dom';
import { TG, request } from '../../api/request.ts';

const Friends: React.FC = () => {
  const navigate = useNavigate();
  const [referralsCount, setReferralsCount] = useState<number | null>(null); // Состояние для количества друзей
  
  // Функция для получения количества друзей
  const fetchReferralsCount = async () => {
    try {
      const telegram_id = TG.initDataUnsafe?.user?.id;
      
      if (!telegram_id) {
        throw new Error('Не удалось получить Telegram ID');
      }
      
      const endpoint = `users/count_of_referrals/${TG.initDataUnsafe.user.id}`;
      const response = await request(endpoint, 'GET', null);
      
      if (typeof response === 'number') {
        setReferralsCount(response); // Сохраняем количество друзей в состоянии
      } else {
        console.error('Некорректный ответ API:', response);
      }
    } catch (error) {
      console.error('Ошибка при получении количества приглашённых друзей:', error);
    }
  };
  
  // Вызов функции после монтирования компонента
  useEffect(() => {
    fetchReferralsCount();
  }, []);
  
  const handleAirdrop = () => {
    navigate('/airdrop');
  };
  
  const handleFriends = () => {
    navigate('/friends');
  };
  
  const handleClicker = () => {
    navigate('/');
  };
  
  const handleTasks = () => {
    navigate('/tasks');
  };
  
  const handleRating = () => {
    navigate('/rating');
  };
  
  const generateReferralLink = async () => {
    try {
      const telegram_id = TG.initDataUnsafe?.user?.id;
      
      if (!telegram_id) {
        throw new Error('Не удалось получить Telegram ID');
      }
      
      const endpoint = `users/referral-share-link/${telegram_id}&Переходи по моей дружеской ссылке и получай +500 $FIVE в подарок 👋`;
      
      const response = await request(endpoint, 'GET', null);
      
      const formattedLink = response.startsWith('https://')
        ? response
        : `https://${response}`;
      
      if (typeof formattedLink === 'string' && formattedLink.startsWith('https://')) {
        TG.openTelegramLink(formattedLink);
      } else {
        console.error('Некорректный формат ответа:', response);
        TG.showAlert('Не удалось получить реферальную ссылку');
      }
    } catch (error) {
      console.error('Ошибка при генерации реферальной ссылки:', error);
      TG.showAlert('Не удалось сгенерировать реферальную ссылку');
    }
  };
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Приглашайте друзей!</h1>
          <div className={styles.button}>
            <Button
              text="Пригласить друзей"
              icon={linkIcon}
              onClick={generateReferralLink}
            />
          </div>
          <p>
            Ты и твой друг получите 500 $FIVE или 1000 $FIVE, если у друга есть
            Telegram Premium.
            Вы также будете получать 100 $FIVE, каждый раз, когда ваш друг будет
            давать пять.
          </p>
            <p className={styles.referralsCount}>
              Количество приглашённых друзей: {referralsCount !== null ? referralsCount : "Загрузка..."}
            </p>
        </div>
      </div>
      <div className={styles.bottomnav}>
        <div className={styles.navitem}>
          <button onClick={handleAirdrop}>
            <img src={airdrop} alt="" />
            Airdrop
          </button>
        </div>
        <div className={styles.navitem}>
          <button onClick={handleTasks}>
            <img src={tasks} alt="" />
            Задания
          </button>
        </div>
        <div className={styles.navitem}>
          <button onClick={handleClicker}>
            <img src={highFive} alt="" />
            Дай пять
          </button>
        </div>
        <div className={styles.navitem}>
          <button onClick={handleFriends}>
            <img src={friends} alt="" />
            Друзья
          </button>
        </div>
        <div className={styles.navitem}>
          <button onClick={handleRating}>
            <img src={rating} alt="" />
            Рейтинг
          </button>
        </div>
      </div>
    </div>
  );
};

export default Friends;
