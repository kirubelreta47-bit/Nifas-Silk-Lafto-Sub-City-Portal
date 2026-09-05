export type SystemStatus = 'production' | 'development' | 'testing' | 'planned';

export type SystemCategory = 
  | 'citizen_services' 
  | 'land_revenue' 
  | 'infrastructure_waste' 
  | 'health_safety' 
  | 'administration';

export interface SubCitySystem {
  id: string;
  name: string;
  amharicName: string;
  category: SystemCategory;
  categoryLabel: string;
  status: SystemStatus;
  statusLabel: string;
  description: string;
  department: string;
  activeUsers: number;
  completionProgress?: number; // 0 to 100 for 'development' status
  launchedYear?: number;
  woredasServed: number;
  uptime: string;
  dailyTransactions: number;
  iconName: string;
  features: string[];
  techStack: string[];
  leadOfficer: string;
  demoType: 'civil_id' | 'tax_calc' | 'land_cadastre' | 'permit_portal' | 'grievance_desk' | 'traffic_cam' | 'waste_dispatch' | 'health_tracker' | 'generic';
}

export interface WoredaInfo {
  id: number;
  numberStr: string;
  name: string;
  amharicName: string;
  neighborhoods: string[];
  population: number;
  systemsActive: number;
  officeLocation: string;
  status: 'Full Digital Network' | 'Fiber Upgraded';
  chiefOfficer: string;
}

export interface LandmarkInfo {
  id: string;
  name: string;
  amharicName: string;
  category: 'Commercial' | 'Diplomatic' | 'Government' | 'Hospitality & Leisure' | 'Safety & Services' | 'Urban Ecology';
  location: string;
  woreda: string;
  description: string;
  highlights: string[];
  icon: string;
}

export interface SystemMetrics {
  totalSystems: number;
  inProduction: number;
  inDevelopment: number;
  inTesting: number;
  connectedWoredas: number;
  dailyCitizenRequests: number;
  averageUptime: string;
}

export type AuctionStatus = 'Live' | 'Upcoming' | 'Ended';

export interface AuctionItem {
  id: string;
  title: string;
  category: string;
  description: string;
  location?: string; // Place / Woreda / Office location
  imageUrl?: string; // Optional image (only displayed inside details modal)
  externalLink?: string;
  linkButtonLabel?: string;
  startingPrice: number; // in ETB (Ethiopian Birr)
  currentBid?: number;
  bidIncrement?: number;
  startDate: string; // ISO string e.g. 2026-09-05T12:00
  endDate: string;   // ISO string e.g. 2026-09-08T18:00
  status?: string;
  createdAt?: string;
}

export interface SupabaseAuctionRow {
  id: string;
  title: string;
  category: string;
  description: string | null;
  image_url: string | null;
  external_link: string | null;
  external_link_label: string | null;
  starting_price: number;
  current_bid?: number | null;
  bid_increment?: number | null;
  start_time: string | null;
  end_time: string;
  status: string | null;
  created_at: string;
}


