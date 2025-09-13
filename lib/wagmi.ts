import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'wagmi/chains';

// Define Somnia Network chain
const somnia = {
  id: 50104,
  name: 'Somnia Network',
  nativeCurrency: {
    decimals: 18,
    name: 'STT',
    symbol: 'STT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.somnia.network'],
    },
    public: {
      http: ['https://rpc.somnia.network'],
    },
  },
  blockExplorers: {
    default: { name: 'Somnia Explorer', url: 'https://explorer.somnia.network' },
  },
  testnet: false,
} as const;

export const config = getDefaultConfig({
  appName: 'Somnia Dashboard',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'default-project-id',
  chains: [somnia, sepolia, mainnet],
  ssr: true,
});

export { somnia };