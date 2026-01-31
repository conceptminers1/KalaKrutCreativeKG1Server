
import { 
  LeaderboardEntry, 
  UserRole, 
  ArtistProfile, 
  MarketplaceItem, 
  RosterMember, 
  ServiceListing, 
  Lead, 
  ForumThread, 
  Article,
  Proposal,
  TreasuryAsset,
  StaffMember,
  ModerationCase,
  SupportTicket
} from './types';

// --- BASE PROFILES FOR EACH ROLE ---

export const MOCK_ARTIST_PROFILE: ArtistProfile = {
  id: 'u_artist',
  name: 'Luna Eclipse',
  avatar: 'https://picsum.photos/seed/u1/200',
  role: UserRole.ARTIST,
  xp: 450,
  level: 2,
  password: 'password123', // Default mock password
  coverImage: 'https://picsum.photos/seed/gig1/1200/400',
  bio: "Electronic synthesis meets classical composition. Based in Brooklyn, Luna Eclipse has been redefining the ambient techno scene since 2021.\n\nMy sets are an immersive journey through sound and light, perfect for intimate venues and large-scale festivals alike.",
  location: 'Brooklyn, NY',
  genres: ['Techno', 'Ambient', 'Electronica'],
  verified: true,
  pressKit: {
    photos: ['https://picsum.photos/seed/gig2/400/400', 'https://picsum.photos/seed/gig3/400/400'],
    topTracks: [
      { title: 'Midnight Protocol', duration: '5:42', plays: '124' },
      { title: 'Neon Rain', duration: '4:15', plays: '98' }
    ],
    techRiderUrl: '#',
    socials: [{ platform: 'Instagram', followers: '45' }, { platform: 'Twitter', followers: '12' }]
  },
  stats: { gigsCompleted: 4, activeGigs: 1, rating: 4.9, responseTime: '< 2 hrs' },
  equityOpportunities: [
    {
      id: 'eq-1',
      title: 'Project: "Neon Horizons" Album',
      type: 'Project Equity',
      description: 'Invest in the production and marketing of the upcoming sophomore album.',
      totalValuation: 5000,
      currency: 'USD',
      equityAvailablePercentage: 20,
      minInvestment: 50,
      tokenSymbol: '$NEON2',
      technology: 'ERC-20',
      termsSummary: 'Investors receive 20% of net royalties for 5 years.',
      riskLevel: 'Medium',
      backersCount: 2
    }
  ],
  subscription: { 
    planName: 'Community Pro', 
    status: 'Active', 
    expiryDate: '2024-10-24', 
    supportTier: 'Priority', 
    autoRenew: true,
    hasLeadGeniusSync: false
  },
  savedPaymentMethods: {
    crypto: [{ id: 'w1', network: 'Ethereum', address: '0x71C...9A23', label: 'Main Vault', isDefault: true }],
    fiat: [{ id: 'c1', type: 'Card', last4: '4242', label: 'Chase Business', isDefault: true }]
  },
  revenue: {
    totalLifetime: 850,
    pendingPayout: 150,
    lastMonth: 340,
    breakdown: {
      gigs: 600,
      merch: 100,
      royalties: 50,
      licensing: 100
    },
    recentPayouts: [
      { date: '2023-09-15', amount: 200, method: 'Crypto (ETH)', status: 'Completed' },
      { date: '2023-08-15', amount: 150, method: 'Bank Transfer', status: 'Completed' }
    ]
  },
  leadQueries: []
};

