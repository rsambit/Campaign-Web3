# Campaign Web3 Frontend

A modern Web3-enabled Next.js application with wallet connection functionality using the latest tools and technologies.

## Features

- 🔗 **Modern Web3 Integration**: Built with Wagmi v1 and Viem for type-safe blockchain interactions
- 🌈 **RainbowKit**: Beautiful, customizable wallet connection modal with support for multiple wallets
- 🦄 **Multi-Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet, and more
- ⚡ **Next.js 14 App Router**: Modern file-system based routing with layouts and loading states
- 🎨 **Beautiful UI**: Modern design with Tailwind CSS and responsive layouts
- 🔒 **Type Safety**: Full TypeScript support throughout the application
- 🚀 **Server Components**: Optimized rendering with React Server Components

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
│   ├── app/                    # Next.js App Router
│   │   ├── campaigns/         # Campaigns routes
│   │   │   ├── layout.tsx     # Campaigns layout
│   │   │   └── page.tsx       # Campaigns page
│   │   ├── globals-error.tsx  # Global error boundary
│   │   ├── layout.tsx         # Root layout (replaces _app.tsx)
│   │   ├── loading.tsx        # Global loading UI
│   │   ├── not-found.tsx      # 404 page
│   │   ├── page.tsx           # Home page (replaces pages/index.tsx)
│   │   └── providers.tsx      # Client-side providers
│   ├── components/
│   │   └── Header.tsx         # Header with navigation & wallet connect
│   ├── config/
│   │   └── wagmi.ts          # Web3 configuration
│   └── styles/
│       └── globals.css        # Global styles
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Key Components

### App Router Structure
- **Root Layout**: `src/app/layout.tsx` - Defines the HTML structure and global providers
- **Providers**: `src/app/providers.tsx` - Client-side Web3 and query providers
- **Home Page**: `src/app/page.tsx` - Main landing page with wallet connection
- **Campaigns**: `src/app/campaigns/` - Nested route with its own layout

### Header Component
- **Location**: `src/components/Header.tsx`
- **Features**: 
  - Navigation between pages
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

## App Router Benefits

- **File-system based routing**: Routes are defined by folder structure
- **Nested layouts**: Share UI between routes while preserving state
- **Loading states**: Built-in loading.tsx for better UX
- **Error boundaries**: Automatic error handling with error.tsx files
- **Server Components**: Better performance with server-side rendering
- **Streaming**: Progressive page rendering

## Technologies Used

- **Frontend Framework**: Next.js 14 with App Router
- **Routing**: File-system based routing with nested layouts
- **Web3 Libraries**: 
  - Wagmi v1 (React hooks for Ethereum)
  - Viem (TypeScript interface for Ethereum)
  - RainbowKit (Wallet connection UI)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: TanStack Query (React Query)
- **Architecture**: React Server Components + Client Components

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
