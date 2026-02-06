### File: `src/components/ArtistProfile.tsx`

---

#### **1. Add New Imports**

At the top of the file, near the other `import` statements (around **line 5**), add the following imports for the search functionality and icons.

```tsx
import { searchArtist } from '../services/musicBrainzService';
import { Artist } from '../types';
```

Also, make sure the `Search` icon is imported from `lucide-react`. If it's not already there, add it to the existing import (around **line 8**).

```tsx
import {
  //... other icons
  Search,
  //... other icons
} from 'lucide-react';
```

---

#### **2. Add New State Variables**

Inside the `ArtistProfile` component function, add the following state variables to handle the search input, results, and loading state. A good place is after the existing `useState` declarations (around **line 45**).

```tsx
  const [artistQuery, setArtistQuery] = useState('');
  const [artistResults, setArtistResults] = useState<Artist[]>([]);
  const [isSearching, setIsSearching] = useState(false);
```

---

#### **3. Add the Search Handler Function**

Add the following function inside the `ArtistProfile` component to handle the logic for searching artists via the MusicBrainz API. A good place is after the `handleSubscribe` function (around **line 120**).

```tsx
  const handleArtistSearch = async () => {
    if (!artistQuery) {
        notify("Please enter an artist name to search.", "warning");
        return;
    }
    setIsSearching(true);
    const results = await searchArtist(artistQuery);
    setArtistResults(results);
    setIsSearching(false);
    notify(`Found ${results.length} artists.`, "success");
  };
```

---

#### **4. Add the MusicBrainz Search UI**

In the JSX returned by the `ArtistProfile` component, find the section for the `leads` tab. It starts with `activeTab === 'leads' && isOwnProfile ? (...)`.

Inside this `div`, place the following code snippet. A good location is right after the "LeadGeniusAI History" block and before the "Manual Entry Form" block (around **line 705**).

```tsx
           {/* MusicBrainz Artist Search */}
           <div className="bg-kala-900/50 border border-kala-800 rounded-xl p-6 mt-6">
               <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Search className="w-4 h-4 text-teal-400" /> MusicBrainz Artist Search
               </h4>
               <div className="flex gap-2">
                   <input
                       type="text"
                       value={artistQuery}
                       onChange={(e) => setArtistQuery(e.target.value)}
                       className="flex-grow bg-kala-800 border border-kala-700 rounded-lg px-4 py-2 text-white outline-none focus:border-teal-500"
                       placeholder="e.g., Nirvana, Daft Punk..."
                   />
                   <button
                       onClick={handleArtistSearch}
                       disabled={isSearching}
                       className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                       {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                       {isSearching ? 'Searching...' : 'Search'}
                   </button>
               </div>
               <p className="text-xs text-kala-500 mt-2">
                   * Search for artists on MusicBrainz to discover new talent.
               </p>
           </div>

           {/* Artist Search Results */}
           {artistResults.length > 0 && (
               <div className="bg-kala-800/40 border border-kala-700/80 rounded-xl mt-6">
                   <div className="p-4 border-b border-kala-700">
                       <h3 className="font-bold text-white">Artist Search Results</h3>
                   </div>
                   <div className="overflow-x-auto">
                       <table className="w-full text-sm text-left">
                           <thead className="text-xs text-kala-400 uppercase bg-kala-800/60">
                               <tr>
                                   <th className="px-6 py-3">Name</th>
                                   <th className="px-6 py-3">Disambiguation</th>
                                   <th className="px-6 py-3 text-center">Actions</th>
                               </tr>
                           </thead>
                           <tbody>
                               {artistResults.map(artist => (
                                   <tr key={artist.id} className="border-b border-kala-800 hover:bg-kala-800/50">
                                       <td className="px-6 py-4 font-medium text-white">{artist.name}</td>
                                       <td className="px-6 py-4 text-kala-300">{artist.bio}</td>
                                       <td className="px-6 py-4 text-center">
                                           <button className="text-indigo-400 hover:text-indigo-300">Add as Lead</button>
                                       </td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>
               </div>
           )}
```

---
