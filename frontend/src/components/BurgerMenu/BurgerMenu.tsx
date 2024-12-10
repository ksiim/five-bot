import React, { useState, useEffect } from 'react';
import styles from './BurgerMenu.module.scss';
import telegramIcon from './../../assets/images/telegramIcon.svg';
import documentIcon from './../../assets/images/documentIcon.svg';
import { TG } from '../../api/request.ts';
import Button from '../Button/Button.tsx';

interface BurgerMenuProps {
  onClose: () => void;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    setIsOpen(true); // Показываем поп-ап при монтировании
    return () => setIsOpen(false); // Убираем поп-ап при размонтировании
  }, []);
  
  const handleClose = () => {
    setIsOpen(false); // Убираем поп-ап с анимацией
    setTimeout(onClose, 400); // Закрываем через 400 мс (длительность анимации)
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
          <div className={styles.buttonGroup}>
            <Button
              text={'Наш телеграм канал'}
              icon={telegramIcon}
              onClick={() =>
                TG.openTelegramLink('https://t.me/highfive_community')
              }
            />
            <Button
              text={'Условия пользования'}
              icon={documentIcon}
              onClick={() =>
                TG.openLink(
                  'https://telegra.ph/Standard-Bot-Privacy-Policy-for-High5iveBot-12-10',
                )
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BurgerMenu;
