import React from 'react';
import styles from './TaskCard.module.scss'
import arrowIcon from '../../assets/images/arrow-right.svg'

interface TaskCardProps {
  iconUrl: string;
  taskName: string;
  cost: number;
}

const TaskCard:React.FC<TaskCardProps> = ({iconUrl, taskName, cost}) => {
  return (
    <div className={styles.taskCard}>
      <div className={styles.leftSection}>
        <img src={iconUrl} alt="Task icon" className={styles.icon}/>
        <div className={styles.info}>
          <span className={styles.taskName}>{taskName}</span>
          <span className={styles.cost}>+{cost.toLocaleString()}</span>
        </div>
      </div>
        <div className={styles.arrow}><img src={arrowIcon}/></div>
    </div>
  );
};

export default TaskCard;