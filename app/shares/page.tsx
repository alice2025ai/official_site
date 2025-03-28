'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import GradientBackground from '../components/GradientBackground';
import WalletConnect from '../components/WalletConnect';
import SharesTable from './SharesTable';
import TradeForm from './TradeForm';
import { API_CONFIG } from '../config';

type Share = {
  subject_address: string;
  shares_amount: string;
};

export default function SharesPage() {
  const { address, isConnected } = useAccount();
  const [shares, setShares] = useState<Share[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell' | null>(null);
  const [selectedShare, setSelectedShare] = useState<Share | null>(null);

  const fetchShares = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.SERVER_API}/users/${address}/shares`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const data = await response.json();
      setShares(data.shares);
    } catch (err) {
      console.error('Failed to get shares:', err);
      setError(err instanceof Error ? err.message : 'Failed to get shares');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchShares();
    }
  }, [isConnected, address]);

  const handleBuy = () => {
    setTradeMode('buy');
    setSelectedShare(null);
  };

  const handleSell = (share: Share) => {
    setTradeMode('sell');
    setSelectedShare(share);
  };

  const handleCloseTradeForm = () => {
    setTradeMode(null);
    setSelectedShare(null);
  };

  const handleTradeComplete = () => {
    fetchShares();
    setTradeMode(null);
    setSelectedShare(null);
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <nav className="h-20 w-full flex justify-between items-center px-8 text-black text-2xl font-semibold">
        <div className="flex items-center gap-1">
          <Image src="/logo.svg" alt="Alice" width={32} height={32} />
          Alice
        </div>
        <WalletConnect />
      </nav>
      <GradientBackground />

      <div className="container mx-auto pt-32 pb-16 px-4 relative z-10">
        <h1 className="text-4xl font-bold text-white mb-8">My Shares</h1>

        {!isConnected ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-xl mb-4">Please connect wallet to view your Shares</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Shares Balance</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleBuy}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Buy
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <p>Loading...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>{error}</p>
              </div>
            ) : shares.length === 0 ? (
              <div className="text-center py-8">
                <p>You don't have any Shares yet</p>
              </div>
            ) : (
              <SharesTable 
                shares={shares} 
                onSell={handleSell} 
              />
            )}

            {tradeMode && (
              <TradeForm 
                mode={tradeMode} 
                share={selectedShare}
                userAddress={address || ''}
                onClose={handleCloseTradeForm}
                onComplete={handleTradeComplete}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
} 