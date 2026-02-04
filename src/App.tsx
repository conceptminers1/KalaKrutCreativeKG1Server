import React, { useState, useEffect, Suspense, useTransition } from 'react';
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
import { WalletProvider, useWallet } from './contexts/WalletContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { useData, DataProvider } from './contexts/DataContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { UserRole, ModerationCase, ArtistProfile as IArtistProfile } from './types';
import { Wallet, Bell, Search, LogOut, Lock, Loader2, UploadCloud, MessageSquare, CreditCard, CheckCircle, ShieldAlert, AlertTriangle, X, RefreshCw, ArrowLeft } from 'lucide-react';
import { MOCK_LEADERBOARD, MOCK_ARTIST_PROFILE, MOCK_ROSTER, MOCK_USERS_BY_ROLE, MOCK_MODERATION_CASES } from './mockData';

// Lazy Loaded Components
const BookingHub = React.lazy(() => import('./components/BookingHub'));
const DaoGovernance = React.lazy(() => import('./components/DaoGovernance'));
const Marketplace = React.lazy(() => import('./components/Marketplace'));
const ServicesHub = React.lazy(() => import('./components/ServicesHub'));
const AnalyticsDashboard = React.lazy(() => import('./components/AnalyticsDashboard'));
const ArtistProfile = React.lazy(() => import('./components/ArtistProfile'));
const Roster = React.lazy(() => import('./components/Roster'));
const ArtistRegistration = React.lazy(() => import('./components/ArtistRegistration'));
const AdminLeads = React.lazy(() => import('./components/AdminLeads'));
const LeadsAndAi = React.lazy(() => import('./components/LeadsAndAi'));
const AdminEmailTemplates = React.lazy(() => import('./components/AdminEmailTemplates'));
const AdminSupport = React.lazy(() => import('./components/AdminSupport'));
const TreasuryDashboard = React.lazy(() => import('./components/TreasuryDashboard'));
const HRDashboard = React.lazy(() => import('./components/HRDashboard'));
const AdminContracts = React.lazy(() => import('./components/AdminContracts'));
const Forum = React.lazy(() => import('./components/Forum'));
const CreativeStudio = React.lazy(() => import('./components/CreativeStudio'));
const MembershipPlans = React.lazy(() => import('./components/MembershipPlans'));
const MyCircle = React.lazy(() => import('./components/MyCircle'));

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

