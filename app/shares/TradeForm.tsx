'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { 
  getPriceEstimationParams, 
  getBuySharesParams, 
  getSellSharesParams,
  formatPrice,
  getSharesSupplyParams
} from './contract';

type TradeFormProps = {
  mode: 'buy' | 'sell';
  share?: {
    subject_address: string;
    shares_amount: string;
  } | null;
  userAddress: string;
  onClose: () => void;
  onComplete: () => void;
};

export default function TradeForm({
  mode,
  share,
  userAddress,
  onClose,
  onComplete,
}: TradeFormProps) {
  const [subjectAddress, setSubjectAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<string | null>(null);

  const { address } = useAccount();
  
  // Contract write operation
  const { data: hash, writeContract, isPending } = useWriteContract();
  
  // Transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });
  
  // Get price estimation parameters
  const priceParams = subjectAddress && amount ? 
    getPriceEstimationParams(mode, subjectAddress, amount) : null;
  console.log('priceParams', priceParams);
  
  // Price estimation for current amount
  const { data: priceData, refetch: refetchPrice } = useReadContract({
    ...priceParams,
    query: {
      enabled: Boolean(priceParams && amount && Number(amount) > 0),
    },
  });
  console.log('priceData', priceData);

  // Get shares supply for the subject
  const supplyParams = subjectAddress ? getSharesSupplyParams(subjectAddress) : null;
  const { data: sharesSupply } = useReadContract({
    ...supplyParams,
    query: {
      enabled: Boolean(supplyParams),
    },
  });
  console.log('sharesSupply', sharesSupply);

  useEffect(() => {
    if (mode === 'sell' && share) {
      setSubjectAddress(share.subject_address);
    } else if (mode === 'buy' && share && share.subject_address) {
      setSubjectAddress(share.subject_address);
    }
  }, [mode, share]);
  
  useEffect(() => {
    if (priceData !== undefined && priceData !== null) {
      setEstimatedPrice(priceData.toString());
    }
  }, [priceData]);

  // Check if this is a first share self-purchase (shares supply = 0, buying own shares)

  const isFirstShareSelfPurchase = 
    mode === 'buy' && 
    subjectAddress && 
    address && 
    subjectAddress.toLowerCase().replace(/^0x/, '') === address.toLowerCase().replace(/^0x/, '') && 
    sharesSupply?.toString() === '0';

  useEffect(() => {
    if (subjectAddress && amount && Number(amount) > 0) {
      refetchPrice();
    }
  }, [subjectAddress, amount, refetchPrice]);

  useEffect(() => {
    if (isConfirmed) {
      onComplete();
    }
  }, [isConfirmed, onComplete]);

  const handleSetMaxAmount = () => {
    if (mode === 'sell' && share) {
      setAmount(share.shares_amount);
    }
  };

  const validateForm = () => {
    if (!subjectAddress) {
      setError('Please enter Subject address');
      return false;
    }

    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    if (
      mode === 'sell' &&
      share &&
      Number(amount) > Number(share.shares_amount)
    ) {
      setError('Sell amount cannot exceed your balance');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (mode === 'buy') {
        // For buying shares, we need to send the estimated price amount
        // Special case: First share self-purchase is always valid with price 0
        console.log('estimatedPrice', estimatedPrice);
        console.log('isFirstShareSelfPurchase', isFirstShareSelfPurchase);
        if ((estimatedPrice === null) || (estimatedPrice === '0' && !isFirstShareSelfPurchase)) {
          throw new Error('Failed to estimate buy price');
        }  else {
          const buyParams = getBuySharesParams(subjectAddress, amount, estimatedPrice);
          writeContract(buyParams);
        }
      } else {
        // For selling shares
        const sellParams = getSellSharesParams(subjectAddress, amount);
        writeContract(sellParams);
      }
      
      // Transaction will be confirmed through the useWaitForTransactionReceipt hook
      // which will trigger onComplete() when confirmed
      
    } catch (err) {
      console.error('Transaction failed:', err);
      setError(err instanceof Error ? err.message : 'Transaction failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {mode === 'buy' ? 'Buy Shares' : 'Sell Shares'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            X
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'buy' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Address
              </label>
              <input
                type="text"
                value={subjectAddress}
                onChange={(e) => setSubjectAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the Subject address you want to buy"
                disabled={isLoading || isPending || isConfirming || Boolean(share && share.subject_address)}
                required
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <div className="flex">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
                disabled={isLoading || isPending || isConfirming}
                required
              />
              {mode === 'sell' && (
                <button
                  type="button"
                  onClick={handleSetMaxAmount}
                  className="bg-gray-200 px-3 py-2 rounded-r-md hover:bg-gray-300"
                >
                  Max
                </button>
              )}
            </div>
            {mode === 'sell' && share && (
              <div className="text-xs text-gray-500 mt-1">
                Maximum sellable: {share.shares_amount}
              </div>
            )}
            
            {estimatedPrice && (
              <div className="p-2 bg-gray-50 rounded mt-2">
                <p className="text-sm font-medium">
                  {mode === 'buy' ? 'Estimated Total Cost' : 'Estimated Total Proceeds'}: 
                  <span className="font-bold ml-1">{formatPrice(estimatedPrice)} MON</span>
                </p>
                {isFirstShareSelfPurchase && (
                  <p className="text-xs text-green-600 mt-1">
                    First share purchase for your own account is free
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              disabled={isLoading || isPending || isConfirming}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white ${
                mode === 'buy'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              disabled={isLoading || isPending || isConfirming}
            >
              {isPending || isConfirming
                ? 'Processing...'
                : mode === 'buy'
                ? 'Confirm Buy'
                : 'Confirm Sell'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}