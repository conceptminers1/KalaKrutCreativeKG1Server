import React, { useState } from 'react';
import { LifeBuoy, AlertCircle, CheckCircle, Clock, Filter, ArrowUpCircle, ShieldAlert, Gavel, X, Unlock, ShieldCheck } from 'lucide-react';
import { SupportTicket, ModerationCase } from '../types';
import { MOCK_TICKETS } from '../mockData'; // Fallback if no props

interface AdminSupportProps {
   moderationCases?: ModerationCase[];
   onDecision?: (caseId: string, decision: 'Unblock' | 'Reject') => void;
}

const AdminSupport: React.FC<AdminSupportProps> = ({ moderationCases = [], onDecision }) => {
  const [activeTab, setActiveTab] = useState<'support' | 'moderation'>('support');
  
  // Support Ticket State
  const [filterTier, setFilterTier] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Moderation State
  const [modFilterStatus, setModFilterStatus] = useState('All');

  const filteredTickets = (MOCK_TICKETS).filter(t => {
     return (filterTier === 'All' || t.tier === filterTier) && 
            (filterStatus === 'All' || t.status === filterStatus);
  });

  const filteredCases = moderationCases.filter(c => {
     if (modFilterStatus === 'All') return true;
     if (modFilterStatus === 'Pending') return c.status === 'Blocked' || c.status === 'Appeal Pending';
     return c.status.includes(modFilterStatus);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <LifeBuoy className="text-kala-secondary" /> Admin Console
          </h2>
          <p className="text-kala-400 text-sm">Manage support tickets, disputes, and enforce moderation policies.</p>
        </div>
        <div className="flex bg-kala-800 p-1 rounded-lg border border-kala-700">
           <button 
             onClick={() => setActiveTab('support')}
             className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'support' ? 'bg-kala-secondary text-kala-900' : 'text-kala-400 hover:text-white'}`}
           >
              Support Tickets
           </button>
           <button 
             onClick={() => setActiveTab('moderation')}
             className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'moderation' ? 'bg-red-500 text-white' : 'text-kala-400 hover:text-white'}`}
           >
              <ShieldAlert className="w-4 h-4" /> Moderation & Appeals
           </button>
        </div>
      </div>

      {activeTab === 'support' ? (
        <>
           <div className="flex gap-2 mb-4">
              <div className="bg-kala-800 p-1 rounded-lg border border-kala-700 flex text-xs font-bold">
                 <button onClick={() => setFilterTier('All')} className={`px-3 py-1.5 rounded ${filterTier === 'All' ? 'bg-kala-secondary text-kala-900' : 'text-kala-400 hover:text-white'}`}>All Tiers</button>
                 <button onClick={() => setFilterTier('Tier 1')} className={`px-3 py-1.5 rounded ${filterTier === 'Tier 1' ? 'bg-kala-secondary text-kala-900' : 'text-kala-400 hover:text-white'}`}>Tier 1</button>
                 <button onClick={() => setFilterTier('Tier 2')} className={`px-3 py-1.5 rounded ${filterTier === 'Tier 2' ? 'bg-kala-secondary text-kala-900' : 'text-kala-400 hover:text-white'}`}>Tier 2</button>
                 <button onClick={() => setFilterTier('Tier 3')} className={`px-3 py-1.5 rounded ${filterTier === 'Tier 3' ? 'bg-kala-secondary text-kala-900' : 'text-kala-400 hover:text-white'}`}>Tier 3</button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats */}
              <div className="bg-kala-800/50 border border-kala-700 p-4 rounded-xl flex items-center justify-between">
                 <div>
                    <div className="text-xs text-kala-400 font-bold uppercase">Open Tickets</div>
                    <div className="text-2xl font-bold text-white">12</div>
                 </div>
                 <div className="p-3 bg-red-500/20 text-red-400 rounded-lg">
                    <AlertCircle className="w-6 h-6" />
                 </div>
              </div>
              <div className="bg-kala-800/50 border border-kala-700 p-4 rounded-xl flex items-center justify-between">
                 <div>
                    <div className="text-xs text-kala-400 font-bold uppercase">Avg Response Time</div>
                    <div className="text-2xl font-bold text-white">1h 42m</div>
                 </div>
                 <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
                    <Clock className="w-6 h-6" />
                 </div>
              </div>
              <div className="bg-kala-800/50 border border-kala-700 p-4 rounded-xl flex items-center justify-between">
                 <div>
                    <div className="text-xs text-kala-400 font-bold uppercase">Resolution Rate</div>
                    <div className="text-2xl font-bold text-white">94%</div>
                 </div>
                 <div className="p-3 bg-green-500/20 text-green-400 rounded-lg">
                    <CheckCircle className="w-6 h-6" />
                 </div>
              </div>
           </div>

           {/* Ticket List */}
           <div className="bg-kala-800/50 border border-kala-700 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-kala-700 flex justify-between items-center bg-kala-900/30">
                 <h3 className="font-bold text-white">Recent Tickets</h3>
                 <div className="flex items-center gap-2 text-xs text-kala-400">
                    <Filter className="w-3 h-3" />
                    <select 
                      className="bg-kala-800 border-none outline-none text-white font-bold"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                       <option value="All">All Status</option>
                       <option value="Open">Open</option>
                       <option value="In Progress">In Progress</option>
                       <option value="Resolved">Resolved</option>
                    </select>
                 </div>
              </div>
              <div className="divide-y divide-kala-700/50">
                 {filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 hover:bg-kala-800/50 transition-colors flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                       <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                             <span className="font-mono text-xs text-kala-500">{ticket.id}</span>
                             <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase border ${
                                ticket.status === 'Open' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                ticket.status === 'In Progress' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                'bg-green-500/10 text-green-400 border-green-500/20'
                             }`}>
                                {ticket.status}
                             </span>
                             <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase border bg-kala-900 border-kala-700 text-kala-400`}>
                                {ticket.tier}
                             </span>
                          </div>
                          <div className="font-bold text-white text-sm">{ticket.subject}</div>
                          <div className="text-xs text-kala-400 mt-0.5">
                             by <span className="text-kala-300">{ticket.userName}</span> • {ticket.lastUpdate}
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4">
                           <div className={`px-2 py-1 rounded text-xs font-bold ${
                              ticket.priority === 'Critical' ? 'text-red-500 bg-red-500/10' :
                              ticket.priority === 'High' ? 'text-orange-500 bg-orange-500/10' :
                              'text-blue-500 bg-blue-500/10'
                           }`}>
                              {ticket.priority}
                           </div>
                           <div className="flex gap-2">
                              <button className="p-2 hover:bg-kala-700 rounded-lg text-kala-400 hover:text-white transition-colors" title="Escalate Tier">
                                 <ArrowUpCircle className="w-4 h-4" />
                              </button>
                              <button className="px-3 py-1.5 bg-kala-700 hover:bg-kala-600 text-white text-xs font-bold rounded-lg transition-colors">
                                 Manage
                              </button>
                           </div>
                       </div>
                    </div>
                 ))}
                 {filteredTickets.length === 0 && (
                    <div className="p-8 text-center text-kala-500 text-sm">
                       No tickets found matching current filters.
                    </div>
                 )}
              </div>
           </div>
        </>
      ) : (
        /* MODERATION TAB */
        <div className="space-y-6 animate-in slide-in-from-right-4">
           {/* Header / Stats */}
           <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-red-500/20 rounded-full text-red-500">
                    <Gavel className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-white">Blacklist & Moderation</h3>
                    <p className="text-sm text-kala-400">Review automated blocks and user appeals.</p>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => setModFilterStatus('All')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${modFilterStatus === 'All' ? 'bg-kala-700 text-white border-kala-500' : 'text-kala-500 border-kala-800'}`}>All Cases</button>
                 <button onClick={() => setModFilterStatus('Pending')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${modFilterStatus === 'Pending' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'text-kala-500 border-kala-800'}`}>Pending Action</button>
              </div>
           </div>

           {/* Cases List */}
           <div className="space-y-4">
              {filteredCases.length === 0 ? (
                 <div className="text-center p-12 bg-kala-800/30 rounded-xl text-kala-500">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    No moderation cases found.
                 </div>
              ) : (
                 filteredCases.map(c => (
                    <div key={c.id} className="bg-kala-800/50 border border-kala-700 rounded-xl p-6 flex flex-col gap-4">
                       <div className="flex justify-between items-start">
                          <div>
                             <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs text-kala-500">{c.id}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                                   c.status === 'Appeal Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                   c.status === 'Blocked' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                   'bg-green-500/10 text-green-400 border-green-500/20'
                                }`}>
                                   {c.status}
                                </span>
                                <span className="text-[10px] bg-kala-900 px-2 py-0.5 rounded text-kala-400">
                                   {c.userRole}
                                </span>
                             </div>
                             <h4 className="font-bold text-white text-lg">{c.userName} <span className="text-xs font-normal text-kala-500">({c.userId})</span></h4>
                             <p className="text-xs text-kala-400 mt-1">Blocked on: {c.timestamp}</p>
                          </div>
                          <div className="text-right">
                             <div className="text-xs text-kala-500 uppercase font-bold mb-1">Violation</div>
                             <div className="text-red-400 font-bold">{c.violationType}</div>
                          </div>
                       </div>

                       <div className="bg-kala-900/50 p-3 rounded-lg border border-kala-700/50">
                          <div className="text-xs text-kala-500 font-bold uppercase mb-1">Flagged Content Snippet</div>
                          <div className="text-sm text-kala-300 font-mono">"{c.contentSnippet}"</div>
                       </div>

                       {c.appealReason && (
                          <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                             <div className="text-xs text-yellow-500 font-bold uppercase mb-1">User Appeal</div>
                             <div className="text-sm text-yellow-200 italic">"{c.appealReason}"</div>
                          </div>
                       )}

                       {(c.status === 'Blocked' || c.status === 'Appeal Pending') && onDecision && (
                          <div className="flex justify-end gap-3 pt-2 border-t border-kala-700/50">
                             <button 
                               onClick={() => onDecision(c.id, 'Reject')}
                               className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs font-bold rounded-lg border border-red-500/30 flex items-center gap-2"
                             >
                                <X className="w-4 h-4" /> Reject Appeal (Ban Permanently)
                             </button>
                             <button 
                               onClick={() => onDecision(c.id, 'Unblock')}
                               className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg flex items-center gap-2"
                             >
                                <Unlock className="w-4 h-4" /> Approve & Unblock Account
                             </button>
                          </div>
                       )}
                    </div>
                 ))
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupport;