const BlockedScreen: React.FC<{ onAppeal: (reason: string) => void }> = ({ onAppeal }) => {
  const [appealReason, setAppealReason] = useState('');
  const [hasAppealed, setHasAppealed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
     if (!appealReason.trim()) return;
     onAppeal(appealReason);
     setHasAppealed(true);
     toast("Appeal submitted to moderation team.", "info");
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
         <p className="text-kala-400 text-sm">This block is immediate and applies to all portal features.</p>
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
            <button onClick={handleSubmit} disabled={!appealReason} className="w-full px-8 py-3 bg-kala-700 hover:bg-kala-600 text-white font-bold rounded-xl border border-kala-500 transition-colors disabled:opacity-50">
               Submit Appeal to Admins
            </button>
         </div>
      ) : (
         <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-xl max-w-md">
            <div className="text-green-400 font-bold text-lg mb-2 flex items-center justify-center gap-2">
               <CheckCircle className="w-5 h-5" /> Appeal Submitted
            </div>
            <p className="text-green-200 text-sm">Your case ID is #BL-{Math.floor(Math.random() * 1000)}. Our moderation team will review your request within 48-72 hours.</p>
         </div>
      )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const [isPending, startTransition] = useTransition();
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
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [moderationCases, setModerationCases] = useState<ModerationCase[]>(MOCK_MODERATION_CASES);

  const { isConnected: isWalletConnected, connect: connectWallet, disconnect: disconnectWallet, walletAddress, balances } = useWallet();
  const { toast } = useToast();
  const { isDemoMode, findUserByEmail, findUserByWallet, updateUser } = useData();

  useEffect(() => {
    if (!isAppLoggedIn && isWalletConnected) { disconnectWallet(); }
  }, [isWalletConnected, isAppLoggedIn]);

  const navigate = (view: string) => {
    startTransition(() => {
      setCurrentView(view);
    });
  };

  const handleBlockUser = () => {
     setIsUserBlocked(true);
     setShowChat(false);
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
     toast("Account suspended due to policy violation.", "error");
  };

  const handleAppeal = (reason: string) => {
     setModerationCases(prev => prev.map(c => (c.userId === currentUser.id && c.status === 'Blocked') ? { ...c, status: 'Appeal Pending', appealReason: reason } : c));
  };

  const handleAdminDecision = (caseId: string, decision: 'Unblock' | 'Reject') => {
     setModerationCases(prev => prev.map(c => {
        if (c.id === caseId) {
           const newStatus = decision === 'Unblock' ? 'Resolved - Unblocked' : 'Resolved - Ban Upheld';
           if (decision === 'Unblock' && c.userId === currentUser.id) { setIsUserBlocked(false); }
           return { ...c, status: newStatus };
        }
        return c;
     }));
     toast(`Case ${caseId} updated: ${decision}`, "success");
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) { navigate('search_results'); }
  };

  const handleOpenChat = () => {
    setChatRecipient(selectedProfile);
    setShowChat(true);
  };

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    await connectWallet();
    setIsConnecting(false);
    toast("Wallet connected successfully!", "success");
  };

  const handleLogin = async (role: UserRole, method: 'web2' | 'web3', credentials?: any) => {
    let targetUser: any;
    if (isDemoMode) {
       targetUser = MOCK_USERS_BY_ROLE[role] || MOCK_ARTIST_PROFILE;
       if (method === 'web3') await handleWalletConnect();
    } else {
       if (method === 'web2') {
          if (!credentials?.email) { toast("Invalid credentials.", "error"); return; }
          const found = findUserByEmail(credentials.email);
          if (!found) { toast("User not found. Please register first.", "error"); return; }
          if (found.password && found.password !== credentials.password) { toast("Incorrect password.", "error"); return; }
          targetUser = { ...MOCK_ARTIST_PROFILE, ...found };
          targetUser.password = found.password;
       } else {
          await handleWalletConnect();
          const found = findUserByWallet(walletAddress);
          if (found) { targetUser = { ...MOCK_ARTIST_PROFILE, ...found }; }
          else {
             targetUser = { ...MOCK_ARTIST_PROFILE, id: 'u_wallet_guest', name: 'Wallet User', role: UserRole.REVELLER };
             toast("Wallet recognized. Logged in as Guest.", "info");
          }
       }
    }

    startTransition(() => {
      setCurrentUserRole(targetUser.role);
      setCurrentUser(targetUser);
      setIsAppLoggedIn(true);
      setIsUserBlocked(false);
      setCurrentView('dashboard');
    });

    if (targetUser.role === UserRole.ARTIST) { setIsProfileComplete(true); }
    toast(`Welcome back, ${targetUser.name}`, "info");
  };

  const handleLogout = () => {
    setIsAppLoggedIn(false);
    disconnectWallet();
    navigate('home');
    setIsUserBlocked(false);
    toast("Logged out successfully.", "info");
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
         bio: `${member.name} is a leading ${member.role} in the KalaKrut ecosystem...`,
         coverImage: `https://picsum.photos/seed/${member.id}/1200/400`
      };
      setSelectedProfile(profile);
      navigate('profile');
    }
  };

  const handleUpdateUserProfile = (updates: Partial<IArtistProfile>) => {
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    updateUser({
      id: updatedUser.id,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      subscriberOnly: { ...updatedUser.subscriberOnly, email: updatedUser.email || updatedUser.subscriberOnly.email },
      password: updatedUser.password
    });
    if (selectedProfile.id === currentUser.id) { setSelectedProfile(updatedUser); }
  };

  const UserWidget = () => (
    <div className="flex flex-col md:flex-row items-end md:items-center justify-between mb-8 gap-4">
       <div className="text-white">
          <h1 className="text-2xl font-bold">Welcome back, {currentUser.name}</h1>
          <p className="text-kala-400 text-sm">Role: {currentUserRole} â€¢ {currentUser.location}</p>
       </div>
       <div className="flex items-center gap-4">
         <div className="relative hidden lg:block">
           <Search className="absolute left-3 top-2.5 w-4 h-4 text-kala-500" />
           <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearch} placeholder="Search portal..." className="bg-kala-800 border border-kala-700 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-kala-secondary outline-none w-48 transition-all focus:w-64" />
         </div>
         <button className="relative p-2 text-kala-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" /><span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
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
                  <button onClick={() => setShowTokenExchange(true)} className="p-2 bg-kala-800 hover:bg-kala-700 rounded-full border border-kala-600 text-kala-secondary transition-colors" title="Swap Tokens"><RefreshCw className="w-4 h-4" /></button>
                </div>
              ) : (
                <button onClick={handleWalletConnect} disabled={isConnecting} className="text-xs bg-kala-secondary text-kala-900 px-3 py-1.5 rounded font-bold hover:bg-cyan-400 transition-colors flex items-center gap-2">
                  {isConnecting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Connect Wallet'}
                </button>
              )}
            </div>
            <div onClick={() => { setSelectedProfile(currentUser); navigate('profile'); }} className="w-10 h-10 rounded-full bg-gradient-to-br from-kala-secondary to-purple-600 p-0.5 cursor-pointer hover:scale-105 transition-transform ml-2" title="View My Profile">
              <img src={currentUser.avatar} alt="Me" className="w-full h-full rounded-full border-2 border-kala-900 object-cover" />
            </div>
            <button onClick={handleLogout} className="text-kala-500 hover:text-red-400 transition-colors ml-2" title="Log Out"><LogOut className="w-5 h-5" /></button>
         </div>
       </div>
    </div>
  );

  const renderAppContent = () => (
    <div className={isPending ? "opacity-70 transition-opacity pointer-events-none" : "opacity-100 transition-opacity"}>
      <Suspense fallback={<PageLoader />}>
        {(() => {
          switch (currentView) {
            case 'search_results': return <SearchResults query={searchQuery} onNavigate={navigate} />;
            case 'sitemap': return <Sitemap onNavigate={navigate} />;
            case 'system_docs': return currentUserRole === UserRole.ADMIN ? <SystemDiagrams /> : <div className="text-red-400 bg-kala-800 p-8 rounded-xl text-center">Access Denied</div>;
            case 'whitepaper': return <WhitePaper />;
            case 'register_artist': return <ArtistRegistration onComplete={() => { setIsProfileComplete(true); navigate('dashboard'); }} onBlockUser={handleBlockUser} />;
            case 'booking': return <BookingHub onBlockUser={handleBlockUser} onOpenExchange={() => setShowTokenExchange(true)} />;
            case 'governance': return <DaoGovernance currentUserRole={currentUserRole} onOpenExchange={() => setShowTokenExchange(true)} />;
            case 'marketplace': return <Marketplace onBlockUser={handleBlockUser} onChat={(seller) => { setChatRecipient({ ...MOCK_ARTIST_PROFILE, name: seller.name, avatar: seller.avatar }); setShowChat(true); }} />;
            case 'services': return <ServicesHub userRole={currentUserRole} onNavigateToProfile={() => { setSelectedProfile(currentUser); navigate('profile'); }} onBlockUser={handleBlockUser} />;
            case 'roster': return <Roster onNavigate={navigate} onViewProfile={handleViewProfile} />;
            case 'forum': return <Forum onBlockUser={handleBlockUser} />;
            case 'studio': return <CreativeStudio onBlockUser={handleBlockUser} />;
            case 'admin_email_templates': return currentUserRole === UserRole.ADMIN ? <AdminEmailTemplates isDemoMode={isDemoMode} /> : <div>Access Denied</div>;
            case 'membership': return <MembershipPlans currentUser={currentUser} />;
            case 'my_circle': return <MyCircle currentUser={currentUser} />;
            case 'leads': return currentUserRole === UserRole.ADMIN ? <AdminLeads /> : <LeadsAndAi />;
            case 'leads_and_ai': return <LeadsAndAi />;
            case 'admin_support': return currentUserRole === UserRole.ADMIN ? <AdminSupport moderationCases={moderationCases} onDecision={handleAdminDecision} /> : <div>Access Denied</div>;
            case 'contracts': return (currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.DAO_Governor) ? <AdminContracts onBlockUser={handleBlockUser} onChat={(name, avatar) => { setChatRecipient({ ...MOCK_ARTIST_PROFILE, name, avatar }); setShowChat(true); }} /> : <div>Access Denied</div>;
            case 'treasury': return (currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.DAO_Governor) ? <TreasuryDashboard /> : <div>Access Denied</div>;
            case 'hrd': return (currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.DAO_Governor) ? <HRDashboard /> : <div>Access Denied</div>;
            case 'profile': return <ArtistProfile artist={selectedProfile} onChat={handleOpenChat} onBook={() => navigate('booking')} isOwnProfile={selectedProfile.id === currentUser.id} isBlocked={isUserBlocked} onUpdateProfile={handleUpdateUserProfile} />;
            case 'analytics': return currentUserRole === UserRole.ADMIN ? <AnalyticsDashboard /> : <div>Access Denied</div>;
            case 'announcements_internal': return <Announcements onBack={() => navigate('dashboard')} />;
            case 'dashboard':
            default:
              let treasuryLabel = currentUserRole === UserRole.ADMIN ? 'Platform Treasury' : (currentUserRole === UserRole.REVELLER ? 'My Wallet' : 'My Earnings');
              return (
                <div className="space-y-8 animate-in fade-in">
                  {showWalletHistory && <div className="mb-8"><WalletHistory /></div>}
                  {isAppLoggedIn && <UserWidget />}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`rounded-xl p-6 text-white shadow-lg ${isWalletConnected ? 'bg-gradient-to-br from-purple-600 to-purple-900' : 'bg-gradient-to-br from-green-600 to-teal-900'}`}>
                      <div className="flex items-center gap-3 mb-2 opacity-80">{isWalletConnected ? <Wallet className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}<span className="text-sm font-medium">{isWalletConnected ? `${treasuryLabel} (Crypto)` : `${treasuryLabel} (Fiat)`}</span></div>
                      <div className="text-3xl font-bold tracking-tight">{isWalletConnected ? `${balances.eth.toFixed(2)} ETH` : `$${(currentUser.revenue?.totalLifetime || 2450).toLocaleString()}`}</div>
                    </div>
                    <div className="bg-kala-800 border border-kala-700 rounded-xl p-6 text-white"><div className="text-kala-400 text-sm font-medium mb-2">{currentUserRole === UserRole.ARTIST ? 'Active Gigs' : 'My Events'}</div><div className="text-3xl font-bold tracking-tight">{currentUser.stats.activeGigs}</div></div>
                    <div className="bg-kala-800 border border-kala-700 rounded-xl p-6 text-white"><div className="text-kala-400 text-sm font-medium mb-2">Community Score</div><div className="text-3xl font-bold tracking-tight">Lvl {currentUser.level}</div></div>
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 space-y-8">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button onClick={() => navigate('roster')} className="p-4 bg-kala-800 border border-kala-700 hover:border-kala-secondary rounded-xl text-left transition-colors group">
                          <div className="bg-kala-secondary/10 w-10 h-10 rounded-lg flex items-center justify-center text-kala-secondary mb-3 group-hover:bg-kala-secondary group-hover:text-kala-900"><Search className="w-5 h-5" /></div><div className="font-bold text-white">Book Now</div>
                        </button>
                        <button onClick={() => navigate('marketplace')} className="p-4 bg-kala-800 border border-kala-700 hover:border-kala-secondary rounded-xl text-left transition-colors group">
                          <div className="bg-purple-500/10 w-10 h-10 rounded-lg flex items-center justify-center text-purple-400 mb-3 group-hover:bg-purple-500 group-hover:text-white"><Wallet className="w-5 h-5" /></div><div className="font-bold text-white">Sell / Auction</div>
                        </button>
                        <button onClick={() => navigate('studio')} className="p-4 bg-kala-800 border border-kala-700 hover:border-kala-secondary rounded-xl text-left transition-colors group">
                          <div className="bg-orange-500/10 w-10 h-10 rounded-lg flex items-center justify-center text-orange-400 mb-3 group-hover:bg-orange-500 group-hover:text-white"><UploadCloud className="w-5 h-5" /></div><div className="font-bold text-white">Studio</div>
                        </button>
                        <button onClick={() => navigate('forum')} className="p-4 bg-kala-800 border border-kala-700 hover:border-kala-secondary rounded-xl text-left transition-colors group">
                          <div className="bg-blue-500/10 w-10 h-10 rounded-lg flex items-center justify-center text-blue-400 mb-3 group-hover:bg-blue-500 group-hover:text-white"><MessageSquare className="w-5 h-5" /></div><div className="font-bold text-white">Forum</div>
                        </button>
                      </div>
                      <div className="bg-kala-800/50 border border-kala-700 p-6 rounded-xl flex items-center justify-between">
                        <div><h3 className="font-bold text-white text-lg flex items-center gap-2"><CheckCircle className="text-green-400 w-5 h-5" /> Community Directory</h3><p className="text-kala-400 text-sm mt-1">Ensure your profile is up to date.</p></div>
                        <button onClick={() => navigate('register_artist')} className="px-4 py-2 bg-kala-700 hover:bg-kala-600 text-white rounded-lg font-medium">Update Profile</button>
                      </div>
                    </div>
                    <div className="xl:col-span-1 space-y-6">
                      <div className="bg-kala-800/30 border border-kala-700 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-2">Platform News</h3><p className="text-sm text-kala-400 mb-4">Stay updated.</p>
                        <button onClick={() => navigate('announcements_internal')} className="w-full py-2 text-sm font-bold bg-kala-700 hover:bg-kala-600 text-white rounded">Read Announcements</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
          }
        })()}
      </Suspense>
    </div>
  );

  if (isUserBlocked) { return <BlockedScreen onAppeal={handleAppeal} />; }
  if (!isAppLoggedIn) {
    if (currentView === 'announcements_public') { return <Announcements onBack={() => navigate('home')} />; }
    if (currentView === 'register_new_user') {
       return (
         <div className="min-h-screen bg-kala-900 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 py-8">
               <button onClick={() => navigate('home')} className="flex items-center gap-2 text-kala-400 hover:text-white mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Home</button>
               <Suspense fallback={<PageLoader />}>
                  <ArtistRegistration onComplete={() => { toast("Registration received!", "success"); navigate('home'); }} onBlockUser={handleBlockUser} />
               </Suspense>
            </div>
         </div>
       );
    }
    return <Home onLogin={handleLogin} onViewNews={() => navigate('announcements_public')} onJoin={() => navigate('register_new_user')} />;
  }

  return (
    <Layout currentView={currentView} userRole={currentUserRole} onNavigate={navigate}>
       {showChat && (
         <ChatOverlay recipientName={chatRecipient.name} recipientAvatar={chatRecipient.avatar} onClose={() => setShowChat(false)} onNavigateToBooking={() => { setShowChat(false); navigate('booking'); }} onBlockUser={handleBlockUser} />
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
