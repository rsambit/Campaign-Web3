import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useAccount, useBalance } from 'wagmi';

const Home: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch by only rendering after client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Campaign Web3 - Connect Your Wallet</title>
        <meta name="description" content="Web3 Campaign application with wallet connection" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to Campaign Web3
        </h1>
        
        <div className="max-w-2xl mx-auto">
          {!mounted ? (
            // Show loading state during hydration
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ) : isConnected ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                🎉 Wallet Connected Successfully!
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Wallet Address
                  </h3>
                  <p className="text-lg font-mono text-gray-900 break-all">
                    {address}
                  </p>
                </div>
                
                {balance && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Balance
                    </h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600 mb-6">
                Connect your MetaMask wallet to get started with Campaign Web3
              </p>
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Click "Connect Wallet" in the header above to get started
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🔗 Web3 Integration</h3>
            <p className="text-gray-600">
              Built with the latest Web3 technologies including Wagmi and RainbowKit
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🦄 Multiple Wallets</h3>
            <p className="text-gray-600">
              Support for MetaMask, WalletConnect, and other popular wallet providers
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">⚡ Fast & Secure</h3>
            <p className="text-gray-600">
              Modern React hooks and TypeScript for type-safe Web3 interactions
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
