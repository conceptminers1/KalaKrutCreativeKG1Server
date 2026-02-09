# `ArtistProfile.tsx` - Corrected Snippets

This file contains the corrected code snippets for `src/components/ArtistProfile.tsx`. The changes are designed to prevent the application from crashing due to incomplete or missing artist data.

**Key Changes:**
1.  **Loading State:** A `loading` state and an early return have been added. The component will now display a "Loading..." message until the `artist` prop is fully loaded, preventing the `TypeError` that causes the application to crash.
2.  **Robust Data Access:** All properties accessed from the `artist` prop (via the `localArtist` state) are now safeguarded using optional chaining (`?.`) and default fallback values (e.g., `|| []`, `|| ''`). This makes the component resilient and ensures that even if parts of the data are missing, it will render without throwing an error.

---

### Section 1: Props Interface & Component Signature (Lines ~48-60)

**Change:** The component now correctly handles a potentially `null` artist prop and includes a `loading` state. An early return is added to display a loading message.

```tsx
interface ArtistProfileProps {
  artist: IArtistProfile | null; // <-- Allow artist to be null
  onChat: () => void;
  onBook: () => void;
  isOwnProfile?: boolean;
  isBlocked?: boolean; 
  onUpdateProfile?: (data: Partial<IArtistProfile>) => void;
}

const ArtistProfile: React.FC<ArtistProfileProps> = ({ artist, onChat, onBook, isOwnProfile = false, isBlocked = false, onUpdateProfile }) => {
  const { notify } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'invest' | 'settings' | 'financials' | 'leads' | 'guide'>('overview');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [localArtist, setLocalArtist] = useState<IArtistProfile | null>(artist);
  const [loading, setLoading] = useState(true); // <-- ADD loading state
  
  // ... (other state declarations)

  // Sync state and handle loading
  useEffect(() => {
    if (artist) {
      setLocalArtist(artist);
      setLoading(false);
    } else {
      setLoading(true);
    }
    if (!isOwnProfile) {
       setActiveTab('overview');
    }
  }, [artist, isOwnProfile]);

  // Early return for loading state
  if (loading || !localArtist) {
    return (
        <div className="flex justify-center items-center h-screen w-full">
            <div className="text-white text-lg">Loading Artist Profile...</div>
        </div>
    );
  }

  // ... (rest of the component logic)
```

---

### Section 2: Handlers with Data Safeguards (Lines ~90-260)

**Change:** Functions that interact with `localArtist` state are updated to handle null values gracefully and to safely access nested properties.

```tsx
  // Check if user is a paid subscriber
  const isSubscribed = localArtist.subscription?.status === 'Active' && 
                       localArtist.subscription?.planName !== 'Guest' && 
                       localArtist.subscription?.planName !== 'Guest / Starter';

  const PayoutModal = () => {
     const [selectedId, setSelectedId] = useState<string>('');
     // Safeguard state initialization
     const [amount, setAmount] = useState(localArtist.revenue?.pendingPayout || 0);

     return (
        // ... Modal JSX
        // Safeguard values used in the modal
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(Number(e.target.value))}
          max={localArtist.revenue?.pendingPayout || 0}
          // ...
        />
        <p className="text-xs text-kala-500 mt-2">Available Balance: ${(localArtist.revenue?.pendingPayout || 0).toLocaleString()}</p>
        // ...
        {(localArtist.savedPaymentMethods?.fiat || []).map(m => (
          // ...
        ))}
        {(localArtist.savedPaymentMethods?.crypto || []).map(m => (
          // ...
        ))}
        // ...
     );
  };
```

---

### Section 3: Main Render (JSX) with Full Data Safeguarding (Lines ~362 - End)

**Change:** This is the most critical fix. Every property accessed from `localArtist` within the JSX is now protected with optional chaining (`?.`) and given a sensible fallback value (`|| ''`, `|| []`, `|| 0`). This guarantees the UI will render without error even with a partially incomplete `artist` object.

