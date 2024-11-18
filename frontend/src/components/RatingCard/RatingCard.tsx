import React from 'react';
import styles from './RatingCard.module.scss';

interface RatingCardProps {
  isCurrentUser?: boolean;
}

const RatingCard: React.FC<RatingCardProps> = ({ isCurrentUser = false }) => {
  return (
    <div className={`${styles.card} ${isCurrentUser ? styles.currentUser : ''}`}>
      <div className={styles.info}>
        <p className={styles.name}>{isCurrentUser ? 'Вы' : 'User'}</p>
        <p className={styles.balance}>5252</p>
      </div>
      <p className={styles.place}>{'>300'}</p>
    </div>
  );
};

export default RatingCard;