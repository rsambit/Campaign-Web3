# Campaign-Web3
Web3 Full stack project for funding a campaign

## Project Structure

This project consists of two main parts:

### 🎨 Frontend (`/frontend`)
A modern Web3-enabled Next.js application with wallet connection functionality.

**Key Features:**
- 🔗 **Modern Web3 Integration**: Built with Wagmi v1 and Viem
- 🌈 **RainbowKit**: Beautiful wallet connection UI
- 🦄 **Multi-Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet, and more
- ⚡ **Fast & Responsive**: Next.js 14 + Tailwind CSS
- 🔒 **Type Safety**: Full TypeScript support

**Technologies:**
- Next.js 14
- Wagmi v1 (React hooks for Ethereum)
- RainbowKit (Wallet connection UI)
- Viem (TypeScript interface for Ethereum)
- Tailwind CSS
- TypeScript

### 🔐 Backend (Coming Soon)
Smart contracts and backend services for campaign management.

## Quick Start

### Frontend Development

#### Using PowerShell (Windows):
```powershell
./start-frontend.ps1
```

#### Using Bash:
```bash
./start-frontend.sh
```

#### Manual Setup:
```bash
cd frontend
npm install
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Wallet Connection Features

✅ **Connect Wallet Button**: Click to connect your MetaMask or other Web3 wallet  
✅ **Address Display**: Shows your wallet address in a readable format  
✅ **Balance Display**: Shows your ETH balance  
✅ **Network Support**: Supports multiple networks (Ethereum, Polygon, etc.)  
✅ **Disconnect Functionality**: Button changes to "Disconnect" when connected  
✅ **Responsive Design**: Works on desktop and mobile devices  

## Supported Wallets

- 🦊 MetaMask
- 🌈 Rainbow Wallet
- 💙 Coinbase Wallet
- 🔗 WalletConnect (all mobile wallets)
- And many more through RainbowKit

## Supported Networks

- Ethereum Mainnet
- Goerli Testnet
- Sepolia Testnet
- Polygon
- Optimism
- Arbitrum

## Environment Setup

1. Copy the environment variables:
   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. (Optional) Add your API keys to `.env.local`:
   - `NEXT_PUBLIC_ALCHEMY_ID`: Your Alchemy API key
   - `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: Your WalletConnect project ID

## Development

The project uses modern Web3 development tools:

- **Wagmi**: React hooks for Ethereum
- **Viem**: TypeScript interface for Ethereum
- **RainbowKit**: Best-in-class wallet connection experience
- **Next.js**: React framework for production
- **Tailwind CSS**: Utility-first CSS framework

## Contributing

1. Clone the repository
2. Navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## License

This project is open source and available under the [MIT License](LICENSE).
