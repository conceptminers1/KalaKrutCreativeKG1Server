
import React, { useState } from 'react';
import { X, ArrowDown, RefreshCw, Loader2, Coins, Wallet } from 'lucide-react';
import { useWallet, Balances } from '../WalletContext';
import { useToast } from './ToastContext';

interface TokenExchangeProps {
  onClose: () => void;
}

const TokenExchange: React.FC<TokenExchangeProps> = ({ onClose }) => {
  const { balances, swap } = useWallet();
  const { notify } = useToast();
  const [fromCurrency, setFromCurrency] = useState<keyof Balances>('usd');
  const [toCurrency, setToCurrency] = useState<keyof Balances>('kala');
  const [amount, setAmount] = useState<string>('');
  const [isSwapping, setIsSwapping] = useState(false);

  // Mock Rates for display
  const RATES: Record<string, number> = {
    eth: 2200, // USD
    kala: 0.15, // USD
    usd: 1
  };

  const getExchangeRate = () => {
    const rate = RATES[fromCurrency] / RATES[toCurrency];
    return rate;
  };

  const estimatedOutput = amount ? (parseFloat(amount) * getExchangeRate()).toFixed(4) : '0.00';

  const handleSwap = async () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    if (val > balances[fromCurrency]) {
      notify(`Insufficient ${fromCurrency.toUpperCase()} balance.`, 'error');
      return;
    }

    setIsSwapping(true);
    try {
      await swap(fromCurrency, toCurrency, val);
      notify('Swap executed successfully!', 'success');
      setAmount('');
    } catch (e) {
      notify('Swap failed. Please try again.', 'error');
    } finally {
      setIsSwapping(false);
    }
  };

  const handleFlip = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-kala-900 border border-kala-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
        <div className="p-4 border-b border-kala-800 flex justify-between items-center bg-kala-800/50">
          <h3 className="text-white font-bold flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-kala-secondary" /> Token Bridge & Swap
          </h3>
          <button onClick={onClose} className="text-kala-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-2">
          {/* FROM SECTION */}
          <div className="bg-kala-800 p-4 rounded-xl border border-kala-700">
            <div className="flex justify-between text-xs text-kala-400 mb-2">
              <span>Pay with</span>
              <span>Balance: {balances[fromCurrency].toFixed(4)}</span>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-2xl font-bold text-white outline-none placeholder-kala-600"
              />
              <select 
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value as keyof Balances)}
                className="bg-kala-900 text-white font-bold py-1 px-2 rounded border border-kala-600 outline-none"
              >
                <option value="usd">USD</option>
                <option value="eth">ETH</option>
                <option value="kala">KALA</option>
              </select>
            </div>
          </div>

          {/* FLIPPER */}
          <div className="flex justify-center -my-3 z-10 relative">
            <button onClick={handleFlip} className="bg-kala-700 border-4 border-kala-900 rounded-full p-2 hover:bg-kala-600 text-white transition-colors">
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          {/* TO SECTION */}
          <div className="bg-kala-800 p-4 rounded-xl border border-kala-700">
            <div className="flex justify-between text-xs text-kala-400 mb-2">
              <span>Receive (Est.)</span>
              <span>Balance: {balances[toCurrency].toFixed(4)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full text-2xl font-bold text-kala-secondary">
                {estimatedOutput}
              </div>
              <select 
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value as keyof Balances)}
                className="bg-kala-900 text-white font-bold py-1 px-2 rounded border border-kala-600 outline-none"
              >
                <option value="usd">USD</option>
                <option value="eth">ETH</option>
                <option value="kala">KALA</option>
              </select>
            </div>
          </div>

          {/* RATES */}
          <div className="px-2 py-2 text-xs text-kala-500 flex justify-between items-center">
            <span>Rate</span>
            <span>1 {fromCurrency.toUpperCase()} ≈ {getExchangeRate().toFixed(4)} {toCurrency.toUpperCase()}</span>
          </div>

          {/* FEES */}
          <div className="bg-kala-800/30 p-3 rounded-lg border border-kala-700/50 flex gap-3 mb-4">
             <Wallet className="w-4 h-4 text-kala-400 shrink-0" />
             <p className="text-[10px] text-kala-400">
               <span className="font-bold text-kala-300">Smart Router:</span> Converting via KalaKrut Liquidity Pool. 
               Network fee: ~0.1%.
             </p>
          </div>

          <button 
            onClick={handleSwap}
            disabled={!amount || isSwapping}
            className="w-full py-4 bg-gradient-to-r from-kala-secondary to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSwapping ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            {isSwapping ? 'Swapping...' : 'Swap Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenExchange;
