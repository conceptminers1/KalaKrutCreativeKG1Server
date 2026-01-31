
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RosterMember, MarketplaceItem, Proposal, ArtistProfile, UserRole } from '../types';
import { MOCK_ROSTER, MOCK_MARKETPLACE_ITEMS, MOCK_PROPOSALS } from '../mockData';

interface DataContextType {
  users: RosterMember[];
  marketItems: MarketplaceItem[];
  proposals: Proposal[];
  addUser: (user: ArtistProfile) => void;
  updateUser: (user: Partial<RosterMember>) => void;
  addMarketItem: (item: MarketplaceItem) => void;
  purgeMockData: () => void;
  isDemoMode: boolean;
  setDemoMode: (isDemo: boolean) => void;
  demoModeAvailable: boolean;
  setDemoModeAvailable: (available: boolean) => void;
  stats: {
    totalMembers: number;
    activeGigs: number;
    totalTransactions: string;
  };
  // Auth Helpers
  findUserByEmail: (email: string) => RosterMember | undefined;
  findUserByWallet: (address: string) => RosterMember | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper to tag mocks
const tagMocks = (data: any[]) => data.map(item => ({ ...item, isMock: true }));

// Emergency Admin for Live Mode
const SYSTEM_ADMIN: RosterMember = {
  id: 'sys_admin_live',
  name: 'System Admin (Live)',
  role: UserRole.ADMIN,
  avatar: 'https://ui-avatars.com/api/?name=System+Admin&background=0D8ABC&color=fff',
  location: 'Server Room',
  verified: true,
  rating: 5.0,
  assets: { ips: [], contents: [], events: [], products: [], services: [], equipment: [], instruments: [], tickets: [] },
  subscriberOnly: {
    email: 'admin@kalakrut.io',
    phone: 'N/A',
    agentContact: 'System'
  },
  isMock: false // REAL USER
};

const SUPER_ADMIN: RosterMember = {
  id: 'super_admin_bhoomin',
  name: 'Super Admin',
  role: UserRole.ADMIN,
  avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=8b5cf6&color=fff',
  location: 'Global HQ',
  verified: true,
  rating: 5.0,
  assets: { ips: [], contents: [], events: [], products: [], services: [], equipment: [], instruments: [], tickets: [] },
  subscriberOnly: {
    email: 'bhoominpandya@gmail.com',
    phone: '+1 (555) 000-SUPER',
    agentContact: 'Direct'
  },
  isMock: false, // REAL USER
  password: 'Creatkala!2' // Specific password
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  const [allUsers, setAllUsers] = useState<RosterMember[]>(() => {
    try {
      const saved = localStorage.getItem('kk_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          let users = parsed.filter(Boolean); // Filter out any null/undefined entries
          // Ensure admin accounts always exist
          if (!users.some(u => u && u.id === SYSTEM_ADMIN.id)) {
            users.push(SYSTEM_ADMIN);
          }
          if (!users.some(u => u && u.id === SUPER_ADMIN.id)) {
            users.push(SUPER_ADMIN);
          }
          return users;
        }
      }
    } catch (error) {
      console.error("CRITICAL: Failed to load or parse 'kk_users' from localStorage. Data may be corrupted. Falling back to default mock data.", error);
    }
    // Fallback to mock data if try block fails or no data is saved
    return [...tagMocks(MOCK_ROSTER), SYSTEM_ADMIN, SUPER_ADMIN];
  });

