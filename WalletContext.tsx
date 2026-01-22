
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Balances {
  eth: number;
  kala: number;
  usd: number;
}

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  balances: Balances;
  connect: () => Promise<void>;
  disconnect: () => void;
  swap: (from: keyof Balances, to: keyof Balances, amount: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const INITIAL_BALANCES: Balances = {
  eth: 14.5,
  kala: 5000,
  usd: 2450
};

// Mock Rates: 1 ETH = 2200 USD, 1 KALA = 0.15 USD
const RATES = {
  eth: 2200,
  kala: 0.15,
  usd: 1
};

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balances, setBalances] = useState<Balances>(INITIAL_BALANCES);

  // Simulate persistent connection check with safety for environments where localStorage is blocked
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kala_wallet_connected');
      if (saved === 'true') {
          setIsConnected(true);
          setWalletAddress('0x71C...9A23');
          // Keep initial mock balances for demo purposes
      }
    } catch (e) {
      console.warn("Local storage access blocked or unavailable:", e);
    }
  }, []);

  const connect = async () => {
    // Simulate MetaMask connection delay
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsConnected(true);
        setWalletAddress('0x71C...9A23'); // Mock address
        try {
          localStorage.setItem('kala_wallet_connected', 'true');
        } catch (e) {
          console.warn("Could not save wallet state:", e);
        }
        resolve();
      }, 1000);
    });
  };

  const disconnect = () => {
    setIsConnected(false);
    setWalletAddress(null);
    try {
      localStorage.removeItem('kala_wallet_connected');
    } catch (e) {
      // Ignore storage errors
    }
  };

  const swap = async (from: keyof Balances, to: keyof Balances, amount: number) => {
    return new Promise<void>((resolve, reject) => {
      if (balances[from] < amount) {
        reject(new Error('Insufficient balance'));
        return;
      }

      // Calculate Amount Out
      const rateFrom = RATES[from];
      const rateTo = RATES[to];
      const valueInUsd = amount * rateFrom;
      const amountOut = valueInUsd / rateTo;

      // Simulate network delay
      setTimeout(() => {
        setBalances(prev => ({
          ...prev,
          [from]: prev[from] - amount,
          [to]: prev[to] + amountOut
        }));
        resolve();
      }, 1500);
    });
  };

  return (
    <WalletContext.Provider value={{ isConnected, walletAddress, balances, connect, disconnect, swap }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
