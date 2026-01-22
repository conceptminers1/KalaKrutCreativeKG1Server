
import React, { useState, useEffect, Suspense } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import Announcements from './components/Announcements';
import ChatOverlay from './components/ChatOverlay';
import WalletHistory from './components/WalletHistory';
import SearchResults from './components/SearchResults';
import Sitemap from './components/Sitemap';
import SystemDiagrams from './components/SystemDiagrams';
import WhitePaper from './components/WhitePaper';
import TokenExchange from './components/TokenExchange';
import { WalletProvider, useWallet } from './WalletContext';
import { ToastProvider, useToast } from './components/ToastContext';
import { useData, DataProvider } from './contexts/DataContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { UserRole, ModerationCase, ArtistProfile as IArtistProfile } from './types';
import { Wallet, Bell, Search, LogOut, Lock, Loader2, UploadCloud, MessageSquare, CreditCard, CheckCircle, ShieldAlert, AlertTriangle, X, RefreshCw, ArrowLeft } from 'lucide-react';
import { MOCK_LEADERBOARD, MOCK_ARTIST_PROFILE, MOCK_ROSTER, MOCK_USERS_BY_ROLE, MOCK_MODERATION_CASES } from './mockData';

// Lazy Loaded Components for Performance Code Splitting
const BookingHub = React.lazy(() => import('./components/BookingHub'));
const DaoGovernance = React.lazy(() => import('./components/DaoGovernance'));
const Marketplace = React.lazy(() => import('./components/Marketplace'));
const ServicesHub = React.lazy(() => import('./components/ServicesHub'));
const AnalyticsDashboard = React.lazy(() => import('./components/AnalyticsDashboard'));
const ArtistProfile = React.lazy(() => import('./components/ArtistProfile'));
const Roster = React.lazy(() => import('./components/Roster'));
const ArtistRegistration = React.lazy(() => import('./components/ArtistRegistration'));
const AdminLeads = React.lazy(() => import('./components/AdminLeads'));
const AdminEmailTemplates = React.lazy(() => import('./components/AdminEmailTemplates'));
const AdminSupport = React.lazy(() => import('./components/AdminSupport'));
const TreasuryDashboard = React.lazy(() => import('./components/TreasuryDashboard'));
const HRDashboard = React.lazy(() => import('./components/HRDashboard'));
const AdminContracts = React.lazy(() => import('./components/AdminContracts'));
const Forum = React.lazy(() => import('./components/Forum'));
const CreativeStudio = React.lazy(() => import('./components/CreativeStudio'));
const MembershipPlans = React.lazy(() => import('./components/MembershipPlans'));

// Loading Fallback
const PageLoader = () => (
  <div className="h-[60vh] w-full flex flex-col items-center justify-center text-kala-400">
    <div className="relative">
       <div className="w-16 h-16 border-4 border-kala-800 border-t-kala-secondary rounded-full animate-spin"></div>
       <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-kala-secondary rounded-full"></div>
       </div>
    </div>
    <p className="text-sm font-bold mt-6 tracking-widest uppercase animate-pulse">Loading Module...</p>
  </div>
);

