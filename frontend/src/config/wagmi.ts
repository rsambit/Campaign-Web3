'use client'

import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { http, createConfig } from 'wagmi'
import { Chain, mainnet, sepolia } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'


const { connectors } = getDefaultWallets({
  appName: 'Campaign Web3',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'your-project-id',
});

const hardhatChain: Chain = {
    id: 31337,
    name: "localhost",
    rpcUrls: {
        public: {
            http: ["http://127.0.0.1:8545/"]
        },
        default: {
            http: ["http://127.0.0.1:8545/"]
        }
    },
    nativeCurrency: {
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18
    },
}

const projectId = 'my-new-project';

export const config = createConfig({
    chains: [mainnet, sepolia, hardhatChain],
    connectors,
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [hardhatChain.id]: http()
    }
})