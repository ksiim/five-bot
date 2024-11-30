import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Tasks.module.scss';
import linkIcon from '../../assets/images/link.svg';
import airdrop from '../../assets/images/airdrop.svg';
import tasks from '../../assets/images/tasks_active.svg';
import highFive from '../../assets/images/highFive.svg';
import friends from '../../assets/images/friends.svg';
import rating from '../../assets/images/rating.svg';
import TaskCard from '../../components/TaskCard/TaskCard';
import TaskPopup from '../../components/TaskPopup/TaskPopup'; // Добавляем попап

interface Task {
  iconUrl: string;
  taskName: string;
  cost: number;
}

const Tasks: React.FC = () => {
  const navigate = useNavigate();
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const handleAirdrop = () => navigate('/airdrop');
  const handleFriends = () => navigate('/friends');
  const handleClicker = () => navigate('/');
  const handleTasks = () => navigate('/tasks');
  const handleRating = () => navigate('/rating');
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };
  
  const closePopup = () => {
    setSelectedTask(null);
  };
  
  const tasksData = [
    { iconUrl: linkIcon, taskName: 'Подключите тон кошелёк', cost: 5252 },
    {iconUrl: linkIcon, taskName: 'Купите мой курс', cost:6969}
    // Добавьте другие задания
  ];
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Задачи</h1>
          <p>Выполняйте задания и зарабатывайте больше $FIVE</p>
        </div>
        
        <div className={styles.taskList}>
          {tasksData.map((task, index) => (
            <TaskCard
              key={index}
              iconUrl={task.iconUrl}
              taskName={task.taskName}
              cost={task.cost}
              onClick={() => handleTaskClick(task)} // Передаём задачу в обработчик
            />
          ))}
        </div>
      </div>
      
      <div className={styles.bottomnav}>
        <div className={styles.navitem}>
          <button onClick={handleAirdrop}>
            <img src={airdrop} alt="" />Airdrop
          </button>
        </div>
        <div className={styles.navitem}>
          <button onClick={handleTasks}>
            <img src={tasks} alt="" />Задания
          </button>
        </div>
        <div className={styles.navitem}>
          <button onClick={handleClicker}>
            <img src={highFive} alt="" />Дай пять
          </button>
        </div>
        <div className={styles.navitem}>
          <button onClick={handleFriends}>
            <img src={friends} alt="" />Друзья
          </button>
        </div>
        <div className={styles.navitem}>
          <button onClick={handleRating}>
            <img src={rating} alt="" />Рейтинг
          </button>
        </div>
      </div>
      
      {selectedTask && (
        <TaskPopup
          task={selectedTask}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default Tasks;
