
import React, { useState } from 'react';
import { ServiceListing, UserRole } from '../types';
import { Briefcase, Star, Users, ArrowRight, Zap, Bot, ExternalLink, ShieldCheck, Lock, FileSpreadsheet, X, MessageSquare, ShieldAlert } from 'lucide-react';
import PaymentGateway from '../components/PaymentGateway';
import { checkContentForViolation, MODERATION_WARNING_TEXT } from '../services/moderationService';
import { useToast } from '../contexts/ToastContext';

const MEMBER_SERVICES: ServiceListing[] = [
  {
    id: '1',
    title: 'Web3 Grant Writing & Strategy',
    provider: 'CryptoGrants Co.',
    category: 'Grant Writing',
    rate: '150',
    rating: 4.9,
    reviews: 42
  },
  {
    id: '2',
    title: 'Event Production & Logistics',
    provider: 'Stage Hands Collective',
    category: 'Production',
    rate: '500',
    rating: 4.7,
    reviews: 128
  },
  {
    id: '3',
    title: 'Music Rights & Royalty Consultancy',
    provider: 'Legal Eagle Arts',
    category: 'Legal',
    rate: '200',
    rating: 5.0,
    reviews: 15
  },
];

interface ServicesHubProps {
  userRole?: UserRole;
  onNavigateToProfile?: () => void;
  onBlockUser: () => void;
}

