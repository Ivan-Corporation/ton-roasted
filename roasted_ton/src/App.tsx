import React from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { WalletConnect } from './components/WalletConnect';
import { RoastInterface } from './components/RoastInterface';
import './App.css';

function App() {
  return (
    <TonConnectUIProvider manifestUrl="https://315467f670ae.ngrok-free.app/tonconnect-manifest.json">
      <div className="App">
        <WalletConnect />
        <RoastInterface />
      </div>
    </TonConnectUIProvider>
  );
}

export default App;