import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuctionItem, SupabaseAuctionRow } from '../types';
import { INITIAL_MOCK_AUCTIONS, DEFAULT_CATEGORIES, isoToDatetimeLocal, isPersistedAuctionId } from '../data/auctionsData';
import { supabase } from '../lib/supabaseClient';
import { sanitizeText, isSafeUrl } from '../utils/security';

export type AuctionWriteResult = {
  item: AuctionItem;
  persisted: boolean;
};

interface AuctionsContextType {
  auctions: AuctionItem[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  isUsingDemoData: boolean;
  fetchAuctions: () => Promise<void>;
  addAuction: (item: Omit<AuctionItem, 'id' | 'createdAt'>) => Promise<AuctionWriteResult>;
  updateAuction: (id: string, item: Omit<AuctionItem, 'id' | 'createdAt'>) => Promise<AuctionWriteResult>;
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
    startDate: isoToDatetimeLocal(row.start_time),
    endDate: isoToDatetimeLocal(row.end_time),
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
  const [isUsingDemoData, setIsUsingDemoData] = useState<boolean>(true);

  const buildPayload = (item: Omit<AuctionItem, 'id' | 'createdAt'>) => {
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

    return {
      sanitizedTitle,
      sanitizedCategory,
      sanitizedLocation,
      sanitizedDesc,
      sanitizedLabel,
      cleanImg,
      cleanExt,
      payload: {
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
      }
    };
  };

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
        console.warn('Supabase fetch error, using demo catalog:', fetchErr.message);
        setError(fetchErr.message);
        setAuctions(INITIAL_MOCK_AUCTIONS);
        setIsUsingDemoData(true);
      } else if (data && data.length > 0) {
        const mapped = (data as SupabaseAuctionRow[]).map(mapRowToAuctionItem);
        setAuctions(mapped);
        setIsUsingDemoData(false);
      } else {
        setAuctions(INITIAL_MOCK_AUCTIONS);
        setIsUsingDemoData(true);
      }
    } catch (err: any) {
      console.error('Unexpected error fetching auctions:', err);
      setError(err?.message || 'Failed to fetch auctions');
      setAuctions(INITIAL_MOCK_AUCTIONS);
      setIsUsingDemoData(true);
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

  const addAuction = async (item: Omit<AuctionItem, 'id' | 'createdAt'>): Promise<AuctionWriteResult> => {
    const { payload } = buildPayload(item);
    const { data, error: insertErr } = await supabase
      .from('auctions')
      .insert([payload])
      .select();

    if (insertErr) {
      throw new Error(insertErr.message);
    }

    if (!data?.[0]) {
      throw new Error('The listing was not saved. No record was returned from the database.');
    }

    const newItem = mapRowToAuctionItem(data[0] as SupabaseAuctionRow);
    setAuctions((prev) => {
      const demoOnly = prev.length === 0 || prev.every((auction) => !isPersistedAuctionId(auction.id));
      return demoOnly ? [newItem] : [newItem, ...prev];
    });
    setIsUsingDemoData(false);
    setError(null);
    return { item: newItem, persisted: true };
  };

  const updateAuction = async (id: string, item: Omit<AuctionItem, 'id' | 'createdAt'>): Promise<AuctionWriteResult> => {
    const built = buildPayload(item);

    if (!isPersistedAuctionId(id)) {
      throw new Error('Sample catalog items cannot be edited in the database. Publish a new listing instead.');
    }

    const { data, error: updateErr } = await supabase
      .from('auctions')
      .update(built.payload)
      .eq('id', id)
      .select();

    if (updateErr) {
      throw new Error(updateErr.message);
    }

    if (!data?.[0]) {
      throw new Error('The listing could not be updated.');
    }

    const updated = mapRowToAuctionItem(data[0] as SupabaseAuctionRow);
    setAuctions((prev) => prev.map((auction) => (auction.id === id ? updated : auction)));
    setError(null);
    return { item: updated, persisted: true };
  };

  const deleteAuction = async (id: string): Promise<void> => {
    const previous = auctions;
    setAuctions((prev) => prev.filter((a) => a.id !== id));

    if (!isPersistedAuctionId(id)) {
      return;
    }

    const { error: delErr } = await supabase
      .from('auctions')
      .delete()
      .eq('id', id);

    if (delErr) {
      setAuctions(previous);
      throw new Error(delErr.message);
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
        isUsingDemoData,
        fetchAuctions,
        addAuction,
        updateAuction,
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
