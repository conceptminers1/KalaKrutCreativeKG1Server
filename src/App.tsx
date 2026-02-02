
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
import { DataProvider, useData } from './contexts/DataContext';
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
  const [currentUser, setCurrentUser] = useState<IArtistProfile>(MOCK_ARTIST_PROFILE);
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
  const { notify } = useToast();
  const { isDemoMode, toggleDemoMode, findUserByEmail, findUserByWallet, updateUser } = useData();

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
     notify("Account suspended due to policy violation.", "error");
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
     notify(`Case ${caseId} updated: ${decision}`, "success");
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) { navigate('search_results'); }
  };

  const handleOpenChat = (recipient: IArtistProfile) => {
    setChatRecipient(recipient);
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
       targetUser = MOCK_USERS_BY_ROLE[role] || MOCK_ARTIST_PROFILE;
       if (method === 'web3') await handleWalletConnect();
    } else {
       if (method === 'web2') {
          if (!credentials?.email) { notify("Invalid credentials.", "error"); return; }
          const found = findUserByEmail(credentials.email);
          if (!found) { notify("User not found. Please register first.", "error"); return; }
          if (found.password && found.password !== credentials.password) { notify("Incorrect password.", "error"); return; }
          targetUser = { ...MOCK_ARTIST_PROFILE, ...found };
          targetUser.password = found.password;
       } else {
          await handleWalletConnect();
          const found = findUserByWallet(walletAddress);
          if (found) { targetUser = { ...MOCK_ARTIST_PROFILE, ...found }; }
          else {
             targetUser = { ...MOCK_ARTIST_PROFILE, id: 'u_wallet_guest', name: 'Wallet User', role: UserRole.REVELLER };
             notify("Wallet recognized. Logged in as Guest.", "info");
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
    notify(`Welcome back, ${targetUser.name}`, "info");
  };

  const handleLogout = () => {
    setIsAppLoggedIn(false);
    disconnectWallet();
    navigate('home');
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
      // @ts-ignore
      subscriberOnly: { ...updatedUser.subscriberOnly, email: updatedUser.email || updatedUser.subscriberOnly.email },
      password: updatedUser.password
    });
    if (selectedProfile.id === currentUser.id) { setSelectedProfile(updatedUser); }
  };

  const AdminModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
        <div className="bg-kala-800 border border-kala-700 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-3">Demo Mode</h2>
            <p className="text-kala-400 mb-6">You are currently in Demo Mode. Some features are simulated. You can switch to live data, but be aware that real transactions will use actual funds.</p>
            <button onClick={toggleDemoMode} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">
                Stop Demo Mode
            </button>
             <button onClick={() => notify('Admin modal closed.', 'info')} className="mt-4 text-sm text-kala-500 hover:text-white">Dismiss</button>
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
            case 'marketplace': return <Marketplace onBlockUser={handleBlockUser} onChat={(seller) => handleOpenChat({ ...MOCK_ARTIST_PROFILE, name: seller.name, avatar: seller.avatar, id: seller.id || 'seller-id'})} />;
            case 'services': return <ServicesHub userRole={currentUserRole} onNavigateToProfile={() => handleViewProfile(currentUser.id)} onBlockUser={handleBlockUser} />;
            case 'roster': return <Roster onNavigate={navigate} onViewProfile={handleViewProfile} />;
            case 'forum': return <Forum onBlockUser={handleBlockUser} />;
            case 'studio': return <CreativeStudio onBack={() => navigate('dashboard')} onBlockUser={handleBlockUser} />;
            case 'membership': return <MembershipPlans currentUser={currentUser} />;
            case 'my_circle': return <MyCircle currentUser={currentUser} />;
            case 'admin_email_templates': return currentUserRole === UserRole.ADMIN ? <AdminEmailTemplates isDemoMode={isDemoMode} /> : <div>Access Denied</div>;
            case 'leads': return currentUserRole === UserRole.ADMIN ? <AdminLeads /> : <div>Access Denied</div>;
            case 'admin_support': return currentUserRole === UserRole.ADMIN ? <AdminSupport moderationCases={moderationCases} onDecision={handleAdminDecision} /> : <div>Access Denied</div>;
            case 'contracts': return (currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.DAO_Governor) ? <AdminContracts onBlockUser={handleBlockUser} onChat={(name, avatar) => handleOpenChat({ ...MOCK_ARTIST_PROFILE, name, avatar, id: 'temp-chat' })} /> : <div>Access Denied</div>;
            case 'treasury': return (currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.DAO_Governor) ? <TreasuryDashboard /> : <div>Access Denied</div>;
            case 'hrd': return (currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.DAO_Governor) ? <HRDashboard /> : <div>Access Denied</div>;
            case 'profile': return <ArtistProfile artist={selectedProfile} onChat={() => handleOpenChat(selectedProfile)} onBook={() => navigate('booking')} isOwnProfile={selectedProfile.id === currentUser.id} isBlocked={isUserBlocked} onUpdateProfile={handleUpdateUserProfile} />;
            case 'analytics': return currentUserRole === UserRole.ADMIN ? <AnalyticsDashboard /> : <div>Access Denied</div>;
            case 'announcements_internal': return <Announcements onBack={() => navigate('dashboard')} />;
            case 'dashboard':
            default:
                // Using a generic dashboard for all roles for now
                return <div>Dashboard for {currentUserRole}</div>;
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
                  <ArtistRegistration onComplete={() => { notify("Registration received!", "success"); navigate('home'); }} onBlockUser={handleBlockUser} />
               </Suspense>
            </div>
         </div>
       );
    }
    return <Home onLogin={handleLogin} onViewNews={() => navigate('announcements_public')} onJoin={() => navigate('register_new_user')} />;
  }

  return (
    <Layout currentView={currentView} userRole={currentUserRole} onNavigate={navigate}>
       {showChat && <ChatOverlay recipient={chatRecipient} onClose={() => setShowChat(false)} onNavigateToBooking={() => { setShowChat(false); navigate('booking'); }} onBlockUser={handleBlockUser} />}
       {showTokenExchange && <TokenExchange onClose={() => setShowTokenExchange(false)} />}
       {isDemoMode && currentView.startsWith('admin') && <AdminModal />}
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
