import React from 'react';
import { useData } from '../contexts/DataContext';
import ArtistProfile from './ArtistProfile';
import { RefreshCw } from 'lucide-react';
// Use the more detailed ArtistProfile type, as this is what the component receives
import { ArtistProfile as IArtistProfile } from '../types';

interface ArtistProfileGateProps {
  // The artist prop is a full artist profile, not just a roster member
  artist: IArtistProfile | null;
  onChat: () => void;
  onBook: () => void;
  isOwnProfile?: boolean;
  isBlocked?: boolean;
  onUpdateProfile?: (data: any) => void;
}

/**
 * This component acts as a safe gatekeeper for the ArtistProfile.
 * It ensures the artist object has all required nested properties before rendering.
 */
const ArtistProfileGate: React.FC<ArtistProfileGateProps> = ({ artist, ...props }) => {
  const { loading } = useData();

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen w-full bg-kala-900">
            <div className="text-white text-lg font-bold flex items-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin"/>
              Loading Profile...
            </div>
        </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-kala-900">
        <div className="text-white text-center">
          <h2 className="text-xl font-bold mb-2">Profile Not Available</h2>
          <p className="text-kala-400">The requested user profile could not be found.</p>
        </div>
      </div>
    );
  }

  // FIX: Create a "safe" artist object by providing default values for nested
  // properties that might be missing from the data source. This prevents crashes
  // inside the ArtistProfile component, like the 'topTracks' error.
  const safeArtist = {
    ...artist,
    pressKit: artist.pressKit || { topTracks: [], photos: [], techRiderUrl: '', socials: [] },
    stats: artist.stats || { gigsCompleted: 0, activeGigs: 0, rating: 0, responseTime: '' },
    revenue: artist.revenue || { totalLifetime: 0, pendingPayout: 0, lastMonth: 0, breakdown: { gigs: 0, merch: 0, royalties: 0, licensing: 0 }, recentPayouts: [] },
    subscription: artist.subscription || { planName: 'None', status: 'Expired', expiryDate: '', supportTier: 'Standard', autoRenew: false }
  };

  // Pass the guaranteed-safe object down to the presentation component.
  return <ArtistProfile artist={safeArtist} {...props} />;
};

export default ArtistProfileGate;
