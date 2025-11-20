import React from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { WalletConnect } from './components/WalletConnect';
import { RoastInterface } from './components/RoastInterface';
import './App.css';

function App() {
  return (
    <TonConnectUIProvider manifestUrl="https://ton-roasted.vercel.app//tonconnect-manifest.json">
      <div className="App">
        <WalletConnect />
        <RoastInterface />
      </div>
    </TonConnectUIProvider>
  );
}

export default App;