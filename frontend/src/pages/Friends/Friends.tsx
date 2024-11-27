import React from 'react';
import styles from './Friends.module.scss'
import Button from '../../components/Button/Button.tsx';
import linkIcon from '../../assets/images/link.svg';
import airdrop from '../../assets/images/airdrop.svg';
import tasks from '../../assets/images/tasks.svg';
import highFive from '../../assets/images/highFive.svg';
import friends from '../../assets/images/friends.svg';
import rating from '../../assets/images/rating.svg';
import {useNavigate} from 'react-router-dom';
import { TG, request } from '../../api/request.ts'; // Укажите правильный путь

const Friends:React.FC = () => {
  const navigate = useNavigate()
  
  const handleAirdrop = () => {
    navigate('/airdrop')
  }
  
  const handleFriends = () => {
    navigate('/friends')
  }
  
  const handleClicker = () => {
    navigate('/')
  }
  
  const handleTasks = () => {
    navigate('/tasks')
  }
  
  const handleRating = () => {
    navigate('/rating')
  }
  
  const generateReferralLink = async () => {
    try {
      // Получаем telegram_id из WebApp
      const telegram_id = TG.initDataUnsafe?.user?.id;
      
      if (!telegram_id) {
        throw new Error('Не удалось получить Telegram ID');
      }
      
      // Формируем эндпоинт с параметрами
      const endpoint = `users/referral-share-link/${telegram_id}&Вас приглашает друг`;
      
      // Делаем запрос
      const response = await request(endpoint, 'GET', null);
      
      // Проверяем и устанавливаем ссылку
      if (response && response.link) {
        // Открываем реферальную ссылку в новой вкладке
        window.open(response.link, '_blank');
      }
    } catch (error) {
      console.error('Ошибка при генерации реферальной ссылки:', error);
      alert('Не удалось сгенерировать реферальную ссылку');
    }
  }
  
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
            Вы также будете получать 100 $FIVE, каждый раз, когда ваш будет
            давать пять.
          </p>
        </div>
      </div>
      <div className={styles.bottomnav}>
        <div className={styles.navitem}><button onClick={handleAirdrop}><img src={airdrop} alt="" className=""/>Airdrop</button></div>
        <div className={styles.navitem}><button onClick={handleTasks}><img src={tasks} alt='' className=''/>Задания</button></div>
        <div className={styles.navitem}><button onClick={handleClicker}><img src={highFive} alt='' className=''/>Дай пять</button></div>
        <div className={styles.navitem}><button onClick={handleFriends}><img src={friends} alt='' className=''/>Друзья</button></div>
        <div className={styles.navitem}><button onClick={handleRating}><img src={rating} alt='' className=''/>Рейтинг</button></div>
      </div>
    </div>
  );
};

export default Friends;