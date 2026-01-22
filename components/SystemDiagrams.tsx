
import React, { useState } from 'react';
import { Download, Database, GitMerge, Trash2, BrainCircuit } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const SystemDiagrams: React.FC = () => {
  const { purgeMockData, isDemoMode } = useData();
  const [activeTab, setActiveTab] = useState<'erd' | 'flow' | 'graph'>('flow');

  const downloadSVG = (id: string, filename: string) => {
    const svgElement = document.getElementById(id);
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <GitMerge className="text-kala-secondary" /> System Architecture
          </h2>
          <p className="text-kala-400 text-sm">Visual documentation of the KalaKrut Platform workflows and data schema.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
           <button 
             onClick={purgeMockData}
             disabled={isDemoMode}
             className={`px-4 py-2 rounded-lg font-bold text-sm bg-red-900 text-red-200 border border-red-500/50 hover:bg-red-800 transition-colors flex items-center gap-2 ${isDemoMode ? 'opacity-50 cursor-not-allowed' : ''}`}
             title={isDemoMode ? "Cannot purge data in Demo Mode" : "Deletes all mock data"}
           >
             <Trash2 className="w-4 h-4" /> End Test Period (Purge Mock Data)
           </button>
           <button 
             onClick={() => setActiveTab('flow')}
             className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'flow' ? 'bg-kala-secondary text-kala-900' : 'bg-kala-800 text-white'}`}
           >
             Workflow Diagram
           </button>
           <button 
             onClick={() => setActiveTab('erd')}
             className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'erd' ? 'bg-kala-secondary text-kala-900' : 'bg-kala-800 text-white'}`}
           >
             Database ERD
           </button>
           <button 
             onClick={() => setActiveTab('graph')}
             className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'graph' ? 'bg-kala-secondary text-kala-900' : 'bg-kala-800 text-white'}`}
           >
             Knowledge Graph
           </button>
        </div>
      </div>

      <div className="flex-1 bg-kala-800/50 border border-kala-700 rounded-xl p-4 overflow-hidden flex flex-col">
         <div className="flex justify-end mb-2">
            <button 
              onClick={() => downloadSVG(
                  activeTab === 'flow' ? 'workflow-svg' : activeTab === 'erd' ? 'erd-svg' : 'graph-svg', 
                  activeTab === 'flow' ? 'kalakrut-workflow.svg' : activeTab === 'erd' ? 'kalakrut-erd.svg' : 'kalakrut-knowledge-graph.svg'
              )}
              className="flex items-center gap-2 text-xs font-bold text-kala-400 hover:text-white bg-kala-900 px-3 py-1.5 rounded border border-kala-700"
            >
               <Download className="w-4 h-4" /> Download SVG
            </button>
         </div>
         
         <div className="flex-1 overflow-auto bg-slate-900 rounded-lg p-8 flex items-center justify-center">
            {activeTab === 'flow' ? (
              <svg id="workflow-svg" width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: 'sans-serif' }}>
                 <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                    </marker>
                 </defs>
                 <rect x="350" y="20" width="100" height="40" rx="20" fill="#06b6d4" stroke="none" />
                 <text x="400" y="45" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">App Start</text>
                 <path d="M400 60 L400 100" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
                 <polygon points="400,100 450,130 400,160 350,130" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
                 <text x="400" y="135" textAnchor="middle" fill="#cbd5e1" fontSize="10">Login?</text>
                 <path d="M350 130 L200 130 L200 200" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
                 <rect x="150" y="200" width="100" height="50" rx="5" fill="#334155" />
                 <text x="200" y="220" textAnchor="middle" fill="#fff" fontSize="12">Public Home</text>
                 <text x="200" y="235" textAnchor="middle" fill="#94a3b8" fontSize="10">(Landing/News)</text>
                 <path d="M450 130 L600 130 L600 200" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
                 <rect x="550" y="200" width="100" height="50" rx="5" fill="#334155" />
                 <text x="600" y="220" textAnchor="middle" fill="#fff" fontSize="12">Dashboard</text>
                 <text x="600" y="235" textAnchor="middle" fill="#94a3b8" fontSize="10">(Role Based)</text>
                 <path d="M600 250 L600 300" stroke="#64748b" strokeWidth="2" />
                 <line x1="450" y1="300" x2="750" y2="300" stroke="#64748b" strokeWidth="2" />
                 <line x1="450" y1="300" x2="450" y2="350" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
                 <rect x="400" y="350" width="100" height="40" rx="5" fill="#1e293b" stroke="#8b5cf6" />
                 <text x="450" y="375" textAnchor="middle" fill="#e2e8f0" fontSize="10">Marketplace</text>
                 <line x1="600" y1="300" x2="600" y2="350" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
                 <rect x="550" y="350" width="100" height="40" rx="5" fill="#1e293b" stroke="#8b5cf6" />
                 <text x="600" y="375" textAnchor="middle" fill="#e2e8f0" fontSize="10">Booking Hub</text>
                 <line x1="750" y1="300" x2="750" y2="350" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
                 <rect x="700" y="350" width="100" height="40" rx="5" fill="#1e293b" stroke="#8b5cf6" />
                 <text x="750" y="375" textAnchor="middle" fill="#e2e8f0" fontSize="10">DAO/Vote</text>
                 <polygon points="600,420 630,440 600,460 570,440" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" />
                 <text x="600" y="443" textAnchor="middle" fill="#fcd34d" fontSize="9">Wallet?</text>
                 <path d="M500 390 L500 440 L570 440" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4" />
                 <path d="M600 390 L600 420" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4" />
                 <path d="M750 390 L750 440 L630 440" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4" />
                 <rect x="550" y="500" width="100" height="60" rx="5" fill="#0f172a" stroke="#22c55e" strokeWidth="2" />
                 <text x="600" y="525" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="bold">Smart Contracts</text>
                 <text x="600" y="545" textAnchor="middle" fill="#86efac" fontSize="9">Escrow / NFT / Vote</text>
                 <path d="M600 460 L600 500" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrowhead)" />
              </svg>
            ) : activeTab === 'erd' ? (
              <svg id="erd-svg" width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: 'sans-serif' }}>
                 <defs>
                    <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                    </marker>
                 </defs>
                 <g transform="translate(50, 50)">
                    <rect width="140" height="120" fill="#1e293b" stroke="#60a5fa" strokeWidth="2" rx="5" />
                    <rect width="140" height="30" fill="#60a5fa" rx="5" />
                    <text x="70" y="20" textAnchor="middle" fill="#0f172a" fontWeight="bold">USER</text>
                    <text x="10" y="50" fill="#e2e8f0" fontSize="10">• PK: UserID</text>
                    <text x="10" y="70" fill="#e2e8f0" fontSize="10">• Name</text>
                    <text x="10" y="90" fill="#e2e8f0" fontSize="10">• Role</text>
                    <text x="10" y="110" fill="#e2e8f0" fontSize="10">• XP / Level</text>
                 </g>
                 <g transform="translate(300, 50)">
                    <rect width="140" height="100" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="5" />
                    <rect width="140" height="30" fill="#f59e0b" rx="5" />
                    <text x="70" y="20" textAnchor="middle" fill="#0f172a" fontWeight="bold">WALLET</text>
                    <text x="10" y="50" fill="#e2e8f0" fontSize="10">• PK: Address</text>
                    <text x="10" y="70" fill="#e2e8f0" fontSize="10">• FK: UserID</text>
                    <text x="10" y="90" fill="#e2e8f0" fontSize="10">• Balance</text>
                 </g>
                 <line x1="190" y1="100" x2="300" y2="100" stroke="#94a3b8" strokeWidth="2" markerStart="url(#arrowhead2)" />
                 <g transform="translate(50, 250)">
                    <rect width="140" height="120" fill="#1e293b" stroke="#c084fc" strokeWidth="2" rx="5" />
                    <rect width="140" height="30" fill="#c084fc" rx="5" />
                    <text x="70" y="20" textAnchor="middle" fill="#0f172a" fontWeight="bold">ARTIST_PROFILE</text>
                    <text x="10" y="50" fill="#e2e8f0" fontSize="10">• FK: UserID</text>
                    <text x="10" y="70" fill="#e2e8f0" fontSize="10">• Bio / Genre</text>
                    <text x="10" y="90" fill="#e2e8f0" fontSize="10">• Press Kit JSON</text>
                 </g>
                 <line x1="120" y1="170" x2="120" y2="250" stroke="#94a3b8" strokeWidth="2" />
                 <g transform="translate(300, 250)">
                    <rect width="140" height="120" fill="#1e293b" stroke="#22c55e" strokeWidth="2" rx="5" />
                    <rect width="140" height="30" fill="#22c55e" rx="5" />
                    <text x="70" y="20" textAnchor="middle" fill="#0f172a" fontWeight="bold">MARKET_ITEM</text>
                    <text x="10" y="50" fill="#e2e8f0" fontSize="10">• PK: ItemID</text>
                    <text x="10" y="70" fill="#e2e8f0" fontSize="10">• FK: SellerID</text>
                    <text x="10" y="90" fill="#e2e8f0" fontSize="10">• Price / Currency</text>
                    <text x="10" y="110" fill="#e2e8f0" fontSize="10">• Type (NFT/Phys)</text>
                 </g>
                 <line x1="370" y1="150" x2="370" y2="250" stroke="#94a3b8" strokeWidth="2" />
                 <g transform="translate(550, 250)">
                    <rect width="140" height="100" fill="#1e293b" stroke="#f472b6" strokeWidth="2" rx="5" />
                    <rect width="140" height="30" fill="#f472b6" rx="5" />
                    <text x="70" y="20" textAnchor="middle" fill="#0f172a" fontWeight="bold">TRANSACTION</text>
                    <text x="10" y="50" fill="#e2e8f0" fontSize="10">• PK: Hash</text>
                    <text x="10" y="70" fill="#e2e8f0" fontSize="10">• FK: WalletAddress</text>
                    <text x="10" y="90" fill="#e2e8f0" fontSize="10">• Amount / Type</text>
                 </g>
                 <line x1="440" y1="100" x2="620" y2="100" stroke="#94a3b8" strokeWidth="2" />
                 <line x1="620" y1="100" x2="620" y2="250" stroke="#94a3b8" strokeWidth="2" />
                 <g transform="translate(300, 450)">
                    <rect width="140" height="100" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="5" />
                    <rect width="140" height="30" fill="#38bdf8" rx="5" />
                    <text x="70" y="20" textAnchor="middle" fill="#0f172a" fontWeight="bold">BOOKING</text>
                    <text x="10" y="50" fill="#e2e8f0" fontSize="10">• PK: BookingID</text>
                    <text x="10" y="70" fill="#e2e8f0" fontSize="10">• FK: ArtistID</text>
                    <text x="10" y="90" fill="#e2e8f0" fontSize="10">• FK: VenueID</text>
                 </g>
                 <line x1="120" y1="370" x2="120" y2="500" stroke="#94a3b8" strokeWidth="2" />
                 <line x1="120" y1="500" x2="300" y2="500" stroke="#94a3b8" strokeWidth="2" />
              </svg>
            ) : (
                <svg id="graph-svg" width="900" height="600" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: 'sans-serif' }}>
                    <defs>
                        <marker id="arrowhead-graph" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto" fill="#a5b4fc"><polygon points="0 0, 10 3.5, 0 7" /></marker>
                    </defs>

                    {/* Title */}
                    <text x="450" y="40" textAnchor="middle" fill="#e2e8f0" fontSize="20" fontWeight="bold" className="flex items-center">
                        Knowledge Graph Data Flow
                    </text>
                    
                    {/* Nodes */}
                    <g>
                        <rect x="50" y="250" width="150" height="80" rx="5" fill="#1e293b" stroke="#fde047" strokeWidth="2" />
                        <text x="125" y="285" textAnchor="middle" fill="#fde047" fontWeight="bold">External DB</text>
                        <text x="125" y="305" textAnchor="middle" fill="#e2e8f0" fontSize="12">(MusicBrainz)</text>
                    </g>
                    <g>
                        <rect x="300" y="150" width="150" height="60" rx="5" fill="#1e293b" stroke="#60a5fa" strokeWidth="2" />
                        <text x="375" y="185" textAnchor="middle" fill="#e2e8f0" fontSize="12">KalaKrut API</text>
                    </g>
                    <g>
                        <rect x="300" y="350" width="150" height="60" rx="5" fill="#1e293b" stroke="#60a5fa" strokeWidth="2" />
                        <text x="375" y="385" textAnchor="middle" fill="#e2e8f0" fontSize="12">Knowledge Graph Service</text>
                    </g>
                    <g>
                        <rect x="550" y="250" width="150" height="80" rx="5" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
                        <text x="625" y="285" textAnchor="middle" fill="#22c55e" fontWeight="bold">KalaKrut DB</text>
                        <text x="625" y="305" textAnchor="middle" fill="#e2e8f0" fontSize="12">(Artist Profiles)</text>
                    </g>
                    <g>
                        <rect x="750" y="250" width="130" height="60" rx="5" fill="#1e293b" stroke="#c084fc" strokeWidth="2" />
                        <text x="815" y="285" textAnchor="middle" fill="#e2e8f0" fontSize="12">UI Components</text>
                    </g>

                    {/* Arrows */}
                    <path d="M200 270 L300 180" stroke="#a5b4fc" strokeWidth="1.5" markerEnd="url(#arrowhead-graph)" />
                    <text x="260" y="215" fill="#a5b4fc" fontSize="10" transform="rotate(-30 250 220)">API Request</text>
                    
                    <path d="M300 180 L200 270" stroke="#a5b4fc" strokeWidth="1.5" markerEnd="url(#arrowhead-graph)" />
                    <text x="260" y="250" fill="#a5b4fc" fontSize="10" transform="rotate(30 250 255)">Artist JSON Data</text>

                    <path d="M375 210 L375 350" stroke="#a5b4fc" strokeWidth="1.5" markerEnd="url(#arrowhead-graph)" />
                    <text x="385" y="280" fill="#a5b4fc" fontSize="10">Process & Enrich</text>

                    <path d="M450 380 L550 310" stroke="#a5b4fc" strokeWidth="1.5" markerEnd="url(#arrowhead-graph)" />
                    <text x="490" y="335" fill="#a5b4fc" fontSize="10" transform="rotate(-30 490 335)">Save Enriched Data</text>

                    <path d="M700 280 L750 280" stroke="#a5b4fc" strokeWidth="1.5" markerEnd="url(#arrowhead-graph)" />
                    <text x="705" y="270" fill="#a5b4fc" fontSize="10">Serve to UI</text>
                </svg>
            )}
         </div>
      </div>
    </div>
  );
};

export default SystemDiagrams;
