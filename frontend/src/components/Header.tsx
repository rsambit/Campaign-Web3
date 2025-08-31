'use client'

import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Campaign Web3
            </h1>
          </div>

          {/* Connect Wallet Button */}
          <div className="flex items-center">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                // Note: If your app doesn't use authentication, you
                // can remove all 'authenticationStatus' checks
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="wallet-button wallet-button-disconnected"
                          >
                            Connect Wallet
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="wallet-button bg-red-500 hover:bg-red-600 text-white"
                          >
                            Wrong Network
                          </button>
                        );
                      }

                      return (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-colors"
                          >
                            {chain.hasIcon && (
                              <div
                                className="inline-block w-4 h-4 mr-2"
                                style={{
                                  background: chain.iconUrl ? `url(${chain.iconUrl})` : 'none',
                                  backgroundSize: 'cover',
                                  borderRadius: '50%',
                                }}
                              />
                            )}
                            {chain.name}
                          </button>

                          <button
                            onClick={openAccountModal}
                            type="button"
                            className="wallet-button wallet-button-connected"
                          >
                            {account.displayName}
                            {account.displayBalance ? ` (${account.displayBalance})` : ''}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