const ServicesHub: React.FC<ServicesHubProps> = ({ userRole, onNavigateToProfile, onBlockUser }) => {
  const { notify } = useToast();
  const [activeTab, setActiveTab] = useState<'platform' | 'members'>('platform');
  const [selectedService, setSelectedService] = useState<ServiceListing | null>(null);
  const [showAutoSyncPayment, setShowAutoSyncPayment] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [serviceToContact, setServiceToContact] = useState<string>('');

  const handleContactSubmit = () => {
    // Zero Tolerance Policy Enforcement
    if (checkContentForViolation(contactMessage)) {
       onBlockUser();
       setShowContactModal(false);
       setContactMessage('');
       return;
    }

    notify(`Message sent to ${serviceToContact}!`, 'success');
    setShowContactModal(false);
    setContactMessage('');
    setServiceToContact('');
  };

  const openContactModal = (providerName: string) => {
    setServiceToContact(providerName);
    setShowContactModal(true);
  };

  return (
    <div className="space-y-6 relative">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="text-kala-secondary" /> Services Hub
          </h2>
          <p className="text-kala-400 text-sm">Access professional tools and community expertise.</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-kala-800 p-1 rounded-lg border border-kala-700">
          <button 
            onClick={() => setActiveTab('platform')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === 'platform' 
              ? 'bg-kala-secondary text-kala-900 shadow-lg' 
              : 'text-kala-400 hover:text-white'
            }`}
          >
            Platform Services
          </button>
          <button 
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === 'members' 
              ? 'bg-kala-secondary text-kala-900 shadow-lg' 
              : 'text-kala-400 hover:text-white'
            }`}
          >
            Provider Members
          </button>
        </div>
       </div>

       {activeTab === 'platform' ? (
         <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* LeadGeniusAI Card */}
            <div className="bg-gradient-to-br from-indigo-900/80 to-kala-900 border border-indigo-500/30 rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Bot className="w-32 h-32 text-indigo-400" />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-indigo-500 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                     <Zap className="w-6 h-6" />
                   </div>
                   <h3 className="text-2xl font-bold text-white">LeadGeniusAI</h3>
                   <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold border border-yellow-500/30 rounded">PREMIUM</span>
                 </div>
                 <p className="text-indigo-200 max-w-2xl mb-6 text-lg">
                   Automate your collaboration outreach. Generate high-quality leads for venues, sponsors, and artists using our AI-powered engine. Perfect for scaling your creative business.
                 </p>
                 
                 <div className="flex flex-wrap gap-4">
                   <a 
                     href="https://studio--leadgeniusai-qrsid.us-central1.hosted.app/" 
                     target="_blank" 
                     rel="noreferrer"
                     className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-indigo-900/40"
                   >
                     Launch External Tool <ExternalLink className="w-4 h-4" />
                   </a>

                   {/* Admin Only: View Global Sheet */}
                   {userRole === UserRole.ADMIN ? (
                     <a 
                       href="https://docs.google.com/spreadsheets/d/1_JDe6kZ9SiEMLueA8isrVMKLogYbSwpO3utV8_BrlQg/edit?usp=drivesdk"
                       target="_blank"
                       rel="noreferrer"
                       className="bg-green-700 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg transition-colors border border-green-600 flex items-center gap-2"
                     >
                       <ShieldCheck className="w-4 h-4" /> View Admin Master Sheet
                     </a>
                   ) : (
                     /* User: Paid Service Options */
                     <div className="flex gap-4">
                        <button 
                           onClick={() => setShowAutoSyncPayment(true)}
                           className="bg-kala-800 hover:bg-kala-700 text-white font-bold px-6 py-3 rounded-lg transition-colors border border-kala-600 flex items-center gap-2"
                        >
                           Activate Auto-Sync ($15/mo)
                        </button>
                        {onNavigateToProfile && (
                           <button 
                              onClick={onNavigateToProfile}
                              className="text-indigo-300 hover:text-white font-medium flex items-center gap-2 px-2"
                           >
                              View Saved Leads <ArrowRight className="w-4 h-4" />
                           </button>
                        )}
                     </div>
                   )}
                 </div>
                 
                 {userRole === UserRole.ADMIN ? (
                    <p className="text-xs text-green-400 mt-4 flex items-center gap-1">
                       <CheckCircleIcon /> Master Database Access Granted (Admin)
                    </p>
                 ) : (
                    <p className="text-xs text-indigo-300/60 mt-4">
                       * Users can manually record queries in their profile for free. Auto-Sync is a paid add-on.
                    </p>
                 )}
              </div>
            </div>

            {/* Other Platform Services (Mock) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-kala-800/50 border border-kala-700 p-6 rounded-xl hover:border-kala-500 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Smart Contract Audit</h3>
                  <p className="text-kala-400 text-sm mb-4">
                    Official platform verification for your custom DAO contracts and revenue-sharing agreements.
                  </p>
                  <button 
                    onClick={() => openContactModal('Platform Audit Team')}
                    className="text-emerald-400 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Request Audit <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
               
               <div className="bg-kala-800/50 border border-kala-700 p-6 rounded-xl hover:border-kala-500 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Talent Concierge</h3>
                  <p className="text-kala-400 text-sm mb-4">
                    Dedicated support for large-scale festival bookings and international logistics.
                  </p>
                  <button 
                    onClick={() => openContactModal('Concierge Sales')}
                    className="text-blue-400 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Contact Sales <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </div>
       ) : (
         <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
           {/* Member Services List */}
           <div className="bg-kala-800/30 border border-kala-700 rounded-xl p-4 mb-4">
             <p className="text-sm text-kala-300">
               Community providers are vetted members offering specialized services. 
               <span className="text-kala-500 ml-1">(Transactions secured by KalaKrut Escrow)</span>
             </p>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
             {MEMBER_SERVICES.map((svc) => (
               <div key={svc.id} className="bg-kala-800/50 border border-kala-700 p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between hover:border-kala-500 transition-colors group">
                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-lg bg-kala-700 flex items-center justify-center text-kala-300 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                     <Briefcase className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-white">{svc.title}</h3>
                     <p className="text-kala-400 text-sm flex items-center gap-2 mt-1">
                       <span>{svc.provider}</span> • 
                       <span className="px-2 py-0.5 rounded-full bg-kala-700/50 text-xs border border-kala-600">{svc.category}</span>
                     </p>
                   </div>
                 </div>

                 <div className="flex items-center gap-8 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                   <div className="text-right">
                     <div className="text-sm font-bold text-white flex items-center gap-1 justify-end">
                       <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {svc.rating}
                     </div>
                     <div className="text-xs text-kala-500">{svc.reviews} reviews</div>
                   </div>
                   
                   <div className="text-right min-w-[100px]">
                     <div className="text-lg font-bold text-kala-secondary font-mono">${svc.rate}</div>
                     <div className="text-xs text-kala-500">Starting rate</div>
                   </div>

                   <div className="flex gap-2">
                      <button 
                        onClick={() => openContactModal(svc.provider)}
                        className="p-2 rounded-full bg-kala-700 hover:bg-white hover:text-kala-900 transition-colors"
                        title="Contact Provider"
                      >
                         <MessageSquare className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setSelectedService(svc)}
                        className="p-2 rounded-full bg-kala-secondary text-kala-900 hover:bg-cyan-400 transition-colors"
                        title="Book Service"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </div>
       )}

       {selectedService && (
         <PaymentGateway 
           amount={selectedService.rate} 
           currency="USD" 
           itemDescription={`Retainer Fee for ${selectedService.title}`} 
           onSuccess={(method) => { notify(`Service Booked via ${method === 'crypto' ? 'Crypto' : 'Fiat'}!`, 'success'); setSelectedService(null); }}
           onCancel={() => setSelectedService(null)}
         />
       )}

       {showAutoSyncPayment && (
         <PaymentGateway 
            amount={15.00}
            currency="USD"
            itemDescription="LeadGeniusAI Auto-Sync (Monthly)"
            onSuccess={(method) => {
               notify('Auto-Sync Activated! Queries will now appear in your profile.', 'success');
               setShowAutoSyncPayment(false);
            }}
            onCancel={() => setShowAutoSyncPayment(false)}
         />
       )}

      {/* Contact Modal (with Moderation) */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
           <div className="bg-kala-900 border border-kala-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="p-4 bg-kala-800 border-b border-kala-700 flex justify-between items-center">
                 <h3 className="text-white font-bold">Contact {serviceToContact}</h3>
                 <button onClick={() => setShowContactModal(false)} className="text-kala-400 hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-6 space-y-4">
                 <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-200">{MODERATION_WARNING_TEXT}</p>
                 </div>
                 
                 <textarea 
                   rows={4}
                   value={contactMessage}
                   onChange={(e) => setContactMessage(e.target.value)}
                   className="w-full bg-kala-800 border border-kala-700 rounded-lg p-3 text-white text-sm outline-none focus:border-kala-secondary resize-none"
                   placeholder="Type your inquiry here..."
                 />
                 
                 <button 
                   onClick={handleContactSubmit}
                   disabled={!contactMessage}
                   className="w-full py-3 bg-kala-secondary text-kala-900 font-bold rounded-xl hover:bg-cyan-400 transition-colors disabled:opacity-50"
                 >
                    Send Secure Message
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const CheckCircleIcon = () => (
   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
   </svg>
);

export default ServicesHub;
