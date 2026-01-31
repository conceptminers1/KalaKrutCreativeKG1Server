
import React from 'react';
import { useData } from '../contexts/DataContext';
import { useWallet } from '../WalletContext';
import { UserRole } from '../types';
import { BarChart3, Users, DollarSign, Activity, Calendar, ShieldCheck, ArrowRight, FileText, Wallet, TrendingUp, CreditCard } from 'lucide-react';
import WalletHistory from './WalletHistory';
import Leaderboard from './Leaderboard';
import { MOCK_LEADERBOARD } from '../mockData';

interface DashboardProps {
  userRole: UserRole;
  onNavigate: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole, onNavigate }) => {
  const { stats } = useData();
  const { balances, walletAddress } = useWallet();

  const isAdmin = userRole === UserRole.ADMIN;

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="text-kala-secondary">{isAdmin ? 'Admin' : 'Creator'}</span>
          </h1>
          <p className="text-kala-400">Here is your ecosystem overview for {new Date().toLocaleDateString()}.</p>
        </div>
        <div className="text-right hidden md:block">
           <div className="text-sm text-kala-500 font-bold uppercase tracking-wider">Session Status</div>
           <div className="text-white font-mono flex items-center justify-end gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
           </div>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard 
            label="Total Members" 
            value={stats.totalMembers.toLocaleString()} 
            icon={Users} 
            trend="+12% this week" 
            color="blue"
         />
         <StatCard 
            label="Active Gigs" 
            value={stats.activeGigs.toString()} 
            icon={Calendar} 
            trend="4 pending approval" 
            color="purple"
         />
         <StatCard 
            label="Volume (30d)" 
            value={`$${stats.totalTransactions}`} 
            icon={DollarSign} 
            trend="+5.4% vs last month" 
            color="green"
         />
         <StatCard 
            label="System Health" 
            value="99.9%" 
            icon={Activity} 
            trend="All nodes operational" 
            color="cyan"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Content Area (Left 2/3) */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Actions */}
            <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">Quick Actions</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isAdmin ? (
                    <>
                      <ActionBtn icon={ShieldCheck} label="Review Contracts" sub="3 Pending Approval" onClick={() => onNavigate('contracts')} />
                      <ActionBtn icon={Users} label="Manage Roster" sub="Edit User Permissions" onClick={() => onNavigate('roster')} />
                      <ActionBtn icon={BarChart3} label="Analytics" sub="View Platform Stats" onClick={() => onNavigate('analytics')} />
                      <ActionBtn icon={Activity} label="System Logs" sub="Technical Diagrams" onClick={() => onNavigate('system_docs')} />
                    </>
                  ) : (
                    <>
                      <ActionBtn icon={Calendar} label="Find Gigs" sub="Browse Opportunities" onClick={() => onNavigate('booking')} />
                      <ActionBtn icon={Users} label="Community" sub="Connect with Peers" onClick={() => onNavigate('forum')} />
                      <ActionBtn icon={DollarSign} label="Marketplace" sub="Buy & Sell Gear" onClick={() => onNavigate('marketplace')} />
                      <ActionBtn icon={Activity} label="My Stats" sub="View Profile" onClick={() => onNavigate('profile')} />
                    </>
                  )}
               </div>
            </div>

            {/* Financial Overview (Integrated) */}
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                     <Wallet className="text-kala-secondary" /> Recent Transactions
                  </h3>
                  <button onClick={() => onNavigate('treasury')} className="text-xs text-kala-400 hover:text-white">View All</button>
               </div>
               <WalletHistory />
            </div>

            {/* Recent Activity */}
            <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
               <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
               <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                     <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-kala-900/30 border border-kala-800 hover:border-kala-600 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-kala-700 flex items-center justify-center text-kala-400">
                           <Activity className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-sm text-white font-medium">New Proposal Submitted: "Jazz in the Park"</p>
                           <p className="text-xs text-kala-500">2 hours ago • by Neon Pulse</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sidebar (Right 1/3) */}
         <div className="space-y-8">
            
            {/* Wallet Balance Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-kala-900 border border-indigo-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <CreditCard className="w-24 h-24 text-white" />
               </div>
               
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                     <div>
                        <p className="text-indigo-300 text-xs font-bold uppercase tracking-wider">Total Balance</p>
                        <h3 className="text-3xl font-bold text-white mt-1">${balances.usd.toLocaleString()}</h3>
                     </div>
                     <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 border border-indigo-500/30">
                        <Wallet className="w-6 h-6" />
                     </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-kala-400 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div> ETH</span>
                        <span className="text-white font-mono">{balances.eth.toFixed(4)}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-kala-400 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-500"></div> KALA</span>
                        <span className="text-white font-mono">{balances.kala.toLocaleString()}</span>
                     </div>
                  </div>

                  <div className="text-xs text-indigo-400 font-mono break-all bg-indigo-950/50 p-2 rounded border border-indigo-500/20">
                     {walletAddress || "0x... (Not Connected)"}
                  </div>
               </div>
            </div>

            {/* Leaderboard Widget */}
            <Leaderboard entries={MOCK_LEADERBOARD} />

            {/* Platform Updates */}
            <div className="bg-gradient-to-br from-kala-secondary/20 to-purple-900/20 border border-kala-secondary/30 rounded-xl p-6">
               <h3 className="text-lg font-bold text-white mb-2">Platform Updates</h3>
               <p className="text-sm text-kala-300 mb-4">
                  KalaKrut 3.0 is live! Explore the new Governance tools and expanded Roster features.
               </p>
               <button onClick={() => onNavigate('announcements_internal')} className="w-full py-2 bg-kala-secondary text-kala-900 font-bold rounded-lg text-sm hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" /> Read Release Notes
               </button>
            </div>
            
            {/* System Status */}
            <div className="bg-kala-800 border border-kala-700 rounded-xl p-6">
               <h3 className="text-lg font-bold text-white mb-4">System Status</h3>
               <div className="space-y-3">
                  <StatusItem label="Mainnet Node" status="Operational" color="green" />
                  <StatusItem label="IPFS Gateway" status="Operational" color="green" />
                  <StatusItem label="Escrow Service" status="Processing" color="yellow" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, trend, color }: any) => {
   const colors: any = {
      blue: 'text-blue-400 bg-blue-500/10',
      purple: 'text-purple-400 bg-purple-500/10',
      green: 'text-green-400 bg-green-500/10',
      cyan: 'text-cyan-400 bg-cyan-500/10'
   };

   return (
      <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6 hover:border-kala-500 transition-colors group">
         <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${colors[color]} group-hover:scale-110 transition-transform`}>
               <Icon className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
               <TrendingUp className="w-3 h-3" />
            </div>
         </div>
         <div className="text-3xl font-bold text-white mb-1">{value}</div>
         <div className="text-sm text-kala-400 font-medium mb-2">{label}</div>
         <div className="text-xs text-kala-500">{trend}</div>
      </div>
   );
};

const ActionBtn = ({ icon: Icon, label, sub, onClick }: any) => (
   <button onClick={onClick} className="flex items-center gap-4 p-4 rounded-xl bg-kala-900 border border-kala-700 hover:bg-kala-800 hover:border-kala-500 transition-all text-left group">
      <div className="w-12 h-12 rounded-full bg-kala-800 flex items-center justify-center text-kala-400 group-hover:bg-kala-700 group-hover:text-white transition-colors">
         <Icon className="w-6 h-6" />
      </div>
      <div>
         <div className="font-bold text-white group-hover:text-kala-secondary transition-colors">{label}</div>
         <div className="text-xs text-kala-500">{sub}</div>
      </div>
      <ArrowRight className="w-4 h-4 text-kala-600 ml-auto group-hover:text-white group-hover:translate-x-1 transition-all" />
   </button>
);

const StatusItem = ({ label, status, color }: any) => (
   <div className="flex justify-between items-center text-sm">
      <span className="text-kala-400">{label}</span>
      <span className={`font-bold ${color === 'green' ? 'text-green-400' : 'text-yellow-400'}`}>{status}</span>
   </div>
);

export default Dashboard;
