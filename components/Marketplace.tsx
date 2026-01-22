
import React, { useState } from 'react';
import { MarketplaceItem } from '../types';
import { useData } from '../contexts/DataContext';
import { ShoppingBag, Clock, Search, X, CheckCircle, Plus, ShieldAlert, UploadCloud, MessageCircle, Eye, Tag, AlertCircle } from 'lucide-react';
import PaymentGateway from './PaymentGateway';
import { checkContentForViolation, MODERATION_WARNING_TEXT } from '../services/moderationService';
import { useToast } from './ToastContext';

interface MarketplaceProps {
  onBlockUser: () => void;
  onChat: (seller: { name: string; avatar: string }) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onBlockUser, onChat }) => {
  const { marketItems, addMarketItem } = useData();
  const { notify } = useToast();
  const [filter, setFilter] = useState('All');
  const [viewingItem, setViewingItem] = useState<MarketplaceItem | null>(null);
  const [buyingItem, setBuyingItem] = useState<MarketplaceItem | null>(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  
  // List Item Form State
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemType, setNewItemType] = useState('Physical Art');

  const filters = ['All', 'NFT', 'Physical Art', 'Instrument', 'Ticket', 'Equipment'];
  const items = filter === 'All' ? marketItems : marketItems.filter(i => i.type === filter);

  const handleListItem = () => {
     // Content Moderation
     if (checkContentForViolation(newItemTitle)) {
        onBlockUser();
        setIsListModalOpen(false);
        return;
     }

     if (!newItemTitle || !newItemPrice) return;
     
     const newItem: MarketplaceItem = {
        id: `m-${Date.now()}`,
        title: newItemTitle,
        price: parseFloat(newItemPrice),
        currency: 'USD',
        type: newItemType as any,
        image: 'https://picsum.photos/seed/' + Date.now() + '/400/400',
        seller: { name: 'You', avatar: 'https://picsum.photos/seed/you/50', verified: true },
        isAuction: false
     };

     addMarketItem(newItem);
     notify("Item listed successfully!", "success");
     setIsListModalOpen(false);
     setNewItemTitle('');
     setNewItemPrice('');
  };

  const handleChat = (item: MarketplaceItem) => {
    onChat({ name: item.seller.name, avatar: item.seller.avatar });
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="text-kala-secondary" /> Marketplace
          </h2>
          <p className="text-kala-400 text-sm">Buy, Sell, Rent & Auction unique creative assets.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setIsListModalOpen(true)}
             className="bg-kala-secondary text-kala-900 font-bold px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors flex items-center gap-2"
           >
             <Plus className="w-4 h-4" /> List Item
           </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-kala-800/30 border border-kala-700 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-kala-500" />
          <input 
            type="text" 
            placeholder="Search for art, gear, tickets..." 
            className="w-full bg-kala-900 border border-kala-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-1 focus:ring-kala-secondary outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filter === f 
                ? 'bg-kala-700 text-white border border-kala-500' 
                : 'bg-kala-900 text-kala-400 border border-kala-700 hover:bg-kala-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-kala-800/50 border border-kala-700 rounded-xl overflow-hidden group hover:border-kala-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/20 flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs text-white font-bold flex items-center gap-1">
                {item.type}
              </div>
              {item.isAuction && (
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3">
                   <div className="text-xs text-yellow-400 font-bold flex items-center gap-1">
                     <Clock className="w-3 h-3" /> Ends in {item.endTime}
                   </div>
                </div>
              )}
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-2">
                    <img src={item.seller.avatar} alt="" className="w-5 h-5 rounded-full" />
                    <span className="text-xs text-kala-300 truncate max-w-[80px]">{item.seller.name}</span>
                    {item.seller.verified && <CheckBadge />}
                 </div>
                 {/* Chat Button on Card */}
                 <button 
                   onClick={(e) => { e.stopPropagation(); handleChat(item); }}
                   className="text-kala-400 hover:text-white transition-colors"
                   title="Chat with Seller"
                 >
                    <MessageCircle className="w-4 h-4" />
                 </button>
              </div>
              
              <h3 className="font-bold text-slate-100 mb-1 truncate">{item.title}</h3>
              <p className="text-xs text-kala-500 line-clamp-2 h-8 mb-2">{item.description}</p>
              
              <div className="mt-auto pt-3 border-t border-kala-700/50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-kala-400 uppercase tracking-wider">{item.isAuction ? 'Current Bid' : 'Price'}</p>
                  <p className="text-lg font-mono font-bold text-kala-secondary">
                    {item.price} {item.currency}
                  </p>
                </div>
                <div className="flex gap-2">
                   {/* View Details Button */}
                   <button 
                     onClick={() => setViewingItem(item)}
                     className="p-2 rounded-lg bg-kala-700 text-kala-300 hover:bg-white hover:text-kala-900 transition-colors"
                     title="View Product Details"
                   >
                      <Eye className="w-4 h-4" />
                   </button>
                   {/* Buy Button */}
                   <button 
                     onClick={() => setBuyingItem(item)}
                     className="px-3 py-2 rounded-lg bg-kala-secondary text-kala-900 hover:bg-cyan-400 transition-colors text-xs font-bold"
                   >
                     {item.isAuction ? 'Bid' : 'Buy'}
                   </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Details Modal */}
      {viewingItem && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-kala-900 border border-kala-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
               {/* Image Section */}
               <div className="w-full md:w-1/2 h-64 md:h-auto bg-black relative">
                  <img src={viewingItem.image} alt={viewingItem.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-xs text-white font-bold border border-white/10">
                     {viewingItem.type}
                  </div>
               </div>

               {/* Info Section */}
               <div className="w-full md:w-1/2 flex flex-col p-6 overflow-y-auto">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h2 className="text-2xl font-bold text-white leading-tight">{viewingItem.title}</h2>
                        <div className="flex items-center gap-2 mt-2">
                           <div className="flex items-center gap-2 bg-kala-800 px-2 py-1 rounded-full border border-kala-700">
                              <img src={viewingItem.seller.avatar} alt="" className="w-6 h-6 rounded-full" />
                              <span className="text-xs text-kala-300 font-bold">{viewingItem.seller.name}</span>
                              {viewingItem.seller.verified && <CheckBadge />}
                           </div>
                        </div>
                     </div>
                     <button onClick={() => setViewingItem(null)} className="text-kala-400 hover:text-white">
                        <X className="w-6 h-6" />
                     </button>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                     <span className="text-3xl font-mono font-bold text-kala-secondary">{viewingItem.price} {viewingItem.currency}</span>
                     {viewingItem.isAuction && (
                        <div className="text-xs font-bold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20 flex items-center gap-1">
                           <Clock className="w-3 h-3" /> Ends in {viewingItem.endTime}
                        </div>
                     )}
                  </div>

                  <div className="space-y-6 flex-1">
                     <div>
                        <h4 className="text-xs font-bold text-kala-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                           <Tag className="w-3 h-3" /> Condition & Type
                        </h4>
                        <div className="flex gap-2">
                           <span className="px-3 py-1 rounded bg-kala-800 text-kala-300 text-sm border border-kala-700">
                              {viewingItem.condition || 'Pre-owned'}
                           </span>
                           <span className="px-3 py-1 rounded bg-kala-800 text-kala-300 text-sm border border-kala-700">
                              {viewingItem.type}
                           </span>
                        </div>
                     </div>

                     <div>
                        <h4 className="text-xs font-bold text-kala-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                           <AlertCircle className="w-3 h-3" /> Description
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                           {viewingItem.description || "No detailed description provided for this item."}
                        </p>
                     </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-kala-800 flex gap-4">
                     <button 
                        onClick={() => { setViewingItem(null); handleChat(viewingItem); }}
                        className="flex-1 py-3 bg-kala-800 hover:bg-kala-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border border-kala-600"
                     >
                        <MessageCircle className="w-5 h-5" /> Chat Seller
                     </button>
                     <button 
                        onClick={() => { setViewingItem(null); setBuyingItem(viewingItem); }}
                        className="flex-1 py-3 bg-kala-secondary hover:bg-cyan-400 text-kala-900 font-bold rounded-xl transition-colors shadow-lg shadow-cyan-900/20"
                     >
                        {viewingItem.isAuction ? 'Place Bid' : 'Buy Now'}
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Checkout Modal */}
      {buyingItem && (
         <PaymentGateway 
            amount={buyingItem.price} 
            currency={buyingItem.currency} 
            itemDescription={buyingItem.title} 
            onSuccess={(method) => { notify(`Transaction initiated via ${method === 'crypto' ? 'Crypto' : 'Fiat'}!`, "success"); setBuyingItem(null); }}
            onCancel={() => setBuyingItem(null)}
         />
      )}

      {/* List Item Modal */}
      {isListModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-kala-900 border border-kala-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
               <div className="p-4 bg-kala-800 border-b border-kala-700 flex justify-between items-center">
                  <h3 className="text-white font-bold">List New Item</h3>
                  <button onClick={() => setIsListModalOpen(false)} className="text-kala-400 hover:text-white"><X className="w-5 h-5"/></button>
               </div>
               
               <div className="p-6 space-y-4">
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 flex items-start gap-3">
                     <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                     <p className="text-xs text-red-200">{MODERATION_WARNING_TEXT}</p>
                  </div>

                  <div className="border-2 border-dashed border-kala-700 rounded-xl p-6 flex flex-col items-center justify-center text-kala-400 hover:bg-kala-800/30 cursor-pointer transition-colors">
                     <UploadCloud className="w-8 h-8 mb-2" />
                     <span className="text-xs font-bold">Upload Image</span>
                  </div>

                  <div>
                     <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Item Title</label>
                     <input 
                       type="text" 
                       value={newItemTitle}
                       onChange={(e) => setNewItemTitle(e.target.value)}
                       className="w-full bg-kala-800 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary"
                       placeholder="e.g. Gibson Les Paul"
                     />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Price (USD)</label>
                        <input 
                          type="number" 
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(e.target.value)}
                          className="w-full bg-kala-800 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary"
                          placeholder="500"
                        />
                     </div>
                     <div>
                        <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Type</label>
                        <select 
                          value={newItemType}
                          onChange={(e) => setNewItemType(e.target.value)}
                          className="w-full bg-kala-800 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary"
                        >
                           {filters.filter(f => f !== 'All').map(f => <option key={f}>{f}</option>)}
                        </select>
                     </div>
                  </div>

                  <button 
                    onClick={handleListItem}
                    className="w-full py-3 bg-kala-secondary text-kala-900 font-bold rounded-xl hover:bg-cyan-400 transition-colors"
                  >
                     Publish Listing
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

const CheckBadge = () => (
  <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
  </svg>
);

export default Marketplace;
