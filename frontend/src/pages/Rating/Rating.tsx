import React from 'react';
import styles from './Rating.module.scss';
import airdrop from '../../assets/images/airdrop.svg';
import tasks from '../../assets/images/tasks.svg';
import highFive from '../../assets/images/highFive.svg';
import friends from '../../assets/images/friends.svg';
import rating from '../../assets/images/rating.svg';
import RatingCard from '../../components/RatingCard/RatingCard.tsx';

const Rating:React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Рейтинг</h1>
          <RatingCard/>
        </div>
        <div className={styles.list}>
          <RatingCard/>
          <RatingCard/>
          <RatingCard/>
          <RatingCard/>
        </div>
      </div>
      <div className={styles.bottomnav}>
        <div className={styles.navitem}><img src={airdrop} alt="" className=""/>Airdrop</div>
        <div className={styles.navitem}><img src={tasks} alt="" className=""/>Задания</div>
        <div className={styles.navitem}><img src={highFive} alt="" className=""/>Дай пять</div>
        <div className={styles.navitem}><img src={friends} alt="" className=""/>Друзья</div>
        <div className={styles.navitem}><img src={rating} alt="" className=""/>Рейтинг</div>
      </div>
    </div>
  );
};

export default Rating;