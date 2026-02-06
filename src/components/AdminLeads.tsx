
import React, { useState } from 'react';
import { Bot, RefreshCw, FileSpreadsheet, Send, Search, UserPlus } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { knowledgeGraph } from '../services/knowledgeGraphService';
import { searchArtist } from '../services/musicBrainzService';
import { Artist, Lead } from '../types';

interface AdminLeadsProps {
  leads: Lead[];
  addLead: (artist: Artist) => boolean;
}

const AdminLeads: React.FC<AdminLeadsProps> = ({ leads, addLead }) => {
  const { notify } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [query, setQuery] = useState('Find artists with releases but no upcoming events.');
  const [artistQuery, setArtistQuery] = useState('');
  const [artistResults, setArtistResults] = useState<Artist[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [aiLeads, setAiLeads] = useState<any[]>([]);

  const handleRunQuery = () => {
    setIsSyncing(true);
    const foundLeads = knowledgeGraph.findLeads(query);
    setTimeout(() => {
      setAiLeads(foundLeads);
      setIsSyncing(false);
      notify(`LeadGeniusAI found ${foundLeads.length} new potential leads.`, "success");
    }, 1500);
  };

  const handleArtistSearch = async () => {
    if (!artistQuery) {
      notify("Please enter an artist name to search.", "warning");
      return;
    }
    setIsSearching(true);
    const results = await searchArtist(artistQuery);
    setArtistResults(results);
    setIsSearching(false);
    notify(`Found ${results.length} artists.`, "success");
  };

  const handleAddLead = (artist: Artist) => {
    const wasAdded = addLead(artist);
    if (wasAdded) {
      notify(`${artist.name} has been added as a new lead.`, 'success');
    } else {
      notify(`${artist.name} is already in your leads list.`, 'info');
    }
  };


  return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Bot className="text-indigo-400" /> Lead Management
            </h2>
            <p className="text-kala-400 text-sm">Automated lead generation and manual artist discovery.</p>
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

        {/* MusicBrainz Artist Search */}
        <div className="bg-kala-900/50 border border-kala-800 rounded-xl p-6">
            <label className="block text-sm text-kala-300 font-bold mb-2">MusicBrainz Artist Search</label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={artistQuery}
                    onChange={(e) => setArtistQuery(e.target.value)}
                    className="flex-grow bg-kala-800 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500"
                    placeholder="e.g., Nirvana, Daft Punk..."
                />
                <button
                    onClick={handleArtistSearch}
                    disabled={isSearching}
                    className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    {isSearching ? 'Searching...' : 'Search'}
                </button>
            </div>
        </div>

        {/* Artist Search Results */}
        {artistResults.length > 0 && (
            <div className="bg-kala-800/40 border border-kala-700/80 rounded-xl">
                <div className="p-4 border-b border-kala-700">
                    <h3 className="font-bold text-white">Artist Search Results</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-kala-400 uppercase bg-kala-800/60">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Disambiguation</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {artistResults.map(artist => (
                                <tr key={artist.id} className="border-b border-kala-800 hover:bg-kala-800/50">
                                    <td className="px-6 py-4 font-medium text-white">{artist.name}</td>
                                    <td className="px-6 py-4 text-kala-300">{artist.bio}</td>
                                    <td className="px-6 py-4 text-center">
                                       <button onClick={() => handleAddLead(artist)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                                          <UserPlus className="w-4 h-4" />
                                          Add as Lead
                                       </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Current Leads Table */}
        <div className="bg-kala-800/40 border border-kala-700/80 rounded-xl">
          <div className="p-4 border-b border-kala-700">
            <h3 className="font-bold text-white">Current Leads</h3>
          </div>
          <div className="overflow-x-auto">
            {leads.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-kala-400 uppercase bg-kala-800/60">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Disambiguation</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead.id} className="border-b border-kala-800 hover:bg-kala-800/50">
                      <td className="px-6 py-4 font-medium text-white">{lead.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          lead.status === 'New' ? 'bg-blue-900 text-blue-300' :
                          lead.status === 'Contacted' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-green-900 text-green-300'
                        }`}>{lead.status}</span>
                      </td>
                      <td className="px-6 py-4 text-kala-300">{lead.bio}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-teal-400 hover:text-teal-300 mr-4">Contact</button>
                        <button className="text-red-400 hover:text-red-300">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-kala-500">
                <p>No leads have been added yet.</p>
                <p className="text-xs">Use the search above to find and add new artists.</p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default AdminLeads;
