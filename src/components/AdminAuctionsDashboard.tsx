import React, { useState } from 'react';
import { 
  Gavel, 
  PlusCircle, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  Eye, 
  FileText,
  MapPin,
  X,
  Info,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuctions } from '../context/AuctionsContext';
import { calculateAuctionStatus } from '../data/auctionsData';
import { AuctionItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { sanitizeText, isSafeUrl } from '../utils/security';

interface AdminAuctionsDashboardProps {
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export const AdminAuctionsDashboard: React.FC<AdminAuctionsDashboardProps> = ({ onNavigate, onLogout }) => {
  const { auctions, categories, addAuction, deleteAuction } = useAuctions();
  const { language } = useLanguage();

  // Form State
  const defaultStartDate = new Date().toISOString().slice(0, 16);
  const defaultEndDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Art');
  const [customCategory, setCustomCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [linkButtonLabel, setLinkButtonLabel] = useState('View Source');
  const [startingPrice, setStartingPrice] = useState<string>('35000');
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UI state for alerts and confirmations
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [adminDetailItem, setAdminDetailItem] = useState<AuctionItem | null>(null);

  // Quick preset filler for instant testing
  const handleFillSample = () => {
    setTitle('Addis Ababa Heritage Architectural Sketches (1930s)');
    setSelectedCategory('Art');
    setCustomCategory('');
    setLocation('Woreda 05 (Vatican Cultural Archive)');
    setDescription('Original architectural blueprint elevations and hand-tinted ink renderings of historic colonial-era civic buildings in southern Addis Ababa.');
    setImageUrl('https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80');
    setExternalLink('https://en.wikipedia.org/wiki/Addis_Ababa');
    setLinkButtonLabel('View Heritage Index');
    setStartingPrice('45000');
    setStartDate(new Date().toISOString().slice(0, 16));
    setEndDate(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Title / Item Name is required.');
      return;
    }

    const priceNum = parseFloat(startingPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMessage('Starting Bid must be a valid positive amount in ETB.');
      return;
    }

    if (!startDate || !endDate) {
      setErrorMessage('Both Start and End Dates are required.');
      return;
    }

    if (new Date(endDate).getTime() <= new Date(startDate).getTime()) {
      setErrorMessage('End Date/Time must be after Start Date/Time.');
      return;
    }

    const finalCategory = selectedCategory === 'Custom' 
      ? (customCategory.trim() || 'General') 
      : selectedCategory;

    const sanitizedTitle = sanitizeText(title);
    const sanitizedCategory = sanitizeText(finalCategory);
    const sanitizedLocation = sanitizeText(location) || 'Sub-City Central Warehouse';
    const sanitizedDescription = sanitizeText(description);
    const sanitizedLabel = sanitizeText(linkButtonLabel) || 'View Source';

    if (imageUrl.trim() && !isSafeUrl(imageUrl)) {
      setErrorMessage('Security Warning: Image URL must start with http:// or https:// and cannot contain scripts.');
      return;
    }

    if (externalLink.trim() && !isSafeUrl(externalLink)) {
      setErrorMessage('Security Warning: External link must start with http:// or https:// and cannot contain scripts.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addAuction({
        title: sanitizedTitle,
        category: sanitizedCategory,
        location: sanitizedLocation,
        description: sanitizedDescription,
        imageUrl: imageUrl.trim() || undefined,
        externalLink: externalLink.trim() || undefined,
        linkButtonLabel: sanitizedLabel,
        startingPrice: priceNum,
        startDate,
        endDate
      });

      setSuccessMessage(`Auction "${sanitizedTitle}" successfully published to Supabase!`);
      setTimeout(() => setSuccessMessage(null), 5000);

      // Reset form
      setTitle('');
      setLocation('');
      setDescription('');
      setImageUrl('');
      setExternalLink('');
      setLinkButtonLabel('View Source');
      setStartingPrice('35000');
      setStartDate(new Date().toISOString().slice(0, 16));
      setEndDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
      setSelectedCategory('Art');
      setCustomCategory('');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create auction item in Supabase.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      await deleteAuction(id);
      setItemToDelete(null);
      setSuccessMessage('Auction listing removed from database successfully.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setErrorMessage('Failed to delete auction item.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#0f172a] py-8 sm:py-12">
      <div className="w-full max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10">
        
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E5E0D5]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => onNavigate('/auctions')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0348AB] hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Back to Public Live Auctions (/auctions)' : 'ወደ ቀጥታ ጨረታዎች ተመለስ'}</span>
              </button>
              <span className="text-gray-300">•</span>
              <button
                onClick={() => onNavigate('/')}
                className="text-xs font-medium text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                {language === 'en' ? 'Main Portal Home' : 'ዋና ፖርታል'}
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#14274E] text-white flex items-center justify-center shadow-xs">
                <Gavel className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14274E] tracking-tight">
                  {language === 'en' ? 'Auction Management Dashboard' : 'የጨረታ አስተዳደር ዳሽቦርድ'}
                </h1>
                <p className="text-xs sm:text-sm text-[#6B6558] mt-0.5">
                  {language === 'en' 
                    ? 'Register new auctions and manage existing listings.' 
                    : 'አዳዲስ ጨረታዎችን ይመዝግቡ እና ነባር ጨረታዎችን ያስተዳድሩ::'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
            <button
              onClick={() => onNavigate('/auctions')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-[#14274E] border border-[#D8D3C7] hover:bg-gray-50 hover:border-[#14274E] shadow-2xs transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#0348AB]" />
              <span>{language === 'en' ? 'Public Catalog' : 'የህዝብ ካታሎግ'}</span>
            </button>

            {/* Sign Out Button */}
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 shadow-2xs transition-colors cursor-pointer"
              title="Sign out and secure admin panel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Sign Out' : 'ውጣ'}</span>
            </button>
          </div>
        </div>


        {/* Inline Alerts */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 shadow-xs"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-sm font-semibold flex-1">{successMessage}</div>
              <button 
                onClick={() => setSuccessMessage(null)}
                className="text-emerald-700 hover:text-emerald-950 text-xs font-bold px-2 py-0.5 cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 shadow-xs"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-sm font-semibold flex-1">{errorMessage}</div>
              <button 
                onClick={() => setErrorMessage(null)}
                className="text-rose-700 hover:text-rose-950 text-xs font-bold px-2 py-0.5 cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SECTION 1: AUCTION CREATION FORM (5 Cols on large screens) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E0D5] shadow-xs">
              
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E5E0D5]">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-[#0348AB]" />
                  <h2 className="text-lg font-extrabold text-[#14274E]">
                    {language === 'en' ? 'Create New Auction' : 'አዲስ ጨረታ ይፍጠሩ'}
                  </h2>
                </div>
                
                <button
                  type="button"
                  onClick={handleFillSample}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0348AB] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  title="Auto-fill with sample museum architectural blueprint"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Fill Example' : 'ምሳሌ ሙላ'}</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    {language === 'en' ? 'Item Title / Name *' : 'የእቃው መጠሪያ / ርዕስ *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={language === 'en' ? 'e.g. Municipal Surplus 4x4 Utility Vehicle' : 'ለምሳሌ፡ የክፍለ ከተማው አገልግሎት ሰጪ ተሽከርካሪ'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] focus:ring-2 focus:ring-[#0348AB]/10 text-sm bg-[#FBF9F4]/40 font-medium transition-all"
                  />
                </div>

                {/* Category Selection + Custom Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      {language === 'en' ? 'Category *' : 'ዘርፍ *'}
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] text-sm bg-white font-medium transition-all"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="Custom">+ Custom Category / ሌላ</option>
                    </select>
                  </div>

                  {selectedCategory === 'Custom' ? (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        {language === 'en' ? 'Custom Category Name' : 'የዘርፉ ስም'}
                      </label>
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="e.g. Heavy Equipment"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] text-sm bg-white font-medium"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        {language === 'en' ? 'Link Button Label' : 'የአዝራሩ ስም'}
                      </label>
                      <input
                        type="text"
                        value={linkButtonLabel}
                        onChange={(e) => setLinkButtonLabel(e.target.value)}
                        placeholder="View Source / View Proof"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] text-sm bg-[#FBF9F4]/40 font-medium"
                      />
                    </div>
                  )}
                </div>

                {/* Place / Location */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    {language === 'en' ? 'Place / Location (Woreda or Center)' : 'የእቃው የሚገኝበት ቦታ (ወረዳ / ማዕከል)'}
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={language === 'en' ? 'e.g. Woreda 03 (Mekanisa Artisan Center)' : 'ለምሳሌ፡ ወረዳ 03 (መካኒሳ ማዕከል)'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] text-sm bg-[#FBF9F4]/40 font-medium"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    {language === 'en' ? 'Description' : 'ዝርዝር ማብራሪያ'}
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={language === 'en' ? 'Provide item condition, provenance, municipal authorization, or specifications...' : 'የእቃውን ሁኔታ፣ ዝርዝር እና መግለጫ እዚህ ያስገቡ...'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] text-sm bg-[#FBF9F4]/40 font-medium transition-all resize-none"
                  />
                </div>

                {/* Starting Price in Ethiopian Birr (ETB) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    {language === 'en' ? 'Starting Bid (ETB / የኢትዮጵያ ብር) *' : 'መነሻ ዋጋ (በብር) *'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-gray-500 font-bold text-xs">ETB</span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      required
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(e.target.value)}
                      placeholder="35000"
                      className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] focus:ring-2 focus:ring-[#0348AB]/10 text-sm bg-[#FBF9F4]/40 font-bold"
                    />
                  </div>
                </div>

                {/* Image URL (Optional - only seen inside details modal) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                      {language === 'en' ? 'Picture URL' : 'የምስል ሊንክ (URL)'}
                    </label>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {language === 'en' ? 'Optional — shown only in details' : 'አስገዳጅ ያልሆነ'}
                    </span>
                  </div>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] text-sm bg-[#FBF9F4]/40 font-medium"
                  />
                </div>

                {/* External Link */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    {language === 'en' ? 'External Link (Proof or Documentation)' : 'ውጫዊ ማስረጃ ሊንክ (URL)'}
                  </label>
                  <input
                    type="url"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    placeholder="https://example.com/item-proof"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] text-sm bg-[#FBF9F4]/40 font-medium"
                  />
                </div>

                {/* Start & End Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      {language === 'en' ? 'Start Date / Time *' : 'የመጀመሪያ ቀን/ሰዓት *'}
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#0348AB] text-xs font-medium bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      {language === 'en' ? 'End Date / Time *' : 'የማብቂያ ቀን/ሰዓት *'}
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#0348AB] text-xs font-medium bg-white"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-[#0348AB] hover:bg-[#02337a] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? (language === 'en' ? 'Publishing to Database...' : 'ወደ ዳታቤዝ በማስቀመጥ ላይ...')
                        : (language === 'en' ? 'Publish Auction Listing' : 'ጨረታውን ይፋ አድርግ')}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* SECTION 2: CURRENT LISTINGS MANAGEMENT CARDS (7 Cols on large screens) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-[#E5E0D5] shadow-xs overflow-hidden">
              
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-[#E5E0D5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FBF9F4]">
                <div>
                  <h2 className="text-lg font-extrabold text-[#14274E] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#0348AB]" />
                    <span>{language === 'en' ? 'Existing Auctions' : 'የተመዘገቡ ጨረታዎች'}</span>
                    <span className="text-xs bg-blue-100 text-[#0348AB] font-bold px-2 py-0.5 rounded-full">
                      {auctions.length}
                    </span>
                  </h2>
                  <p className="text-xs text-[#6B6558] mt-0.5">
                    {language === 'en' 
                      ? 'Review details, monitor status, or remove listings.' 
                      : 'የተመዘገቡ ጨረታዎችን ሁኔታ ይመልከቱ እና ያስተዳድሩ::'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('/auctions')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0348AB] hover:underline cursor-pointer"
                  >
                    <span>{language === 'en' ? 'Preview on Public Portal →' : 'በህዝብ ፖርታል እይ →'}</span>
                  </button>
                </div>
              </div>

              {/* Cards List / Empty state */}
              {auctions.length === 0 ? (
                <div className="p-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                    <Gavel className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-gray-800 text-base">
                    {language === 'en' ? 'No auction listings currently in database' : 'ምንም የተመዘገበ ጨረታ የለም'}
                  </div>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    {language === 'en' 
                      ? 'You can create a new auction listing using the registration form on the left.' 
                      : 'በግራ በኩል ባለው ቅጽ አዲስ ጨረታ መመዝገብ ይችላሉ::'}
                  </p>
                </div>
              ) : (
                <div className="p-4 sm:p-6 bg-[#FBF9F4]/40 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {auctions.map((item) => {
                    const status = calculateAuctionStatus(item);
                    const isEnded = status === 'Ended';
                    const isLive = status === 'Live';
                    const isUpcoming = status === 'Upcoming';
                    const formattedEndDate = new Date(item.endDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl p-5 border border-[#E5E0D5] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3.5"
                      >
                        {/* Top Meta: Status Pill, Category, and End Time */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            {isLive && (
                              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                                <span>Active</span>
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

                          <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>{formattedEndDate}</span>
                          </div>
                        </div>

                        {/* Title & Place */}
                        <div className="space-y-1.5">
                          <h3 className="text-sm sm:text-base font-extrabold text-[#14274E] leading-snug line-clamp-2" title={item.title}>
                            {item.title}
                          </h3>

                          {/* Location / Place */}
                          <div className="flex items-center gap-1.5 text-xs text-[#0348AB] font-semibold">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{item.location || 'Sub-City Central Warehouse'}</span>
                          </div>

                          <p className="text-xs text-[#6B6558] line-clamp-2 leading-relaxed">
                            {item.description || 'No description provided.'}
                          </p>
                        </div>

                        {/* Starting Bid Only in ETB */}
                        <div className="bg-[#F7F5F0] rounded-xl p-3 border border-[#E5E0D5] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                              {language === 'en' ? 'Starting Bid' : 'መነሻ ዋጋ'}
                            </span>
                            <div className="text-sm sm:text-base font-extrabold text-[#14274E]">
                              ETB {item.startingPrice.toLocaleString()} <span className="text-[11px] font-semibold text-gray-500">ብር</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-semibold text-gray-400">
                              {item.imageUrl ? '📷 Picture attached' : 'No picture'}
                            </span>
                          </div>
                        </div>

                        {/* Actions Row: Details Modal & Delete Confirmation */}
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setAdminDetailItem(item)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#0348AB] hover:underline cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{language === 'en' ? 'View Details' : 'ሙሉ መረጃ'}</span>
                          </button>

                          <div>
                            {itemToDelete === item.id ? (
                              <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 p-1 rounded-lg">
                                <span className="text-[10px] font-bold text-rose-800 pl-1">Delete?</span>
                                <button
                                  onClick={() => handleConfirmDelete(item.id)}
                                  className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-700 cursor-pointer"
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setItemToDelete(null)}
                                  className="px-1.5 py-0.5 rounded text-gray-500 hover:text-gray-800 text-[10px] cursor-pointer"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setItemToDelete(item.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200 cursor-pointer"
                                title="Delete auction listing"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{language === 'en' ? 'Delete' : 'ሰርዝ'}</span>
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

              {/* Card List Footer */}
              <div className="p-4 bg-[#F7F5F0] border-t border-[#E5E0D5] flex items-center justify-between text-xs text-gray-500">
                <span>
                  {language === 'en' 
                    ? `Showing ${auctions.length} recorded auctions` 
                    : `${auctions.length} የተመዘገቡ ጨረታዎች ይታያሉ`}
                </span>
                <span className="text-[11px] text-gray-400">
                  {language === 'en' ? 'Directly synced with Public Live Auctions' : 'ከቀጥታ ጨረታዎች ጋር በቅጽበት የተሳሰረ'}
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* ADMIN PREVIEW DETAILS MODAL */}
      <AnimatePresence>
        {adminDetailItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-200 relative my-8"
            >
              <button
                onClick={() => setAdminDetailItem(null)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0348AB] flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Listing Inspection
                  </span>
                  <span className="bg-[#F7F5F0] text-gray-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-[#E5E0D5]">
                    {adminDetailItem.category}
                  </span>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-[#14274E] leading-snug mb-3">
                {adminDetailItem.title}
              </h3>

              {/* Picture: ONLY shown if image URL exists */}
              {adminDetailItem.imageUrl && adminDetailItem.imageUrl.trim() ? (
                <div className="mb-4 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 aspect-16/9">
                  <img
                    src={adminDetailItem.imageUrl}
                    alt={adminDetailItem.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : null}

              {/* Location */}
              <div className="mb-4 p-3 bg-[#FBF9F4] rounded-xl border border-[#E5E0D5] flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#0348AB] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                    Place / Location
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#14274E]">
                    {adminDetailItem.location || 'Sub-City Central Warehouse'}
                  </span>
                </div>
              </div>

              {/* Starting Bid in ETB */}
              <div className="mb-4 p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Starting Bid
                  </span>
                  <div className="text-xl font-extrabold text-emerald-900">
                    ETB {adminDetailItem.startingPrice.toLocaleString()} <span className="text-xs font-semibold text-emerald-700">ብር</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  Description
                </span>
                <p className="text-xs text-[#6B6558] bg-[#F7F5F0]/60 p-3 rounded-xl border border-[#E5E0D5]">
                  {adminDetailItem.description || 'No description entered.'}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setAdminDetailItem(null)}
                  className="py-2 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
