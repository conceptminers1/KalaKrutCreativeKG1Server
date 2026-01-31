
import React, { useState } from 'react';
import { Bot, RefreshCw, Download, FileSpreadsheet, Send } from 'lucide-react';
import { useToast } from './ToastContext';
import { knowledgeGraph } from '../services/knowledgeGraphService';

// Define the structure of a Lead object
interface Lead {
  leadId: string;
  targetId: string;
  targetName: string;
  targetType: string;
  reason: string;
  status: 'New' | 'Contacted' | 'Closed';
  confidenceScore: number;
}

const AdminLeads: React.FC = () => {
  const { notify } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [query, setQuery] = useState('Find artists with releases but no upcoming events.');

  const handleRunQuery = () => {
      setIsSyncing(true);
      // The "AI" is now powered by our knowledge graph query
      const foundLeads = knowledgeGraph.findLeads(query);
      
      setTimeout(() => {
        setLeads(foundLeads as Lead[]);
        setIsSyncing(false);
        notify(`LeadGeniusAI found ${foundLeads.length} new leads.`, "success");
      }, 1500); // Simulate network delay
    };

  return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Bot className="text-indigo-400" /> Lead Management
            </h2>
            <p className="text-kala-400 text-sm">Automated lead generation via LeadGeniusAI, powered by the Knowledge Graph.</p>
          </div>
          <div className="flex gap-2">
             <a 
               href="https://docs.google.com/spreadsheets/d/1_JDe6kZ9SiEMLueA8isrVMKLogYbSwpO3utV8_BrlQg/edit?usp=drivesdk"
               target="_blank"
               rel="noreferrer"
               className="bg-kala-800 hover:bg-kala-700 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-kala-700"
             >
               <FileSpreadsheet className="w-4 h-4" /> Open Leads Sheet
             </a>
          </div>
        </div>

        {/* Query Engine */}
        <div className="bg-kala-900/50 border border-kala-800 rounded-xl p-6">
           <label className="block text-sm text-kala-300 font-bold mb-2">LeadGeniusAI Query Prompt</label>
           <div className="flex gap-2">
              <input 
                 type="text"
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 className="flex-grow bg-kala-800 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500"
                 placeholder="e.g., Find venues that haven't hosted a show in 3 months..."
              />
              <button 
                 onClick={handleRunQuery}
                 disabled={isSyncing}
                 className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} 
                 {isSyncing ? 'Analyzing...' : 'Run Query'}
              </button>
           </div>
           <p className="text-xs text-kala-500 mt-2">
              * This triggers the LeadGeniusAI engine to scan the Knowledge Graph for opportunities.
           </p>
        </div>

        {/* Results Table */}
        <div className="bg-kala-800/40 border border-kala-700/80 rounded-xl">
            <div className="p-4 border-b border-kala-700">
                <h3 className="font-bold text-white">Generated Leads</h3>
            </div>
            <div className="overflow-x-auto">
               {leads.length > 0 ? (
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-kala-400 uppercase bg-kala-800/60">
                            <tr>
                                <th className="px-6 py-3">Lead Name</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Reason</th>
                                <th className="px-6 py-3 text-center">Confidence</th>
                                <th className="px-6 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map(lead => (
                                <tr key={lead.leadId} className="border-b border-kala-800 hover:bg-kala-800/50">
                                    <td className="px-6 py-4 font-medium text-white">{lead.targetName}</td>
                                    <td className="px-6 py-4 text-kala-300">{lead.targetType}</td>
                                    <td className="px-6 py-4 text-kala-400">{lead.reason}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-300 border border-green-500/20">
                                            {(lead.confidenceScore * 100).toFixed(0)}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-300 border border-sky-500/20">
                                            {lead.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
               ) : (
                <div className="text-center py-12 text-kala-500">
                    <p>No leads generated yet.</p>
                    <p className="text-xs">Run a query to find new opportunities.</p>
                </div>
               )}
            </div>
        </div>
      </div>
  );
};

export default AdminLeads;
