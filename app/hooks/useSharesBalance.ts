'use client';

import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { getSharesBalanceParams, formatPrice } from '../shares/contract';
import { useWallet } from '../context/WalletContext';

export function useSharesBalance(subjectAddress: string) {
  const { walletAddress } = useWallet();
  const [formattedBalance, setFormattedBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Skip call if wallet not connected or subject address is empty
  const shouldFetch = !!walletAddress && !!subjectAddress;

  // Prepare contract call parameters
  const contractParams = shouldFetch
    ? getSharesBalanceParams(walletAddress as string, subjectAddress)
    : undefined;

  // Read from contract
  const { data: balance, isError, isPending } = useReadContract({
    ...contractParams,
    query: {
      enabled: shouldFetch,
    },
  });

  // Update formatted balance whenever raw balance changes
  useEffect(() => {
    setIsLoading(isPending);
    
    if (balance !== undefined) {
      setFormattedBalance(formatPrice(balance as bigint));
      setError(null);
    }
    
    if (isError) {
      setError('Failed to fetch shares balance');
    }
  }, [balance, isPending, isError]);

  return {
    balance: balance as bigint | undefined,
    formattedBalance,
    isLoading,
    error,
  };
} 