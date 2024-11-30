import React, { useState, useEffect, useCallback } from 'react';
import { useTonConnectUI, SendTransactionRequest } from '@tonconnect/ui-react';
import styles from './Airdrop.module.scss';
import Button from '../../components/Button/Button.tsx';
import walletIcon from '../../assets/images/wallet.svg';
import tonIcon from '../../assets/images/ton.svg';
import airdrop from '../../assets/images/airdrop_active.svg';
import tasks from '../../assets/images/tasks.svg';
import highFive from '../../assets/images/highFive.svg';
import friends from '../../assets/images/friends.svg';
import rating from '../../assets/images/rating.svg';
import { useNavigate } from 'react-router-dom';

const Airdrop: React.FC = () => {
  const navigate = useNavigate();
  const [tonConnectUI] = useTonConnectUI();
  const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const handleWalletConnection = useCallback((address: string) => {
    setTonWalletAddress(address);
    localStorage.setItem("tonWalletAddress", address);
    console.log("Wallet connected successfully!");
    setIsLoading(false);
  }, []);
  
  const handleWalletDisconnection = useCallback(() => {
    setTonWalletAddress(null);
    localStorage.removeItem("tonWalletAddress");
    console.log("Wallet disconnected successfully!");
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    const savedAddress = localStorage.getItem("tonWalletAddress");
    if (savedAddress) {
      handleWalletConnection(savedAddress);
    } else {
      handleWalletDisconnection();
    }
    
    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        handleWalletConnection(wallet.account.address);
      } else {
        handleWalletDisconnection();
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [tonConnectUI, handleWalletConnection, handleWalletDisconnection]);
  
  const handleWalletAction = async () => {
    if (tonConnectUI.connected) {
      const confirmation = window.confirm(
        "Вы уверены, что хотите разорвать соединение с кошельком?"
      );
      if (confirmation) {
        setIsLoading(true);
        await tonConnectUI.disconnect();
        console.log("Wallet disconnected successfully!");
      }
    } else {
      await tonConnectUI.openModal();
      console.log("Wallet connected successfully!");
    }
  };
  
  const handleTransaction = async () => {
    if (!tonWalletAddress) return;
    
    try {
      const transaction: SendTransactionRequest = {
        validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
        messages: [
          {
            // Replace with the actual wallet address and amount you want to use
            address: "UQBKCoqHQaZLBkLp--tUgT4u6Iiw-7BwgdqwHV2P3dOi0Dq3",
            amount: "200", // Toncoin in nanotons
          },
        ],
      };
      
      await tonConnectUI.sendTransaction(transaction);
      console.log("Transaction sent successfully!");
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };
  
  const formatAddress = (address: string) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  };
  
  const handleAirdrop = () => { navigate('/airdrop'); };
  const handleFriends = () => { navigate('/friends'); };
  const handleClicker = () => { navigate('/'); };
  const handleTasks = () => { navigate('/tasks'); };
  const handleRating = () => { navigate('/rating'); };
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Airdrop</h1>
          {isLoading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : (
            <>
              <h2>Задача для участия в Airdrop:</h2>
              <div className={styles.info}>
                {tonWalletAddress ? (
                  <Button
                    text={`Кошелек подключен: ${formatAddress(tonWalletAddress)}`}
                    icon={walletIcon}
                    onClick={() => alert("Кошелек уже подключен!")}
                  />
                ) : (
                  <Button
                    text="1. Подключите кошелек"
                    icon={walletIcon}
                    onClick={handleWalletAction}
                  />
                )}
                
                {tonWalletAddress && (
                  <Button
                    text="2. Совершите TON транзакцию"
                    icon={tonIcon}
                    onClick={handleTransaction}
                  />
                )}
                
                <div className={styles.paragraphs}>
                  <p>Airdrop - это распределение токенов на кошельки игроков. Вскоре
                    токены будут торговаться на ведущих биржах, и вы сможете
                    купить/продать наш токен. Для того чтобы получить airdrop
                    необходимо выполнить все задачи, которые представлены выше.
                  </p>
                  <p>В настоящее время мы на находимся на этапе добычи, где игроки
                    зарабатывают больше $FIVE для airdrop.
                  </p>
                  <p>Подробные детали airdrop появятся позже в нашем официальном
                    канале.</p>
                </div>
              </div>
              
              <div className={styles.advice}>
                <p>Кошелек можно подключать только к одному аккаунту</p>
              </div>
            </>
          )}
        </div>
      </div>
      <div className={styles.bottomnav}>
        <div className={styles.navitem}><button onClick={handleAirdrop}><img src={airdrop} alt="" />Airdrop</button></div>
        <div className={styles.navitem}><button onClick={handleTasks}><img src={tasks} alt="" />Задания</button></div>
        <div className={styles.navitem}><button onClick={handleClicker}><img src={highFive} alt="" />Дай пять</button></div>
        <div className={styles.navitem}><button onClick={handleFriends}><img src={friends} alt="" />Друзья</button></div>
        <div className={styles.navitem}><button onClick={handleRating}><img src={rating} alt="" />Рейтинг</button></div>
      </div>
    </div>
  );
};

export default Airdrop;
