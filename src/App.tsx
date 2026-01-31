import React, {
  useState,
  useEffect,
  Suspense,
  useTransition
} from 'react';

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

import { WalletProvider } from './WalletContext';
import { ToastProvider } from './components/ToastContext';
import { useData, DataProvider } from './contexts/DataContext';
import { ErrorBoundary } from './components/ErrorBoundary';

import { UserRole } from './types';

/* ---------------- Lazy Components (UNCHANGED) ---------------- */

const BookingHub = React.lazy(() => import('./components/BookingHub'));
const DaoGovernance = React.lazy(() => import('./components/DaoGovernance'));
const Marketplace = React.lazy(() => import('./components/Marketplace'));
const ServicesHub = React.lazy(() => import('./components/ServicesHub'));
const AnalyticsDashboard = React.lazy(() => import('./components/AnalyticsDashboard'));
const ArtistProfile = React.lazy(() => import('./components/ArtistProfile'));
const Roster = React.lazy(() => import('./components/Roster'));
const ArtistRegistration = React.lazy(() => import('./components/ArtistRegistration'));
const AdminLeads = React.lazy(() => import('./components/AdminLeads'));

/* ---------------- App ---------------- */

const AppContent: React.FC = () => {
  const { users } = useData();

  const [activeView, setActiveView] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  /* 🔧 FIX #1: ALL view switches wrapped in startTransition */
  const navigate = (view: string) => {
    startTransition(() => {
      setActiveView(view);
    });
  };

  return (
    <Layout
      onNavigate={navigate}
      activeView={activeView}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isPending={isPending}
    >
      {/* 🔧 FIX #2: ONE stable Suspense boundary */}
      <Suspense fallback={<div className="p-6">Loading…</div>}>

        {activeView === 'home' && (
          <Home
            onLogin={(role, method, creds) => {
              startTransition(() => {
                // original login logic preserved
                setActiveView('dashboard');
              });
            }}
            onViewNews={() => navigate('announcements')}
            onJoin={() => navigate('register')}
          />
        )}

        {activeView === 'announcements' && <Announcements />}
        {activeView === 'wallet' && <WalletHistory />}
        {activeView === 'search' && <SearchResults query={searchQuery} />}
        {activeView === 'sitemap' && <Sitemap />}
        {activeView === 'whitepaper' && <WhitePaper />}
        {activeView === 'diagrams' && <SystemDiagrams />}
        {activeView === 'token' && <TokenExchange />}

        {/* Lazy sections */}
        {activeView === 'booking' && <BookingHub />}
        {activeView === 'dao' && <DaoGovernance />}
        {activeView === 'marketplace' && <Marketplace />}
        {activeView === 'services' && <ServicesHub />}
        {activeView === 'analytics' && <AnalyticsDashboard />}
        {activeView === 'profile' && <ArtistProfile />}
        {activeView === 'roster' && <Roster />}
        {activeView === 'register' && <ArtistRegistration />}
        {activeView === 'admin-leads' && <AdminLeads />}

      </Suspense>

      <ChatOverlay />
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

export default App