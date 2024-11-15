import React from 'react';
import styles from './FiveBot.module.scss'
import {FiveBotProps} from '../../interfaces/FiveBotProps.ts'; // Стили, которые мы добавили ранее
import handImage from '../../assets/images/hand group.png'
import airdrop from '../../assets/images/airdrop.svg'
import burger from '../../assets/images/burger.svg'
import friends from '../../assets/images/friends.svg'
import highFive from '../../assets/images/highFive.svg'
import rating from '../../assets/images/rating.svg'
import tasks from '../../assets/images/tasks.svg'


const FiveBot: React.FC<FiveBotProps> = ({ data }) => {
  return (
    <div className={styles.container}>
      {/* Верхний текст с именем пользователя и балансом */}
      <div className={styles.topnav}>
        <img src={burger} alt='' className=''/>
      </div>
      
      
      
      {/* Центральная область с рукой и окружностью */}
      <div className={styles.handcontainer}>
        <div className={styles.currencyinfo}>
          <h2 className="textwhite">$FIVE</h2>
        </div>
        
        <div className={styles.balanceinfo}>
          <h1>{data.balance}</h1>
        </div>
        <button>
          <img src={handImage} alt="hand" className={styles.handimage}/>
        </button>
        <p className={styles.infotext}>место для инфы</p>
      </div>
      
      {/* Нижняя панель навигации */}
      <div className={styles.bottomnav}>
        <div className={styles.navitem}><img src={airdrop} alt="" className=""/>Airdrop</div>
        <div className={styles.navitem}><img src={tasks} alt='' className='' />Задания</div>
        <div className={styles.navitem}><img src={highFive} alt='' className='' />Дай пять</div>
        <div className={styles.navitem}><img src={friends} alt='' className='' />Друзья</div>
        <div className={styles.navitem}><img src={rating} alt='' className='' />Рейтинг</div>
      </div>
    </div>
  );
};

export default FiveBot;
