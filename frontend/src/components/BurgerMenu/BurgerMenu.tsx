import React from 'react';
import styles from './BurgerMenu.module.scss';
import telegramIcon from './../../assets/images/telegramIcon.svg';
import documentIcon from './../../assets/images/documentIcon.svg';
import {TG} from '../../api/request.ts';
import Button from '../Button/Button.tsx';

interface BurgerMenuProps {
  onClose: () => void;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.menu}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <Button text = {'Наш телеграм канал'} icon={telegramIcon} onClick={TG.openTelegramLink('https://t.me/givefive_community')}/>
        <Button text = {'Условия пользования'} icon={documentIcon} onClick={TG.openTelegramLink('https://telegra.ph/Standard-Bot-Privacy-Policy-for-givefive-bot-09-21')}/>
      </div>
    </div>
  );
};

export default BurgerMenu;
