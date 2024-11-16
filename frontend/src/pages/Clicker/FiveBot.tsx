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
import {useNavigate} from 'react-router-dom';


const FiveBot: React.FC<FiveBotProps> = ({ data }) => {
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
        <div className={styles.navitem}><button onClick={handleAirdrop}><img src={airdrop} alt="" className=""/>Airdrop</button></div>
        <div className={styles.navitem}><button onClick={handleTasks}><img src={tasks} alt='' className='' />Задания</button></div>
        <div className={styles.navitem}><button onClick={handleClicker}><img src={highFive} alt='' className='' />Дай пять</button></div>
        <div className={styles.navitem}><button onClick={handleFriends}><img src={friends} alt='' className='' />Друзья</button></div>
        <div className={styles.navitem}><button onClick={handleRating}><img src={rating} alt='' className='' />Рейтинг</button></div>
      </div>
    </div>
  );
};

export default FiveBot;
