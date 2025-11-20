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
  const [isRoastVisible, setIsRoastVisible] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [count, id] = await Promise.all([
          getRoastCount(),
          getInitialId()
        ]);
        setContractRoastCount(count);
        setInitialId(id);
      } catch (error) {
        console.error('Failed to load initial data:', error);
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
    setIsRoastVisible(false);
    
    try {
      const queryId = Math.floor(Math.random() * 1000000);
      const transaction = createRoastTransaction(queryId);
      
      await tonConnectUI.sendTransaction(transaction);
      
      setTimeout(async () => {
        try {
          const roast = await getRandomRoast();
          setLastRoast(roast);
          setRoastCount(prev => prev + 1);
          
          // Animate the roast appearance
          setTimeout(() => setIsRoastVisible(true), 300);
          
          const newCount = await getRoastCount();
          setContractRoastCount(newCount);
        } catch (error) {
          console.error('Error getting roast:', error);
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
          setTimeout(() => setIsRoastVisible(true), 300);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-700 to-red-600 py-4 px-4 sm:py-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/4 -right-10 w-16 h-16 bg-red-400 rounded-full blur-xl opacity-30 animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-purple-400 rounded-full blur-xl opacity-20 animate-ping"></div>
      </div>

      <div className="relative max-w-2xl mx-auto bg-gradient-to-br from-gray-900/90 via-purple-900/80 to-pink-800/80 rounded-3xl shadow-2xl p-6 sm:p-8 text-white text-center backdrop-blur-lg border border-white/10">
        
        {/* Header with animated emojis */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-center items-center gap-2 sm:gap-4 mb-4">
            <span className="text-3xl sm:text-4xl animate-bounce">🔥</span>
            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
              TON Roaster
            </h1>
            <span className="text-3xl sm:text-4xl animate-pulse">🔥</span>
          </div>
          <p className="text-lg sm:text-xl opacity-90 font-light">
            Ready to get roasted by a smart contract?
          </p>
        </div>
        
        {!wallet ? (
          <div className="bg-white/5 rounded-2xl p-8 sm:p-10 backdrop-blur-sm border border-white/10">
            <div className="text-6xl mb-4">🔐</div>
            <p className="text-lg sm:text-xl mb-4">Connect your wallet to get roasted!</p>
            <p className="text-sm opacity-70">
              You'll need some testnet TON to play with the roasts
            </p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Main Roast Button */}
            <div className="relative">
              <button 
                onClick={handleGetRoast}
                disabled={isLoading}
                className={`
                  relative px-8 py-6 sm:px-12 sm:py-8 text-xl sm:text-2xl font-bold rounded-2xl 
                  transition-all duration-500 transform
                  ${isLoading 
                    ? 'bg-gray-600 cursor-not-allowed scale-95' 
                    : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 hover:scale-105 hover:shadow-2xl active:scale-95'
                  }
                  text-white shadow-lg w-full max-w-md mx-auto
                  border-2 border-orange-300/50
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Roasting in progress...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">🔥</span>
                    <span>ROAST ME!</span>
                    <span className="text-2xl">🔥</span>
                  </div>
                )}
                
                {/* Button shine effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
              
              {/* Floating emojis around button */}
              {!isLoading && (
                <>
                  <div className="absolute -top-2 -left-2 text-2xl animate-bounce">💀</div>
                  <div className="absolute -top-2 -right-2 text-2xl animate-bounce delay-150">😈</div>
                  <div className="absolute -bottom-2 -left-4 text-2xl animate-bounce delay-300">👻</div>
                  <div className="absolute -bottom-2 -right-4 text-2xl animate-bounce delay-500">🤡</div>
                </>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div className="bg-white/5 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-300">
                <div className="text-2xl sm:text-3xl mb-2">🌍</div>
                <p className="text-xs sm:text-sm opacity-70 mb-1">Total Roasts</p>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-400">{contractRoastCount}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-300">
                <div className="text-2xl sm:text-3xl mb-2">🆔</div>
                <p className="text-xs sm:text-sm opacity-70 mb-1">Contract ID</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-400">{initialId}</p>
              </div>
            </div>

            {/* Refresh Button */}
            <button 
              onClick={handleRefreshData}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40 text-sm"
            >
              🔄 Refresh Stats
            </button>

            {/* Roast Display */}
            {lastRoast && (
              <div className={`bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl p-6 sm:p-8 border-2 border-orange-400/30 backdrop-blur-sm transition-all duration-700 transform ${
                isRoastVisible 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-10 scale-95'
              }`}>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-2xl animate-pulse">🎯</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-yellow-300">DIRECT HIT!</h3>
                  <span className="text-2xl animate-pulse">🎯</span>
                </div>
                <div className="bg-black/30 rounded-xl p-4 sm:p-6 border border-yellow-500/30">
                  <p className="text-lg sm:text-2xl italic leading-relaxed text-white">
                    "{lastRoast}"
                  </p>
                </div>
                <div className="mt-4 text-sm opacity-70">
                  💡 Powered by TON Smart Contract
                </div>
              </div>
            )}

            {/* Session Stats */}
            <div className="bg-white/5 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-white/10">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm opacity-70 mb-1">Your Roasts</p>
                  <p className="text-2xl font-bold text-purple-300">{roastCount}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70 mb-1">Cost per Roast</p>
                  <p className="text-xl font-mono font-bold text-green-300">0.05 TON</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Contract Info */}
        <div className="mt-8 sm:mt-12 bg-black/30 rounded-xl p-4 sm:p-6 border border-white/10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-lg">📝</span>
            <p className="text-sm font-medium">Smart Contract</p>
          </div>
          <p className="font-mono text-xs sm:text-sm break-all opacity-80 mb-3">
            {ROAST_CONTRACT_ADDRESS}
          </p>
          <a 
            href={`https://testnet.tonscan.org/address/${ROAST_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            <span>View on Tonscan</span>
            <span>↗</span>
          </a>
        </div>

        {/* Footer */}
        <div className="mt-6 text-xs opacity-50">
          Made with ❤️ and 🔥 on TON Blockchain
        </div>
      </div>
    </div>
  );
};