// New Component: Blocked User Screen with Appeal
const BlockedScreen: React.FC<{ onAppeal: (reason: string) => void }> = ({ onAppeal }) => {
  const [appealReason, setAppealReason] = useState('');
  const [hasAppealed, setHasAppealed] = useState(false);
  const { notify } = useToast();

  const handleSubmit = () => {
     if (!appealReason.trim()) return;
     onAppeal(appealReason);
     setHasAppealed(true);
     notify("Appeal submitted to moderation team.", "info");
  };

  return (
    <div className="min-h-screen bg-kala-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-red-900/20 p-8 rounded-full border-4 border-red-500 mb-8 animate-pulse">
         <ShieldAlert className="w-24 h-24 text-red-500" />
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">Account Suspended</h1>
      <div className="max-w-xl mx-auto space-y-4 mb-8">
         <p className="text-red-200 text-lg">
            Your account has been automatically flagged and blocked for violating our <span className="font-bold">Zero Tolerance Policy</span> regarding illicit or foul content.
         </p>
         <p className="text-kala-400 text-sm">
            This block is immediate and applies to all portal features.
         </p>
      </div>

      {!hasAppealed ? (
         <div className="w-full max-w-md bg-kala-800 p-6 rounded-xl border border-kala-700">
            <h3 className="text-white font-bold mb-3 flex items-center justify-center gap-2">
               <AlertTriangle className="w-4 h-4 text-yellow-500" /> File Formal Appeal
            </h3>
            <textarea 
               className="w-full bg-kala-900 border border-kala-600 rounded-lg p-3 text-white text-sm mb-4 outline-none focus:border-kala-secondary"
               rows={4}
               placeholder="Explain why this block was an error..."
               value={appealReason}
               onChange={(e) => setAppealReason(e.target.value)}
            />
            <button 
              onClick={handleSubmit}
              disabled={!appealReason}
              className="w-full px-8 py-3 bg-kala-700 hover:bg-kala-600 text-white font-bold rounded-xl border border-kala-500 transition-colors disabled:opacity-50"
            >
               Submit Appeal to Admins
            </button>
         </div>
      ) : (
         <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-xl max-w-md">
            <div className="text-green-400 font-bold text-lg mb-2 flex items-center justify-center gap-2">
               <CheckCircle className="w-5 h-5" /> Appeal Submitted
            </div>
            <p className="text-green-200 text-sm">
               Your case ID is #BL-{Math.floor(Math.random() * 1000)}. Our moderation team will review your request within 48-72 hours. Check back later.
            </p>
         </div>
      )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState('home'); 
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.ARTIST);
  const [currentUser, setCurrentUser] = useState(MOCK_ARTIST_PROFILE);
  const [isAppLoggedIn, setIsAppLoggedIn] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(MOCK_ARTIST_PROFILE);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [showWalletHistory, setShowWalletHistory] = useState(false);
  const [showTokenExchange, setShowTokenExchange] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(MOCK_ARTIST_PROFILE);
  
  // Moderation State
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [moderationCases, setModerationCases] = useState<ModerationCase[]>(MOCK_MODERATION_CASES);

  const { isConnected: isWalletConnected, connect: connectWallet, disconnect: disconnectWallet, walletAddress, balances } = useWallet();
  const { notify } = useToast();
  const { isDemoMode, findUserByEmail, findUserByWallet, updateUser } = useData();

  useEffect(() => {
    if (!isAppLoggedIn && isWalletConnected) {
      disconnectWallet();
    }
  }, [isWalletConnected, isAppLoggedIn]);

  const handleBlockUser = () => {
     setIsUserBlocked(true);
     setShowChat(false); // Close chat if open
     
     // Create a new moderation case for Admin
     const newCase: ModerationCase = {
        id: `MOD-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUserRole,
        violationType: 'Automated Flag (Zero Tolerance)',
        contentSnippet: 'User content triggered global moderation filter.',
        status: 'Blocked',
        timestamp: new Date().toLocaleString()
     };
     setModerationCases(prev => [newCase, ...prev]);
     notify("Account suspended due to policy violation.", "error");
  };

  const handleAppeal = (reason: string) => {
     // Update the latest case for this user
     setModerationCases(prev => prev.map(c => 
        (c.userId === currentUser.id && c.status === 'Blocked') 
        ? { ...c, status: 'Appeal Pending', appealReason: reason } 
        : c
     ));
  };

  const handleAdminDecision = (caseId: string, decision: 'Unblock' | 'Reject') => {
     setModerationCases(prev => prev.map(c => {
        if (c.id === caseId) {
           const newStatus = decision === 'Unblock' ? 'Resolved - Unblocked' : 'Resolved - Ban Upheld';
           // If unblocking currently logged in user (simulation)
           if (decision === 'Unblock' && c.userId === currentUser.id) {
              setIsUserBlocked(false);
           }
           return { ...c, status: newStatus };
        }
        return c;
     }));
     notify(`Case ${caseId} updated: ${decision}`, "success");
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setCurrentView('search_results');
    }
  };

  const handleOpenChat = () => {
    setChatRecipient(selectedProfile);
    setShowChat(true);
  };

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    await connectWallet();
    setIsConnecting(false);
    notify("Wallet connected successfully!", "success");
  };

  const handleLogin = async (role: UserRole, method: 'web2' | 'web3', credentials?: any) => {
    let targetUser: any;

    if (isDemoMode) {
       // Demo Mode: Use mock data directly
       targetUser = MOCK_USERS_BY_ROLE[role] || MOCK_ARTIST_PROFILE;
       if (method === 'web3') await handleWalletConnect();
    } else {
       // Live Mode: Real Auth
       if (method === 'web2') {
          if (!credentials?.email) { notify("Invalid credentials.", "error"); return; }
          const found = findUserByEmail(credentials.email);
          if (!found) {
             notify("User not found. Please register first.", "error");
             return;
          }
          // Verify Password if it exists on record
          if (found.password && found.password !== credentials.password) {
             notify("Incorrect password.", "error");
             return;
          }
          
          targetUser = { ...MOCK_ARTIST_PROFILE, ...found }; // Merge basic profile structure with real data
          // Ensure we carry over password so user can update it later
          targetUser.password = found.password;
       } else {
          // Web3 Login
          await handleWalletConnect();
          const found = findUserByWallet('dummy_address'); // Simulate
          if (found) {
             targetUser = { ...MOCK_ARTIST_PROFILE, ...found };
          } else {
             // If wallet connected but no user, usually prompt reg. For now, map to temp user.
             targetUser = { ...MOCK_ARTIST_PROFILE, id: 'u_wallet_guest', name: 'Wallet User', role: UserRole.REVELLER };
             notify("Wallet recognized. Logged in as Guest.", "info");
          }
       }
    }

    setCurrentUserRole(targetUser.role);
    setCurrentUser(targetUser);
    setIsAppLoggedIn(true);
    setIsUserBlocked(false); 
    setCurrentView('dashboard');
    if (targetUser.role === UserRole.ARTIST) {
       setIsProfileComplete(true); 
    }
    notify(`Welcome back, ${targetUser.name}`, "info");
  };

  const handleLogout = () => {
    setIsAppLoggedIn(false);
    disconnectWallet();
    setCurrentView('home');
    setIsUserBlocked(false);
    notify("Logged out successfully.", "info");
  };

  const handleViewProfile = (id: string) => {
    const member = MOCK_ROSTER.find(m => m.id === id);
    if (member) {
      const profile = {
         ...MOCK_ARTIST_PROFILE,
         id: member.id,
         name: member.name,
         role: member.role,
         avatar: member.avatar,
         location: member.location,
         verified: member.verified,
         bio: `${member.name} is a leading ${member.role} in the KalaKrut ecosystem, operating out of ${member.location}. With a proven track record and ${member.rating} star rating, they are a key asset to our creative community.\n\n(Note: This is a dynamically generated profile preview based on Roster data).`,
         coverImage: `https://picsum.photos/seed/${member.id}/1200/400` 
      };
      setSelectedProfile(profile);
      setCurrentView('profile');
    }
  };

  const handleUpdateUserProfile = (updates: Partial<IArtistProfile>) => {
    // Update local state
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    // Update persisted data
    updateUser({
      id: updatedUser.id,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      subscriberOnly: {
        ...updatedUser.subscriberOnly,
        email: updatedUser.email || updatedUser.subscriberOnly.email
      },
      password: updatedUser.password
    });
    // If we are viewing own profile, update that view too
    if (selectedProfile.id === currentUser.id) {
      setSelectedProfile(updatedUser);
    }
  };

  const RoleSwitcher = () => {
    // Only show role switcher in Demo Mode. Real users can't switch roles arbitrarily.
    if (!isDemoMode) return null;

    return (
      <div className="flex items-center gap-2 mr-4 bg-kala-800 rounded-lg p-1">
        <span className="text-xs text-kala-500 px-2">View As:</span>
        <select 
          value={currentUserRole}
          onChange={(e) => {
              const newRole = e.target.value as UserRole;
              setCurrentUserRole(newRole);
              const newUser = MOCK_USERS_BY_ROLE[newRole];
              setCurrentUser(newUser);
              notify(`Switched view to ${newRole}`, "info");
          }}
          className="bg-kala-700 text-white text-xs rounded px-2 py-1 border-none outline-none"
        >
          {Object.values(UserRole).map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>
    );
  };

  const UserWidget = () => (
    <div className="flex flex-col md:flex-row items-end md:items-center justify-between mb-8 gap-4">
       <div className="text-white">
          <h1 className="text-2xl font-bold">Welcome back, {currentUser.name}</h1>
          <p className="text-kala-400 text-sm">Role: {currentUserRole} • {currentUser.location}</p>
       </div>

       <div className="flex items-center gap-4">
         <RoleSwitcher />
         
         <div className="relative hidden lg:block">
           <Search className="absolute left-3 top-2.5 w-4 h-4 text-kala-500" />
           <input 
             type="text"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             onKeyDown={handleSearch}
             placeholder="Search portal..." 
             className="bg-kala-800 border border-kala-700 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-kala-secondary outline-none w-48 transition-all focus:w-64"
           />
         </div>
         
         <button className="relative p-2 text-kala-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
         </button>

         <div className="flex items-center gap-3 pl-4 border-l border-kala-700">
            <div className="text-right hidden sm:block">
              {isWalletConnected ? (
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-sm font-bold text-white text-right">{walletAddress}</div>
                    <div className="flex gap-2 justify-end">
                      <span className="text-xs text-kala-secondary font-mono">{balances.eth.toFixed(2)} ETH</span>
                      <span className="text-xs text-purple-400 font-mono">{balances.kala.toFixed(0)} KALA</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowTokenExchange(true)}
                    className="p-2 bg-kala-800 hover:bg-kala-700 rounded-full border border-kala-600 text-kala-secondary transition-colors"
                    title="Swap Tokens"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleWalletConnect}
                  disabled={isConnecting}
                  className="text-xs bg-kala-secondary text-kala-900 px-3 py-1.5 rounded font-bold hover:bg-cyan-400 transition-colors flex items-center gap-2"
                >
                  {isConnecting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Connect Wallet'}
                </button>
              )}
            </div>
            <div 
              onClick={() => { setSelectedProfile(currentUser); setCurrentView('profile'); }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-kala-secondary to-purple-600 p-0.5 cursor-pointer hover:scale-105 transition-transform ml-2"
              title="View My Profile"
            >
              <img src={currentUser.avatar} alt="Me" className="w-full h-full rounded-full border-2 border-kala-900 object-cover" />
            </div>
            <button onClick={handleLogout} className="text-kala-500 hover:text-red-400 transition-colors ml-2" title="Log Out">
                <LogOut className="w-5 h-5" />
            </button>
         </div>
       </div>
    </div>
  );

  const renderAppContent = () => {
    // Wrap Lazy loaded components in Suspense
    return (
      <Suspense fallback={<PageLoader />}>
        {(() => {
          switch (currentView) {
            case 'search_results':
              return <SearchResults query={searchQuery} onNavigate={setCurrentView} />;
            case 'sitemap':
              return <Sitemap onNavigate={setCurrentView} />;
            case 'system_docs':
              return currentUserRole === UserRole.ADMIN ? <SystemDiagrams /> : <div className="text-red-400 bg-kala-800 p-8 rounded-xl text-center">Access Denied: Admins Only</div>;
            case 'whitepaper':
               return <WhitePaper />;
            case 'register_artist':
              return <ArtistRegistration onComplete={() => { setIsProfileComplete(true); setCurrentView('dashboard'); }} onBlockUser={handleBlockUser} />;
            case 'booking':
              return <BookingHub onBlockUser={handleBlockUser} onOpenExchange={() => setShowTokenExchange(true)} />;
            case 'governance':
              return <DaoGovernance currentUserRole={currentUserRole} onOpenExchange={() => setShowTokenExchange(true)} />;
            case 'marketplace':
              return <Marketplace 
                        onBlockUser={handleBlockUser} 
                        onChat={(seller) => {
                           setChatRecipient({ ...MOCK_ARTIST_PROFILE, name: seller.name, avatar: seller.avatar });
                           setShowChat(true);
                        }}
                     />;
            case 'services':
              return <ServicesHub userRole={currentUserRole} onNavigateToProfile={() => { setSelectedProfile(currentUser); setCurrentView('profile'); }} onBlockUser={handleBlockUser} />;
            case 'roster':
              return <Roster onNavigate={setCurrentView} onViewProfile={handleViewProfile} />;
            case 'forum':
              return <Forum onBlockUser={handleBlockUser} />;
            case 'studio':
              return <CreativeStudio onBlockUser={handleBlockUser} />;
            case 'admin_email_templates':
              return currentUserRole === UserRole.ADMIN ? <AdminEmailTemplates isDemoMode={isDemoMode} /> : <div className="text-red-400 bg-kala-800 p-8 rounded-xl text-center">Access Denied: Admins Only</div>;
            case 'membership':
              return <MembershipPlans currentUser={currentUser} />;
            case 'leads':
              return currentUserRole === UserRole.ADMIN ? <AdminLeads /> : <div className="text-red-400 bg-kala-800 p-8 rounded-xl text-center">Access Denied: Admins Only</div>;
            case 'admin_support':
              return currentUserRole === UserRole.ADMIN ? <AdminSupport moderationCases={moderationCases} onDecision={handleAdminDecision} /> : <div className="text-red-400 bg-kala-800 p-8 rounded-xl text-center">Access Denied: Admins Only</div>;
            case 'contracts':
              return (currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.DAO_MEMBER) ? 
                <AdminContracts 
                  onBlockUser={handleBlockUser} 
                  onChat={(name, avatar) => {
                    setChatRecipient({ ...MOCK_ARTIST_PROFILE, name, avatar });
                    setShowChat(true);
                  }} 
                /> 
                : <div className="text-red-400 bg-kala-800 p-8 rounded-xl text-center">Access Denied: Admin/DAO Only</div>;
            case 'treasury':
              return (currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.DAO_MEMBER) ? <TreasuryDashboard /> : <div className="text-red-400 bg-kala-800 p-8 rounded-xl text-center">Access Denied: Admin/DAO Only</div>;
            case 'hrd':
              return (currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.DAO_MEMBER) ? <HRDashboard /> : <div className="text-red-400 bg-kala-800 p-8 rounded-xl text-center">Access Denied: Admin/DAO Only</div>;
            case 'profile':
              return (
                <ArtistProfile 
                  artist={selectedProfile} 
                  onChat={handleOpenChat} 
                  onBook={() => setCurrentView('booking')}
                  isOwnProfile={selectedProfile.id === currentUser.id}
                  isBlocked={isUserBlocked} 
                  onUpdateProfile={handleUpdateUserProfile}
                />
              );
            case 'analytics':
              return currentUserRole === UserRole.ADMIN ? <AnalyticsDashboard /> : <div className="text-red-400 bg-kala-800 p-8 rounded-xl text-center">Access Denied: Admins Only</div>;
            case 'announcements_internal':
              return <Announcements onBack={() => setCurrentView('dashboard')} />;
            case 'community':
            case 'dashboard':
            default:
              // Dashboard inline logic
              let treasuryLabel = 'My Earnings';
              if (currentUserRole === UserRole.ADMIN) treasuryLabel = 'Platform Treasury';
              if (currentUserRole === UserRole.REVELLER) treasuryLabel = 'My Wallet';

              return (
                <div className="space-y-8 animate-in fade-in">
                  {showWalletHistory && (
                    <div className="mb-8 animate-in slide-in-from-top-4 fade-in">
                      <WalletHistory />
                    </div>
                  )}

                  {isAppLoggedIn && <UserWidget />}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className={`rounded-xl p-6 text-white shadow-lg ${isWalletConnected ? 'bg-gradient-to-br from-purple-600 to-purple-900 shadow-purple-900/30' : 'bg-gradient-to-br from-green-600 to-teal-900 shadow-green-900/30'}`}>
                        <div className="flex items-center gap-3 mb-2 opacity-80">
                          {isWalletConnected ? <Wallet className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                          <span className="text-sm font-medium">
                            {isWalletConnected ? `${treasuryLabel} (Crypto)` : `${treasuryLabel} (Fiat)`}
                          </span>
                        </div>
                        <div className="text-3xl font-bold tracking-tight">
                          {isWalletConnected ? `${balances.eth.toFixed(2)} ETH` : `$${(currentUser.revenue?.totalLifetime || 2450).toLocaleString()}`}
                        </div>
                        <div className={`text-xs mt-2 flex justify-between ${isWalletConnected ? 'text-purple-200' : 'text-green-200'}`}>
                           <span>{isWalletConnected ? 'Wallet Connected' : 'Stripe Balance (Available)'}</span>
                           <span>+12.5% (30d)</span>
                        </div>
                     </div>

                     <div className="bg-kala-800 border border-kala-700 rounded-xl p-6 text-white">
                        <div className="text-kala-400 text-sm font-medium mb-2">
                           {currentUserRole === UserRole.ARTIST ? 'Active Gigs' : 'My Events'}
                        </div>
                        <div className="text-3xl font-bold tracking-tight text-slate-100">{currentUser.stats.activeGigs}</div>
                        <div className="text-xs mt-2 text-green-400">View Details</div>
                     </div>

                     <div className="bg-kala-800 border border-kala-700 rounded-xl p-6 text-white">
                        <div className="text-kala-400 text-sm font-medium mb-2">Community Score</div>
                        <div className="text-3xl font-bold tracking-tight text-slate-100">Lvl {currentUser.level}</div>
                        <div className="text-xs mt-2 text-kala-secondary">Top 5% of {currentUserRole}s</div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                     <div className="xl:col-span-2 space-y-8">
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <button onClick={() => setCurrentView('roster')} className="p-4 bg-kala-800 border border-kala-700 hover:border-kala-secondary rounded-xl text-left transition-colors group">
                             <div className="bg-kala-secondary/10 w-10 h-10 rounded-lg flex items-center justify-center text-kala-secondary mb-3 group-hover:bg-kala-secondary group-hover:text-kala-900">
                                <Search className="w-5 h-5" />
                             </div>
                             <div className="font-bold text-white">Book Now</div>
                             <div className="text-[10px] text-kala-500">Find & Select Artists</div>
                          </button>
                          <button onClick={() => setCurrentView('marketplace')} className="p-4 bg-kala-800 border border-kala-700 hover:border-kala-secondary rounded-xl text-left transition-colors group">
                             <div className="bg-purple-500/10 w-10 h-10 rounded-lg flex items-center justify-center text-purple-400 mb-3 group-hover:bg-purple-500 group-hover:text-white">
                                <Wallet className="w-5 h-5" />
                             </div>
                             <div className="font-bold text-white">Sell / Auction</div>
                             <div className="text-[10px] text-kala-500">List NFTs or Gear</div>
                          </button>
                          <button onClick={() => setCurrentView('studio')} className="p-4 bg-kala-800 border border-kala-700 hover:border-kala-secondary rounded-xl text-left transition-colors group">
                             <div className="bg-orange-500/10 w-10 h-10 rounded-lg flex items-center justify-center text-orange-400 mb-3 group-hover:bg-orange-500 group-hover:text-white">
                                <UploadCloud className="w-5 h-5" />
                             </div>
                             <div className="font-bold text-white">Studio</div>
                             <div className="text-[10px] text-kala-500">Upload & Mint</div>
                          </button>
                          <button onClick={() => setCurrentView('forum')} className="p-4 bg-kala-800 border border-kala-700 hover:border-kala-secondary rounded-xl text-left transition-colors group">
                             <div className="bg-blue-500/10 w-10 h-10 rounded-lg flex items-center justify-center text-blue-400 mb-3 group-hover:bg-blue-500 group-hover:text-white">
                                <MessageSquare className="w-5 h-5" />
                             </div>
                             <div className="font-bold text-white">Forum</div>
                             <div className="text-[10px] text-kala-500">Community Chat</div>
                          </button>
                       </div>
                       
                       <div className="bg-kala-800/50 border border-kala-700 p-6 rounded-xl flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-white text-lg flex items-center gap-2">
                              <CheckCircle className="text-green-400 w-5 h-5" /> Community Directory
                            </h3>
                            <p className="text-kala-400 text-sm mt-1">
                              Ensure your profile is up to date in the ArtistCatalog database for automated matchmaking.
                            </p>
                          </div>
                          <button 
                             onClick={() => setCurrentView('register_artist')}
                             className="px-4 py-2 bg-kala-700 hover:bg-kala-600 text-white rounded-lg font-medium transition-colors"
                          >
                             Update Profile
                          </button>
                       </div>

                       <div className="hidden md:block">
                          {/* Leaderboard not lazy loaded on dashboard for instant feel */}
                       </div>
                     </div>

                     <div className="xl:col-span-1 space-y-6">
                        <div className="bg-gradient-to-br from-green-900/50 to-kala-900 border border-green-700/30 rounded-xl p-6 relative overflow-hidden">
                           <div className="relative z-10">
                              <h3 className="text-lg font-bold text-white mb-2">Go Mobile</h3>
                              <p className="text-sm text-green-200/80 mb-4">
                                 Download the KalaKrut Android App for real-time notifications and mobile ticketing.
                              </p>
                              <button className="bg-white text-green-900 text-xs font-bold px-4 py-2 rounded hover:bg-green-100">
                                 Get on Google Play
                              </button>
                           </div>
                           <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-green-500/20 rounded-full blur-xl"></div>
                        </div>

                        <div className="bg-kala-800/30 border border-kala-700 rounded-xl p-6">
                           <h3 className="text-lg font-bold text-white mb-2">Platform News</h3>
                           <p className="text-sm text-kala-400 mb-4">Stay updated with the latest features and community stories.</p>
                           <button 
                             onClick={() => setCurrentView('announcements_internal')}
                             className="w-full py-2 text-sm font-bold bg-kala-700 hover:bg-kala-600 text-white rounded transition-colors"
                           >
                             Read Announcements
                           </button>
                        </div>
                     </div>
                  </div>
                </div>
              );
          }
        })()}
      </Suspense>
    );
  };

  // If user is blocked, force Blocked Screen with Appeal
  if (isUserBlocked) {
    return <BlockedScreen onAppeal={handleAppeal} />;
  }

  if (!isAppLoggedIn) {
    if (currentView === 'announcements_public') {
      return <Announcements onBack={() => setCurrentView('home')} />;
    }
    if (currentView === 'register_new_user') {
       return (
         <div className="min-h-screen bg-kala-900 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 py-8">
               <button 
                 onClick={() => setCurrentView('home')} 
                 className="flex items-center gap-2 text-kala-400 hover:text-white mb-6 transition-colors"
               >
                  <ArrowLeft className="w-4 h-4" /> Back to Home
               </button>
               <ArtistRegistration 
                  onComplete={() => { 
                     notify("Registration received! You may now login.", "success");
                     setCurrentView('home'); 
                  }} 
                  onBlockUser={handleBlockUser} 
               />
            </div>
         </div>
       );
    }
    return <Home onLogin={handleLogin} onViewNews={() => setCurrentView('announcements_public')} onJoin={() => setCurrentView('register_new_user')} />;
  }

  return (
    <Layout currentView={currentView} userRole={currentUserRole} onNavigate={setCurrentView}>
       {showChat && (
         <ChatOverlay 
            recipientName={chatRecipient.name} 
            recipientAvatar={chatRecipient.avatar} 
            onClose={() => setShowChat(false)}
            onNavigateToBooking={() => { setShowChat(false); setCurrentView('booking'); }}
            onBlockUser={handleBlockUser}
         />
       )}
       {showTokenExchange && <TokenExchange onClose={() => setShowTokenExchange(false)} />}
       {renderAppContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <WalletProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </WalletProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
