'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '../context/WalletContext';
import { AI_FRAME_CONFIG, API_CONFIG } from '../config';
import { useDebounce } from '../hooks/useDebounce';

export default function CreateAgentForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { walletAddress, isWalletConnected, connectWallet, signMessage } = useWallet();
  const [agentName, setAgentName] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [nameExists, setNameExists] = useState(false);
  const debouncedName = useDebounce(agentName, 500);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!isWalletConnected) {
      setError('Please connect your wallet first');
      setIsLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const agentName = formData.get('agentName') as string;
    const telegramToken = formData.get('telegramToken') as string;
    const telegramGroupId = formData.get('telegramGroupId') as string;
    const agentBio = formData.get('agentBio') as string;
    const telegramInviteUrl = formData.get('telegramInviteUrl') as string;

    const telegramInviteUrlRegex = /^https:\/\/t\.me\/\+[a-zA-Z0-9_-]+$/;
    if (!telegramInviteUrlRegex.test(telegramInviteUrl)) {
      setError('Please enter a valid Telegram invite URL (e.g., https://t.me/+7Ev9E8aomwk5YzI1)');
      setIsLoading(false);
      return;
    }

    try {
      // Wallet sign a message for authorization
      const messageToSign = `Create Agent: ${agentName}`;
      await signMessage(messageToSign);
      
      // Step 1: Get agent ID from the first API
      const idResponse = await fetch(`${AI_FRAME_CONFIG.AI_FRAME_API}/agent/id/${encodeURIComponent(agentName)}`);
      
      if (!idResponse.ok) {
        throw new Error(`Failed to get agent ID: ${idResponse.status} ${idResponse.statusText}`);
      }
      
      const { agentId } = await idResponse.json();
      
      if (!agentId) {
        throw new Error('No agent ID returned from server');
      }

      // Generate JSON template
      const agentData = {
        name: agentName,
        clients: ["telegram"],
        allowDirectMessages: true,
        modelProvider: "deepseek",
        settings: {
          secrets: {
            TELEGRAM_BOT_TOKEN: telegramToken
          },
          modelConfig: {
            maxOutputTokens: 4096
          }
        },
        plugins: ["@elizaos-plugins/client-telegram"],
        bio: [
          agentBio
        ],
        lore: [],
        knowledge: [
          "I can execute token transfers, staking, unstaking, and governance actions directly with the connected wallet.",
          "I ensure all actions are verified and secure before execution.",
          "I support creating new denominations (denoms) directly through your wallet."
        ],
        messageExamples: [],
        postExamples: [],
        topics: [
          "Direct wallet operations",
          "Token management",
          "Secure transaction execution"
        ],
        style: {
          all: [
            "Direct",
            "Precise",
            "Factual",
            "Data-driven"
          ],
          chat: [
            "Clear",
            "Verification-focused",
            "Data-driven"
          ],
          post: []
        },
        adjectives: [
          "Accurate",
          "Methodical",
          "Wallet-integrated"
        ]
      };

      // Step 2: Set agent data with the second API
      const setResponse = await fetch(`${AI_FRAME_CONFIG.AI_FRAME_API}/agents/${agentId}/set`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentData),
      });

      if (!setResponse.ok) {
        throw new Error(`Failed to create agent: ${setResponse.status} ${setResponse.statusText}`);
      }

      // Step 3: Add Telegram bot to the system
      const addTelegramBotResponse = await fetch(`${API_CONFIG.SERVER_API}/add_tg_bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bot_token: telegramToken,
          chat_group_id: telegramGroupId,
          subject_address: walletAddress,
          agent_name: agentName,
          bio: agentBio,
          invite_url: telegramInviteUrl
        }),
      });

      if (!addTelegramBotResponse.ok) {
        throw new Error(`Failed to add Telegram bot: ${addTelegramBotResponse.status} ${addTelegramBotResponse.statusText}`);
      }

      // Success - redirect to homepage or success page
      router.push('/');
      
    } catch (err) {
      console.error('Error creating agent:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if agent name already exists
  useEffect(() => {
    const checkAgentNameExists = async () => {
      if (!debouncedName || debouncedName.trim() === '') return;
      
      setIsChecking(true);
      try {
        const response = await fetch(`${API_CONFIG.SERVER_API}/agents/${debouncedName}`);
        const data = await response.json();
        setNameExists(data.agent !== null);
      } catch (error) {
        console.error('Failed to check agent name:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAgentNameExists();
  }, [debouncedName]);

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-gray-100 p-4 rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Wallet Connection</h3>
            <p className="text-xs text-gray-500">
              {isWalletConnected 
                ? `Connected: ${walletAddress?.substring(0, 6)}...${walletAddress?.substring(walletAddress.length - 4)}` 
                : 'Please connect your wallet to create an agent'}
            </p>
          </div>
          {!isWalletConnected && (
            <button
              type="button"
              onClick={connectWallet}
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="agentName" className="block text-sm font-medium text-gray-700">
          Agent Name
        </label>
        <input
          id="agentName"
          name="agentName"
          type="text"
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md ${
            nameExists ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {isChecking && <p className="text-sm text-gray-500">Checking availability...</p>}
        {nameExists && (
          <p className="text-sm text-red-500">
            This agent name already exists. Please choose another name.
          </p>
        )}
      </div>
      
      <div>
        <label htmlFor="telegramToken" className="block text-sm font-medium text-gray-700 mb-1">
          Telegram Bot Token
        </label>
        <input
          type="text"
          id="telegramToken"
          name="telegramToken"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Telegram bot token"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="telegramGroupId" className="block text-sm font-medium text-gray-700 mb-1">
          Telegram Group ID
        </label>
        <input
          type="text"
          id="telegramGroupId"
          name="telegramGroupId"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Telegram group ID (negative number)"
          required
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Must be a negative number (e.g., -1001234567890)
        </p>
      </div>
      
      <div>
        <label htmlFor="agentBio" className="block text-sm font-medium text-gray-700 mb-1">
          Agent Bio
        </label>
        <textarea
          id="agentBio"
          name="agentBio"
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter agent bio"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="telegramInviteUrl" className="block text-sm font-medium text-gray-700 mb-1">
          Telegram Group Invite URL
        </label>
        <input
          type="text"
          id="telegramInviteUrl"
          name="telegramInviteUrl"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://t.me/+7Ev9E8aomwk5YzI1"
          required
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Must be a valid Telegram invite URL (e.g., https://t.me/+7Ev9E8aomwk5YzI1)
        </p>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Link href="/">
          <button 
            type="button" 
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            disabled={isLoading}
          >
            Cancel
          </button>
        </Link>
        <button
          type="submit"
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
          disabled={isLoading || !isWalletConnected || nameExists}
        >
          {isLoading ? 'Creating...' : 'Create Agent'}
        </button>
      </div>
    </form>
  );
} 