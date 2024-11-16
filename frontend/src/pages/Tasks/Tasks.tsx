import React from 'react';
import {useNavigate} from 'react-router-dom';
import styles from '../Friends/Friends.module.scss';
import linkIcon from '../../assets/images/link.svg';
import airdrop from '../../assets/images/airdrop.svg';
import tasks from '../../assets/images/tasks.svg';
import highFive from '../../assets/images/highFive.svg';
import friends from '../../assets/images/friends.svg';
import rating from '../../assets/images/rating.svg';
import TaskCard from '../../components/TaskCard/TaskCard.tsx';

const Tasks:React.FC = () => {
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
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Задачи</h1>
          <p>
            Выполняйте задания и зарабатывайте
            больше $FIVE
          </p>
        </div>
        
        <div className={styles.taskList}>
          <TaskCard iconUrl={linkIcon} taskName={'Подключите тон кошелёк'} cost={5252}/>
        </div>
      </div>
      <div className={styles.bottomnav}>
        <div className={styles.navitem}>
          <button onClick={handleAirdrop}><img src={airdrop} alt=""
                                               className=""/>Airdrop
          </button>
        </div>
        <div className={styles.navitem}>
          <button onClick={handleTasks}><img src={tasks} alt='' className=''/>Задания
          </button>
        </div>
        <div className={styles.navitem}>
          <button onClick={handleClicker}><img src={highFive} alt=''
                                               className=''/>Дай пять
          </button>
        </div>
        <div className={styles.navitem}>
          <button onClick={handleFriends}><img src={friends} alt=''
                                               className=''/>Друзья
          </button>
        </div>
        <div className={styles.navitem}>
          <button onClick={handleRating}><img src={rating} alt='' className=''/>Рейтинг
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tasks;