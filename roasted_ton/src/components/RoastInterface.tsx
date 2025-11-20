import React, { useState, useEffect } from 'react';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { createRoastTransaction, ROAST_CONTRACT_ADDRESS } from '../ton/contract';
import { getRoastCount, getRandomRoast, getInitialId } from '../ton/api';

export const RoastInterface: React.FC = () => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [lastRoast, setLastRoast] = useState<string>('');
  const [roastCount, setRoastCount] = useState<number>(0);
  const [contractRoastCount, setContractRoastCount] = useState<number>(0);
  const [initialId, setInitialId] = useState<number>(0);

useEffect(() => {
  const loadInitialData = async () => {
    try {
      // Get both values at once - with API key, this should work fine
      const [count, id] = await Promise.all([
        getRoastCount(),
        getInitialId()
      ]);
      setContractRoastCount(count);
      setInitialId(id);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      // Just use defaults
      setContractRoastCount(0);
      setInitialId(0);
    }
  };

  loadInitialData();
}, []);

  const handleGetRoast = async () => {
    if (!wallet) {
      alert('Please connect your wallet first!');
      return;
    }

    setIsLoading(true);
    setLastRoast('');
    
    try {
      const queryId = Math.floor(Math.random() * 1000000);
      const transaction = createRoastTransaction(queryId);
      
      await tonConnectUI.sendTransaction(transaction);
      
      // Wait for transaction, then get the roast
      setTimeout(async () => {
        try {
          // Just get the roast, don't bother with count updates
          const roast = await getRandomRoast();
          setLastRoast(roast);
          setRoastCount(prev => prev + 1);
          
          // Optionally update the count if you really want to
          const newCount = await getRoastCount();
          setContractRoastCount(newCount);
        } catch (error) {
          console.error('Error getting roast:', error);
          // Fallback to local roasts
          const fallbackRoasts = [
            "You're the reason we need warning labels.",
            "You bring everyone so much joy... when you leave the room.",
            "You're like a cloud. When you disappear, it's a beautiful day.",
            "If laughter is the best medicine, your face must be curing the world.",
            "You have a face for radio... and a voice for silent film.",
            "Is your ass jealous of the amount of shit that just came out of your mouth?",
            "You're not stupid; you just have bad luck thinking.",
            "I'd agree with you but then we'd both be wrong.",
            "Don't worry about me. Worry about your eyebrows.",
            "You're... actually not that bad. Just kidding!"
          ];
          const randomRoast = fallbackRoasts[Math.floor(Math.random() * fallbackRoasts.length)];
          setLastRoast(randomRoast);
          setRoastCount(prev => prev + 1);
        }
        setIsLoading(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error sending transaction:', error);
      setIsLoading(false);
      alert('Failed to get roast. Please try again.');
    }
  };

  const handleRefreshData = async () => {
    try {
      const count = await getRoastCount();
      setContractRoastCount(count);
    } catch (error) {
      console.error('Error refreshing count:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-8 text-white text-center">
        <h1 className="text-5xl font-bold mb-6">🔥 TON Roaster 🔥</h1>
        <p className="text-xl mb-8 opacity-90">
          Ready to get roasted by a smart contract?
        </p>
        
        {!wallet ? (
          <div className="bg-white/10 rounded-2xl p-10 backdrop-blur-sm">
            <p className="text-lg">Connect your wallet to get started!</p>
          </div>
        ) : (
          <div>
            <button 
              onClick={handleGetRoast}
              disabled={isLoading}
              className={`
                px-8 py-4 text-xl font-bold rounded-full transition-all duration-300
                ${isLoading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600 transform hover:-translate-y-1 hover:shadow-2xl'
                }
                text-white shadow-lg mb-6 w-full max-w-xs
              `}
            >
              {isLoading ? '🔥 Getting Roast...' : '🔥 Roast Me!'}
            </button>
            
            {/* Simple contract stats - who even looks at these? */}
            <div className="bg-white/10 rounded-xl p-4 mb-6 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm opacity-70">Total Roasts</p>
                  <p className="text-2xl font-bold">{contractRoastCount}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Contract ID</p>
                  <p className="text-2xl font-bold">{initialId}</p>
                </div>
              </div>
              <button 
                onClick={handleRefreshData}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
              >
                Refresh
              </button>
            </div>
            
            {lastRoast && (
              <div className="bg-white/10 rounded-2xl p-6 border-2 border-white/20 backdrop-blur-sm animate-fade-in">
                <h3 className="text-xl font-semibold mb-4">Your Latest Roast:</h3>
                <p className="text-2xl italic mb-3 text-yellow-300 leading-relaxed">
                  "{lastRoast}"
                </p>
              </div>
            )}
            
            <div className="mt-6 opacity-80 space-y-2">
              <p>Your Roasts This Session: <span className="font-bold">{roastCount}</span></p>
              <p className="text-sm">
                Cost: <span className="font-mono">0.05 TON</span> per roast
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-10 bg-black/20 rounded-xl p-5 text-sm">
          <p className="font-mono break-all">{ROAST_CONTRACT_ADDRESS}</p>
          <a 
            href={`https://testnet.tonscan.org/address/${ROAST_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-300 hover:text-yellow-200 transition-colors duration-200 inline-block mt-2"
          >
            View on Tonscan ↗
          </a>
        </div>
      </div>
    </div>
  );
};