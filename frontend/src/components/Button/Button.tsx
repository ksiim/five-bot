import React from 'react';
import styles from './Button.module.scss'

interface ButtonProps {
  text: string; // Текст кнопки
  icon: string; // Иконка, которая будет передаваться
  onClick?: () => void; // Опциональный обработчик клика
}

const Button: React.FC<ButtonProps> = ({ text, icon, onClick }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      <span className={styles.text}>{text}</span>
      <img src={icon} alt={'Иконка кнопки'}/>
    </button>
  );
};

export default Button;