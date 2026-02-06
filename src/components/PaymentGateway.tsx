
import React, { useState } from 'react';
import { Coins, CreditCard, Loader2, Lock, ShieldCheck } from 'lucide-react';

interface PaymentGatewayProps {
  amount: number | string;
  currency: string;
  itemDescription: string;
  onSuccess: (method: 'crypto' | 'fiat') => void;
  onCancel: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ amount, currency, itemDescription, onSuccess, onCancel }) => {
  const [method, setMethod] = useState<'crypto' | 'fiat'>('crypto');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(method);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
       <div className="bg-kala-900 border border-kala-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-kala-800 bg-kala-800/50 flex justify-between items-center">
             <div>
               <h3 className="text-white font-bold text-lg flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-green-400" /> Secure Checkout
               </h3>
               <p className="text-xs text-kala-400">Encrypted via KalaKrut Escrow</p>
             </div>
             <div className="bg-kala-900 px-2 py-1 rounded text-[10px] font-mono text-kala-500 border border-kala-800">
               SSL 256-bit
             </div>
          </div>

          <div className="p-6 space-y-6">
             {/* Order Summary */}
             <div className="bg-kala-800/30 rounded-lg p-4 flex justify-between items-center border border-kala-700">
                <div>
                  <div className="text-xs text-kala-500 uppercase font-bold">Item</div>
                  <div className="text-sm text-kala-300 font-medium">{itemDescription}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-kala-500 uppercase font-bold">Total</div>
                  <div className="text-xl font-mono font-bold text-white">{amount} {currency}</div>
                </div>
             </div>

             {/* Payment Method Selection */}
             <div>
               <label className="block text-xs text-kala-400 mb-2 uppercase font-bold tracking-wider">Select Payment Method</label>
               <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMethod('crypto')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all relative overflow-hidden ${
                      method === 'crypto'
                      ? 'bg-purple-500/20 border-purple-500 text-white shadow-lg shadow-purple-900/20'
                      : 'bg-kala-800 border-kala-700 text-kala-400 hover:bg-kala-700'
                    }`}
                  >
                     <Coins className="w-8 h-8 mb-1" />
                     <span className="text-sm font-bold">Crypto Wallet</span>
                     <span className="text-[10px] opacity-70">ETH, MATIC, USDC</span>
                     {method === 'crypto' && <div className="absolute inset-0 border-2 border-purple-500 rounded-xl"></div>}
                  </button>

                  <button
                    onClick={() => setMethod('fiat')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all relative overflow-hidden ${
                      method === 'fiat'
                      ? 'bg-green-500/20 border-green-500 text-white shadow-lg shadow-green-900/20'
                      : 'bg-kala-800 border-kala-700 text-kala-400 hover:bg-kala-700'
                    }`}
                  >
                     <CreditCard className="w-8 h-8 mb-1" />
                     <span className="text-sm font-bold">Card / Fiat</span>
                     <span className="text-[10px] opacity-70">Stripe / Bank Transfer</span>
                     {method === 'fiat' && <div className="absolute inset-0 border-2 border-green-500 rounded-xl"></div>}
                  </button>
               </div>
             </div>

             {/* Dynamic Info Box */}
             <div className={`text-xs p-3 rounded border ${
               method === 'crypto' 
               ? 'bg-purple-900/20 border-purple-500/30 text-purple-200' 
               : 'bg-green-900/20 border-green-500/30 text-green-200'
             }`}>
                {method === 'crypto' ? (
                   <div className="flex gap-2">
                     <Lock className="w-4 h-4 shrink-0" />
                     <p>Transaction will be signed via your connected Web3 wallet. Smart contract gas fees apply.</p>
                   </div>
                ) : (
                   <div className="flex gap-2">
                     <Lock className="w-4 h-4 shrink-0" />
                     <p>Processed securely via Stripe. A 2.9% + 30¢ processing fee will be applied to the final total.</p>
                   </div>
                )}
             </div>

             {/* Action Buttons */}
             <div className="flex gap-3 pt-2">
                <button 
                  onClick={onCancel} 
                  disabled={isProcessing}
                  className="flex-1 py-3 rounded-xl border border-kala-600 text-kala-400 font-bold hover:text-white hover:bg-kala-800 transition-colors"
                >
                   Cancel
                </button>
                <button
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-kala-secondary text-kala-900 font-bold rounded-xl hover:bg-cyan-400 flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 transition-all"
                >
                   {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (method === 'crypto' ? 'Sign & Pay' : 'Pay Now')}
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default PaymentGateway;
