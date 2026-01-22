import React from 'react';
import { Article } from '../types';
import { ArrowLeft, Calendar, User, Tag, ChevronRight } from 'lucide-react';

interface AnnouncementsProps {
  onBack: () => void;
}

const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'KalaKrut Launches Version 3.0 Beta',
    excerpt: 'Our biggest update yet brings Smart Chat, Roster management, and dedicated DAO governance tools to the mainnet.',
    content: 'We are thrilled to announce the immediate availability of KalaKrut 3.0. This release marks a significant milestone in our journey to build a sustainable, artist-centric economy. Key features include the new Smart Chat system that ensures secure, on-platform transactions, and a comprehensive Roster tool for venues and organizers to scout talent efficiently.',
    date: 'Oct 12, 2023',
    author: 'KalaKrut Team',
    image: 'https://picsum.photos/seed/news1/800/400',
    category: 'Announcement'
  },
  {
    id: '2',
    title: 'Community Spotlight: The Rise of "Neon Pulse"',
    excerpt: 'How one synthwave collective used the KalaKrut DAO Grant to fund their international tour.',
    content: 'Neon Pulse started as a bedroom project in Brooklyn. Utilizing the Tier-3 DAO Grant program, they secured funding for their "Midnight Protocol" tour without signing away rights to a major label. This case study explores how they leveraged the Booking Hub to manage 14 dates across Europe.',
    date: 'Oct 08, 2023',
    author: 'Sarah Jenkins',
    image: 'https://picsum.photos/seed/news2/800/400',
    category: 'Community'
  },
  {
    id: '3',
    title: 'New Partnership with Global Ticketing Services',
    excerpt: 'Seamless integration for hybrid events is now live for all Verified Venues.',
    content: 'We have partnered with leading ticketing providers to allow direct API integration. Venues can now mint NFT tickets alongside traditional QR codes, providing revellers with collectible memorabilia that unlocks future perks.',
    date: 'Sep 29, 2023',
    author: 'BizDev Team',
    image: 'https://picsum.photos/seed/news3/800/400',
    category: 'Press Release'
  }
];

const Announcements: React.FC<AnnouncementsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-kala-900 text-slate-200">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-kala-900/90 backdrop-blur border-b border-kala-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-kala-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <div className="font-bold text-xl tracking-tighter text-white">
            Kala<span className="text-kala-secondary">Krut</span> News
          </div>
          <div className="w-20"></div> {/* Spacer for center alignment */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Latest Updates</h1>
          <p className="text-xl text-kala-400 max-w-2xl mx-auto">
            Insights, press releases, and stories from the KalaKrut creative ecosystem.
          </p>
        </div>

        <div className="space-y-8">
          {MOCK_ARTICLES.map((article) => (
            <div key={article.id} className="bg-kala-800/50 border border-kala-700 rounded-2xl overflow-hidden hover:border-kala-500 transition-colors group">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-kala-900/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-kala-secondary border border-kala-700 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {article.category}
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-4 text-xs text-kala-400 mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-kala-secondary transition-colors">
                  {article.title}
                </h2>
                
                <p className="text-slate-300 leading-relaxed mb-6">
                  {article.excerpt}
                </p>

                <button className="text-kala-secondary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Read Full Article <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Announcements;