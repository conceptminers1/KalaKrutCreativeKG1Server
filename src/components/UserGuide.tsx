
import React, { useState } from 'react';
import { BookOpen, Download, Lock, ChevronDown, ChevronUp, CheckCircle, FileText, Scale, ShieldAlert } from 'lucide-react';
import PaymentGateway from '../components/PaymentGateway';

interface UserGuideProps {
  isSubscribed: boolean;
  onSubscribe: () => void;
}

const GUIDE_CONTENT = [
  {
    title: "1. Getting Started: Profile & Verification",
    content: `• Complete your Profile: Go to the 'Settings' tab. Upload a high-quality cover image and avatar.
• Get Verified: Ensure you fill out the 'Roster Registration' form found in the Dashboard. Verified users get 2x more visibility.
• Wallets: You can connect a Crypto Wallet (MetaMask) or add a Bank Card. You need at least one to receive payments.`
  },
  {
    title: "2. How to Book & Get Paid (Artists)",
    content: `• Sending a Proposal: Go to the 'Booking Hub'. Select an artist or venue. Fill in the budget and dates.
• Escrow: When you book someone, money is held safely in 'Escrow'. It is not paid to the artist until the job is done.
• Milestones: For big projects, use 'Milestone Payments'. Example: Pay 50% deposit, and 50% after the show.
• Releasing Funds: Once the gig is over, go to 'My Proposals' and click 'Release Funds'.`
  },
  {
    title: "3. Using the Marketplace",
    content: `• Buying: You can buy physical items (like guitars) or Digital Collectibles (NFTs).
• Selling: Click 'Sell' on the dashboard. Upload a photo, set a price (USD or Crypto), and publish.
• Auctions: You can set a timer. The highest bidder wins when time runs out.`
  },
  {
    title: "4. Creative Studio (Uploads)",
    content: `• Uploading: Drag and drop your songs or videos into the 'Creative Studio'.
• IPFS: We store your files on the 'InterPlanetary File System'. This means no one can delete them but you.
• Minting: You can turn your uploaded song into an NFT. This proves you own it.`
  },
  {
    title: "5. Safety & Support",
    content: `• Chat: Only chat inside the portal. If someone asks to pay via WhatsApp or Venmo, they might be a scammer.
• Disputes: If a gig goes wrong, do not release funds. Go to the 'Support Widget' (bottom right) and open a ticket.
• Tiers: Priority members get 24hr support response times.`
  },
  {
    title: "6. Role-Specific Tips",
    content: `• Venues: Use the 'Services Hub' to find certified Lead Generation tools to fill your calendar.
• Sponsors: Check the 'DAO Governance' tab to vote on which artists receive community grants.
• Revellers: Subscribe to the 'Community Pro' plan to see full contact details of your favorite artists and get early access to tickets.`
  },
  {
    title: "7. Community Guidelines & Legal Terms",
    content: `• What We Can't Do: KalaKrut is a technology facilitator, not a judicial body. We cannot manage or fund litigation arising from copyright violations between users. IP disputes must be resolved legally between the parties involved.
• Platform Neutrality: We operate with strict neutrality. We do not practice favoritism; visibility on the platform (Leaderboards, Search) is purely algorithmic based on user activity and XP. We cannot manually boost profiles upon request.
• Third-Party Risks: The platform is not liable for third-party thefts of data (via external phishing), theft of physical products during shipping, or unauthorized scraping of public profile data.
• Content Ownership: You retain 100% ownership of your uploads, but you also bear 100% responsibility. Uploading content you do not own will result in immediate account suspension.
• Account Deletion: As per community guidelines, you cannot self-delete active accounts to prevent fraud. Please contact an admin.`
  },
  {
    title: "8. ZERO TOLERANCE POLICY (IMPORTANT)",
    content: `• Strict Moderation: We enforce a global algorithm to detect "illicit" or foul content/language across all formats (text, image, audio, video, NFTs, metaverse).
• Immediate Blocking: A single violation of this policy—whether in Chat, Uploads, Forums, or Registration—will trigger an immediate automated block of your account.
• No Exceptions: This applies to foul words, hate speech, illegal content, and scams.
• Appeals: If you believe you were blocked in error, you may file a formal appeal via the Support Widget, but access will remain restricted until reviewed.`
  }
];