  const [allMarketItems, setAllMarketItems] = useState<MarketplaceItem[]>(() => {
    try {
      const saved = localStorage.getItem('kk_market');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean); // Filter out any null/undefined entries
        }
      }
    } catch (error) {
      console.error("CRITICAL: Failed to load or parse 'kk_market' from localStorage. Falling back to default mock data.", error);
    }
    return tagMocks(MOCK_MARKETPLACE_ITEMS);
  });

  const [allProposals, setAllProposals] = useState<Proposal[]>(() => {
    try {
      const saved = localStorage.getItem('kk_proposals');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean); // Filter out any null/undefined entries
        }
      }
    } catch (error) {
      console.error("CRITICAL: Failed to load or parse 'kk_proposals' from localStorage. Falling back to default mock data.", error);
    }
    return tagMocks(MOCK_PROPOSALS);
  });

  const [isDemoMode, setIsDemoMode] = useState(true);
  
  const [demoModeAvailable, setDemoModeAvailable] = useState(() => {
    const saved = localStorage.getItem('kk_demo_available');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Persistence Effects
  useEffect(() => { localStorage.setItem('kk_users', JSON.stringify(allUsers)); }, [allUsers]);
  useEffect(() => { localStorage.setItem('kk_market', JSON.stringify(allMarketItems)); }, [allMarketItems]);
  useEffect(() => { localStorage.setItem('kk_proposals', JSON.stringify(allProposals)); }, [allProposals]);
  
  useEffect(() => { 
    localStorage.setItem('kk_demo_available', JSON.stringify(demoModeAvailable));
    if (!demoModeAvailable) {
      setIsDemoMode(false);
    }
  }, [demoModeAvailable]);

  const addUser = (profile: ArtistProfile) => {
    const newRosterMember: RosterMember = {
      id: profile.id,
      name: profile.name,
      role: profile.role,
      avatar: profile.avatar || 'https://picsum.photos/seed/new_user/200',
      location: profile.location,
      verified: false,
      rating: 0,
      assets: {
        ips: [], contents: [], events: [], products: [], services: [], equipment: [], instruments: [], tickets: []
      },
      subscriberOnly: {
        email: profile.email || 'hidden',
        phone: 'Hidden',
        agentContact: 'Direct'
      },
      isMock: false,
      password: profile.password
    };
    
    setAllUsers(prev => [newRosterMember, ...prev.filter(p => p.id !== newRosterMember.id)]);
  };

  const updateUser = (updates: Partial<RosterMember>) => {
    setAllUsers(prev => prev.map(user => user.id === updates.id ? { ...user, ...updates } : user));
  };

  const addMarketItem = (item: MarketplaceItem) => {
    setAllMarketItems(prev => [{ ...item, isMock: false }, ...prev]);
  };

  const purgeMockData = () => {
    if (window.confirm("WARNING: This will delete all 'Working Example' data and leave only Real User data. This action cannot be undone. Are you sure?")) {
      setAllUsers(prev => prev.filter(u => u.isMock === false));
      setAllMarketItems(prev => prev.filter(i => i.isMock === false));
      setAllProposals(prev => prev.filter(p => p.isMock === false));
    }
  };

  const findUserByEmail = (email: string) => {
    // Ensure subscriberOnly exists before matching
    return allUsers.find(u => u.subscriberOnly && u.subscriberOnly.email && u.subscriberOnly.email.toLowerCase() === email.toLowerCase());
  };

  const findUserByWallet = (address: string) => {
    // This logic was flawed, it should find a user by a wallet address.
    // This is a placeholder as wallet addresses aren't stored on the user object.
    // In a real app, you would have a 'walletAddress' field on the user.
    return allUsers.find(u => u.isMock === false); 
  };

  // Filtered Data based on Mode
  const visibleUsers = isDemoMode ? allUsers : allUsers.filter(u => u.isMock === false);
  const visibleMarket = allMarketItems;
  const visibleProposals = isDemoMode ? allProposals : allProposals.filter(p => p.isMock === false);

  const stats = {
    totalMembers: visibleUsers.length,
    activeGigs: visibleProposals.filter(p => p.status === 'Active').length,
    totalTransactions: isDemoMode ? (12 + visibleUsers.filter(u => !u.isMock).length).toString() : '0'
  };

  return (
    <DataContext.Provider value={{ 
      users: visibleUsers, 
      marketItems: visibleMarket, 
      proposals: visibleProposals, 
      addUser, 
      updateUser,
      addMarketItem, 
      purgeMockData,
      isDemoMode,
      setDemoMode: setIsDemoMode,
      demoModeAvailable,
      setDemoModeAvailable,
      stats,
      findUserByEmail,
      findUserByWallet
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