// Mock Users for Role Switcher
export const MOCK_USERS_BY_ROLE: Record<UserRole, ArtistProfile> = {
  [UserRole.ARTIST]: MOCK_ARTIST_PROFILE,
  [UserRole.VENUE]: { ...MOCK_ARTIST_PROFILE, id: 'u_venue', name: 'The Warehouse', role: UserRole.VENUE, avatar: 'https://picsum.photos/seed/venue1/200', location: 'London, UK' },
  [UserRole.SPONSOR]: { ...MOCK_ARTIST_PROFILE, id: 'u_sponsor', name: 'RedBull Music', role: UserRole.SPONSOR, avatar: 'https://picsum.photos/seed/sponsor1/200', location: 'Global' },
  [UserRole.REVELLER]: { ...MOCK_ARTIST_PROFILE, id: 'u_reveller', name: 'Alex Fan', role: UserRole.REVELLER, avatar: 'https://picsum.photos/seed/fan1/200', level: 2, xp: 150 },
  [UserRole.ADMIN]: { ...MOCK_ARTIST_PROFILE, id: 'u_admin', name: 'System Admin', role: UserRole.ADMIN, avatar: 'https://picsum.photos/seed/admin/200', level: 99 },
  [UserRole.ORGANIZER]: { ...MOCK_ARTIST_PROFILE, id: 'u_org', name: 'Festival Co.', role: UserRole.ORGANIZER, avatar: 'https://picsum.photos/seed/org/200' },
  [UserRole.DAO_MEMBER]: { ...MOCK_ARTIST_PROFILE, id: 'u_dao', name: 'Governor Alice', role: UserRole.DAO_MEMBER, avatar: 'https://picsum.photos/seed/dao/200', level: 5 },
  [UserRole.SERVICE_PROVIDER]: { ...MOCK_ARTIST_PROFILE, id: 'u_service', name: 'Legal Eagle', role: UserRole.SERVICE_PROVIDER, avatar: 'https://picsum.photos/seed/legal/200' }
};

export const MOCK_ROSTER: RosterMember[] = [
  {
    id: 'u_artist',
    name: 'Luna Eclipse',
    role: UserRole.ARTIST,
    avatar: 'https://picsum.photos/seed/u1/200',
    location: 'Brooklyn, NY',
    verified: true,
    assets: {
      ips: 2,
      events: 1,
      services: 2,
      productions: 5,
      nfts: 3
    },
    rating: 4.9,
    subscriberOnly: {
      email: 'booking@lunaeclipse.com',
      phone: '+1 555 019 2834',
      agentContact: 'Creative Artists Agency'
    }
  },
  {
    id: 'r2',
    name: 'The Warehouse',
    role: UserRole.VENUE,
    avatar: 'https://picsum.photos/seed/venue1/200',
    location: 'London, UK',
    verified: true,
    assets: {
      ips: 0,
      events: 1,
      services: 2,
      productions: 0,
      nfts: 10
    },
    rating: 4.8,
    subscriberOnly: {
      email: 'events@thewarehouse.ldn',
      phone: '+44 20 7946 0123',
      agentContact: 'Internal Booking Team'
    }
  },
  {
    id: 'r3',
    name: 'TechStart Inc.',
    role: UserRole.SPONSOR,
    avatar: 'https://picsum.photos/seed/sponsor1/200',
    location: 'San Francisco, CA',
    verified: true,
    assets: {
      ips: 0,
      events: 0,
      services: 2,
      productions: 0,
      nfts: 0
    },
    rating: 5.0,
    subscriberOnly: {
      email: 'partnerships@techstart.io',
      phone: '+1 415 555 0100',
      agentContact: 'Global Brand Director'
    }
  },
    {
    id: 'u_dao',
    name: 'Governor Alice',
    role: UserRole.DAO_MEMBER,
    avatar: 'https://picsum.photos/seed/dao/200',
    location: 'Decentralized',
    verified: true,
    assets: {
      ips: 0,
      events: 0,
      services: 2,
      productions: 0,
      nfts: 0
    },
    rating: 5.0,
    subscriberOnly: {
      email: 'governor.alice@kalakrut.io',
      phone: '',
      agentContact: ''
    }
  }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, user: { ...MOCK_USERS_BY_ROLE[UserRole.ARTIST], name: 'Luna Eclipse', xp: 450 }, badges: ['Early Adopter'], change: 0 },
  { rank: 2, user: { ...MOCK_USERS_BY_ROLE[UserRole.VENUE], name: 'The Warehouse', xp: 320 }, badges: ['Super Host'], change: 0 },
  { rank: 3, user: { ...MOCK_USERS_BY_ROLE[UserRole.REVELLER], name: 'CryptoFan_99', xp: 150 }, badges: ['Collector'], change: 0 },
];

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'PROP-101',
    title: 'Initialize Treasury',
    description: 'Proposal to seed the community treasury with initial grant funding.',
    votesFor: 3,
    votesAgainst: 0,
    deadline: '2023-10-20',
    status: 'Active',
    creator: 'Governor Alice',
    quorumRequired: 20,
    currentParticipation: 100, // 3/3 users voted
    isCritical: true
  }
];

