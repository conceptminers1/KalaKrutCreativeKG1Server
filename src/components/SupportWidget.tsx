
import React, { useState } from 'react';
import { LifeBuoy, X, Send, AlertCircle, MessageSquare } from 'lucide-react';

const SupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Transaction',
    priority: 'Medium',
    subject: '',
    description: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setTimeout(() => {
         setIsOpen(false);
         setIsSubmitted(false);
         setFormData({ category: 'Transaction', priority: 'Medium', subject: '', description: '' });
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
       {/* Widget Toggle */}
       <button 
         onClick={() => setIsOpen(!isOpen)}
         className="bg-kala-secondary text-kala-900 p-4 rounded-full shadow-lg shadow-cyan-900/20 hover:scale-110 transition-transform font-bold flex items-center gap-2"
       >
          {isOpen ? <X className="w-6 h-6" /> : <LifeBuoy className="w-6 h-6" />}
          {!isOpen && <span className="hidden md:inline pr-1">Help & Support</span>}
       </button>

       {/* Widget Window */}
       {isOpen && (
          <div className="mb-4 w-80 md:w-96 bg-kala-900 border border-kala-700 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in origin-bottom-right">
             <div className="bg-kala-800 p-4 border-b border-kala-700 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                   <LifeBuoy className="w-5 h-5 text-kala-secondary" /> Support Center
                </h3>
                <span className="text-[10px] text-kala-500 uppercase font-bold tracking-wider">Tiered Support</span>
             </div>

             {isSubmitted ? (
               <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto">
                     <Send className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Ticket Created!</h4>
                  <p className="text-sm text-kala-400">
                     Ticket #TK-4829 has been assigned to our Tier 1 support team. You will receive an email shortly.
                  </p>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="p-4 space-y-4">
                  <div>
                     <label className="block text-xs text-kala-400 font-bold uppercase mb-1">Issue Category</label>
                     <select 
                       value={formData.category}
                       onChange={(e) => setFormData({...formData, category: e.target.value})}
                       className="w-full bg-kala-800 border border-kala-700 rounded-lg px-3 py-2 text-sm text-white focus:border-kala-secondary outline-none"
                     >
                        <option value="Transaction">Transaction / Escrow Issue</option>
                        <option value="Proposal">Proposal Dispute</option>
                        <option value="Payment">Payment Gateway Failure</option>
                        <option value="Technical">Platform Bug / Glitch</option>
                        <option value="Account">Account Verification</option>
                     </select>
                  </div>
                  
                  <div>
                     <label className="block text-xs text-kala-400 font-bold uppercase mb-1">Priority</label>
                     <select 
                       value={formData.priority}
                       onChange={(e) => setFormData({...formData, priority: e.target.value})}
                       className="w-full bg-kala-800 border border-kala-700 rounded-lg px-3 py-2 text-sm text-white focus:border-kala-secondary outline-none"
                     >
                        <option value="Low">Low - General Question</option>
                        <option value="Medium">Medium - Feature Issue</option>
                        <option value="High">High - Transaction Stuck</option>
                        <option value="Critical">Critical - Fund Loss Risk</option>
                     </select>
                  </div>

                  <div>
                     <label className="block text-xs text-kala-400 font-bold uppercase mb-1">Subject</label>
                     <input 
                       required
                       type="text" 
                       value={formData.subject}
                       onChange={(e) => setFormData({...formData, subject: e.target.value})}
                       placeholder="Brief summary..."
                       className="w-full bg-kala-800 border border-kala-700 rounded-lg px-3 py-2 text-sm text-white focus:border-kala-secondary outline-none"
                     />
                  </div>

                  <div>
                     <label className="block text-xs text-kala-400 font-bold uppercase mb-1">Description</label>
                     <textarea 
                       required
                       rows={3}
                       value={formData.description}
                       onChange={(e) => setFormData({...formData, description: e.target.value})}
                       placeholder="Describe the issue in detail..."
                       className="w-full bg-kala-800 border border-kala-700 rounded-lg px-3 py-2 text-sm text-white focus:border-kala-secondary outline-none resize-none"
                     />
                  </div>

                  <div className="bg-kala-800/50 p-3 rounded text-xs text-kala-400 flex gap-2">
                     <AlertCircle className="w-4 h-4 shrink-0" />
                     <p>For transaction disputes, please include the TX Hash if available.</p>
                  </div>

                  <button type="submit" className="w-full bg-kala-secondary hover:bg-cyan-400 text-kala-900 font-bold py-3 rounded-xl transition-colors">
                     Submit Ticket
                  </button>
               </form>
             )}
             
             {/* Footer Link */}
             <div className="p-3 bg-kala-900 border-t border-kala-700 text-center">
               <p className="text-[10px] text-kala-500">
                  Response times vary by <span className="text-white cursor-pointer hover:underline">Support Plan</span>.
               </p>
             </div>
          </div>
       )}
    </div>
  );
};

export default SupportWidget;
