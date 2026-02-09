
// src/services/knowledgeGraphService.ts

import { 
  MOCK_ROSTER,
  MOCK_USERS_BY_ROLE,
  MOCK_ARTIST_PROFILE
} from '../mockData';
import { UserRole, RosterMember, ArtistProfile } from '../types';

// --- DEFINITIVE DATA MERGING LOGIC ---

/**
 * Creates a single, clean list of users by merging demo stubs with real profiles.
 * This is the single source of truth for all user data in the app.
 */
const getMergedRoster = (): RosterMember[] => {
  const profileMap = new Map<string, ArtistProfile>();

  // 1. Add all base users from the main roster. These have the correct IDs for login.
  MOCK_ROSTER.forEach(member => {
    profileMap.set(member.id, {
      ...MOCK_ARTIST_PROFILE,
      ...member,
    });
  });

  // 2. Merge the REAL user profiles. This overwrites the demo names/avatars with real ones.
  Object.values(MOCK_USERS_BY_ROLE).forEach(realProfile => {
    if (realProfile) {
      const existingProfile = profileMap.get(realProfile.id) || {};
      profileMap.set(realProfile.id, { ...existingProfile, ...realProfile });
    }
  });
  
  return Array.from(profileMap.values());
};

// This finalRoster is the definitive source of user data for the service.
const finalRoster = getMergedRoster();

// --- Corrected Graph and Node Definitions ---

interface Node {
  id: string;
  label: string;
  type: string; // Keep as string to accommodate all roles
}

interface Edge {
  source: string;
  target: string;
  label: 'PLAYS_AT' | 'SPONSORED_BY' | 'USES_SERVICE' | 'OVERSEES' | 'CONNECTED_TO';
}

// Helper to find the CORRECT user profiles from the merged list.
const findUser = (role: UserRole) => finalRoster.find(m => m.role === role);

// Define constants for all user types in the requested order, using the merged roster.
const artist = findUser(UserRole.ARTIST);
const venue = findUser(UserRole.VENUE);
const serviceProvider = findUser(UserRole.SERVICE_PROVIDER);
const organizer = findUser(UserRole.ORGANIZER);
const sponsor = findUser(UserRole.SPONSOR);
const reveller = findUser(UserRole.REVELLER);
const admin = findUser(UserRole.ADMIN);
const daoGovernor = findUser(UserRole.DAO_GOVERNOR);
const daoMember = findUser(UserRole.DAO_MEMBER);

// INITIAL_NODES now correctly uses the REAL names for labels for ALL users.
export const INITIAL_NODES: Node[] = [
  ...(artist ? [{ id: artist.id, label: artist.name, type: 'Artist' }] : []),
  ...(venue ? [{ id: venue.id, label: venue.name, type: 'Venue' }] : []),
  ...(serviceProvider ? [{ id: serviceProvider.id, label: serviceProvider.name, type: 'Service' }] : []),
  ...(organizer ? [{ id: organizer.id, label: organizer.name, type: 'Organizer' }] : []),
  ...(sponsor ? [{ id: sponsor.id, label: sponsor.name, type: 'Sponsor' }] : []),
  ...(reveller ? [{ id: reveller.id, label: reveller.name, type: 'Reveller' }] : []),
  ...(admin ? [{ id: admin.id, label: admin.name, type: 'Admin' }] : []),
  ...(daoGovernor ? [{ id: daoGovernor.id, label: daoGovernor.name, type: 'DAO Governor' }] : []),
  ...(daoMember ? [{ id: daoMember.id, label: daoMember.name, type: 'DAO Member' }] : []),
  { id: 'treasury_main', label: 'Main Treasury', type: 'Treasury' },
];

// Edges remain correct as they use IDs, which are consistent.
export const INITIAL_EDGES: Edge[] = [
  ...(artist && venue ? [{ source: artist.id, target: venue.id, label: 'PLAYS_AT' as const }] : []),
  ...(artist && sponsor ? [{ source: artist.id, target: sponsor.id, label: 'SPONSORED_BY' as const }] : []),
  ...(artist && serviceProvider ? [{ source: artist.id, target: serviceProvider.id, label: 'USES_SERVICE' as const }] : []),
  ...(daoGovernor && artist ? [{ source: daoGovernor.id, target: artist.id, label: 'OVERSEES' as const }] : []),
  ...(daoGovernor && venue ? [{ source: daoGovernor.id, target: venue.id, label: 'OVERSEES' as const }] : []),
  ...(daoGovernor && sponsor ? [{ source: daoGovernor.id, target: sponsor.id, label: 'OVERSEES' as const }] : []),
  ...(daoGovernor ? [{ source: daoGovernor.id, target: 'treasury_main', label: 'CONNECTED_TO' as const }] : []),
];


// --- KnowledgeGraph Class Implementation (Preserved) ---

class KnowledgeGraph {
  private connections: Map<string, string[]>;
  public nodes: Node[];
  public edges: Edge[];

  constructor() {
    this.connections = new Map();
    this.nodes = [];
    this.edges = [];
  }

  public loadData(nodes: Node[], edges: Edge[]): void {
    this.nodes = nodes;
    this.edges = edges;
    this.connections.clear();

    edges.forEach(edge => {
      const targetNode = nodes.find(n => n.id === edge.target);
      const connectionLabel = targetNode ? `${targetNode.type}:${targetNode.label}` : edge.target;
      if (!this.connections.has(edge.source)) {
        this.connections.set(edge.source, []);
      }
      this.connections.get(edge.source)!.push(connectionLabel);

      const sourceNode = nodes.find(n => n.id === edge.source);
      if (sourceNode) {
          const reverseConnectionLabel = `${sourceNode.type}:${sourceNode.label}`;
          if (!this.connections.has(edge.target)) {
              this.connections.set(edge.target, []);
          }
          if (!this.connections.get(edge.target)!.includes(reverseConnectionLabel)) {
            this.connections.get(edge.target)!.push(reverseConnectionLabel);
          }
      }
    });
  }

  public getConnections(id: string): string[] {
    return this.connections.get(id) || [];
  }

  /**
   * Retrieves the full community roster, now correctly named and de-duplicated at the source.
   */
  public getRosterMembers(): (RosterMember & { protected?: boolean })[] {
    return finalRoster.map(member => ({
      ...member,
      protected: member.role === UserRole.SPONSOR
    }));
  }

  public findLeads(query: string): any[] {
    if (query.includes('releases') && query.includes('no upcoming events')) {
      return [
        { id: 'ai-l1', name: 'DJ Quantum', reason: 'Has 3 new tracks, zero upcoming gigs.' },
        { id: 'ai-l2', name: 'The Vinylists', reason: 'Album dropped last month, no tour dates.' }
      ];
    }
    return [];
  }
}

// --- Singleton Instantiation (Preserved) ---

const knowledgeGraph = new KnowledgeGraph();
knowledgeGraph.loadData(INITIAL_NODES, INITIAL_EDGES);

export { knowledgeGraph };
