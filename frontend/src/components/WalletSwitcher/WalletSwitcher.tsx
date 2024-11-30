import React, { useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import styles from './WalletSwitcher.module.css';

const WalletSwitcher:React.FC<WalletSwitcherProps> = ({walletAddress}) => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [tonConnectUI] = useTonConnectUI();
  
  const handleWalletConnect = async () => {
    try {
      await tonConnectUI.openModal();
      const wallet = tonConnectUI.account;
      handleTransaction(wallet?.address || null);
      setShowWalletOptions(false);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };
  
  const handleWalletDisconnect = async () => {
    try {
      await tonConnectUI.disconnect();
      handleTransaction(null);
      setShowWalletOptions(false);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };
  
  const formatAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  };
  
  return (
    <div className={styles.walletSwitcher}>
      <button
        className={styles.walletButton}
        onClick={() => setShowWalletOptions(!showWalletOptions)}
      >
        {walletAddress ? formatAddress(walletAddress) : 'Connect Wallet'}
      </button>
      {showWalletOptions && (
        <div className={styles.walletOptions}>
          {walletAddress ? (
            <button className={styles.walletOption} onClick={handleWalletDisconnect}>
              Disconnect Wallet
            </button>
          ) : (
            <button className={styles.walletOption} onClick={handleWalletConnect}>
              Connect Wallet
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletSwitcher;