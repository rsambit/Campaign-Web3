# Campaign Web3 Frontend

A modern Web3-enabled Next.js application with wallet connection functionality using the latest tools and technologies.

## Features

- 🔗 **Modern Web3 Integration**: Built with Wagmi v1 and Viem for type-safe blockchain interactions
- 🌈 **RainbowKit**: Beautiful, customizable wallet connection modal with support for multiple wallets
- 🦄 **Multi-Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet, and more
- ⚡ **Fast & Responsive**: Built with Next.js 14 and Tailwind CSS
- 🔒 **Type Safety**: Full TypeScript support throughout the application
- 🎨 **Beautiful UI**: Modern design with Tailwind CSS

## Supported Wallets

- MetaMask
- WalletConnect (mobile wallets)
- Coinbase Wallet
- Rainbow Wallet
- And many more through RainbowKit

## Supported Networks

- Ethereum Mainnet
- Goerli Testnet
- Sepolia Testnet
- Polygon
- Optimism
- Arbitrum

## Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- A Web3 wallet like MetaMask installed in your browser

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. (Optional) Configure your environment variables in `.env.local`:
   - `NEXT_PUBLIC_ALCHEMY_ID`: Your Alchemy API key for better RPC performance
   - `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: Your WalletConnect project ID

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── Header.tsx          # Header with wallet connect button
│   ├── config/
│   │   └── wagmi.ts           # Web3 configuration
│   ├── pages/
│   │   ├── _app.tsx           # App wrapper with providers
│   │   └── index.tsx          # Home page
│   └── styles/
│       └── globals.css        # Global styles
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Key Components

### Header Component
- **Location**: `src/components/Header.tsx`
- **Features**: 
  - Connect/Disconnect wallet functionality
  - Display connected wallet address in readable format
  - Network switching capability
  - Responsive design

### Wagmi Configuration
- **Location**: `src/config/wagmi.ts`
- **Features**:
  - Multi-chain support
  - Multiple RPC providers
  - Auto-connection on page load

## Technologies Used

- **Frontend Framework**: Next.js 14
- **Web3 Libraries**: 
  - Wagmi v1 (React hooks for Ethereum)
  - Viem (TypeScript interface for Ethereum)
  - RainbowKit (Wallet connection UI)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: TanStack Query (React Query)

## Customization

### Adding New Networks
Edit `src/config/wagmi.ts` and add your desired networks to the `chains` array.

### Customizing Wallet UI
Modify the `ConnectButton.Custom` component in `src/components/Header.tsx` to change the wallet button appearance and behavior.

### Styling
Update `tailwind.config.js` and `src/styles/globals.css` to customize the application's appearance.

## Common Issues

### "Unknown at rule @tailwind" errors
These are expected during development and will be resolved when the application is built.

### Module not found errors
Run `npm install` to ensure all dependencies are properly installed.

### Wallet connection issues
Ensure you have a Web3 wallet installed and that you're on a supported network.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [RainbowKit Documentation](https://www.rainbowkit.com)
- [Viem Documentation](https://viem.sh)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
