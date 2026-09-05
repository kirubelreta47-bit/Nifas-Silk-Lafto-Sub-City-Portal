import { AuctionItem, AuctionStatus } from '../types';

// Helper to format ISO date strings relative to today
const now = new Date();
const addHours = (hours: number) => new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString().slice(0, 16);
const addDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
const subDays = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

export const DEFAULT_CATEGORIES = [
  'Art',
  'Electronics',
  'Collectibles',
  'Vehicles & Fleet',
  'Machinery & Equipment',
  'Office Assets'
];

export const INITIAL_MOCK_AUCTIONS: AuctionItem[] = [
  {
    id: 'auc-01',
    title: 'Heritage Amharic Calligraphy & Illuminated Manuscript',
    category: 'Art',
    description: 'Authentic hand-scribed Ethiopian parchment scroll adorned with traditional mineral pigments, framed in reclaimed Wanza hardwood. Certified by the Addis Ababa Heritage & Cultural Preservation Directorate.',
    location: 'Woreda 03 (Mekanisa Artisan Center)',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    externalLink: 'https://en.wikipedia.org/wiki/Ethiopian_art',
    linkButtonLabel: 'View Authenticity Proof',
    startingPrice: 35000,
    startDate: subDays(1),
    endDate: addDays(2), // Ends in ~2 days (Live)
    createdAt: subDays(2)
  },
  {
    id: 'auc-02',
    title: 'Sub-City ICT Core Enterprise 42U Server Rack & Dual PDU',
    category: 'Electronics',
    description: 'Decommissioned high-density enterprise server cabinet equipped with dual smart metered PDUs, redundant 10Gbps optical fiber patch panels, and temperature airflow sensors from Woreda 03 data center upgrade.',
    location: 'Woreda 01 (Central ICT Facility)',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    externalLink: 'https://en.wikipedia.org/wiki/Server_room',
    linkButtonLabel: 'View Hardware Specs',
    startingPrice: 165000,
    startDate: subDays(2),
    endDate: addHours(18), // Ends in ~18 hours (Live, ending soon)
    createdAt: subDays(3)
  },
  {
    id: 'auc-03',
    title: 'Vintage Menelik II Era Commemorative Postal & Telegraph Stamps',
    category: 'Collectibles',
    description: 'Rare historical philatelic collection documenting the dawn of telecommunications in Nifas Silk (1895–1912). Includes official imperial seal cancellations and original diplomatic post covers.',
    location: 'Woreda 02 (Nifas Silk Archival Vault)',
    imageUrl: undefined, // No image provided by admin
    externalLink: 'https://en.wikipedia.org/wiki/Postage_stamps_and_postal_history_of_Ethiopia',
    linkButtonLabel: 'View Historical Archive',
    startingPrice: 52000,
    startDate: subDays(3),
    endDate: addDays(4), // Ends in ~4 days (Live)
    createdAt: subDays(4)
  },
  {
    id: 'auc-04',
    title: 'Municipal Precision Optical Theodolite (1960s Surveying Cadastre)',
    category: 'Collectibles',
    description: 'Heavy solid brass precision engineering transit theodolite housed in its original mahogany field box. Used during early metropolitan boundary demarcations across the southern district.',
    location: 'Woreda 06 (Kera Cadastre Office)',
    imageUrl: undefined, // No image provided by admin
    externalLink: 'https://en.wikipedia.org/wiki/Theodolite',
    linkButtonLabel: 'View Cadastre Records',
    startingPrice: 48000,
    startDate: subDays(7),
    endDate: subDays(1), // Ended yesterday (Ended status)
    createdAt: subDays(10)
  },
  {
    id: 'auc-05',
    title: 'Commercial Heavy-Duty All-Terrain Municipal Patrol Utility Unit',
    category: 'Vehicles & Fleet',
    description: 'Scheduled for upcoming public surplus auction. 4x4 municipal utility vehicle inspected by Addis Ababa Transport Bureau with complete maintenance log and clear ownership transfer documentation.',
    location: 'Woreda 08 (Jemo Transport Yard)',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    externalLink: 'https://en.wikipedia.org/wiki/Off-road_vehicle',
    linkButtonLabel: 'Inspection Report',
    startingPrice: 950000,
    startDate: addDays(2), // Starts in 2 days (Upcoming)
    endDate: addDays(9),
    createdAt: now.toISOString().slice(0, 16)
  }
];

export function calculateAuctionStatus(item: AuctionItem): AuctionStatus {
  const currentTime = Date.now();
  const startTime = new Date(item.startDate).getTime();
  const endTime = new Date(item.endDate).getTime();

  if (isNaN(startTime) || isNaN(endTime)) return 'Live';
  if (currentTime < startTime) return 'Upcoming';
  if (currentTime > endTime) return 'Ended';
  return 'Live';
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isEnded: boolean;
  isUpcoming: boolean;
}

export function getTimeRemaining(targetDateStr: string, startDateStr?: string): TimeRemaining {
  const nowMs = Date.now();
  const endMs = new Date(targetDateStr).getTime();
  const startMs = startDateStr ? new Date(startDateStr).getTime() : 0;

  if (startDateStr && nowMs < startMs) {
    const diff = Math.max(0, startMs - nowMs);
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      totalMs: diff,
      isEnded: false,
      isUpcoming: true
    };
  }

  const diff = Math.max(0, endMs - nowMs);
  const isEnded = diff <= 0;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    totalMs: diff,
    isEnded,
    isUpcoming: false
  };
}
