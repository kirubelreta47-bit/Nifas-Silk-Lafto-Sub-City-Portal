import React, { useState, useEffect } from 'react';
import { 
  Gavel, 
  Clock, 
  ExternalLink, 
  Search, 
  Tag, 
  MapPin,
  Eye,
  ArrowLeft,
  X,
  Settings,
  Calendar,
  Building2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuctions } from '../context/AuctionsContext';
import { calculateAuctionStatus, getTimeRemaining, TimeRemaining } from '../data/auctionsData';
import { AuctionItem, AuctionStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LiveAuctionsPageProps {
  onNavigate: (path: string) => void;
}

// Dynamic real-time ticking countdown timer component for an individual card
const AuctionCountdownBadge: React.FC<{ item: AuctionItem; status: AuctionStatus }> = ({ item, status }) => {
  const { language } = useLanguage();
  const [time, setTime] = useState<TimeRemaining>(() => 
    getTimeRemaining(item.endDate, item.startDate)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeRemaining(item.endDate, item.startDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [item.endDate, item.startDate]);

  if (status === 'Ended' || time.isEnded) {
    return (
      <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-gray-200">
        <Clock className="w-3 h-3 text-gray-400" />
        <span>{language === 'en' ? 'Closed' : 'ተዘግቷል'}</span>
      </div>
    );
  }

  if (status === 'Upcoming' || time.isUpcoming) {
    return (
      <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600" />
        <span>
          {language === 'en' ? 'Starts: ' : 'ጅምር፡ '}
          {time.days > 0 ? `${time.days}d ` : ''}
          {String(time.hours).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  // Live countdown
  const isUrgent = time.days === 0 && time.hours < 12;

  return (
    <div className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border ${
      isUrgent
        ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }`}>
      <Clock className={`w-3 h-3 ${isUrgent ? 'text-rose-600' : 'text-emerald-600'}`} />
      <span>
        {time.days > 0 ? `${time.days}d ` : ''}
        {String(time.hours).padStart(2, '0')}h : {String(time.minutes).padStart(2, '0')}m : {String(time.seconds).padStart(2, '0')}s
      </span>
    </div>
  );
};

export const LiveAuctionsPage: React.FC<LiveAuctionsPageProps> = ({ onNavigate }) => {
  const { auctions, categories, isLoading } = useAuctions();
  const { language } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | 'Live' | 'Upcoming' | 'Ended'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Details modal state
  const [detailModalItem, setDetailModalItem] = useState<AuctionItem | null>(null);

  // Filtered auctions
  const filteredAuctions = auctions.filter((item) => {
    const status = calculateAuctionStatus(item);

    // Category filter
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }

    // Status filter
    if (selectedStatusFilter !== 'All' && status !== selectedStatusFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchLoc = item.location?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat && !matchLoc) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#0f172a] py-8 sm:py-12">
      <div className="w-full max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E5E0D5]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => onNavigate('/')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0348AB] hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Back to Portal Home' : 'ወደ ዋና ገጽ ተመለስ'}</span>
              </button>
              <span className="text-gray-300">•</span>
              <span className="text-xs font-medium text-gray-500">
                {language === 'en' ? 'Civic Commerce & Surplus Auctions' : 'የክፍለ ከተማው የንብረት ጨረታ'}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#0348AB] text-white flex items-center justify-center shadow-xs">
                <Gavel className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14274E] tracking-tight">
                  {language === 'en' ? 'Live Public Auctions' : 'ቀጥታ የህዝብ ጨረታዎች'}
                </h1>
                <p className="text-xs sm:text-sm text-[#6B6558] mt-0.5">
                  {language === 'en'
                    ? 'Nifas Silk-Lafto Sub-City Public Asset, Surplus Equipment & Cultural Memorabilia Auctions.'
                    : 'የነፋስ ስልክ ላፍቶ ክፍለ ከተማ ህጋዊ የንብረት፣ ማሽነሪዎች እና ቅርስ ጨረታዎች ካታሎግ::'}
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E0D5] shadow-2xs mb-8 space-y-4">
          
          {/* Top row: Search & Status tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'en' ? 'Search by title, location, category...' : 'በስም፣ በቦታ ወይም በዘርፍ ፈልግ...'}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 focus:border-[#0348AB] focus:ring-2 focus:ring-[#0348AB]/10 bg-[#FBF9F4]/40 font-medium transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Tabs Filter */}
            <div className="flex items-center gap-1 bg-[#F7F5F0] p-1 rounded-xl border border-[#E5E0D5] self-start md:self-auto overflow-x-auto max-w-full">
              {(['All', 'Live', 'Upcoming', 'Ended'] as const).map((status) => {
                const isSelected = selectedStatusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => setSelectedStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-[#0348AB] text-white shadow-xs'
                        : 'text-gray-600 hover:text-[#0348AB]'
                    }`}
                  >
                    {status === 'All' ? (language === 'en' ? 'All Status' : 'ሁሉም') : status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom row: Category filter buttons */}
          <div className="pt-3 border-t border-[#E5E0D5] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Tag className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Category:' : 'ዘርፍ:'}</span>
            </span>

            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#14274E] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {language === 'en' ? 'All Categories' : 'ሁሉም ዘርፎች'} ({auctions.length})
            </button>

            {categories.map((cat) => {
              const count = auctions.filter((a) => a.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#0348AB] text-white shadow-xs font-bold'
                      : 'bg-[#F7F5F0] text-gray-700 hover:bg-[#eae5d8] border border-[#E5E0D5]'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Auction Cards Grid (NO IMAGES ON FRONT OF CARDS) */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-[#E5E0D5] p-5.5 space-y-4 animate-pulse shadow-xs">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-24 bg-gray-200 rounded-full" />
                  <div className="h-5 w-28 bg-gray-200 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-5 w-3/4 bg-gray-200 rounded-md" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded-md" />
                </div>
                <div className="h-16 bg-[#FAF8F5] rounded-xl border border-gray-100 p-3 flex justify-between items-center">
                  <div className="space-y-1.5">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-5 w-28 bg-gray-200 rounded" />
                  </div>
                  <div className="h-8 w-24 bg-gray-200 rounded-lg" />
                </div>
                <div className="h-10 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredAuctions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E5E0D5] shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0348AB] flex items-center justify-center mx-auto border border-blue-100">
              <Gavel className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-[#14274E]">
                {language === 'en' ? 'No Matching Auctions Found' : 'ምንም የተገኘ ጨረታ የለም'}
              </h3>
              <p className="text-sm text-[#6B6558] max-w-md mx-auto">
                {language === 'en'
                  ? 'Try adjusting your search criteria or category filter, or check back soon for newly published municipal listings.'
                  : 'የፍለጋ ቃላትን ይቀይሩ ወይም አዳዲስ ጨረታዎች ሲወጡ ይመልከቱ::'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedStatusFilter('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {language === 'en' ? 'Clear Filters' : 'ማጣሪያዎችን አጽዳ'}
              </button>
            </div>
          </div>

        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map((item) => {
              const status = calculateAuctionStatus(item);
              const isLive = status === 'Live';
              const isEnded = status === 'Ended';
              const isUpcoming = status === 'Upcoming';

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border border-[#E5E0D5] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 hover:border-[#0348AB]/40 group"
                >
                  
                  {/* Top Meta Header: Status Pill, Category, and Live Countdown */}
                  <div className="space-y-2.5 pb-3 border-b border-gray-100">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        {isLive && (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                            <span>Live</span>
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="inline-flex items-center bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Upcoming
                          </span>
                        )}
                        {isEnded && (
                          <span className="inline-flex items-center bg-gray-200 text-gray-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Ended
                          </span>
                        )}
                        <span className="bg-[#F7F5F0] text-gray-700 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-[#E5E0D5]">
                          {item.category}
                        </span>
                      </div>

                      {/* Ticking countdown */}
                      <AuctionCountdownBadge item={item} status={status} />
                    </div>
                  </div>

                  {/* Body: Title, Location/Place, Description */}
                  <div className="space-y-2.5 flex-1">
                    {/* Item Name / Title */}
                    <h3 className="text-base font-extrabold text-[#14274E] leading-snug group-hover:text-[#0348AB] transition-colors" title={item.title}>
                      {item.title}
                    </h3>

                    {/* Place / Location */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0348AB] bg-blue-50/70 border border-blue-100 px-2.5 py-1 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-[#0348AB]" />
                      <span className="truncate">{item.location || (language === 'en' ? 'Sub-City Central Facility' : 'የክፍለ ከተማው ዋና ማዕከል')}</span>
                    </div>

                    {/* Description snippet */}
                    <p className="text-xs text-[#6B6558] line-clamp-3 leading-relaxed">
                      {item.description || 'Verified municipal surplus lot from Nifas Silk-Lafto Sub-City administration.'}
                    </p>
                  </div>

                  {/* Pricing Box: ONLY Starting Bid in ETB (Ethiopian Birr) */}
                  <div className="bg-[#F7F5F0] rounded-xl p-3.5 border border-[#E5E0D5] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                        {language === 'en' ? 'Starting Bid' : 'የመነሻ ዋጋ'}
                      </span>
                      <div className="text-base sm:text-lg font-extrabold text-[#14274E]">
                        ETB {item.startingPrice.toLocaleString()} <span className="text-xs font-semibold text-gray-500">ብር</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        {language === 'en' ? 'Currency' : 'የገንዘብ አይነት'}
                      </span>
                      <span className="text-xs font-bold text-[#0348AB] bg-white px-2 py-0.5 rounded border border-gray-200">
                        ETB
                      </span>
                    </div>
                  </div>

                  {/* Actions Row: View Details Button & External Link */}
                  <div className="pt-1 flex items-center gap-2">
                    {/* View Details Button */}
                    <button
                      onClick={() => setDetailModalItem(item)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#0348AB] hover:bg-[#02337a] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'View Details' : 'ሙሉ መረጃ እይ'}</span>
                    </button>

                    {/* External Link if provided */}
                    {item.externalLink && (
                      <a
                        href={item.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl border border-gray-300 hover:border-[#0348AB] text-gray-700 hover:text-[#0348AB] bg-white text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                        title={item.linkButtonLabel || 'View Proof'}
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                        <span className="truncate max-w-[90px]">{item.linkButtonLabel || 'Proof'}</span>
                      </a>
                    )}
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* AUCTION DETAILS MODAL (Shows picture ONLY if admin entered one) */}
      <AnimatePresence>
        {detailModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-200 relative my-8"
            >
              {/* Close button */}
              <button
                onClick={() => setDetailModalItem(null)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0348AB] flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    {language === 'en' ? 'Auction Information' : 'የጨረታ ዝርዝር መረጃ'}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="bg-[#F7F5F0] text-gray-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-[#E5E0D5]">
                      {detailModalItem.category}
                    </span>
                    <span className="text-[11px] text-gray-400">ID: {detailModalItem.id}</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-extrabold text-[#14274E] leading-snug mb-3">
                {detailModalItem.title}
              </h3>

              {/* Picture: ONLY shown if admin entered an image URL! */}
              {detailModalItem.imageUrl && detailModalItem.imageUrl.trim() ? (
                <div className="mb-4 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 aspect-16/9">
                  <img
                    src={detailModalItem.imageUrl}
                    alt={detailModalItem.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : null}

              {/* Place / Location */}
              <div className="mb-4 p-3 bg-[#FBF9F4] rounded-xl border border-[#E5E0D5] flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#0348AB] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                    {language === 'en' ? 'Inspection & Physical Place / Location' : 'የእቃው የሚገኝበት ቦታ'}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#14274E]">
                    {detailModalItem.location || (language === 'en' ? 'Nifas Silk-Lafto Sub-City Central Facility' : 'የነፋስ ስልክ ላፍቶ ክፍለ ከተማ ማዕከል')}
                  </span>
                </div>
              </div>

              {/* Starting Bid Box in ETB */}
              <div className="mb-4 p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    {language === 'en' ? 'Starting Bid (መነሻ ዋጋ)' : 'መነሻ ዋጋ'}
                  </span>
                  <div className="text-xl font-extrabold text-emerald-900">
                    ETB {detailModalItem.startingPrice.toLocaleString()} <span className="text-xs font-semibold text-emerald-700">ብር</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
                    Ethiopian Birr
                  </span>
                </div>
              </div>

              {/* Full Description */}
              <div className="mb-4 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  {language === 'en' ? 'Description & Details' : 'ዝርዝር መግለጫ'}
                </span>
                <p className="text-xs sm:text-sm text-[#6B6558] leading-relaxed bg-[#F7F5F0]/60 p-3 rounded-xl border border-[#E5E0D5]">
                  {detailModalItem.description || 'No additional notes provided by administration.'}
                </p>
              </div>

              {/* Schedule Dates */}
              <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-500 font-semibold block">
                    {language === 'en' ? 'Start Date' : 'የመጀመሪያ ቀን'}
                  </span>
                  <span className="font-bold text-[#14274E]">
                    {new Date(detailModalItem.startDate).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-500 font-semibold block">
                    {language === 'en' ? 'End Date' : 'የማብቂያ ቀን'}
                  </span>
                  <span className="font-bold text-[#14274E]">
                    {new Date(detailModalItem.endDate).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                {detailModalItem.externalLink && (
                  <a
                    href={detailModalItem.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl border border-gray-300 hover:border-[#0348AB] text-gray-700 hover:text-[#0348AB] bg-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{detailModalItem.linkButtonLabel || 'View Proof / Source'}</span>
                  </a>
                )}
                <button
                  onClick={() => setDetailModalItem(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  {language === 'en' ? 'Close Window' : 'ዝጋ'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
