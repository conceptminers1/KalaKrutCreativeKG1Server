
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
  // Initialize state with Mocks (if not purged previously) OR LocalStorage data
  const [allUsers, setAllUsers] = useState<RosterMember[]>(() => {
    const saved = localStorage.getItem('kk_users');
    let users = saved ? JSON.parse(saved) : tagMocks(MOCK_ROSTER);
    
    // Safety Net: Ensure the Live Admin always exists if not present
    if (!users.find((u: RosterMember) => u.subscriberOnly.email === 'admin@kalakrut.io')) {
       users = [...users, SYSTEM_ADMIN];
    }
    // Ensure Super Admin exists
    if (!users.find((u: RosterMember) => u.subscriberOnly.email === 'bhoominpandya@gmail.com')) {
       users = [...users, SUPER_ADMIN];
    }
    return users;
  });

  const [allMarketItems, setAllMarketItems] = useState<MarketplaceItem[]>(() => {
    const saved = localStorage.getItem('kk_market');
    return saved ? JSON.parse(saved) : tagMocks(MOCK_MARKETPLACE_ITEMS);
  });

  const [allProposals, setAllProposals] = useState<Proposal[]>(() => {
    const saved = localStorage.getItem('kk_proposals');
    return saved ? JSON.parse(saved) : tagMocks(MOCK_PROPOSALS);
  });

  const [isDemoMode, setIsDemoMode] = useState(true);
  
  // New Global Admin Setting: Is Demo Mode even an option?
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
    // CRITICAL: If Demo Mode is globally disabled, immediately force current session to Live Mode
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
      isMock: false, // REAL DATA TAG
      password: profile.password
    };
    
    setAllUsers(prev => [newRosterMember, ...prev]);
  };

  const updateUser = (updates: Partial<RosterMember>) => {
    setAllUsers(prev => prev.map(user => {
      if (user.id === updates.id) {
        return { ...user, ...updates };
      }
      return user;
    }));
  };

  const addMarketItem = (item: MarketplaceItem) => {
    setAllMarketItems(prev => [{ ...item, isMock: false }, ...prev]);
  };

  const purgeMockData = () => {
    if (window.confirm("WARNING: This will delete all 'Working Example' data and leave only Real User data. This action cannot be undone. Are you sure?")) {
      setAllUsers(prev => prev.filter((u: any) => u.isMock === false));
      setAllMarketItems(prev => prev.filter((i: any) => i.isMock === false));
      setAllProposals(prev => prev.filter((p: any) => p.isMock === false));
    }
  };

  const findUserByEmail = (email: string) => {
    return allUsers.find(u => u.subscriberOnly.email.toLowerCase() === email.toLowerCase() && u.isMock === false);
  };

  const findUserByWallet = (address: string) => {
    return allUsers.find(u => u.isMock === false);
  };

  // Filtered Data based on Mode
  const visibleUsers = isDemoMode ? allUsers : allUsers.filter(u => u.isMock === false);
  const visibleMarket = allMarketItems;
  const visibleProposals = isDemoMode ? allProposals : allProposals.filter(p => p.isMock === false);

  const stats = {
    totalMembers: visibleUsers.length,
    activeGigs: isDemoMode ? 2 + visibleUsers.filter((u: any) => !u.isMock).length : visibleUsers.length, 
    totalTransactions: isDemoMode ? `${(12 + visibleUsers.filter((u: any) => !u.isMock).length)}` : '0'
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
