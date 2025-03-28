'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAccount } from 'wagmi';

interface WalletContextType {
  walletAddress: string | null;
  isWalletConnected: boolean;
  connectWallet: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get account from wagmi
  const { address, isConnected } = useAccount();

  // Sync with wagmi state
  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
      setIsWalletConnected(true);
    } else if (!isConnected) {
      setIsWalletConnected(false);
    }
  }, [isConnected, address]);

  // Function to connect wallet
  const connectWallet = async () => {
    try {
      // Check if window.ethereum is available
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        // Request account access
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
      } else {
        setError('Ethereum wallet not detected. Please install MetaMask or another wallet.');
      }
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    }
  };

  // Sign message with wallet
  const signMessage = async (message: string): Promise<string> => {
    try {
      if (!walletAddress) throw new Error('Wallet not connected');
      
      const signature = await (window as any).ethereum.request({
        method: 'personal_sign',
        params: [message, walletAddress],
      });
      
      return signature;
    } catch (err) {
      console.error('Error signing message:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to sign message');
    }
  };

  // Handle ethereum events
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        setWalletAddress(accounts[0] || null);
        setIsWalletConnected(!!accounts[0]);
      };

      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);

      // Cleanup listener on unmount
      return () => {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  return (
    <WalletContext.Provider value={{ walletAddress, isWalletConnected, connectWallet, signMessage }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
} 