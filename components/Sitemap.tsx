

import React from 'react';
import { Network, Home, LayoutGrid, ShoppingBag, Briefcase, Calendar, Users, MessageSquare, UploadCloud, BarChart3, Bot, FileText, File } from 'lucide-react';

interface SitemapProps {
  onNavigate: (view: string) => void;
}

const Sitemap: React.FC<SitemapProps> = ({ onNavigate }) => {
  const sections = [
    {
      title: 'Core Platform',
      links: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
        { id: 'marketplace', label: 'Marketplace (NFTs/Gear)', icon: ShoppingBag },
        { id: 'services', label: 'Services Hub', icon: Briefcase },
        { id: 'booking', label: 'Booking Hub', icon: Calendar },
        { id: 'studio', label: 'Creative Studio (IPFS)', icon: UploadCloud },
      ]
    },
    {
      title: 'Community',
      links: [
        { id: 'roster', label: 'Roster / Directory', icon: Users },
        { id: 'forum', label: 'Discussion Forum', icon: MessageSquare },
        { id: 'governance', label: 'DAO Governance', icon: Network },
        { id: 'announcements_internal', label: 'News & Announcements', icon: FileText },
      ]
    },
    {
      title: 'Public Pages',
      links: [
        { id: 'home', label: 'Landing Page', icon: Home },
        { id: 'announcements_public', label: 'Public Blog', icon: FileText },
      ]
    },
    {
      title: 'Admin Tools',
      links: [
        { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 },
        { id: 'leads', label: 'LeadGeniusAI Integration', icon: Bot },
        { id: 'whitepaper', label: 'Whitepaper Litepaper', icon: FileText },
        { id: 'system_docs', label: 'System Diagrams & ERD', icon: Network },
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
       <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Platform Sitemap</h2>
          <p className="text-kala-400">Complete navigational structure of KalaKrut Creative v3.0</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section, idx) => (
             <div key={idx} className="space-y-4">
                <h3 className="text-lg font-bold text-kala-secondary uppercase tracking-wider border-b border-kala-700 pb-2">
                   {section.title}
                </h3>
                <ul className="space-y-3">
                   {section.links.map(link => (
                      <li key={link.id}>
                         <button 
                           onClick={() => onNavigate(link.id)}
                           className="flex items-center gap-3 text-kala-300 hover:text-white hover:translate-x-1 transition-all group w-full text-left"
                         >
                            <div className="p-1.5 rounded-md bg-kala-800 text-kala-500 group-hover:bg-kala-700 group-hover:text-kala-secondary transition-colors">
                               <link.icon className="w-4 h-4" />
                            </div>
                            <span>{link.label}</span>
                         </button>
                      </li>
                   ))}
                </ul>
             </div>
          ))}
       </div>
    </div>
  );
};

export default Sitemap;
