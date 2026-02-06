
// src/services/knowledgeGraphService.ts

import { MOCK_ROSTER } from '../mockData';
import { UserRole, RosterMember } from '../types';

// --- Explicit Data Definition for Reusability ---

// Define Node interface for clarity
interface Node {
  id: string;
  label: string;
  type: 'Artist' | 'Venue' | 'Sponsor' | 'DAO Governor' | 'Service' | 'Treasury';
}

// Define Edge interface for clarity
interface Edge {
  source: string;
  target: string;
  label: 'PLAYS_AT' | 'SPONSORED_BY' | 'USES_SERVICE' | 'OVERSEES' | 'CONNECTED_TO';
}

// Helper to find mock users safely
const artist = MOCK_ROSTER.find(m => m.role === UserRole.ARTIST);
const venue = MOCK_ROSTER.find(m => m.role === UserRole.VENUE);
const sponsor = MOCK_ROSTER.find(m => m.role === UserRole.SPONSOR);
const daoGovernor = MOCK_ROSTER.find(m => m.role === UserRole.DAO_GOVERNOR);

// Exportable Nodes and Edges for database seeding or other uses
export const INITIAL_NODES: Node[] = [
  ...(artist ? [{ id: artist.id, label: artist.name, type: 'Artist' as const }] : []),
  ...(venue ? [{ id: venue.id, label: venue.name, type: 'Venue' as const }] : []),
  ...(sponsor ? [{ id: sponsor.id, label: sponsor.name, type: 'Sponsor' as const }] : []),
  ...(daoGovernor ? [{ id: daoGovernor.id, label: daoGovernor.name, type: 'DAO Governor' as const }] : []),
  { id: 'service_legal', label: 'Legal Eagle', type: 'Service' },
  { id: 'treasury_main', label: 'Main Treasury', type: 'Treasury' },
];

export const INITIAL_EDGES: Edge[] = [
  // Artist connections
  ...(artist && venue ? [{ source: artist.id, target: venue.id, label: 'PLAYS_AT' as const }] : []),
  ...(artist && sponsor ? [{ source: artist.id, target: sponsor.id, label: 'SPONSORED_BY' as const }] : []),
  ...(artist ? [{ source: artist.id, target: 'service_legal', label: 'USES_SERVICE' as const }] : []),

  // DAO Governor connections
  ...(daoGovernor && artist ? [{ source: daoGovernor.id, target: artist.id, label: 'OVERSEES' as const }] : []),
  ...(daoGovernor && venue ? [{ source: daoGovernor.id, target: venue.id, label: 'OVERSEES' as const }] : []),
  ...(daoGovernor && sponsor ? [{ source: daoGovernor.id, target: sponsor.id, label: 'OVERSEES' as const }] : []),
  ...(daoGovernor ? [{ source: daoGovernor.id, target: 'treasury_main', label: 'CONNECTED_TO' as const }] : []),
];


// --- KnowledgeGraph Class Implementation ---

class KnowledgeGraph {
  private connections: Map<string, string[]>;
  public nodes: Node[];
  public edges: Edge[];

  constructor() {
    this.connections = new Map();
    this.nodes = [];
    this.edges = [];
  }

  /**
   * Loads nodes and edges and builds the internal connection map.
   */
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

  /**
   * Retrieves all connections for a given entity ID.
   */
  public getConnections(id: string): string[] {
    return this.connections.get(id) || [];
  }

  /**
   * Retrieves the full community roster and enriches it with dynamic properties.
   */
  public getRosterMembers(): (RosterMember & { protected?: boolean })[] {
    return MOCK_ROSTER.map(member => ({
      ...member,
      // Simulate a protected user for guest view demonstration
      protected: member.role === UserRole.SPONSOR
    }));
  }

  /**
   * Simulates running a complex query against the knowledge graph to find leads.
   * In a real system, this would involve graph traversal and pattern matching.
   */
  public findLeads(query: string): any[] {
    // Mock implementation based on query keywords
    if (query.includes('releases') && query.includes('no upcoming events')) {
      return [
        { id: 'ai-l1', name: 'DJ Quantum', reason: 'Has 3 new tracks, zero upcoming gigs.' },
        { id: 'ai-l2', name: 'The Vinylists', reason: 'Album dropped last month, no tour dates.' }
      ];
    }
    return [];
  }
}

// --- Singleton Instantiation ---

const knowledgeGraph = new KnowledgeGraph();
knowledgeGraph.loadData(INITIAL_NODES, INITIAL_EDGES);

export { knowledgeGraph };
