import React from 'react';
import styles from './RatingCard.module.scss'

const RatingCard:React.FC = () => {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <p className={styles.name}>User</p>
        <p className={styles.balance}>5252</p>
      </div>
      <p className={styles.place}>{'>300'}</p>
    </div>
  );
};

export default RatingCard;