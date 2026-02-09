
import React, { createContext, useContext, useState } from 'react';
import { RosterMember, Message, Proposal, LeaderboardEntry, ArtistProfile, Booking, MarketplaceItem, ServiceListing, Article, Lead, ForumThread, Transaction, IPFSAsset, SupportTicket, SubscriptionPlan, TreasuryAsset, StaffMember, ModerationCase, UserRole } from '../types';

import { 
  MOCK_ROSTER as initialRoster,
  MOCK_PROPOSALS as initialProposals,
  MOCK_LEADERBOARD as initialLeaderboard,
  MOCK_MARKETPLACE_ITEMS as initialMarketplaceItems,
  MOCK_SERVICES as initialServiceListings,
  MOCK_ARTICLES as initialArticles,
  MOCK_THREADS as initialForumThreads,
  MOCK_TICKETS as initialSupportTickets,
  MOCK_TREASURY_ASSETS as initialTreasuryAssets,
  MOCK_STAFF as initialStaff,
  MOCK_MODERATION_CASES as initialModerationCases,
  MOCK_USERS_BY_ROLE,
  MOCK_ARTIST_PROFILE
} from '../mockData';

// --- DEFINITIVE FIX: Merge All User Data at the Source ---
// This function creates a single, clean list of users by merging the demo stubs with real profiles.
const getMergedRoster = () => {
  const profileMap = new Map<string, ArtistProfile>();

  // 1. Add all base users from the main roster to the map, keyed by their unique ID.
  // This includes the "demo_artist", "demo_venue" etc., which are needed for login.
  initialRoster.forEach(member => {
    profileMap.set(member.id, {
      ...MOCK_ARTIST_PROFILE, // Start with a generic fallback profile
      ...member, // Apply the specific member data (id, role, etc.)
    });
  });

  // 2. Now, merge the REAL user profiles from MOCK_USERS_BY_ROLE.
  // This finds the correct user by ID and merges the real name and details over the demo data.
  Object.values(MOCK_USERS_BY_ROLE).forEach(realProfile => {
    if (realProfile) {
      const existingProfile = profileMap.get(realProfile.id) || {};
      // Merge the real profile onto the existing one. The real name and avatar will overwrite the demo/generic ones.
      profileMap.set(realProfile.id, { ...existingProfile, ...realProfile });
    }
  });
  
  // The final list now contains a single, correct entry for every user.
  return Array.from(profileMap.values());
};


const rosterWithFullProfiles = getMergedRoster();

interface DataContextType {
  currentUser: ArtistProfile | null;
  roster: ArtistProfile[];
  messages: Message[];
  proposals: Proposal[];
  leaderboard: LeaderboardEntry[];
  bookings: Booking[];
  marketplaceItems: MarketplaceItem[];
  serviceListings: ServiceListing[];
  articles: Article[];
  leads: Lead[];
  forumThreads: ForumThread[];
  transactions: Transaction[];
  ipfsAssets: IPFSAsset[];
  supportTickets: SupportTicket[];
  subscriptionPlans: SubscriptionPlan[];
  treasuryAssets: TreasuryAsset[];
  staff: StaffMember[];
  moderationCases: ModerationCase[];
  loading: boolean;
  login: (user: ArtistProfile | RosterMember) => void;
  logout: () => void;
  addMessage: (message: Message) => void;
  addProposal: (proposal: Proposal) => void;
  updateUser: (user: ArtistProfile) => void;
  addUser: (user: Omit<RosterMember, 'id'>) => RosterMember;
  addMarketItem: (item: MarketplaceItem) => void;
  addLead: (artist: { id: string; name: string; bio: string; }) => boolean;
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  updateProposal: (updatedProposal: Proposal) => void;
  updateBooking: (updatedBooking: Booking) => void;
  updateTransaction: (updatedTransaction: Transaction) => void;
  updateIpfsAsset: (updatedAsset: IPFSAsset) => void;
  updateTicket: (updatedTicket: SupportTicket) => void;
  updateStaffMember: (updatedStaff: StaffMember) => void;
  updateModerationCase: (updatedCase: ModerationCase) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<ArtistProfile | null>(null);
  
  const [roster, setRoster] = useState<ArtistProfile[]>(rosterWithFullProfiles);
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(initialMarketplaceItems || []);
  const [serviceListings, setServiceListings] = useState<ServiceListing[]>(initialServiceListings || []);
  const [articles, setArticles] = useState<Article[]>(initialArticles || []);
  const [forumThreads, setForumThreads] = useState<ForumThread[]>(initialForumThreads || []);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets || []);
  const [treasuryAssets, setTreasuryAssets] = useState<TreasuryAsset[]>(initialTreasuryAssets || []);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff || []);
  const [moderationCases, setModerationCases] = useState<ModerationCase[]>(initialModerationCases || []);

  const [messages, setMessages] = useState<Message[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ipfsAssets, setIpfsAssets] = useState<IPFSAsset[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  
  const [loading, setLoading] = useState(false);

  const login = (user: ArtistProfile | RosterMember) => {
    const fullProfile = roster.find(r => r.id === user.id);
    setCurrentUser(fullProfile || null);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = (user: Omit<RosterMember, 'id'>): RosterMember => {
    const newUser: RosterMember = { ...user, id: `user-${Date.now()}` };
    setRoster(prev => [...prev, newUser as ArtistProfile]);
    return newUser;
  };

  const updateUser = (updatedUser: ArtistProfile) => {
    setRoster(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
  };

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const addProposal = (proposal: Proposal) => {
    setProposals(prev => [proposal, ...prev]);
  };
  
  const addMarketItem = (item: MarketplaceItem) => {
    setMarketplaceItems(prev => [item, ...prev]);
  };

  const addLead = (artist: { id: string; name: string; bio: string; }): boolean => {
    let wasAdded = false;
    setLeads(prev => {
        if (prev.some(l => l.id === artist.id)) {
            wasAdded = false;
            return prev;
        }
        const newLead: Lead = {
            id: artist.id,
            email: `${artist.name.replace(/\s+/g, '.') .toLowerCase()}@example-lead.com`,
            source: 'MusicBrainz Search',
            status: 'New',
            generatedDate: new Date().toISOString(),
            notes: artist.bio || 'No bio available.',
        };
        wasAdded = true;
        return [newLead, ...prev];
    });
    return wasAdded;
  };

  const updateProposal = (updatedProposal: Proposal) => {
    setProposals(prev => prev.map(p => p.id === updatedProposal.id ? updatedProposal : p));
  };

  const updateBooking = (updatedBooking: Booking) => {
    setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
  };

  const updateIpfsAsset = (updatedAsset: IPFSAsset) => {
    setIpfsAssets(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
  };

  const updateTicket = (updatedTicket: SupportTicket) => {
    setSupportTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };

  const updateStaffMember = (updatedStaff: StaffMember) => {
    setStaff(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
  };

  const updateModerationCase = (updatedCase: ModerationCase) => {
    setModerationCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
  };

  return (
    <DataContext.Provider value={{
      currentUser, roster, messages, proposals, leaderboard, bookings, marketplaceItems, serviceListings, articles, leads, setLeads, forumThreads, transactions, ipfsAssets, supportTickets, subscriptionPlans, treasuryAssets, staff, moderationCases, loading,
      login, logout, addUser, updateUser, addMessage, addProposal, addLead, addMarketItem, updateProposal, updateBooking, updateTransaction, updateIpfsAsset, updateTicket, updateStaffMember, updateModerationCase
    }}>
      {children}
    </DataContext.Provider>
  );
};
