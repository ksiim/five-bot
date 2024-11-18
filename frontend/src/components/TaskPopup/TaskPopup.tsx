import React from 'react';
import styles from './TaskPopup.module.scss';
import Button from '../Button/Button.tsx';
import walletIcon from '../../assets/images/wallet.svg'

interface TaskPopupProps {
  task: {
    iconUrl: string;
    taskName: string;
    cost: number;
  };
  onClose: () => void;
}

const TaskPopup: React.FC<TaskPopupProps> = ({ task, onClose }) => {
  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div className={styles.info}>
          <img src={task.iconUrl} alt="Task icon" className={styles.icon}/>
          <div className={styles.info__text}>
            <h2>{task.taskName}</h2>
            <p>+{task.cost.toLocaleString()} $FIVE</p>
          </div>
        </div>
        <p>Дополнительная информация о задании...</p>
        <Button text={'Подключите кошелёк'} icon={walletIcon}/>
      </div>
    </div>
  );
};

export default TaskPopup;
