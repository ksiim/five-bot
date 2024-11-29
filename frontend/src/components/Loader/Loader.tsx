import React from 'react';
import styles from './Loader.module.scss'

const Loader:React.FC = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  );
};

export default Loader;