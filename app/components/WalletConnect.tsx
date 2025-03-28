'use client';

import { useEffect, useState } from 'react';
import { useAccount, useBalance, useChainId, useSwitchChain } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from './WalletConnect.module.css';
import { useWallet } from '../context/WalletContext';
import { WEB3_CONFIG } from '../config';

const MONAD_TESTNET = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: WEB3_CONFIG.WEB3_RPC },
  },
};

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: balance } = useBalance({
    address,
  });
  const { connectWallet, isWalletConnected, walletAddress } = useWallet();

  const [showSwitchNetwork, setShowSwitchNetwork] = useState(false);

  useEffect(() => {
    if (chainId !== MONAD_TESTNET.id) {
      setShowSwitchNetwork(true);
    } else {
      setShowSwitchNetwork(false);
    }
  }, [chainId]);

  // Sync Wagmi connection state with our wallet context
  useEffect(() => {
    if (isConnected && address && !isWalletConnected) {
      // If connected via RainbowKit but not in our context, sync the state
      connectWallet();
    }
  }, [isConnected, address, isWalletConnected, connectWallet]);

  const handleSwitchNetwork = async () => {
    try {
      await switchChain?.({
        chainId: MONAD_TESTNET.id,
        connector: undefined
      });
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  return (
    <div className="relative flex justify-center">
      <div className={styles.walletConnectWrapper}>
        {!isConnected ? (
          <ConnectButton />
        ) : (
          <div className="flex items-center gap-4">
            <div className="text-sm">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
            <div className="text-sm">
              {balance?.formatted} {balance?.symbol}
            </div>
            {showSwitchNetwork && (
              <button
                onClick={handleSwitchNetwork}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
              >
                Switch to Monad Testnet
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 