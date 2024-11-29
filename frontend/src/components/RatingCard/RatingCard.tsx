import React from 'react';
import styles from './RatingCard.module.scss';

interface RatingCardProps {
  isCurrentUser?: boolean;
  username: string | null;
  balance: number;
  place?: number | string;
}

const RatingCard: React.FC<RatingCardProps> = ({
                                                 isCurrentUser = false,
                                                 username,
                                                 balance,
                                                 place
                                               }) => {
  return (
    <div className={`${styles.card} ${isCurrentUser ? styles.currentUser : ''}`}>
      <div className={styles.info}>
        <p className={styles.name}>{isCurrentUser ? 'Вы' : username}</p>
        <p className={styles.balance}>{balance}</p>
      </div>
      <p className={styles.place}>
        {place !== undefined && place !== null ? place : '>300'}
      </p>
    </div>
  );
};

export default RatingCard;