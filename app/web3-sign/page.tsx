'use client';

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import { API_CONFIG } from '../config';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Web3SignPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function requestSignature() {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask not installed!');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      console.log(signer);
      const address = await signer.getAddress();
      console.log(`address is ${address}`);

      const urlParams = new URLSearchParams(window.location.search);
      const challenge = urlParams.get('challenge');
      const chat_id = urlParams.get('chat_id');
      const shares_subject = urlParams.get('subject');
    //   const user = urlParams.get('user');
      const user = address;
      console.log(`challenge is ${challenge}`);
      console.log(`shares_subject is ${shares_subject}`);
      if (!challenge) {
        throw new Error('Missing challenge parameter');
      }
      
      const signature = await signer.signMessage(challenge);
      console.log(`Signature is ${signature}`);


      const response = await fetch(`${API_CONFIG.SERVER_API}/verify-signature`, {
        headers: { "Content-Type": "application/json" },
        method: 'POST',
        body: JSON.stringify({ challenge, chat_id,signature, shares_subject, user })
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          window.close();
        }, 2000);
      } else {
        throw new Error(result.error || 'Verification failed');
      }
    } catch (err) {
      console.error('Signature error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Automatically request signature when page loads
    requestSignature();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">MetaMask Signature Verification</h1>
        
        {loading && (
          <div className="text-center mb-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p>Processing, please confirm signature in MetaMask...</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 mb-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p className="font-medium">Error</p>
            <p>{error}</p>
            <button
              onClick={requestSignature}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={loading}
            >
              Retry
            </button>
          </div>
        )}
        
        {success && (
          <div className="p-4 mb-4 bg-green-50 border-l-4 border-green-500 text-green-700">
            <p className="font-medium">Success</p>
            <p>Signature verification successful! Returning to Telegram...</p>
          </div>
        )}
        
        {!loading && !error && !success && (
          <button
            onClick={requestSignature}
            className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            disabled={loading}
          >
            Connect Wallet and Sign
          </button>
        )}
        
        <div className="mt-4 text-center">
          <Link href="/">
            <span className="text-blue-600 hover:underline">Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 