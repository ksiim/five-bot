import React from 'react';
import styles from './Friends.module.scss'
import Button from '../../components/Button/Button.tsx';
import linkIcon from '../../assets/images/link.svg';
import airdrop from '../../assets/images/airdrop.svg';
import tasks from '../../assets/images/tasks.svg';
import highFive from '../../assets/images/highFive.svg';
import friends from '../../assets/images/friends.svg';
import rating from '../../assets/images/rating.svg';

const Friends:React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Приглашайте друзей!</h1>
          <div className={styles.button}>
            <Button text="Пригласить друзей" icon={linkIcon}/>
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
        <div className={styles.navitem}><img src={airdrop} alt="" className=""/>Airdrop
        </div>
        <div className={styles.navitem}><img src={tasks} alt="" className=""/>Задания
        </div>
        <div className={styles.navitem}><img src={highFive} alt=""
                                             className=""/>Дай пять
        </div>
        <div className={styles.navitem}><img src={friends} alt="" className=""/>Друзья
        </div>
        <div className={styles.navitem}><img src={rating} alt="" className=""/>Рейтинг
        </div>
      </div>
    </div>
  
  );
};

export default Friends;