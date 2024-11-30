import React, { useState } from 'react';
import styles from './TaskPopup.module.scss';
import Button from '../Button/Button.tsx';
import walletIcon from '../../assets/images/wallet.svg';
import checkIcon from '../../assets/images/wallet.svg';
import { request, TG } from '../../api/request.ts'; // Adjust import path as needed

interface TaskPopupProps {
  task: {
    iconUrl: string;
    taskName: string;
    cost: number;
    description?: string;
    link?: string;
    verification_link?: string;
  };
  onClose: () => void;
}

const TaskPopup: React.FC<TaskPopupProps> = ({ task, onClose }) => {
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [verificationMessage, setVerificationMessage] = useState<string>('');
  
  const handleOpenLink = () => {
    if (task.link) {
      window.open(task.link, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleVerifyTask = async () => {
    try {
      // Extract channel ID from verification link
      const telegramId = TG.initDataUnsafe.user.id;
      
      setVerificationStatus('loading');
      setVerificationMessage('');
      
      // Make verification request
      const response = await request(`${task.verification_link}&${telegramId}`, 'GET', null);
      
      // Check response and set appropriate status
      if (response.status === 'success' || response.verified === true) {
        setVerificationStatus('success');
        setVerificationMessage('Задача успешно выполнена!');
      } else {
        setVerificationStatus('error');
        setVerificationMessage(response.message || 'Не удалось подтвердить выполнение задачи');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      setVerificationMessage('Произошла ошибка при проверке');
    }
  };
  
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
        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}
        <div className={styles.buttonGroup}>
          <Button
            text={'Выполнить задание'}
            icon={walletIcon}
            onClick={handleOpenLink}
          />
          <Button
            text={'Проверить'}
            icon={checkIcon}
            onClick={handleVerifyTask}
            disabled={verificationStatus === 'loading'}
          />
        </div>
        {verificationMessage && (
          <p
            className={`${styles.verificationMessage} ${
              verificationStatus === 'success'
                ? styles.successMessage
                : verificationStatus === 'error'
                  ? styles.errorMessage
                  : ''
            }`}
          >
            {verificationMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskPopup;