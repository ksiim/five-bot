import React from 'react';
import styles from './Button.module.scss'

interface ButtonProps {
  text: string; // Текст кнопки
  icon: string; // Иконка, которая будет передаваться
}

const Button: React.FC<ButtonProps> = ({ text, icon }) => {
  return (
    <button className={styles.button}>
      <span className={styles.text}>{text}</span>
      <img src={icon} alt={'Иконка кнопки'}/>
    </button>
  );
};

export default Button;
