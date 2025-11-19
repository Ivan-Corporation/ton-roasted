import React from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';

export const WalletConnect: React.FC = () => {
  return (
    <div className="fixed top-5 right-5 z-50">
      <TonConnectButton className="rounded-full" />
    </div>
  );
};