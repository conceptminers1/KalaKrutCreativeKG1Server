import { Artist, Member, Release, Track, Venue, Event, Sponsor, Nft, MarketplaceListing, PerformedAt, Wrote, Released, CollaboratedWith, Sponsored, HostedAt, HasMember, Produced, AssociatedWith } from '../data/knowledgeGraphSchema';
import { MOCK_PROPOSALS, MOCK_ROSTER } from '../mockData';

class KnowledgeGraph {
  private nodes: {
    artists: Map<string, Artist>;
    members: Map<string, Member>;
    releases: Map<string, Release>;
    tracks: Map<string, Track>;
    venues: Map<string, Venue>;
    events: Map<string, Event>;
    sponsors: Map<string, Sponsor>;
    nfts: Map<string, Nft>;
    marketplaceListings: Map<string, MarketplaceListing>;
    proposals: any;
  } = {
    artists: new Map(),
    members: new Map(),
    releases: new Map(),
    tracks: new Map(),
    venues: new Map(),
    events: new Map(),
    sponsors: new Map(),
    nfts: new Map(),
    marketplaceListings: new Map(),
    proposals: new Map()
  };

  private edges: {
    performedAt: PerformedAt[];
    wrote: Wrote[];
    released: Released[];
    collaboratedWith: CollaboratedWith[];
    sponsored: Sponsored[];
    hostedAt: HostedAt[];
    hasMember: HasMember[];
    produced: Produced[];
    associatedWith: AssociatedWith[];
  } = {
    performedAt: [],
    wrote: [],
    released: [],
    collaboratedWith: [],
    sponsored: [],
    hostedAt: [],
    hasMember: [],
    produced: [],
    associatedWith: []
  };

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed Artists
    const artist1: Artist = { id: 'artist-1', name: 'Luna Eclipse', bio: 'Electronic music producer & DJ', type: 'person' };
    const artist2: Artist = { id: 'artist-2', name: 'Solaris', bio: 'Ambient soundscapes artist', type: 'person' };
    this.addNode('artists', artist1.id, artist1);
    this.addNode('artists', artist2.id, artist2);

    // Seed Proposals from mockData
    MOCK_PROPOSALS.forEach(p => {
        this.addNode('proposals', p.id, p)
    });
  }

  public addNode<T>(type: keyof typeof this.nodes, id: string, data: T) {
    const collection = this.nodes[type] as Map<string, T>;
    collection.set(id, data);
  }

  public getNode<T>(type: keyof typeof this.nodes, id: string): T | undefined {
    const collection = this.nodes[type] as Map<string, T>;
    return collection.get(id);
  }

  public getAllNodes<T>(type: keyof typeof this.nodes): T[] {
    const collection = this.nodes[type] as Map<string, T>;
    return Array.from(collection.values());
  }

  public addEdge<T>(type: keyof typeof this.edges, edge: T) {
    const collection = this.edges[type] as T[];
    collection.push(edge);
  }

  public getRosterMembers() {
    return MOCK_ROSTER;
  }
}

export const knowledgeGraph = new KnowledgeGraph();
