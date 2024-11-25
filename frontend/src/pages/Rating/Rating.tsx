import React, { useEffect, useState } from 'react';
import styles from './Rating.module.scss';
import airdrop from '../../assets/images/airdrop.svg';
import tasks from '../../assets/images/tasks.svg';
import highFive from '../../assets/images/highFive.svg';
import friends from '../../assets/images/friends.svg';
import rating from '../../assets/images/rating.svg';
import RatingCard from '../../components/RatingCard/RatingCard';
import { useNavigate } from 'react-router-dom';
import { request, TG } from '../../api/request';
import { IUser } from '../../interfaces/User';

interface UserRating extends IUser {
  place?: number;
}

const Rating: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserRating | null>(null);
  const [topUsers, setTopUsers] = useState<UserRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch top 50 users
        const usersResponse = await request('users/', 'GET', {
          limit: 50,
          sort_by: 'balance',
          sort_order: 'desc'
        });
        
        // Get current user's rating
        const userPlace = await request(`users/user/rate/${TG.initDataUnsafe.user.id}`, 'GET', null);
        
        // Find current user in the response or make a separate request if needed
        const currentUserData = usersResponse.find(
          (user: IUser) => user.telegram_id === TG.initDataUnsafe.user.id
        );
        
        if (currentUserData) {
          setCurrentUser({ ...currentUserData, place: userPlace });
        }
        
        setTopUsers(usersResponse.map((user: IUser, index: number) => ({
          ...user,
          place: index + 1
        })));
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных');
        console.error('Ошибка загрузки рейтинга:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleAirdrop = () => navigate('/airdrop');
  const handleFriends = () => navigate('/friends');
  const handleClicker = () => navigate('/');
  const handleTasks = () => navigate('/tasks');
  const handleRating = () => navigate('/rating');
  
  if (loading) {
    return <div className={styles.wrapper}>Загрузка...</div>;
  }
  
  if (error) {
    return <div className={styles.wrapper}>Ошибка: {error}</div>;
  }
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Рейтинг</h1>
          {currentUser && (
            <div className={styles.fixedUserCard}>
              <RatingCard
                isCurrentUser={true}
                username={currentUser.username}
                balance={currentUser.balance}
                place={currentUser.place}
              />
            </div>
          )}
        </div>
        <div className={styles.scrollableList}>
          {topUsers.map((user, index) => (
            <RatingCard
              key={user.telegram_id}
              username={user.username}
              balance={user.balance}
              place={index + 1}
            />
          ))}
        </div>
      </div>
      <div className={styles.bottomnav}>
        <div className={styles.navitem}>
          <button onClick={handleAirdrop}><img src={airdrop} alt="" />Airdrop</button>
        </div>
        <div className={styles.navitem}>
          <button onClick={handleTasks}><img src={tasks} alt="" />Задания</button>
        </div>
        <div className={styles.navitem}>
          <button onClick={handleClicker}><img src={highFive} alt="" />Дай пять</button>
        </div>
        <div className={styles.navitem}>
          <button onClick={handleFriends}><img src={friends} alt="" />Друзья</button>
        </div>
        <div className={styles.navitem}>
          <button onClick={handleRating}><img src={rating} alt="" />Рейтинг</button>
        </div>
      </div>
    </div>
  );
};

export default Rating;