export const MOCK_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: 'm1',
    title: 'Cyberpunk Guitar (Limited Ed.)',
    type: 'Instrument',
    price: 1200,
    currency: 'USD',
    image: 'https://picsum.photos/seed/guitar/400/400',
    seller: { name: 'Neon Pulse', avatar: 'https://picsum.photos/seed/u2/50', verified: true },
    isAuction: false,
    description: 'Custom painted Cyberpunk 2077 themed electric guitar. Modified pickups for extra crunch. Used on stage during the "Neon Nights" tour.',
    condition: 'Like New'
  },
  {
    id: 'm2',
    title: 'Lifetime Backstage Pass NFT',
    type: 'NFT',
    price: 0.5,
    currency: 'ETH',
    image: 'https://picsum.photos/seed/nft1/400/400',
    seller: { name: 'The Warehouse', avatar: 'https://picsum.photos/seed/venue1/50', verified: true },
    isAuction: true,
    endTime: '2d 14h',
    description: 'Granting lifetime backstage access to all events at The Warehouse London. Includes VIP bar access and meet & greet privileges. Tradable on secondary market.',
    condition: 'Digital'
  }
];

export const MOCK_THREADS: ForumThread[] = [
  {
    id: '1',
    title: 'Welcome to the Beta!',
    category: 'General',
    author: 'System Admin',
    authorAvatar: 'https://picsum.photos/seed/admin/50',
    replies: 2,
    views: 12,
    lastActive: '1h ago',
    isPinned: true
  }
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'KalaKrut Launches Beta',
    excerpt: 'Welcome to the future of creative collaboration. We are live with our first cohort of artists.',
    content: 'Full article content here...',
    date: 'Oct 12, 2023',
    author: 'KalaKrut Team',
    image: 'https://picsum.photos/seed/news1/800/400',
    category: 'Announcement'
  }
];

export const MOCK_SERVICES: ServiceListing[] = [
  {
    id: '1',
    title: 'Web3 Grant Writing & Strategy',
    provider: 'CryptoGrants Co.',
    category: 'Grant Writing',
    rate: '150',
    rating: 5.0,
    reviews: 1,
    isPlatformService: false
  }
];

export const MOCK_TREASURY_ASSETS: TreasuryAsset[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: 2.5, valueUsd: 4500, allocation: 25, trend: 'neutral' },
  { symbol: 'USDC', name: 'USD Coin', balance: 10000, valueUsd: 10000, allocation: 55, trend: 'neutral' },
  { symbol: 'KALA', name: 'Kala Token', balance: 50000, valueUsd: 2500, allocation: 20, trend: 'up' }
];

export const MOCK_STAFF: StaffMember[] = [
  {
    id: 'st-1',
    name: 'Sarah Connor',
    role: 'Community Manager',
    department: 'Community',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/staff1/200',
    email: 'sarah@kalakrut.io',
    lastActive: '5 mins ago',
    designation: 'Community Lead',
    employmentDate: '2023-09-01',
    salary: 4000,
    currency: 'USD',
    taxDeductions: 600,
    normalHours: 160,
    hoursWorked: 160,
    overtimeHours: 0,
    overtimePaid: 0,
    leavesAccrued: 2,
    leavesUsed: 0,
    duties: ['Manage Discord', 'Onboard initial users'],
    monthlyTasks: ['Welcome new users', 'Gather feedback']
  }
];

export const MOCK_MODERATION_CASES: ModerationCase[] = [];

export const MOCK_TICKETS: SupportTicket[] = [
  {
     id: 'TK-1001',
     userId: 'u_artist',
     userName: 'Luna Eclipse',
     subject: 'Profile Verification',
     category: 'Account',
     priority: 'Low',
     status: 'Open',
     tier: 'Tier 1',
     createdAt: '2023-10-14 09:00',
     lastUpdate: '2h ago'
  }
];