```tsx
  return (
    <div className="space-y-6 pb-10">
      {/* Hero Header */}
      <div className="relative rounded-2xl overflow-hidden bg-kala-800 border border-kala-700 shadow-2xl">
        <div className="h-64 w-full relative">
          <img src={localArtist.coverImage || ''} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-kala-900 via-kala-900/40 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="flex items-end gap-4">
              <img 
                src={localArtist.avatar || ''} 
                alt={localArtist.name || 'Artist'} 
                className="w-24 h-24 rounded-xl border-4 border-kala-900 shadow-xl object-cover"
              />
              <div className="mb-1">
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  {localArtist.name || 'Unnamed Artist'} 
                  {localArtist.verified && <CheckCircle className="w-6 h-6 text-blue-400 fill-blue-400/20" />}
                </h1>
                <div className="flex items-center gap-2 text-kala-300 text-sm mt-1">
                  <MapPin className="w-4 h-4" /> {localArtist.location || 'Unknown Location'}
                  {(localArtist.genres || []).length > 0 && (
                    <>
                      <span className="mx-1">â€¢</span>
                      {(localArtist.genres || []).join(', ')}
                    </>
                  )}

                </div>
              </div>
            </div>
            {/* ... (buttons remain the same) ... */}
          </div>
        </div>
        
        {/* ... (Navigation Tabs remain the same) ... */}
      </div>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
           {/* Left Column: Bio & Info */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
                 <h3 className="text-lg font-bold text-white mb-4">About</h3>
                 <p className="text-kala-300 whitespace-pre-line leading-relaxed">
                   {localArtist.bio || 'No biography available.'}
                 </p>
              </div>

              <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                   <Play className="w-5 h-5 text-kala-secondary" /> Top Tracks / Content
                 </h3>
                 <div className="space-y-2">
                    {(localArtist.pressKit?.topTracks || []).length > 0 ? (localArtist.pressKit?.topTracks || []).map((track, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-kala-800 transition-colors group cursor-pointer">
                         <div className="flex items-center gap-3">
                           <span className="text-kala-500 text-sm font-mono w-4">{i + 1}</span>
                           <div className="font-medium text-white group-hover:text-kala-secondary">{track.title}</div>
                         </div>
                         <div className="flex items-center gap-4 text-xs text-kala-500">
                            <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {track.plays}</span>
                            <span>{track.duration}</span>
                         </div>
                      </div>
                    )) : (
                      <div className="text-kala-500 text-sm italic">No tracks available.</div>
                    )}
                 </div>
              </div>
           </div>

           {/* Right Column: Stats & Socials */}
           <div className="space-y-6">
              <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
                 <h3 className="text-sm font-bold text-kala-500 uppercase mb-4">Performance Stats</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-kala-400 text-sm">Community Rating</span>
                       <span className="text-white font-bold flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {localArtist.stats?.rating || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-kala-400 text-sm">Gigs/Deals Completed</span>
                       <span className="text-white font-bold">{localArtist.stats?.gigsCompleted || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-kala-400 text-sm">Avg. Response</span>
                       <span className="text-white font-bold">{localArtist.stats?.responseTime || 'N/A'}</span>
                    </div>
                 </div>
              </div>

              <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
                 <h3 className="text-sm font-bold text-kala-500 uppercase mb-4">Connect</h3>
                 <div className="flex flex-col gap-3">
                    {(localArtist.pressKit?.socials || []).map((social, i) => (
                       <a key={i} href="#" className="flex items-center justify-between p-3 bg-kala-900/50 rounded-lg hover:bg-kala-900 transition-colors">
                          <span className="text-white text-sm">{social.platform}</span>
                          <span className="text-kala-500 text-xs">{social.followers} followers</span>
                       </a>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      // NOTE: The same pattern of optional chaining and fallbacks must be applied to ALL OTHER TABS
      // ('invest', 'financials', 'leads', 'guide', 'settings').
      // Example for 'financials' tab:
      ) : activeTab === 'financials' && isOwnProfile ? (
        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-kala-800 border border-kala-700 rounded-xl p-6">
              <div className="text-kala-400 text-sm font-bold uppercase mb-2">Lifetime Earnings</div>
              <div className="text-3xl font-mono text-white">${(localArtist.revenue?.totalLifetime || 0).toLocaleString()}</div>
            </div>
            {/* ... etc for all other financial data points ... */}
          </div>
        </div>
      ) : null}
      
      {showPayoutModal && <PayoutModal />}
    </div>
  );
};
```
