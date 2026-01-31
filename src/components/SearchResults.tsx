
import React from 'react';
import { Search, ArrowRight, User, ShoppingBag, MessageSquare, FileText, Briefcase } from 'lucide-react';
import { MOCK_ROSTER, MOCK_MARKETPLACE_ITEMS, MOCK_THREADS, MOCK_ARTICLES, MOCK_SERVICES } from '../mockData';

interface SearchResultsProps {
  query: string;
  onNavigate: (view: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, onNavigate }) => {
  const lowerQuery = query.toLowerCase();

  // Filter Data
  const rosterResults = MOCK_ROSTER.filter(i => i.name.toLowerCase().includes(lowerQuery) || i.role.toLowerCase().includes(lowerQuery));
  const marketResults = MOCK_MARKETPLACE_ITEMS.filter(i => i.title.toLowerCase().includes(lowerQuery) || i.type.toLowerCase().includes(lowerQuery));
  const forumResults = MOCK_THREADS.filter(i => i.title.toLowerCase().includes(lowerQuery) || i.category.toLowerCase().includes(lowerQuery));
  const newsResults = MOCK_ARTICLES.filter(i => i.title.toLowerCase().includes(lowerQuery) || i.excerpt.toLowerCase().includes(lowerQuery));
  const serviceResults = MOCK_SERVICES.filter(i => i.title.toLowerCase().includes(lowerQuery) || i.category.toLowerCase().includes(lowerQuery));

  const totalResults = rosterResults.length + marketResults.length + forumResults.length + newsResults.length + serviceResults.length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-kala-800/50 border border-kala-700 p-6 rounded-xl flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <Search className="text-kala-secondary" /> Search Results
           </h2>
           <p className="text-kala-400 text-sm mt-1">
             Found {totalResults} matches for "<span className="text-white font-bold">{query}</span>"
           </p>
        </div>
        <button onClick={() => onNavigate('dashboard')} className="text-sm text-kala-400 hover:text-white underline">
          Clear Search
        </button>
      </div>

      {totalResults === 0 && (
         <div className="text-center py-20 text-kala-500">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">No results found.</p>
            <p className="text-sm">Try searching for "Artist", "NFT", "Grant" or "Music".</p>
         </div>
      )}

      {/* Roster Results */}
      {rosterResults.length > 0 && (
        <div>
           <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2 border-b border-kala-700 pb-2">
             <User className="w-4 h-4 text-blue-400" /> People & Roster
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rosterResults.map(item => (
                 <div key={item.id} className="bg-kala-800 p-4 rounded-lg flex items-center gap-4 hover:bg-kala-700 transition-colors cursor-pointer" onClick={() => onNavigate('roster')}>
                    <img src={item.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                    <div>
                       <div className="font-bold text-white">{item.name}</div>
                       <div className="text-xs text-kala-400">{item.role} • {item.location}</div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* Market Results */}
      {marketResults.length > 0 && (
        <div>
           <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2 border-b border-kala-700 pb-2">
             <ShoppingBag className="w-4 h-4 text-purple-400" /> Marketplace
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {marketResults.map(item => (
                 <div key={item.id} className="bg-kala-800 p-4 rounded-lg hover:bg-kala-700 transition-colors cursor-pointer" onClick={() => onNavigate('marketplace')}>
                    <div className="flex items-center gap-3 mb-2">
                       <img src={item.image} alt="" className="w-10 h-10 rounded object-cover" />
                       <div>
                          <div className="font-bold text-white text-sm truncate">{item.title}</div>
                          <div className="text-xs text-kala-500">{item.type}</div>
                       </div>
                    </div>
                    <div className="text-right text-kala-secondary font-mono text-sm">{item.price} {item.currency}</div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* Service Results */}
      {serviceResults.length > 0 && (
        <div>
           <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2 border-b border-kala-700 pb-2">
             <Briefcase className="w-4 h-4 text-green-400" /> Services
           </h3>
           <div className="space-y-2">
              {serviceResults.map(item => (
                 <div key={item.id} className="bg-kala-800 p-3 rounded-lg flex justify-between items-center hover:bg-kala-700 cursor-pointer" onClick={() => onNavigate('services')}>
                    <div>
                       <div className="font-bold text-white text-sm">{item.title}</div>
                       <div className="text-xs text-kala-400">by {item.provider}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-kala-500" />
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* Forum Results */}
      {forumResults.length > 0 && (
        <div>
           <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2 border-b border-kala-700 pb-2">
             <MessageSquare className="w-4 h-4 text-orange-400" /> Forum Discussions
           </h3>
           <div className="space-y-2">
              {forumResults.map(item => (
                 <div key={item.id} className="bg-kala-800 p-3 rounded-lg hover:bg-kala-700 cursor-pointer" onClick={() => onNavigate('forum')}>
                    <div className="font-bold text-white text-sm">{item.title}</div>
                    <div className="text-xs text-kala-400">Category: {item.category} • {item.replies} replies</div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* News Results */}
      {newsResults.length > 0 && (
        <div>
           <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2 border-b border-kala-700 pb-2">
             <FileText className="w-4 h-4 text-pink-400" /> News & Articles
           </h3>
           <div className="space-y-2">
              {newsResults.map(item => (
                 <div key={item.id} className="bg-kala-800 p-3 rounded-lg hover:bg-kala-700 cursor-pointer" onClick={() => onNavigate('announcements_internal')}>
                    <div className="font-bold text-white text-sm">{item.title}</div>
                    <div className="text-xs text-kala-400 truncate">{item.excerpt}</div>
                 </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
    