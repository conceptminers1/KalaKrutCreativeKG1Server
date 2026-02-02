
import React, { useState } from 'react';
import { SubscriptionPlan, User } from '../types';
import { Check, ShieldCheck, LifeBuoy, Crown, Zap, Star, Lock, Unlock, TrendingUp, AlertCircle } from 'lucide-react';
import PaymentGateway from '../components/PaymentGateway';
import { useToast } from '../contexts/ToastContext';

const PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Guest / Starter',
    price: '0',
    period: 'forever',
    features: [
      'Basic Profile Access',
      'View Public Marketplace',
      'Read Forum Discussions',
      'Standard Support (Email)'
    ],
    supportTier: 'Standard'
  },
  {
    id: 'pro',
    name: 'Community Pro',
    price: '19.99',
    period: 'mo',
    isRecommended: true,
    features: [
      'Full Roster Access (Contact Info)',
      'View Community Ratings',
      'Post in Forums',
      'Bid in Auctions',
      'Zero Service Fees on Bookings',
      'Priority Support (24h SLA)'
    ],
    supportTier: 'Priority'
  },
  {
    id: 'business',
    name: 'Business Elite',
    price: '99.00',
    period: 'mo',
    features: [
      'All Pro Features',
      'Verified Business Badge',
      'API Access for Ticketing',
      'Dedicated Account Manager',
      'Bulk Lead Export (LeadGeniusAI)',
      'Elite Support (1h Response)'
    ],
    supportTier: 'Elite'
  }
];

// Criteria for DAO Membership
const DAO_MIN_LEVEL = 20;
const DAO_PRICE_FIAT = 500;

interface MembershipPlansProps {
  currentUser: User;
}