const UserGuide: React.FC<UserGuideProps> = ({ isSubscribed, onSubscribe }) => {
  const [openSection, setOpenSection] = useState<number | null>(0);
  const [showPayment, setShowPayment] = useState(false);

  const handleDownload = () => {
    // Generate a simple text file download
    const title = "KalaKrut_User_Guide_v3.txt";
    const textContent = `KALAKRUT CREATIVE - OFFICIAL USER GUIDE\n\n` + 
      GUIDE_CONTENT.map((section, i) => `${section.title}\n${'-'.repeat(section.title.length)}\n${section.content}\n\n`).join('');
    
    const element = document.createElement("a");
    const file = new Blob([textContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = title;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!isSubscribed) {
    return (
      <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-kala-900 rounded-full flex items-center justify-center mx-auto border border-kala-700">
           <Lock className="w-8 h-8 text-kala-500" />
        </div>
        <div>
           <h3 className="text-2xl font-bold text-white mb-2">Subscriber-Only Resource</h3>
           <p className="text-kala-400 max-w-md mx-auto">
             The "Mastering KalaKrut" guide contains step-by-step strategies for maximizing earnings, securing gigs, and navigating Web3 features safely.
           </p>
        </div>
        <button 
          onClick={() => setShowPayment(true)}
          className="bg-kala-secondary hover:bg-cyan-400 text-kala-900 font-bold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-cyan-900/20"
        >
           Unlock Guide ($19.99/mo)
        </button>

        {showPayment && (
           <PaymentGateway 
             amount={19.99}
             currency="USD"
             itemDescription="Community Pro Subscription (Includes Guide)"
             onSuccess={() => { setShowPayment(false); onSubscribe(); }}
             onCancel={() => setShowPayment(false)}
           />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="bg-gradient-to-r from-emerald-900/50 to-kala-900 border border-emerald-500/30 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400">
               <BookOpen className="w-8 h-8" />
            </div>
            <div>
               <h3 className="text-xl font-bold text-white">Mastering KalaKrut</h3>
               <p className="text-sm text-kala-300">Official How-To Guide & Best Practices</p>
            </div>
         </div>
         <button 
           onClick={handleDownload}
           className="flex items-center gap-2 bg-kala-800 hover:bg-kala-700 text-white px-4 py-2 rounded-lg border border-kala-600 transition-colors font-bold text-sm"
         >
            <Download className="w-4 h-4" /> Download Offline Copy
         </button>
      </div>
      
      {/* Policy Warning Banner */}
      <div className="bg-red-900/20 border border-red-500/40 rounded-xl p-4 flex items-start gap-3">
         <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
         <div>
            <h4 className="font-bold text-red-200 text-sm">Strict Moderation Active</h4>
            <p className="text-xs text-red-200/70 mt-1">
               Please review Section 8 regarding our Zero Tolerance Policy on illicit content. Violations result in immediate account suspension.
            </p>
         </div>
      </div>

      <div className="space-y-4">
        {GUIDE_CONTENT.map((section, index) => (
          <div key={index} className="bg-kala-800/30 border border-kala-700 rounded-xl overflow-hidden transition-all">
             <button 
               onClick={() => setOpenSection(openSection === index ? null : index)}
               className="w-full flex items-center justify-between p-4 hover:bg-kala-800/50 transition-colors text-left"
             >
                <span className="font-bold text-white flex items-center gap-3">
                   {openSection === index ? <CheckCircle className="w-5 h-5 text-kala-secondary" /> : <div className="w-5 h-5 rounded-full border-2 border-kala-600" />}
                   {section.title}
                </span>
                {openSection === index ? <ChevronUp className="text-kala-500" /> : <ChevronDown className="text-kala-500" />}
             </button>
             
             {openSection === index && (
                <div className="p-4 pt-0 pl-12 text-kala-300 text-sm whitespace-pre-line leading-relaxed border-t border-kala-700/50 bg-kala-900/30">
                   {section.content}
                </div>
             )}
          </div>
        ))}
      </div>

      <div className="bg-kala-800 p-4 rounded-xl flex items-start gap-3">
         <Scale className="w-5 h-5 text-kala-500 mt-0.5" />
         <div>
            <h4 className="font-bold text-white text-sm">Legal Disclaimer</h4>
            <p className="text-xs text-kala-400 mt-1">
               By using the portal, you agree to these guidelines. For complex legal issues, please consult your own legal counsel. Visit the <span className="text-kala-secondary cursor-pointer hover:underline">Support Center</span> for reporting violations.
            </p>
         </div>
      </div>
    </div>
  );
};

export default UserGuide;
