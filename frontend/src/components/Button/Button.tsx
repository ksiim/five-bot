import React from 'react';
import styles from './Button.module.scss'

interface ButtonProps {
  text: string; // Текст кнопки
  icon: string; // Иконка, которая будет передаваться
  onClick?: () => void; // Опциональный обработчик клика
  disabled?: boolean; // Необязательный пропс для отключения кнопки
}

const Button: React.FC<ButtonProps> = ({
                                         text,
                                         icon,
                                         onClick,
                                         disabled = false // Значение по умолчанию - false
                                       }) => {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      disabled={disabled} // Добавляем проп disabled
    >
      <span className={styles.text}>{text}</span>
      <img src={icon} alt={'Иконка кнопки'}/>
    </button>
  );
};

export default Button;