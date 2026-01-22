
import React, { useState } from 'react';
import { 
  LayoutGrid, Users, Calendar, Vote, Settings, LogOut, Menu, X, ShoppingBag, Briefcase, 
  BarChart3, Contact2, Bot, MessageSquare, UploadCloud, Network, GitMerge, LifeBuoy, CreditCard, Coins, FileText, FileSignature, AlertTriangle, ToggleLeft, ToggleRight, ShieldCheck
} from 'lucide-react';
import { UserRole } from '../types';
import { useWallet } from '../WalletContext';
import { useData } from '../contexts/DataContext';
import SupportWidget from './SupportWidget';
import { useToast } from './ToastContext';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  userRole: UserRole;
  onNavigate: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, userRole, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState(false);
  const { disconnect } = useWallet();
  const { isDemoMode, demoModeAvailable, setDemoModeAvailable } = useData();
  const { notify } = useToast();

  const handleDisconnect = () => {
    disconnect();
  };

  const handleSettingsClick = () => {
    if (userRole === UserRole.ADMIN) {
      setIsAdminSettingsOpen(true);
    } else {
      notify("Global Settings are restricted to Administrators.", "warning");
    }
  };

  const handleToggleDemoAvailability = () => {
    if (isDemoMode) {
       notify("System settings are read-only in Demo Mode. Login to Live Mode to make changes.", "warning");
       return;
    }
    const newState = !demoModeAvailable;
    setDemoModeAvailable(newState);
    notify(`Demo Mode has been ${newState ? 'ENABLED' : 'DISABLED'} for all users.`, "success");
  };

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => {
        onNavigate(id);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
        currentView === id 
          ? 'bg-kala-secondary/10 text-kala-secondary border-r-2 border-kala-secondary' 
          : 'text-slate-400 hover:bg-kala-800 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-kala-900 flex text-slate-200 font-sans selection:bg-kala-secondary selection:text-kala-900 relative">
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-kala-900/90 backdrop-blur border-b border-kala-700 z-50 px-4 py-3 flex justify-between items-center">
        <div className="font-bold text-xl tracking-tighter text-white">
          Kala<span className="text-kala-secondary">Krut</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static top-0 left-0 z-40 h-full w-64 bg-kala-900 border-r border-kala-800 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-kala-800">
           <div className="font-bold text-2xl tracking-tighter text-white">
            Kala<span className="text-kala-secondary">Krut</span>
            <span className="text-[10px] ml-1 bg-kala-700 text-kala-300 px-1.5 py-0.5 rounded">v3.0</span>
          </div>
          <p className="text-xs text-kala-500 mt-1">Creative Portal</p>
        </div>

        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-180px)] custom-scrollbar">
          <div className="text-xs font-bold text-kala-600 uppercase px-4 py-2">Main</div>
          <NavItem id="dashboard" icon={LayoutGrid} label="Dashboard" />
          <NavItem id="marketplace" icon={ShoppingBag} label="Marketplace" />
          <NavItem id="services" icon={Briefcase} label="Services Hub" />
          <NavItem id="booking" icon={Calendar} label="Proposals & Bookings" />
          <NavItem id="studio" icon={UploadCloud} label="Creative Studio" />

          <div className="text-xs font-bold text-kala-600 uppercase px-4 py-2 mt-4">Community</div>
          <NavItem id="roster" icon={Contact2} label="Roster / Members" />
          <NavItem id="forum" icon={MessageSquare} label="Forum" />
          <NavItem id="community" icon={Users} label="My Circle" />
          <NavItem id="membership" icon={CreditCard} label="Membership & Plans" />

          <div className="text-xs font-bold text-kala-600 uppercase px-4 py-2 mt-4">System</div>
          <NavItem id="sitemap" icon={Network} label="Site Map" />
          <NavItem id="whitepaper" icon={FileText} label="Whitepaper & Docs" />

          {(userRole === UserRole.ADMIN || userRole === UserRole.DAO_MEMBER) && (
             <>
               <div className="text-xs font-bold text-kala-600 uppercase px-4 py-2 mt-4">Admin / DAO</div>
               <NavItem id="governance" icon={Vote} label="DAO Governance" />
               <NavItem id="contracts" icon={FileSignature} label="Contracts & Agreements" />
               <NavItem id="treasury" icon={Coins} label="Treasury" />
               <NavItem id="hrd" icon={Briefcase} label="HRD & Team" />
               <NavItem id="analytics" icon={BarChart3} label="Analytics" />
               <NavItem id="admin_support" icon={LifeBuoy} label="Support Center" />
               <NavItem id="leads" icon={Bot} label="Leads & AI" />
               <NavItem id="system_docs" icon={GitMerge} label="Architecture & ERD" />
               <NavItem id="admin_email_templates" icon={FileText} label="Email Templates" />
             </>
          )}
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-kala-800 bg-kala-900">
           <button 
             onClick={handleSettingsClick}
             className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-white transition-colors w-full"
           >
              <Settings className="w-5 h-5" /> Settings
           </button>
           <button 
             onClick={handleDisconnect}
             className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 transition-colors w-full mt-1"
           >
              <LogOut className="w-5 h-5" /> Disconnect
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen relative bg-kala-900">
         {/* Demo Mode Banner */}
         {isDemoMode && (
            <div className="bg-gradient-to-r from-yellow-600/90 to-orange-600/90 text-white text-xs font-bold text-center py-1.5 flex items-center justify-center gap-2 sticky top-0 z-30 backdrop-blur">
               <AlertTriangle className="w-3 h-3 text-white" />
               DEMO MODE ACTIVE: Using sample data. Actions will not persist to mainnet.
            </div>
         )}
         
         <div className="p-4 lg:p-8 pt-20 lg:pt-8 max-w-7xl mx-auto">
           {children}
         </div>
         {/* Global Support Widget */}
         <SupportWidget />
      </main>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Admin Settings Modal */}
      {isAdminSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
           <div className="bg-kala-900 border border-kala-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-kala-800 flex justify-between items-center bg-kala-800/50">
                 <h3 className="text-white font-bold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-kala-secondary" /> System Configuration
                 </h3>
                 <button onClick={() => setIsAdminSettingsOpen(false)} className="text-kala-500 hover:text-white">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <div className="p-6 space-y-6">
                 <div className={`bg-kala-800 p-4 rounded-xl border border-kala-700 flex items-center justify-between ${isDemoMode ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div>
                       <h4 className="text-white font-bold text-sm flex items-center gap-2">
                          Public Demo Mode
                          {isDemoMode && <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-500/30">READ ONLY</span>}
                       </h4>
                       <p className="text-xs text-kala-400 mt-1 max-w-[200px]">
                          Allow visitors to access the platform with mock data. Disable for production launch.
                       </p>
                    </div>
                    <button 
                      onClick={handleToggleDemoAvailability}
                      disabled={isDemoMode}
                      className={`relative w-12 h-6 rounded-full transition-colors ${demoModeAvailable ? 'bg-green-500' : 'bg-kala-700'} ${isDemoMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                       <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${demoModeAvailable ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                 </div>
                 
                 {isDemoMode && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-200">
                            You are currently in <b>Demo Mode</b>. Global system settings can only be changed by a verified Admin in <b>Live Mode</b>.
                        </p>
                    </div>
                 )}
                 
                 <div className="text-xs text-center text-kala-500">
                    Changes take effect immediately on the Login Screen.
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
