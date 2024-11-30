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
  
  // Функция для загрузки задач
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const telegramId = TG.initDataUnsafe.user.id;
      
      if (!telegramId) {
        throw new Error('Telegram ID not found');
      }
      
      const response: TasksResponse = await request(`tasks/user/${telegramId}`, 'GET', null);
      console.log('Full API response:', response);
      
      setTasks(response.data); // Обновление списка задач
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Failed to load tasks. Please try again later.');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Обработчик закрытия попапа
  const closePopup = () => {
    setSelectedTask(null);
    fetchTasks(); // Обновление задач после закрытия попапа
  };
  
  // Вызов fetchTasks при монтировании компонента
  useEffect(() => {
    fetchTasks();
  }, []);
  
  // Остальной код компонента остается без изменений
  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }
  
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
                iconUrl={linkIcon}
                taskName={task.title}
                cost={task.reward}
                onClick={() => setSelectedTask(task)}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className={styles.bottomnav}>
        {/* Кнопки навигации */}
        <div className={styles.navitem}>
          <button onClick={() => navigate('/airdrop')}>
            <img src={airdrop} alt="" />Airdrop
          </button>
        </div>
        <div className={styles.navitem}>
          <button onClick={() => navigate('/tasks')}>
            <img src={tasksImg} alt="" />Задания
          </button>
        </div>
        <div className={styles.navitem}>
          <button onClick={() => navigate('/')}>
            <img src={highFive} alt="" />Дай пять
          </button>
        </div>
        <div className={styles.navitem}>
          <button onClick={() => navigate('/friends')}>
            <img src={friends} alt="" />Друзья
          </button>
        </div>
        <div className={styles.navitem}>
          <button onClick={() => navigate('/rating')}>
            <img src={rating} alt="" />Рейтинг
          </button>
        </div>
      </div>
      
      {selectedTask && (
        <TaskPopup
          task={{
            id: selectedTask.id,
            iconUrl: linkIcon,
            taskName: selectedTask.title,
            cost: selectedTask.reward,
            description: selectedTask.description,
            link: selectedTask.link,
            verification_link: selectedTask.verification_link,
          }}
          onClose={closePopup}
        />
      )}
    </div>
  );
};


export default Tasks;