const MembershipPlans: React.FC<MembershipPlansProps> = ({ currentUser }) => {
  const { notify } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showDaoPayment, setShowDaoPayment] = useState(false);

  // Check Eligibility
  const isDaoEligible = currentUser.level >= DAO_MIN_LEVEL;
  const xpProgress = Math.min(100, (currentUser.level / DAO_MIN_LEVEL) * 100);

  return (
    <div className="space-y-12 animate-in fade-in pb-10">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Membership & Support Plans</h2>
        <p className="text-kala-400 max-w-2xl mx-auto">
          Choose a plan that fits your creative needs. Unlock roster contacts, lower fees, and get access to our tiered support network.
        </p>
      </div>

      {/* Standard Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative rounded-2xl p-8 border flex flex-col ${
              plan.isRecommended 
              ? 'bg-gradient-to-b from-kala-800 to-kala-900 border-kala-secondary shadow-2xl shadow-cyan-900/20 transform md:-translate-y-4' 
              : 'bg-kala-800/30 border-kala-700'
            }`}
          >
            {plan.isRecommended && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-kala-secondary text-kala-900 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-cyan-400">
                Most Popular
              </div>
            )}
            
            <div className="mb-6">
               <h3 className="text-xl font-bold text-white flex items-center gap-2">
                 {plan.id === 'free' ? <Star className="w-5 h-5 text-slate-400" /> :
                  plan.id === 'pro' ? <Zap className="w-5 h-5 text-yellow-400" /> :
                  <Crown className="w-5 h-5 text-purple-400" />}
                 {plan.name}
               </h3>
               <div className="mt-4 flex items-baseline gap-1">
                 <span className="text-4xl font-bold text-white">${plan.price}</span>
                 <span className="text-kala-500">/{plan.period}</span>
               </div>
            </div>

            <div className="flex-1 space-y-4 mb-8">
               {plan.features.map((feat, i) => (
                 <div key={i} className="flex items-start gap-3 text-sm text-kala-300">
                    <Check className={`w-5 h-5 shrink-0 ${plan.isRecommended ? 'text-kala-secondary' : 'text-kala-500'}`} />
                    <span>{feat}</span>
                 </div>
               ))}
            </div>

            <div className="mt-auto">
               <div className="bg-kala-900/50 rounded-lg p-3 mb-4 text-center border border-kala-700">
                  <div className="text-[10px] uppercase text-kala-500 font-bold mb-1">Included Support Level</div>
                  <div className={`text-sm font-bold flex items-center justify-center gap-2 ${
                    plan.supportTier === 'Elite' ? 'text-purple-400' :
                    plan.supportTier === 'Priority' ? 'text-green-400' :
                    'text-slate-400'
                  }`}>
                    <LifeBuoy className="w-4 h-4" /> {plan.supportTier} Tier
                  </div>
               </div>
               
               <button 
                 onClick={() => setSelectedPlan(plan)}
                 disabled={plan.id === 'free'}
                 className={`w-full py-3 rounded-xl font-bold transition-all ${
                   plan.id === 'free' 
                   ? 'bg-kala-800 text-kala-500 cursor-not-allowed' 
                   : plan.isRecommended
                   ? 'bg-kala-secondary hover:bg-cyan-400 text-kala-900 shadow-lg shadow-cyan-900/20'
                   : 'bg-kala-700 hover:bg-white hover:text-kala-900 text-white'
                 }`}
               >
                 {plan.id === 'free' ? 'Current Plan' : 'Upgrade Now'}
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* DAO Governance Tier (Merit Based) */}
      <div className="max-w-4xl mx-auto mt-16">
        <div className={`relative rounded-2xl border overflow-hidden ${isDaoEligible ? 'bg-gradient-to-r from-purple-900/40 to-kala-900 border-purple-500/50' : 'bg-kala-800/50 border-kala-700 opacity-90'}`}>
           <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2 space-y-4">
                 <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${isDaoEligible ? 'bg-purple-500 text-white' : 'bg-kala-700 text-kala-400'}`}>
                       <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-bold text-white">DAO Governance Membership</h3>
                       <p className="text-sm text-kala-400">Vote on proposals, steer platform direction, and earn yield.</p>
                    </div>
                 </div>

                 {!isDaoEligible ? (
                    <div className="bg-kala-900/50 rounded-xl p-4 border border-kala-700">
                       <div className="flex items-center gap-2 text-yellow-400 font-bold mb-2">
                          <Lock className="w-4 h-4" /> Eligibility Locked
                       </div>
                       <p className="text-sm text-kala-300 mb-3">
                          DAO Membership is reserved for active community contributors. You must reach <span className="text-white font-bold">Level {DAO_MIN_LEVEL}</span> to unlock this tier.
                       </p>
                       <div className="space-y-1">
                          <div className="flex justify-between text-xs text-kala-500">
                             <span>Current: Lvl {currentUser.level}</span>
                             <span>Target: Lvl {DAO_MIN_LEVEL}</span>
                          </div>
                          <div className="w-full h-2 bg-kala-800 rounded-full overflow-hidden">
                             <div className="h-full bg-yellow-500 transition-all duration-1000" style={{ width: `${xpProgress}%` }}></div>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-green-400 font-bold">
                          <Unlock className="w-5 h-5" /> Eligibility Unlocked!
                       </div>
                       <p className="text-sm text-kala-300">
                          Congratulations! Your contributions (Level {currentUser.level}) have qualified you for full governance rights.
                       </p>
                       <ul className="text-sm text-kala-400 space-y-1 mt-2 grid grid-cols-1 md:grid-cols-2">
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Voting Rights</li>
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Treasury Yield</li>
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Exclusive NFT Badge</li>
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Direct Fiat On-ramp</li>
                       </ul>
                    </div>
                 )}
              </div>

              <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-kala-700 pt-6 md:pt-0 md:pl-8">
                 <div className="text-xs font-bold text-kala-500 uppercase mb-1">Annual Membership</div>
                 <div className="text-3xl font-bold text-white mb-4">${DAO_PRICE_FIAT} <span className="text-lg text-kala-500 font-normal">/yr</span></div>
                 
                 <button 
                   onClick={() => setShowDaoPayment(true)}
                   disabled={!isDaoEligible}
                   className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      isDaoEligible 
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20' 
                      : 'bg-kala-800 text-kala-500 cursor-not-allowed'
                   }`}
                 >
                    {isDaoEligible ? 'Join DAO' : 'Locked'}
                 </button>
                 {!isDaoEligible && (
                    <p className="text-[10px] text-kala-500 mt-2">
                       Engage in forums and marketplace to level up.
                    </p>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Support Tiers Detail */}
      <div className="bg-kala-800/50 border border-kala-700 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ShieldCheck className="text-green-400" /> Support Service Level Agreements (SLA)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="space-y-2">
              <h4 className="font-bold text-white">Standard Tier</h4>
              <p className="text-sm text-kala-400">For general inquiries and non-urgent account issues.</p>
              <ul className="text-xs text-kala-500 space-y-1 mt-2">
                <li>• Email Only</li>
                <li>• 48-72hr Response Time</li>
                <li>• Community Forum Access</li>
              </ul>
           </div>
           <div className="space-y-2">
              <h4 className="font-bold text-green-400">Priority Tier</h4>
              <p className="text-sm text-kala-400">For active members, roster issues, and payment disputes.</p>
              <ul className="text-xs text-kala-500 space-y-1 mt-2">
                <li>• Email & In-App Chat</li>
                <li>• 24hr Response Time</li>
                <li>• Dispute Resolution Mediation</li>
              </ul>
           </div>
           <div className="space-y-2">
              <h4 className="font-bold text-purple-400">Elite Tier</h4>
              <p className="text-sm text-kala-400">For business partners, high-volume venues, and critical ops.</p>
              <ul className="text-xs text-kala-500 space-y-1 mt-2">
                <li>• Dedicated Agent</li>
                <li>• 1hr Critical Response</li>
                <li>• Phone Support Access</li>
              </ul>
           </div>
        </div>
      </div>

      {/* Standard Plan Payment */}
      {selectedPlan && (
         <PaymentGateway 
           amount={selectedPlan.price} 
           currency="USD" 
           itemDescription={`${selectedPlan.name} Subscription`} 
           onSuccess={(method) => { notify(`Welcome to ${selectedPlan.name}! (Paid via ${method})`, 'success'); setSelectedPlan(null); }}
           onCancel={() => setSelectedPlan(null)}
         />
      )}

      {/* DAO Payment (Fiat Allowed) */}
      {showDaoPayment && (
         <PaymentGateway 
            amount={DAO_PRICE_FIAT}
            currency="USD"
            itemDescription="DAO Governance Membership (Annual)"
            onSuccess={(method) => { 
               notify(`Welcome to the DAO! Governance Rights Unlocked via ${method}.`, 'success'); 
               setShowDaoPayment(false); 
            }}
            onCancel={() => setShowDaoPayment(false)}
         />
      )}
    </div>
  );
};

export default MembershipPlans;
