
import React from 'react';
import { Users, Briefcase, UserPlus, Mail, Shield } from 'lucide-react';
import { ArtistProfile, CircleMember } from '../types';

const CircleMemberCard = ({ member }: { member: CircleMember }) => (
  <div className="bg-kala-800/50 border border-kala-700 rounded-lg p-4 flex items-center justify-between hover:bg-kala-800 transition-colors">
    <div className="flex items-center gap-4">
      <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover border-2 border-kala-700" />
      <div>
        <h4 className="font-bold text-white">{member.name}</h4>
        <p className="text-sm text-kala-400">{member.role}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
        <button className="p-2 bg-kala-700 hover:bg-kala-600 rounded-lg text-kala-300 hover:text-white transition-colors" title={`Message ${member.name}`}>
            <Mail className="w-4 h-4" />
        </button>
    </div>
  </div>
);

interface MyCircleProps {
  currentUser: ArtistProfile;
}

const MyCircle: React.FC<MyCircleProps> = ({ currentUser }) => {
  const followers = currentUser.followers || [];
  const businessAssociates = currentUser.businessAssociates || [];

  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3"><Users className="text-kala-secondary" /> My Circle</h1>
        <p className="text-kala-400 mt-1">Your private network of followers and business associates.</p>
      </div>

       <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 flex items-start gap-4">
         <Shield className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
         <p className="text-sm text-blue-200">
           <span className="font-bold">This page is private.</span> Your circle is only visible to you. Others cannot see who you follow or who your business associates are.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Followers Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><UserPlus className="text-kala-accent" /> Followers ({followers.length})</h2>
          <div className="space-y-4">
            {followers.map(follower => (
              <CircleMemberCard key={follower.id} member={follower} />
            ))}
          </div>
        </div>

        {/* Business Associates Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Briefcase className="text-kala-accent" /> Business Associates ({businessAssociates.length})</h2>
          <div className="space-y-4">
            {businessAssociates.map(associate => (
              <CircleMemberCard key={associate.id} member={associate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCircle;
