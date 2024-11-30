import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Tasks.module.scss';
import linkIcon from '../../assets/images/link.svg';
import airdrop from '../../assets/images/airdrop.svg';
import tasksImg from '../../assets/images/tasks_active.svg';
import highFive from '../../assets/images/highFive.svg';
import friends from '../../assets/images/friends.svg';
import rating from '../../assets/images/rating.svg';
import TaskCard from '../../components/TaskCard/TaskCard';
import TaskPopup from '../../components/TaskPopup/TaskPopup';
import { request, TG } from '../../api/request.ts'; // Adjust the import path as needed

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  link: string;
  verification_link: string;
  task_type_id: string;
}

interface TasksResponse {
  data: Task[];
  count: number;
}

const Tasks: React.FC = () => {
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Navigation handlers
  const handleAirdrop = () => navigate('/airdrop');
  const handleFriends = () => navigate('/friends');
  const handleClicker = () => navigate('/');
  const handleTasks = () => navigate('/tasks');
  const handleRating = () => navigate('/rating');
  
  // Task selection handler
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };
  
  // Close popup handler
  const closePopup = () => {
    setSelectedTask(null);
  };
  
  // Fetch tasks effect
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        // Assume TG.initDataRaw contains the Telegram user ID
        const telegramId = TG.initDataUnsafe.user.id;
        
        if (!telegramId) {
          throw new Error('Telegram ID not found');
        }
        
        const response: TasksResponse = await request(`tasks/user/${telegramId}`, 'GET', null);
        
        console.log('Full API response:', response);
        
        // Directly use the data array from the response
        const fetchedTasks = response.data;
        
        setTasks(fetchedTasks);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError('Failed to load tasks. Please try again later.');
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, []);
  
  // Render loading state
  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <p className={styles.error}>{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Задачи</h1>
          <p>Выполняйте задания и зарабатывайте больше $FIVE</p>
        </div>
        
        {tasks.length === 0 ? (
          <p>Нет доступных задач</p>
        ) : (
          <div className={styles.taskList}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                iconUrl={linkIcon} // You might want to map this dynamically if you have task-specific icons
                taskName={task.title}
                cost={task.reward}
                onClick={() => handleTaskClick(task)}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className={styles.bottomnav}>
        <div className={styles.navitem}>
          <button onClick={handleAirdrop}>
            <img src={airdrop} alt="" />Airdrop
          </button>
        </div>
        <div className={styles.navitem}>
          <button onClick={handleTasks}>
            <img src={tasksImg} alt="" />Задания
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
          task={{
            iconUrl: linkIcon,
            taskName: selectedTask.title,
            cost: selectedTask.reward,
            description: selectedTask.description,
            link: selectedTask.link,
            verification_link: selectedTask.verification_link
          }}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default Tasks;