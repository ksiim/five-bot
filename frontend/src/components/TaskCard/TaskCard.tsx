import React from 'react';
import styles from './TaskCard.module.scss';
import arrowIcon from '../../assets/images/arrow-right.svg';

interface TaskCardProps {
  iconUrl: string;
  taskName: string;
  cost: number;
  onClick?: () => void; // Добавляем необязательный обработчик клика
}

const TaskCard: React.FC<TaskCardProps> = ({ iconUrl, taskName, cost, onClick }) => {
  return (
    <div
      className={styles.taskCard}
      onClick={onClick} // Привязываем обработчик клика
      role="button"
      tabIndex={0}
      onKeyUp={(e) => e.key === 'Enter' && onClick?.()} // Поддержка клавиши Enter для доступности
    >
      <div className={styles.leftSection}>
        <img src={iconUrl} alt="Task icon" className={styles.icon} />
        <div className={styles.info}>
          <span className={styles.taskName}>{taskName}</span>
          <span className={styles.cost}>+{cost.toLocaleString()}</span>
        </div>
      </div>
      <div className={styles.arrow}>
        <img src={arrowIcon} alt="Arrow icon" />
      </div>
    </div>
  );
};

export default TaskCard;
