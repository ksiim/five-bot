import React from 'react';
import styles from './Rating.module.scss';
import airdrop from '../../assets/images/airdrop.svg';
import tasks from '../../assets/images/tasks.svg';
import highFive from '../../assets/images/highFive.svg';
import friends from '../../assets/images/friends.svg';
import rating from '../../assets/images/rating.svg';
import RatingCard from '../../components/RatingCard/RatingCard';
import { useNavigate } from 'react-router-dom';

const Rating: React.FC = () => {
  const navigate = useNavigate();
  
  const handleAirdrop = () => navigate('/airdrop');
  const handleFriends = () => navigate('/friends');
  const handleClicker = () => navigate('/');
  const handleTasks = () => navigate('/tasks');
  const handleRating = () => navigate('/rating');
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Рейтинг</h1>
          <div className={styles.fixedUserCard}>
            <RatingCard isCurrentUser={true}/>
          </div>
        </div>
        <div className={styles.scrollableList}>
          <RatingCard />
          <RatingCard />
          <RatingCard />
          <RatingCard />
          <RatingCard />
          <RatingCard />
          <RatingCard />
          <RatingCard />
          <RatingCard />
          <RatingCard />
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