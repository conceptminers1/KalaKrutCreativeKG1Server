import React from 'react';
import { Download, FileText, ShieldCheck, Globe2, Coins, Users, ArrowLeft } from 'lucide-react';

const WhitePaper: React.FC = () => {
  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-kala-900 to-kala-800 border-b border-kala-700 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <span className="bg-kala-secondary text-kala-900 text-xs font-bold px-2 py-1 rounded">INTERNAL DRAFT</span>
              <span className="text-kala-500 text-xs font-mono">v3.0.1</span>
           </div>
           <h1 className="text-3xl font-bold text-white tracking-tight">KalaKrut Creative Ecosystem</h1>
           <p className="text-kala-400 mt-1">Litepaper & Technical Architecture</p>
        </div>
        <button 
          onClick={handleDownload}
          className="bg-white text-kala-900 font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-lg"
        >
           <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>

      {/* Document Content */}
      <div className="bg-white text-slate-900 p-12 md:p-16 rounded-xl shadow-2xl print:shadow-none print:p-0">
         {/* Title Page */}
         <div className="text-center border-b-2 border-slate-900 pb-12 mb-12">
            <h1 className="text-5xl font-bold mb-4 text-slate-900">KalaKrut Creative</h1>
            <p className="text-2xl text-slate-600 font-light">A Hybrid Web3 Social Enterprise for the Arts</p>
            <div className="mt-8 flex justify-center gap-4 text-sm text-slate-500 font-mono">
               <span>EST. 2024</span>
               <span>•</span>
               <span>DAO GOVERNED</span>
               <span>•</span>
               <span>COMMUNITY OWNED</span>
            </div>
         </div>

         {/* 1. Executive Summary */}
         <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
               <Globe2 className="w-6 h-6 text-blue-600" /> 1. Executive Summary
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
               KalaKrut Creative is an artist-centric, gamified community portal designed to solve the fragmentation in the creative industry. By merging a Web2 SaaS workflow (booking, ticketing, CRM) with Web3 incentives (DAO governance, NFT assets), KalaKrut creates a sustainable, circular economy.
            </p>
            <p className="text-slate-700 leading-relaxed">
               Unlike traditional agencies that take 15-20% commissions, KalaKrut operates as a social enterprise, utilizing smart contracts to enforce transparent, low-fee (&lt; 2.5%) transactions while empowering the community to govern the platform's treasury.
            </p>
         </section>

         {/* 2. Problem & Solution */}
         <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
               <ShieldCheck className="w-6 h-6 text-green-600" /> 2. Problem & Solution
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                  <h3 className="font-bold text-red-900 mb-2">The Problem</h3>
                  <ul className="list-disc list-inside text-red-800 space-y-2 text-sm">
                     <li><strong>Fragmentation:</strong> Artists use 5+ apps for booking, payments, and promo.</li>
                     <li><strong>Trust Issues:</strong> Payment disputes and contract breaches are common.</li>
                     <li><strong>High Barriers:</strong> Emerging talent lacks access to venues and capital.</li>
                  </ul>
               </div>
               <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                  <h3 className="font-bold text-green-900 mb-2">The KalaKrut Solution</h3>
                  <ul className="list-disc list-inside text-green-800 space-y-2 text-sm">
                     <li><strong>Unified Portal:</strong> One login for Roster, Marketplace, and Booking.</li>
                     <li><strong>Smart Escrow:</strong> Funds are locked in code, released only upon milestones.</li>
                     <li><strong>Gamified Growth:</strong> XP systems reward participation with visibility.</li>
                  </ul>
               </div>
            </div>
         </section>

         {/* 3. The "Lvl 42" Gamification Model */}
         <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
               <Users className="w-6 h-6 text-purple-600" /> 3. The Gamification Model
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
               To ensure platform neutrality, visibility is driven by a "Community Score" (XP) rather than paid boosting. Artists can quickly onboard by syncing their profile with the MusicBrainz knowledge graph.
            </p>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-slate-100 text-slate-900 font-bold uppercase">
                     <tr>
                        <th className="p-3 border-b border-slate-300">Action</th>
                        <th className="p-3 border-b border-slate-300">XP Reward</th>
                        <th className="p-3 border-b border-slate-300">Benefit</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                     <tr>
                        <td className="p-3">Sync with MusicBrainz</td>
                        <td className="p-3 font-mono">+750 XP</td>
                        <td className="p-3">Auto-filled profile, Knowledge Graph entry</td>
                     </tr>
                     <tr>
                        <td className="p-3">Complete Profile</td>
                        <td className="p-3 font-mono">+500 XP</td>
                        <td className="p-3">Verified Badge</td>
                     </tr>
                     <tr>
                        <td className="p-3">Complete Gig (5 Star)</td>
                        <td className="p-3 font-mono">+2000 XP</td>
                        <td className="p-3">Higher Search Ranking</td>
                     </tr>
                     <tr>
                        <td className="p-3">Vote in DAO</td>
                        <td className="p-3 font-mono">+100 XP</td>
                        <td className="p-3">Governance Weight</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </section>

         {/* 4. Financial Architecture */}
         <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
               <Coins className="w-6 h-6 text-yellow-600" /> 4. Financial Architecture
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
               KalaKrut employs a Dual-Gateway system to bridge the gap between traditional industry standards and Web3 innovation.
            </p>
            <ul className="space-y-4">
               <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">A</div>
                  <div>
                     <h4 className="font-bold text-slate-900">Fiat Rails (Stripe/Bank)</h4>
                     <p className="text-slate-600 text-sm">Used for subscription fees, ticket sales, and standard booking deposits. Funds are held in a regulated holding account and paid out monthly.</p>
                  </div>
               </li>
               <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">B</div>
                  <div>
                     <h4 className="font-bold text-slate-900">Crypto Rails (Smart Contracts)</h4>
                     <p className="text-slate-600 text-sm">Used for NFT sales, instant cross-border payments, and DAO grants. Funds are held in on-chain escrow contracts, eliminating counterparty risk.</p>
                  </div>
               </li>
            </ul>
         </section>

         {/* 5. Legal & Governance */}
         <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
               <FileText className="w-6 h-6 text-slate-600" /> 5. Legal & Governance
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
               The platform is governed by the <strong>KalaKrut DAO</strong>, a decentralized organization comprising all Verified Members.
            </p>
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
               <h3 className="font-bold text-slate-900 mb-2">Liability Disclaimer</h3>
               <p className="text-slate-600 text-sm italic">
                  "KalaKrut provides the technological infrastructure for connection and transaction. We do not employ the artists nor own the venues. Disputes regarding performance quality, copyright infringement, or physical damages must be resolved between the contracting parties. Our liability is strictly limited to the platform fees collected."
               </p>
            </div>
         </section>

         {/* Footer */}
         <div className="border-t-2 border-slate-900 pt-8 mt-12 text-center">
            <p className="font-bold text-slate-900">© 2024 KalaKrut Creative.</p>
            <p className="text-slate-500 text-sm mt-2">Empowering Art through Technology.</p>
         </div>
      </div>
    </div>
  );
};

export default WhitePaper;