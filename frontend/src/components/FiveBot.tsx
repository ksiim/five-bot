import React from 'react';
import '../index.css';
import {FiveBotProps} from '../interfaces/FiveBotProps.ts'; // Стили, которые мы добавили ранее
import handImage from '../assets/images/main-hand.png'
import airdrop from '../assets/images/airdrop.svg'
import burger from '../assets/images/burger.svg'
import friends from '../assets/images/friends.svg'
import highFive from '../assets/images/highFive.svg'
import rating from '../assets/images/rating.svg'
import tasks from '../assets/images/tasks.svg'


const FiveBot: React.FC<FiveBotProps> = ({ data }) => {
  return (
    <div className="container">
      {/* Верхний текст с именем пользователя и балансом */}
      <div className='top-nav'>
        <img src={burger} alt='' className=''/>
      </div>
      
      <div className='currency-info'>
        <h2 className='text-white'>$FIVE</h2>
      </div>
      
      <div className="balance-info">
        <h1>{data.balance}</h1>
      </div>
      
      {/* Центральная область с рукой и окружностью */}
      <div className="hand-container">
        <div className="circle">
          <img src={handImage} alt="hand" className="hand-image" />
        </div>
        <p className="info-text">место для инфы</p>
      </div>
      
      {/* Нижняя панель навигации */}
      <div className="bottom-nav">
        <div className="nav-item"><img src={airdrop} alt='' className='' />Airdrop</div>
        <div className="nav-item"><img src={tasks} alt='' className='' />Задания</div>
        <div className="nav-item"><img src={highFive} alt='' className='' />Дай пять</div>
        <div className="nav-item"><img src={friends} alt='' className='' />Друзья</div>
        <div className="nav-item"><img src={rating} alt='' className='' />Рейтинг</div>
      </div>
    </div>
  );
};

export default FiveBot;
