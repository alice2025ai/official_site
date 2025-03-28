'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { WalletProvider } from './context/WalletContext';
import { WEB3_CONFIG } from './config';

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

const config = getDefaultConfig({
  appName: 'Alice',
  projectId: '0e91d2e39fb0fc87e37632b9f4deb16d', // Need to be replaced with actual WalletConnect project ID
  chains: [MONAD_TESTNET],
  transports: {
    [MONAD_TESTNET.id]: http('https://testnet-rpc.monad.xyz'),
  },
});

const queryClient = new QueryClient();

// 自定义RainbowKit主题
const customTheme = {
  ...darkTheme(),
  colors: {
    ...darkTheme().colors,
    modalBackground: '#FFFFFF',
    accentColor: '#000000',
  },
  fonts: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  radii: {
    ...darkTheme().radii,
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" theme={customTheme} locale="en">
          <WalletProvider>
            {children}
          </WalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 