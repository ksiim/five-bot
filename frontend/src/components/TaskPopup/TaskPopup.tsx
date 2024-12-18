import React, { useEffect, useState } from 'react';
import styles from './TaskPopup.module.scss';
import Button from '../Button/Button.tsx';
import walletIcon from '../../assets/images/wallet.svg';
import checkIcon from '../../assets/images/wallet.svg';
import { request, TG } from '../../api/request.ts'; // Adjust import path as needed

interface TaskPopupProps {
  task: {
    id: string;
    iconUrl: string;
    taskName: string;
    cost: number;
    description?: string;
    link?: string;
    verification_link: string;
    task_type_id: string;
  };
  onClose: () => void;
}

interface taskUserData {
  user_id: string;
  task_id: string;
}

const TaskPopup: React.FC<TaskPopupProps> = ({ task, onClose }) => {
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [verificationMessage, setVerificationMessage] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isVerifyVisible, setIsVerifyVisible] = useState(false); // Добавлено состояние для управления видимостью кнопки "Проверить"
  
  const handleOpenLink = () => {
    if (task.link) {
      window.open(task.link, '_blank', 'noopener,noreferrer');
    }
    setIsVerifyVisible(true); // Показываем кнопку "Проверить"
  };
  
  useEffect(() => {
    setIsOpen(true); // Показываем поп-ап при монтировании
    return () => setIsOpen(false); // Убираем поп-ап при размонтировании
  }, []);
  
  const handleClose = () => {
    setIsOpen(false); // Убираем поп-ап с анимацией
    setTimeout(onClose, 400); // Закрываем через 400 мс (длительность анимации)
  };
  
  const handleVerifyTask = async () => {
    try {
      const telegramId = TG.initDataUnsafe.user.id;
      
      setVerificationStatus('loading');
      setVerificationMessage('');
      
      // Определяем URL для проверки задания
      let verificationUrl;
      console.log(task.task_type_id);
      if (task.task_type_id === '0fbfdf74-7f59-42cc-b9d8-54a7e1958c0d') {
        verificationUrl = `tasks/stump/${telegramId}`;
      } else {
        verificationUrl = `${task.verification_link}&${telegramId}`;
      }
      
      // Отправляем запрос на проверку
      const response = await request(verificationUrl, 'GET', null);
      const userResponse = await request(`users/${telegramId}`, 'GET', null);
      
      console.log(userResponse);
      
      const taskUserInfo: taskUserData = {
        user_id: userResponse.id,
        task_id: task.id,
      };
      
      // Обрабатываем ответ
      if (response === true) {
        await request('user-tasks/', 'POST', taskUserInfo);
        setVerificationStatus('success');
        setVerificationMessage('Задание выполнено успешно!');
        onClose();
      } else {
        setVerificationStatus('error');
        setVerificationMessage('Не удалось подтвердить выполнение задачи');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      setVerificationMessage('Произошла ошибка при проверке');
    }
  };
  
  
  return (
    <>
      <div
        className={`${styles.popupOverlay} ${isOpen ? styles.open : ''}`}
        onClick={handleClose}
      ></div>
      <div className={`${styles.popup} ${isOpen ? styles.open : ''}`}>
        <div className={styles.popupContent}>
          <button className={styles.closeButton} onClick={handleClose}>
            &times;
          </button>
          <div className={styles.info}>
            <img src={task.iconUrl} alt="Task icon" className={styles.icon} />
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
            {isVerifyVisible && ( // Условный рендеринг для кнопки "Проверить"
              <Button
                text={'Проверить'}
                icon={checkIcon}
                onClick={handleVerifyTask}
                disabled={verificationStatus === 'loading'}
              />
            )}
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
    </>
  );
};

export default TaskPopup;
