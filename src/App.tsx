
import React, { useState, useEffect, Suspense, lazy, useTransition } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';

// --- CONTEXTS ---
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

// --- STYLES ---
import './styles/App.css';
import './styles/Layout.css';
import './styles/Dashboard.css';
import './styles/Sidebar.css';
import './styles/Roster.css';
import './styles/Marketplace.css';
import './styles/Booking.css';
import './styles/Onboarding.css';
import './styles/System.css';

// --- CORE COMPONENTS ---
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoadingScreen from './components/LoadingScreen';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// --- LAZY LOADED PAGES ---
const Home = lazy(() => import('./components/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ArtistRoster = lazy(() => import('./pages/ArtistRoster'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const BookingHub = lazy(() => import('./pages/BookingHub'));
const Contracts = lazy(() => import('./pages/Contracts'));
const DaoGovernance = lazy(() => import('./pages/DaoGovernance'));
const SystemSettings = lazy(() => import('./pages/SystemSettings'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const MyProfile = lazy(() => import('./pages/MyProfile'));

// --- TYPES ---
import { UserRole } from './types';

// --- MODERATION COMPONENT ---
const BlockedScreen: React.FC<{ onAppeal: (reason: string) => void }> = ({ onAppeal }) => {
  const [appealReason, setAppealReason] = useState('');
  const [hasAppealed, setHasAppealed] = useState(false);

  const handleSubmit = () => {
     if (!appealReason.trim()) return;
     onAppeal(appealReason);
     setHasAppealed(true);
     toast.info("Appeal submitted to moderation team.");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center text-white">
      <div className="bg-red-900/20 p-8 rounded-full border-4 border-red-500 mb-8 animate-pulse">
         <ShieldAlert className="w-24 h-24 text-red-500" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Account Suspended</h1>
      <p className="text-red-200 text-lg max-w-xl mb-8">
        Your account has been automatically flagged for violating our Zero Tolerance Policy.
      </p>

      {!hasAppealed ? (
         <div className="w-full max-w-md bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="font-bold mb-3 flex items-center justify-center gap-2">
               <AlertTriangle className="w-4 h-4 text-yellow-500" /> File Formal Appeal
            </h3>
            <textarea 
               className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm mb-4 outline-none focus:border-cyan-500"
               rows={4}
               placeholder="Explain why this block was an error..."
               value={appealReason}
               onChange={(e) => setAppealReason(e.target.value)}
            />
            <button 
              onClick={handleSubmit}
              disabled={!appealReason}
              className="w-full px-8 py-3 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl border border-slate-600 transition-colors disabled:opacity-50"
            >
               Submit Appeal to Admins
            </button>
         </div>
      ) : (
         <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-xl max-w-md">
            <div className="text-green-400 font-bold text-lg mb-2 flex items-center justify-center gap-2">
               <CheckCircle className="w-5 h-5" /> Appeal Submitted
            </div>
            <p className="text-green-200 text-sm">Our team will review your request within 48-72 hours.</p>
         </div>
      )}
    </div>
  );
};

// --- ENHANCED ROUTE GUARDS (WITH TOASTS) ---
const AuthenticatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen message="Authenticating..." />;
  }

  if (!currentUser) {
    toast.error('Access Denied', {
      description: 'You must be logged in to view this page.',
      duration: 3000,
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen message="Verifying permissions..." />;
  }

  if (currentUser?.role !== UserRole.ADMIN) {
    toast.error('Permission Denied', {
      description: 'This area is restricted to administrators.',
      duration: 3000,
    });
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// --- MAIN LAYOUT ---
const AppLayout: React.FC = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const location = useLocation();
  const [isPending, startTransition] = useTransition(); // ADDED useTransition
  const [isUserBlocked, setIsUserBlocked] = useState(false);

  const handleAppeal = (reason: string) => {
    console.log("Appeal received:", reason);
    // In a real app, this would send the appeal to the backend.
  };

  if (authLoading) return <LoadingScreen message="Initializing KalaKrut..." />;

  // Force Blocked Screen if flag is true
  if (isUserBlocked) return <BlockedScreen onAppeal={handleAppeal} />;

  const isSidebarVisible = !['/login', '/onboarding'].some(path => location.pathname.startsWith(path));

  if (!currentUser && location.pathname !== '/login') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUser && !currentUser.onboardingComplete && !location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className={`app-container ${isSidebarVisible ? 'with-sidebar' : ''}`}>
      {isSidebarVisible && <Sidebar />}
      <main className="main-content">
        {isSidebarVisible && <Header />}
        <div className="page-content">
          <AnimatePresence mode="wait">
            <Suspense fallback={<LoadingScreen message="Loading..." />}>
              <Routes location={location} key={location.pathname}>
                <Route path="/login" element={<Login />} />
                <Route path="/onboarding/*" element={
                  currentUser && !currentUser.onboardingComplete ? <Onboarding /> : <Navigate to="/dashboard" />
                } />

                <Route path="/" element={<AuthenticatedRoute><Home /></AuthenticatedRoute>} />
                <Route path="/dashboard" element={<AuthenticatedRoute><Dashboard /></AuthenticatedRoute>} />
                <Route path="/roster" element={<AuthenticatedRoute><ArtistRoster /></AuthenticatedRoute>} />
                <Route path="/marketplace" element={<AuthenticatedRoute><Marketplace /></AuthenticatedRoute>} />
                <Route path="/bookings" element={<AuthenticatedRoute><BookingHub /></AuthenticatedRoute>} />
                <Route path="/contracts" element={<AuthenticatedRoute><Contracts /></Authenticated-Route>} />
                <Route 
                  path="/governance" 
                  element={
                    <AuthenticatedRoute>
                      <DaoGovernance currentUserName={currentUser?.name || ''} />
                    </AuthenticatedRoute>
                  } 
                />
                <Route path="/profile" element={<AuthenticatedRoute><MyProfile /></AuthenticatedRoute>} />

                <Route path="/system" element={
                  <AuthenticatedRoute>
                    <AdminRoute>
                      <SystemSettings />
                    </AdminRoute>
                  </AuthenticatedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Toaster richColors position="bottom-right" theme="dark" />
      <AuthProvider>
        <DataProvider>
          <AppLayout />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
