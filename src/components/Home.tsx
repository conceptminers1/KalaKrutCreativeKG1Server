
import React, { useState, useTransition } from 'react';
import { UserRole } from '../types';
import { useData } from '../contexts/DataContext';
import { 
  ArrowRight, Music, Globe2, ShieldCheck, Users, Coins, Building2, Newspaper, Mail, Wallet, Lock, X, Loader2,
  ShoppingBag, Activity, TrendingUp, Instagram, Facebook, Eye, MapPin, PlayCircle, Radio, KeyRound, Info
} from 'lucide-react';
import { useToast } from './ToastContext';

interface HomeProps {
  onLogin: (role: UserRole, method: 'web2' | 'web3', credentials?: any) => void;
  onViewNews: () => void;
  onJoin: () => void;
}

const KalaKrutLogo = ({ className = "w-32 h-32" }: { className?: string }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="logo_grad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Abstract Art Circle */}
    <circle cx="100" cy="100" r="90" stroke="url(#logo_grad)" strokeWidth="8" fill="none" opacity="0.8" />
    <circle cx="100" cy="100" r="70" stroke="white" strokeWidth="1" fill="none" opacity="0.2" strokeDasharray="4 4" />
    
    {/* Central Swirls representing Creativity */}
    <path d="M60 100 Q 100 20, 140 100 T 60 100" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" filter="url(#glow)" />
    <path d="M60 100 Q 100 180, 140 100" stroke="url(#logo_grad)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
    
    {/* Core Dot */}
    <circle cx="100" cy="100" r="12" fill="white" />
    <circle cx="100" cy="100" r="6" fill="#0f172a" />
    
    {/* Orbiting Satellite (Tech/Web3) */}
    <circle cx="100" cy="20" r="6" fill="#06b6d4">
      <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="10s" repeatCount="indefinite" />
    </circle>
  </svg>
);

const SubstackIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
  </svg>
);

const LinktreeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M13.7364 5.85294V0H10.2624V5.85294L5.27521 2.97351L3.53857 5.98144L9.39343 9.36203L3.53857 12.7426L5.27521 15.7505L10.2624 12.8711V24H13.7364V12.8711L18.7237 15.7505L20.4603 12.7426L14.6054 9.36203L20.4603 5.98144L18.7237 2.97351L13.7364 5.85294Z" />
  </svg>
);

const Home: React.FC<HomeProps> = ({ onLogin, onViewNews, onJoin }) => {
  const { users, stats, setDemoMode, isDemoMode, demoModeAvailable } = useData();
  const { notify } = useToast();
  const [selectedRoleForLogin, setSelectedRoleForLogin] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMembersPreview, setShowMembersPreview] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Login Form State for Live Mode
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Local state for the modal toggle before confirming login.
  const [loginMode, setLoginMode] = useState<'demo' | 'live'>(
    demoModeAvailable && isDemoMode ? 'demo' : 'live'
  );

  const previewMembers = users.slice(0, 5);

  const handleLoginClick = (method: 'web2' | 'web3') => {
    if (selectedRoleForLogin) {
      if (loginMode === 'live' && method === 'web2' && (!email || !password)) {
         notify("Please enter email and password for Live access.", "warning");
         return;
      }

      setIsLoading(true);
      const effectiveMode = demoModeAvailable ? (loginMode === 'demo') : false;
      setDemoMode(effectiveMode);
      
      setTimeout(() => {
        onLogin(selectedRoleForLogin, method, { email, password });
        setIsLoading(false); 
      }, 500);
    }
  };

  const LoginCard = ({ role, icon: Icon, desc }: { role: UserRole, icon: any, desc: string }) => (
    <button 
      onClick={() => setSelectedRoleForLogin(role)}
      className="bg-kala-800/40 backdrop-blur border border-kala-700 p-6 rounded-xl hover:bg-kala-800 hover:border-kala-secondary transition-all text-left group h-full flex flex-col"
    >
      <div className="w-12 h-12 rounded-lg bg-kala-700 flex items-center justify-center text-kala-300 group-hover:bg-kala-secondary group-hover:text-kala-900 mb-4 transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{role}</h3>
      <p className="text-sm text-kala-400 leading-relaxed flex-grow">{desc}</p>
      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-kala-500 group-hover:text-white uppercase tracking-wider">
        Login / Register <ArrowRight className="w-3 h-3" />
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-kala-900 text-slate-200">
      
      {/* Navbar */}
      <nav className="border-b border-kala-800 bg-kala-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-white">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-kala-secondary to-purple-600 flex items-center justify-center">
               <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span>Kala<span className="text-kala-secondary">Krut</span></span>
          </div>
          <div className="flex gap-4">
             <button onClick={onViewNews} className="text-sm font-medium text-kala-300 hover:text-white flex items-center gap-2 px-4 py-2 rounded hover:bg-kala-800 transition-colors">
               <Newspaper className="w-4 h-4" /> News & Announcements
             </button>
             <button className="bg-white text-kala-900 px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">
               Get App
             </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-kala-secondary/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-16 text-center">
           
           <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
             The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-kala-secondary to-purple-500">Creative Business</span>
           </h1>
           <p className="text-xl text-kala-300 mb-10 max-w-2xl mx-auto">
             A hybrid social enterprise and gamified community portal. We connect artists, venues, and sponsors through Web3 governance and sustainable business workflows.
           </p>
           
           <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-kala-400 mb-8">
              <span className="flex items-center gap-2 bg-kala-800 px-3 py-1 rounded-full border border-kala-700">
                <ShieldCheck className="w-4 h-4 text-green-400" /> Secure Contracts
              </span>
              <span className="flex items-center gap-2 bg-kala-800 px-3 py-1 rounded-full border border-kala-700">
                <Globe2 className="w-4 h-4 text-blue-400" /> Global Roster
              </span>
              <span className="flex items-center gap-2 bg-kala-800 px-3 py-1 rounded-full border border-kala-700">
                <Coins className="w-4 h-4 text-yellow-400" /> Crypto & Fiat
              </span>
           </div>

           {/* Modes Info */}
           <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-3 bg-kala-800/60 border border-kala-700 px-5 py-3 rounded-xl backdrop-blur-sm">
                 <div className="p-2 bg-kala-secondary/20 rounded-full text-kala-secondary">
                    <PlayCircle className="w-4 h-4" />
                 </div>
                 <div className="text-left">
                    <div className="text-[10px] text-kala-400 font-bold uppercase tracking-wider">Demo Mode</div>
                    <div className="text-xs text-white">Explore working examples</div>
                 </div>
              </div>
              <div className="flex items-center gap-3 bg-kala-800/60 border border-kala-700 px-5 py-3 rounded-xl backdrop-blur-sm">
                 <div className="p-2 bg-green-500/20 rounded-full text-green-400">
                    <Radio className="w-4 h-4" />
                 </div>
                 <div className="text-left">
                    <div className="text-[10px] text-kala-400 font-bold uppercase tracking-wider">Live Mode</div>
                    <_truncated_>