import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuctionItem, SupabaseAuctionRow } from '../types';
import { INITIAL_MOCK_AUCTIONS, DEFAULT_CATEGORIES } from '../data/auctionsData';
import { supabase } from '../lib/supabaseClient';
import { sanitizeText, isSafeUrl } from '../utils/security';

interface AuctionsContextType {
  auctions: AuctionItem[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  fetchAuctions: () => Promise<void>;
  addAuction: (item: Omit<AuctionItem, 'id' | 'createdAt'>) => Promise<AuctionItem | null>;
  deleteAuction: (id: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const AuctionsContext = createContext<AuctionsContextType | undefined>(undefined);

// Helper to map a Supabase row to frontend AuctionItem
export function mapRowToAuctionItem(row: SupabaseAuctionRow): AuctionItem {
  let location = 'Sub-City Central Warehouse';
  let cleanDescription = row.description || '';

  if (row.description) {
    const locMatch = row.description.match(/^\[Location:\s*(.*?)\](?:\n+|$)/);
    if (locMatch) {
      location = locMatch[1].trim();
      cleanDescription = row.description.replace(/^\[Location:\s*.*?\](?:\n+|$)/, '').trim();
    }
  }

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: cleanDescription,
    location,
    startingPrice: Number(row.starting_price) || 0,
    currentBid: row.current_bid ? Number(row.current_bid) : undefined,
    bidIncrement: row.bid_increment ? Number(row.bid_increment) : 5,
    startDate: row.start_time ? row.start_time.slice(0, 16) : new Date().toISOString().slice(0, 16),
    endDate: row.end_time ? row.end_time.slice(0, 16) : new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 16),
    imageUrl: row.image_url || undefined,
    externalLink: row.external_link || undefined,
    linkButtonLabel: row.external_link_label || 'View Source',
    status: row.status || undefined,
    createdAt: row.created_at || new Date().toISOString()
  };
}

export const AuctionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auctions, setAuctions] = useState<AuctionItem[]>(INITIAL_MOCK_AUCTIONS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load Auctions from Supabase
  const fetchAuctions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('auctions')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchErr) {
        console.warn('Supabase fetch error, using cached/mock items:', fetchErr.message);
        setError(fetchErr.message);
      } else if (data && data.length > 0) {
        const mapped = (data as SupabaseAuctionRow[]).map(mapRowToAuctionItem);
        setAuctions(mapped);
      } else {
        // Table is empty, keep initial mock auctions
        setAuctions(INITIAL_MOCK_AUCTIONS);
      }
    } catch (err: any) {
      console.error('Unexpected error fetching auctions:', err);
      setError(err?.message || 'Failed to fetch auctions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  // Dynamic categories list
  const categories = React.useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    auctions.forEach((a) => {
      if (a.category && a.category.trim()) {
        set.add(a.category.trim());
      }
    });
    return Array.from(set);
  }, [auctions]);

  // Add Auction with security sanitization and Supabase persistence
  const addAuction = async (item: Omit<AuctionItem, 'id' | 'createdAt'>): Promise<AuctionItem | null> => {
    // 1. Run administrator inputs through security.ts sanitizers
    const sanitizedTitle = sanitizeText(item.title);
    const sanitizedCategory = sanitizeText(item.category);
    const sanitizedLocation = sanitizeText(item.location || 'Sub-City Central Warehouse');
    const sanitizedDesc = sanitizeText(item.description || '');
    const sanitizedLabel = sanitizeText(item.linkButtonLabel || 'View Source');

    const cleanImg = item.imageUrl && isSafeUrl(item.imageUrl) ? item.imageUrl.trim() : null;
    const cleanExt = item.externalLink && isSafeUrl(item.externalLink) ? item.externalLink.trim() : null;

    const formattedDescription = sanitizedLocation
      ? `[Location: ${sanitizedLocation}]\n\n${sanitizedDesc}`
      : sanitizedDesc;

    const payload = {
      title: sanitizedTitle,
      category: sanitizedCategory,
      description: formattedDescription,
      starting_price: Number(item.startingPrice),
      current_bid: Number(item.startingPrice),
      bid_increment: 5,
      start_time: new Date(item.startDate).toISOString(),
      end_time: new Date(item.endDate).toISOString(),
      image_url: cleanImg,
      external_link: cleanExt,
      external_link_label: sanitizedLabel,
      status: 'active'
    };

    try {
      const { data, error: insertErr } = await supabase
        .from('auctions')
        .insert([payload])
        .select();

      if (insertErr) {
        console.error('Supabase insert error:', insertErr);
        throw new Error(insertErr.message);
      }

      if (data && data[0]) {
        const newItem = mapRowToAuctionItem(data[0] as SupabaseAuctionRow);
        setAuctions((prev) => [newItem, ...prev]);
        return newItem;
      }
    } catch (err: any) {
      console.error('Failed to add auction to Supabase:', err);
      // Fallback local addition if network fails
      const fallbackItem: AuctionItem = {
        id: `auc-${Date.now().toString().slice(-6)}`,
        title: sanitizedTitle,
        category: sanitizedCategory,
        location: sanitizedLocation,
        description: sanitizedDesc,
        startingPrice: Number(item.startingPrice),
        currentBid: Number(item.startingPrice),
        bidIncrement: 5,
        startDate: item.startDate,
        endDate: item.endDate,
        imageUrl: cleanImg || undefined,
        externalLink: cleanExt || undefined,
        linkButtonLabel: sanitizedLabel,
        status: 'active',
        createdAt: new Date().toISOString().slice(0, 16)
      };
      setAuctions((prev) => [fallbackItem, ...prev]);
      return fallbackItem;
    }

    return null;
  };

  // Delete Auction from Supabase and local state
  const deleteAuction = async (id: string): Promise<void> => {
    // Optimistically update local state
    setAuctions((prev) => prev.filter((a) => a.id !== id));

    try {
      const { error: delErr } = await supabase
        .from('auctions')
        .delete()
        .eq('id', id);

      if (delErr) {
        console.error('Supabase delete error:', delErr);
      }
    } catch (err) {
      console.error('Unexpected error deleting auction from Supabase:', err);
    }
  };

  const resetToDefaults = async (): Promise<void> => {
    await fetchAuctions();
  };

  return (
    <AuctionsContext.Provider
      value={{
        auctions,
        categories,
        isLoading,
        error,
        fetchAuctions,
        addAuction,
        deleteAuction,
        resetToDefaults
      }}
    >
      {children}
    </AuctionsContext.Provider>
  );
};

export const useAuctions = (): AuctionsContextType => {
  const context = useContext(AuctionsContext);
  if (!context) {
    throw new Error('useAuctions must be used within an AuctionsProvider');
  }
  return context;
};
