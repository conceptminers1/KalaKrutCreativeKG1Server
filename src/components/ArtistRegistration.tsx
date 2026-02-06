
import React, { useState } from 'react';
import { User, Mail, MapPin, Music, Link as LinkIcon, Save, DollarSign, Briefcase, ShieldAlert, Search, BrainCircuit } from 'lucide-react';
import { checkContentForViolation, MODERATION_WARNING_TEXT } from '../services/moderationService';
import { useToast } from '../contexts/ToastContext';
import { useData } from '../contexts/DataContext';
import { UserRole } from '../types';
import { searchArtist } from '../services/musicBrainzService';
import { Artist } from '../data/knowledgeGraphSchema';

interface ArtistRegistrationProps {
   onComplete: () => void;
   onBlockUser: () => void;
}

const ArtistRegistration: React.FC<ArtistRegistrationProps> = ({ onComplete, onBlockUser }) => {
  const { showToast } = useToast();
  const { addUser } = useData();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    stageName: '',
    location: '',
    genres: '',
    bio: '',
    portfolioUrl: '',
    ratePerGig: '',
    skills: '',
    equipment: '',
    musicBrainzId: ''
  });
  const [musicBrainzSearch, setMusicBrainzSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const handleSearch = async () => {
    if (!musicBrainzSearch) return;
    const results = await searchArtist(musicBrainzSearch);
    setSearchResults(results);
    if (results.length === 0) {
      showToast('No artists found on MusicBrainz with that name.', 'warning');
    }
  };

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setFormData({
      ...formData,
      stageName: artist.name,
      bio: artist.bio || formData.bio,
      musicBrainzId: artist.id
    });
    setSearchResults([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const valuesToCheck = Object.values(formData).join(' ');
    if (checkContentForViolation(valuesToCheck)) {
       onBlockUser();
       return;
    }

    const tempPassword = Math.random().toString(36).slice(-8);

    const newUserProfile = {
      id: `u-${Date.now()}`,
      name: formData.stageName || `${formData.firstName} ${formData.lastName}`,
      role: UserRole.ARTIST,
      avatar: 'https://picsum.photos/seed/' + Date.now() + '/200',
      location: formData.location,
      genres: formData.genres.split(',').map(s => s.trim()),
      bio: formData.bio,
      email: formData.email,
      password: tempPassword,
      verified: false,
      pressKit: { photos: [], topTracks: [], techRiderUrl: '', socials: [] },
      stats: { gigsCompleted: 0, activeGigs: 0, rating: 0, responseTime: 'N/A' },
      level: 1,
      xp: 0,
      musicBrainzId: formData.musicBrainzId
    };

    addUser(newUserProfile as any);
    
    showToast(`Account created! Confirmation sent to ${formData.email}. Password: ${tempPassword}`, "success");
    
    console.log("--- SIMULATED EMAIL ---");
    console.log(`To: ${formData.email}`);
    console.log(`Subject: Welcome to KalaKrut!`);
    console.log(`Body: Your account has been created. Your temporary password is: ${tempPassword}`);
    console.log("-----------------------");

    onComplete();
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Join the Community</h1>
        <p className="text-kala-400">
          Complete your profile to be listed in the Roster. We use these details to match you with opportunities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-kala-800/50 border border-kala-700 rounded-2xl p-8 space-y-6">
        
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 flex items-start gap-3">
           <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
           <p className="text-xs text-red-200">{MODERATION_WARNING_TEXT}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BrainCircuit className="text-kala-secondary w-5 h-5" /> Knowledge Graph Link
          </h3>
          <p className="text-sm text-kala-300 mb-2">
            Bootstrap your profile by linking to an existing MusicBrainz artist entry. This will pre-fill your name and bio.
          </p>
          <div className="flex gap-2">
            <input 
              value={musicBrainzSearch} 
              onChange={(e) => setMusicBrainzSearch(e.target.value)}
              className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary" 
              placeholder="Search for your artist name on MusicBrainz..." 
            />
            <button type="button" onClick={handleSearch} className="bg-kala-secondary text-kala-900 font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2">
              <Search className="w-5 h-5" /> Search
            </button>
          </div>
          {searchResults.length > 0 && (
            <div className="mt-4 bg-kala-900/50 border border-kala-700 rounded-lg p-4 max-h-60 overflow-y-auto">
              <h4 className="text-white font-bold mb-2">Select your artist profile:</h4>
              <ul>
                {searchResults.map(artist => (
                  <li key={artist.id}>
                    <button type="button" onClick={() => handleSelectArtist(artist)} className="w-full text-left p-2 hover:bg-kala-700 rounded-md">
                      <p className="font-bold">{artist.name}</p>
                      <p className="text-sm text-kala-400">{artist.bio}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {selectedArtist && (
             <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-3 flex items-center gap-3">
                 <BrainCircuit className="w-5 h-5 text-green-400 shrink-0" />
                 <p className="text-sm text-green-200">
                     Profile linked to MusicBrainz artist: <span className="font-bold">{selectedArtist.name}</span>
                 </p>
             </div>
        )}

        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <User className="text-kala-secondary w-5 h-5" /> Identity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">First Name</label>
              <input required name="firstName" onChange={handleChange} value={formData.firstName} className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="Jane" />
            </div>
            <div>
              <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Last Name</label>
              <input required name="lastName" onChange={handleChange} value={formData.lastName} className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="Doe" />
            </div>
            <div className="md:col-span-2">
               <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Artist / Stage Name</label>
               <input required name="stageName" onChange={handleChange} value={formData.stageName} className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="e.g. Neon Pulse" />
            </div>
             <div className="md:col-span-2">
               <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Email Address</label>
               <div className="relative">
                 <Mail className="absolute left-3 top-2.5 w-4 h-4 text-kala-500" />
                 <input required type="email" name="email" onChange={handleChange} value={formData.email} className="w-full bg-kala-900 border border-kala-700 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="jane@example.com" />
               </div>
               <p className="text-[10px] text-kala-500 mt-1">A confirmation email with your password will be sent here.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-kala-700/50"></div>

        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Music className="text-purple-400 w-5 h-5" /> Creative Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Location</label>
               <div className="relative">
                 <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-kala-500" />
                 <input required name="location" onChange={handleChange} value={formData.location} className="w-full bg-kala-900 border border-kala-700 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="City, Country" />
               </div>
             </div>
             <div>
               <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Genres</label>
               <input required name="genres" onChange={handleChange} value={formData.genres} className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="Techno, Ambient, Jazz" />
             </div>
             <div className="md:col-span-2">
               <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Skills / Assets</label>
               <input name="skills" onChange={handleChange} value={formData.skills} className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="e.g. Sound Design, Piano, Logic Pro X" />
             </div>
             <div className="md:col-span-2">
               <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Equipment List (Available for Rent/Use)</label>
               <input name="equipment" onChange={handleChange} value={formData.equipment} className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="e.g. Fender Strat, Pioneer CDJs" />
             </div>
             <div className="md:col-span-2">
               <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Bio</label>
               <textarea required name="bio" rows={4} onChange={handleChange} value={formData.bio} className="w-full bg-kala-900 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-kala-secondary resize-none" placeholder="Tell us about your artistic journey..." />
             </div>
          </div>
        </div>

        <div className="border-t border-kala-700/50"></div>

        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Briefcase className="text-green-400 w-5 h-5" /> Professional Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Portfolio / Press Kit URL</label>
               <div className="relative">
                 <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-kala-500" />
                 <input name="portfolioUrl" onChange={handleChange} value={formData.portfolioUrl} className="w-full bg-kala-900 border border-kala-700 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="https://..." />
               </div>
             </div>
             <div>
               <label className="block text-xs text-kala-400 mb-1 uppercase font-bold">Standard Rate (Starting)</label>
               <div className="relative">
                 <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-kala-500" />
                 <input name="ratePerGig" onChange={handleChange} value={formData.ratePerGig} className="w-full bg-kala-900 border border-kala-700 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-kala-secondary" placeholder="500" />
               </div>
             </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-kala-secondary text-kala-900 font-bold py-4 rounded-xl hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20">
           <Save className="w-5 h-5" /> Save Profile & Register
        </button>
      </form>
    </div>
  );
};

export default ArtistRegistration;
