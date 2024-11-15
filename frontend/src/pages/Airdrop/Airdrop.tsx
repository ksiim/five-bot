import React from 'react';
import styles from './Airdrop.module.scss';
import Button from '../../components/Button/Button.tsx';
import walletIcon from '../../assets/images/wallet.svg';
import tonIcon from '../../assets/images/ton.svg';
import airdrop from '../../assets/images/airdrop.svg';
import tasks from '../../assets/images/tasks.svg';
import highFive from '../../assets/images/highFive.svg';
import friends from '../../assets/images/friends.svg';
import rating from '../../assets/images/rating.svg';

const Airdrop:React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Airdrop</h1>
          <h2>Задача для участия в Airdrop:</h2>
          <div className={styles.info}>
            <Button text="1. Подключите кошелек" icon={walletIcon}/>
            <Button text="2. Совершите TON транзакцию" icon={tonIcon} />
            <div className={styles.paragraphs}>
              <p>Airdrop - это распределение токенов на кошельки игроков. Вскоре токены будут торговаться на ведущих биржах, и вы сможете купить/продать наш токен. Для того чтобы получить airdrop необходимо выполнить все задачи, которые представлены выше.
              </p>
              <p>В настоящее время мы на находимся на этапе добычи, где игроки зарабатывают больше $FIVE для airdrop.
              </p>
              <p>Подробные детали airdrop появятся позже в нашем официальном канале.</p>
            </div>
          </div>
          
          <div className={styles.advice}>
            <p>Кошелек можно подключать только к одному аккаунту</p>
          </div>
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

export default Airdrop;