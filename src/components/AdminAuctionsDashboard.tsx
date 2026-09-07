import React, { useMemo, useState } from 'react';
import {
  Gavel,
  PlusCircle,
  Trash2,
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
  LogOut,
  Globe,
  Search,
  Pencil,
  Database,
  RefreshCw,
  ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuctions } from '../context/AuctionsContext';
import { calculateAuctionStatus, toDatetimeLocalValue, isPersistedAuctionId } from '../data/auctionsData';
import { AuctionItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { sanitizeText, isSafeUrl } from '../utils/security';

interface AdminAuctionsDashboardProps {
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const emptyForm = () => {
  const start = toDatetimeLocalValue(new Date());
  const end = toDatetimeLocalValue(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
  return {
    title: '',
    selectedCategory: 'Art',
    customCategory: '',
    location: '',
    description: '',
    imageUrl: '',
    externalLink: '',
    linkButtonLabel: 'View Source',
    startingPrice: '35000',
    startDate: start,
    endDate: end
  };
};

export const AdminAuctionsDashboard: React.FC<AdminAuctionsDashboardProps> = ({ onNavigate, onLogout }) => {
  const { auctions, categories, addAuction, updateAuction, deleteAuction, isLoading, error, isUsingDemoData, fetchAuctions } = useAuctions();
  const { language, toggleLanguage } = useLanguage();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [adminDetailItem, setAdminDetailItem] = useState<AuctionItem | null>(null);

  const [listSearch, setListSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Live' | 'Upcoming' | 'Ended'>('All');

  const stats = useMemo(() => {
    const counts = { total: auctions.length, live: 0, upcoming: 0, ended: 0 };
    auctions.forEach((item) => {
      const status = calculateAuctionStatus(item);
      if (status === 'Live') counts.live += 1;
      else if (status === 'Upcoming') counts.upcoming += 1;
      else counts.ended += 1;
    });
    return counts;
  }, [auctions]);

  const filteredAuctions = useMemo(() => {
    const query = listSearch.trim().toLowerCase();
    return auctions.filter((item) => {
      const status = calculateAuctionStatus(item);
      if (statusFilter !== 'All' && status !== statusFilter) return false;
      if (!query) return true;
      return (
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.location || '').toLowerCase().includes(query) ||
        (item.description || '').toLowerCase().includes(query)
      );
    });
  }, [auctions, listSearch, statusFilter]);

  const updateField = <K extends keyof ReturnType<typeof emptyForm>>(key: K, value: ReturnType<typeof emptyForm>[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFillSample = () => {
    setForm({
      title: 'Addis Ababa Heritage Architectural Sketches (1930s)',
      selectedCategory: 'Art',
      customCategory: '',
      location: 'Woreda 05 (Vatican Cultural Archive)',
      description: 'Original architectural blueprint elevations and hand-tinted ink renderings of historic colonial-era civic buildings in southern Addis Ababa.',
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
      externalLink: 'https://en.wikipedia.org/wiki/Addis_Ababa',
      linkButtonLabel: 'View Heritage Index',
      startingPrice: '45000',
      startDate: toDatetimeLocalValue(new Date()),
      endDate: toDatetimeLocalValue(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000))
    });
    setEditingId(null);
  };

  const startEdit = (item: AuctionItem) => {
    const knownCategory = categories.includes(item.category);
    setForm({
      title: item.title,
      selectedCategory: knownCategory ? item.category : 'Custom',
      customCategory: knownCategory ? '' : item.category,
      location: item.location || '',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      externalLink: item.externalLink || '',
      linkButtonLabel: item.linkButtonLabel || 'View Source',
      startingPrice: String(item.startingPrice),
      startDate: item.startDate,
      endDate: item.endDate
    });
    setEditingId(item.id);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!form.title.trim()) {
      setErrorMessage(language === 'en' ? 'Title / item name is required.' : 'የእቃው መጠሪያ ያስፈልጋል።');
      return;
    }

    const priceNum = parseFloat(form.startingPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMessage(language === 'en' ? 'Starting bid must be a valid positive amount in ETB.' : 'መነሻ ዋጋ ትክክለኛ ቁጥር መሆን አለበት።');
      return;
    }

    if (!form.startDate || !form.endDate) {
      setErrorMessage(language === 'en' ? 'Both start and end dates are required.' : 'የመጀመሪያ እና የማብቂያ ቀን ያስፈልጋል።');
      return;
    }

    if (new Date(form.endDate).getTime() <= new Date(form.startDate).getTime()) {
      setErrorMessage(language === 'en' ? 'End date/time must be after start date/time.' : 'የማብቂያ ቀን ከመጀመሪያ ቀን በኋላ መሆን አለበት።');
      return;
    }

    const finalCategory = form.selectedCategory === 'Custom'
      ? (form.customCategory.trim() || 'General')
      : form.selectedCategory;

    const sanitizedTitle = sanitizeText(form.title);
    const sanitizedCategory = sanitizeText(finalCategory);
    const sanitizedLocation = sanitizeText(form.location) || 'Sub-City Central Warehouse';
    const sanitizedDescription = sanitizeText(form.description);
    const sanitizedLabel = sanitizeText(form.linkButtonLabel) || 'View Source';

    if (form.imageUrl.trim() && !isSafeUrl(form.imageUrl)) {
      setErrorMessage(language === 'en'
        ? 'Image URL must start with http:// or https://.'
        : 'የምስል ሊንክ በ http:// ወይም https:// መጀመር አለበት።');
      return;
    }

    if (form.externalLink.trim() && !isSafeUrl(form.externalLink)) {
      setErrorMessage(language === 'en'
        ? 'External link must start with http:// or https://.'
        : 'ውጫዊ ሊንክ በ http:// ወይም https:// መጀመር አለበት።');
      return;
    }

    const payload = {
      title: sanitizedTitle,
      category: sanitizedCategory,
      location: sanitizedLocation,
      description: sanitizedDescription,
      imageUrl: form.imageUrl.trim() || undefined,
      externalLink: form.externalLink.trim() || undefined,
      linkButtonLabel: sanitizedLabel,
      startingPrice: priceNum,
      startDate: form.startDate,
      endDate: form.endDate
    };

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateAuction(editingId, payload);
        setSuccessMessage(
          language === 'en'
            ? `Auction “${sanitizedTitle}” updated in the database.`
            : `ጨረታ “${sanitizedTitle}” ተዘምኗል።`
        );
      } else {
        await addAuction(payload);
        setSuccessMessage(
          language === 'en'
            ? `Auction “${sanitizedTitle}” published to the public catalog.`
            : `ጨረታ “${sanitizedTitle}” ይፋ ሆኗል።`
        );
      }
      setTimeout(() => setSuccessMessage(null), 5000);
      resetForm();
    } catch (err: any) {
      setErrorMessage(err?.message || (language === 'en'
        ? 'Could not save this listing to the database.'
        : 'ጨረታውን ወደ ዳታቤዝ ማስቀመጥ አልተቻለም።'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      await deleteAuction(id);
      setItemToDelete(null);
      if (editingId === id) resetForm();
      setSuccessMessage(language === 'en' ? 'Listing removed.' : 'ጨረታው ተሰርዟል።');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err?.message || (language === 'en' ? 'Failed to delete listing.' : 'ማጥፋት አልተቻለም።'));
    }
  };

  const imagePreviewSafe = form.imageUrl.trim() && isSafeUrl(form.imageUrl);

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#0f172a]">
      <header className="border-b border-[#E5E0D5] bg-[#14274E] text-white">
        <div className="w-full max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Gavel className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/60 font-bold">
                {language === 'en' ? 'Nifas Silk-Lafto · Staff desk' : 'ንፋስ ስልክ ላፍቶ · የሰራተኛ መስኮት'}
              </p>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight truncate">
                {language === 'en' ? 'Auction register' : 'የጨረታ መዝገብ'}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/auctions')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#14274E] cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Public catalog' : 'የህዝብ ካታሎግ'}</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-100 hover:bg-rose-500/30 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Sign out' : 'ውጣ'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="w-full max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <button
            onClick={() => onNavigate('/auctions')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0348AB] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Back to live auctions' : 'ወደ ቀጥታ ጨረታዎች ተመለስ'}</span>
          </button>
          <button
            type="button"
            onClick={() => fetchAuctions()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#14274E] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Refresh from database' : 'ከዳታቤዝ አድስ'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: language === 'en' ? 'On register' : 'በመዝገብ', value: stats.total },
            { label: language === 'en' ? 'Live' : 'ቀጥታ', value: stats.live },
            { label: language === 'en' ? 'Upcoming' : 'በቅርብ', value: stats.upcoming },
            { label: language === 'en' ? 'Ended' : 'ያለቀ', value: stats.ended },
            {
              label: language === 'en' ? 'Data source' : 'ምንጭ',
              value: isUsingDemoData
                ? (language === 'en' ? 'Demo' : 'ናሙና')
                : (language === 'en' ? 'Live DB' : 'ዳታቤዝ')
            }
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-[#E5E0D5] rounded-2xl px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{stat.label}</div>
              <div className="text-lg font-extrabold text-[#14274E] mt-0.5">{stat.value}</div>
            </div>
          ))}
        </div>

        {isUsingDemoData && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3">
            <Database className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-bold">
                {language === 'en' ? 'Showing the sample catalog' : 'የናሙና ካታሎግ እየታየ ነው'}
              </div>
              <p className="text-xs mt-1 leading-relaxed">
                {language === 'en'
                  ? 'These lots are not saved in the database yet. Publishing a listing writes it to Supabase and replaces this sample set on the public page.'
                  : 'እነዚህ ጨረታዎች በዳታቤዝ ውስጥ አልተቀመጡም። አዲስ ጨረታ ሲያትሙ ወደ Supabase ይቀመጣል።'}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-bold">{language === 'en' ? 'Database connection issue' : 'የዳታቤዝ ግንኙነት ችግር'}</div>
              <p className="text-xs mt-1">{error}</p>
            </div>
          </div>
        )}

        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-sm font-semibold flex-1">{successMessage}</div>
              <button onClick={() => setSuccessMessage(null)} className="text-emerald-700 text-xs font-bold cursor-pointer">✕</button>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-sm font-semibold flex-1">{errorMessage}</div>
              <button onClick={() => setErrorMessage(null)} className="text-rose-700 text-xs font-bold cursor-pointer">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E0D5]">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E5E0D5]">
                <div className="flex items-center gap-2">
                  {editingId ? <Pencil className="w-5 h-5 text-[#0348AB]" /> : <PlusCircle className="w-5 h-5 text-[#0348AB]" />}
                  <h2 className="text-lg font-extrabold text-[#14274E]">
                    {editingId
                      ? (language === 'en' ? 'Edit listing' : 'ጨረታ አርትዕ')
                      : (language === 'en' ? 'Register a new lot' : 'አዲስ ጨረታ ይመዝግቡ')}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleFillSample}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0348AB] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Fill example' : 'ምሳሌ ሙላ'}</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    {language === 'en' ? 'Item title / name *' : 'የእቃው መጠሪያ / ርዕስ *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder={language === 'en' ? 'e.g. Municipal surplus 4x4 utility vehicle' : 'ለምሳሌ፡ የክፍለ ከተማው አገልግሎት ሰጪ ተሽከርካሪ'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] focus:ring-2 focus:ring-[#0348AB]/10 text-sm bg-[#FBF9F4]/40 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      {language === 'en' ? 'Category *' : 'ዘርፍ *'}
                    </label>
                    <select
                      value={form.selectedCategory}
                      onChange={(e) => updateField('selectedCategory', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] text-sm bg-white font-medium"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="Custom">+ Custom / ሌላ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      {language === 'en' ? 'Link button label' : 'የአዝራሩ ስም'}
                    </label>
                    <input
                      type="text"
                      value={form.linkButtonLabel}
                      onChange={(e) => updateField('linkButtonLabel', e.target.value)}
                      placeholder="View Source / View Proof"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] text-sm bg-[#FBF9F4]/40 font-medium"
                    />
                  </div>
                </div>

                {form.selectedCategory === 'Custom' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      {language === 'en' ? 'Custom category name' : 'የዘርፉ ስም'}
                    </label>
                    <input
                      type="text"
                      value={form.customCategory}
                      onChange={(e) => updateField('customCategory', e.target.value)}
                      placeholder="e.g. Heavy Equipment"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] text-sm bg-white font-medium"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    {language === 'en' ? 'Place / location (woreda or center)' : 'የእቃው የሚገኝበት ቦታ (ወረዳ / ማዕከል)'}
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder={language === 'en' ? 'e.g. Woreda 03 (Mekanisa Artisan Center)' : 'ለምሳሌ፡ ወረዳ 03 (መካኒሳ ማዕከል)'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] text-sm bg-[#FBF9F4]/40 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    {language === 'en' ? 'Description' : 'ዝርዝር ማብራሪያ'}
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder={language === 'en' ? 'Condition, provenance, authorization, or specifications…' : 'የእቃውን ሁኔታ፣ ዝርዝር እና መግለጫ እዚህ ያስገቡ...'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] text-sm bg-[#FBF9F4]/40 font-medium resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    {language === 'en' ? 'Starting bid (ETB) *' : 'መነሻ ዋጋ (በብር) *'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-gray-500 font-bold text-xs">ETB</span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      required
                      value={form.startingPrice}
                      onChange={(e) => updateField('startingPrice', e.target.value)}
                      placeholder="35000"
                      className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] focus:ring-2 focus:ring-[#0348AB]/10 text-sm bg-[#FBF9F4]/40 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                      {language === 'en' ? 'Picture URL' : 'የምስል ሊንክ (URL)'}
                    </label>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {language === 'en' ? 'Optional — details only' : 'አስገዳጅ ያልሆነ'}
                    </span>
                  </div>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => updateField('imageUrl', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] text-sm bg-[#FBF9F4]/40 font-medium"
                  />
                  {imagePreviewSafe && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-[#E5E0D5] bg-gray-50 aspect-video">
                      <img
                        src={form.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    {language === 'en' ? 'External link (proof or documentation)' : 'ውጫዊ ማስረጃ ሊንክ (URL)'}
                  </label>
                  <input
                    type="url"
                    value={form.externalLink}
                    onChange={(e) => updateField('externalLink', e.target.value)}
                    placeholder="https://example.com/item-proof"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#0348AB] text-sm bg-[#FBF9F4]/40 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      {language === 'en' ? 'Start date / time *' : 'የመጀመሪያ ቀን/ሰዓት *'}
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={form.startDate}
                      onChange={(e) => updateField('startDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#0348AB] text-xs font-medium bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      {language === 'en' ? 'End date / time *' : 'የማብቂያ ቀን/ሰዓት *'}
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={form.endDate}
                      onChange={(e) => updateField('endDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#0348AB] text-xs font-medium bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#0348AB] hover:bg-[#02337a] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {editingId ? <Pencil className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                    <span>
                      {isSubmitting
                        ? (language === 'en' ? 'Saving…' : 'በማስቀመጥ ላይ...')
                        : editingId
                          ? (language === 'en' ? 'Save changes' : 'ለውጦችን አስቀምጥ')
                          : (language === 'en' ? 'Publish listing' : 'ጨረታውን ይፋ አድርግ')}
                    </span>
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-3 rounded-xl border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      {language === 'en' ? 'Cancel' : 'ሰርዝ'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-[#E5E0D5] overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-[#E5E0D5] space-y-4 bg-[#FBF9F4]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#14274E] flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#0348AB]" />
                      <span>{language === 'en' ? 'Existing auctions' : 'የተመዘገቡ ጨረታዎች'}</span>
                      <span className="text-xs bg-blue-100 text-[#0348AB] font-bold px-2 py-0.5 rounded-full">
                        {filteredAuctions.length}
                      </span>
                    </h2>
                    <p className="text-xs text-[#6B6558] mt-0.5">
                      {language === 'en'
                        ? 'Search, inspect, edit, or remove lots on the public register.'
                        : 'የተመዘገቡ ጨረታዎችን ይፈልጉ፣ ያርትዑ ወይም ያስወግዱ።'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={listSearch}
                      onChange={(e) => setListSearch(e.target.value)}
                      placeholder={language === 'en' ? 'Search title, location, category…' : 'በስም፣ ቦታ ወይም ዘርፍ ፈልግ...'}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-sm bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5E0D5] overflow-x-auto">
                    {(['All', 'Live', 'Upcoming', 'Ended'] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap cursor-pointer ${
                          statusFilter === status ? 'bg-[#0348AB] text-white' : 'text-gray-600 hover:text-[#0348AB]'
                        }`}
                      >
                        {status === 'All' ? (language === 'en' ? 'All' : 'ሁሉም') : status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="h-44 rounded-2xl bg-gray-100 animate-pulse border border-[#E5E0D5]" />
                  ))}
                </div>
              ) : filteredAuctions.length === 0 ? (
                <div className="p-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                    <Gavel className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-gray-800 text-base">
                    {language === 'en' ? 'No listings match this filter' : 'ምንም የሚዛመድ ጨረታ የለም'}
                  </div>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    {language === 'en'
                      ? 'Register a lot with the form, or clear search and status filters.'
                      : 'በግራ ባለው ቅጽ አዲስ ጨረታ ይመዝግቡ ወይም ማጣሪያውን ያጽዱ።'}
                  </p>
                </div>
              ) : (
                <div className="p-4 sm:p-6 bg-[#FBF9F4]/40 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAuctions.map((item) => {
                    const status = calculateAuctionStatus(item);
                    const isEnded = status === 'Ended';
                    const isLive = status === 'Live';
                    const isUpcoming = status === 'Upcoming';
                    const persisted = isPersistedAuctionId(item.id);
                    const formattedEndDate = new Date(item.endDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl p-5 border border-[#E5E0D5] flex flex-col justify-between space-y-3.5"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            {isLive && (
                              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
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
                          <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>{formattedEndDate}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <h3 className="text-sm sm:text-base font-extrabold text-[#14274E] leading-snug line-clamp-2" title={item.title}>
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-[#0348AB] font-semibold">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{item.location || 'Sub-City Central Warehouse'}</span>
                          </div>
                          <p className="text-xs text-[#6B6558] line-clamp-2 leading-relaxed">
                            {item.description || (language === 'en' ? 'No description provided.' : 'ማብራሪያ አልተሰጠም።')}
                          </p>
                        </div>

                        <div className="bg-[#F7F5F0] rounded-xl p-3 border border-[#E5E0D5] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                              {language === 'en' ? 'Starting bid' : 'መነሻ ዋጋ'}
                            </span>
                            <div className="text-sm sm:text-base font-extrabold text-[#14274E]">
                              ETB {item.startingPrice.toLocaleString()} <span className="text-[11px] font-semibold text-gray-500">ብር</span>
                            </div>
                          </div>
                          <div className="text-right space-y-0.5">
                            <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1 justify-end">
                              <ImageIcon className="w-3 h-3" />
                              {item.imageUrl ? (language === 'en' ? 'Picture attached' : 'ምስል አለ') : (language === 'en' ? 'No picture' : 'ምስል የለም')}
                            </span>
                            <span className="text-[10px] font-semibold text-gray-400 block">
                              {persisted
                                ? (language === 'en' ? 'Saved in database' : 'በዳታቤዝ ተቀምጧል')
                                : (language === 'en' ? 'Sample only' : 'ናሙና ብቻ')}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setAdminDetailItem(item)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#0348AB] hover:underline cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{language === 'en' ? 'Details' : 'ሙሉ መረጃ'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => startEdit(item)}
                              disabled={!persisted}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#14274E] hover:underline cursor-pointer disabled:text-gray-300 disabled:no-underline disabled:cursor-not-allowed"
                              title={!persisted ? 'Sample lots cannot be edited in the database' : 'Edit listing'}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>{language === 'en' ? 'Edit' : 'አርትዕ'}</span>
                            </button>
                          </div>

                          {itemToDelete === item.id ? (
                            <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 p-1 rounded-lg">
                              <span className="text-[10px] font-bold text-rose-800 pl-1">
                                {language === 'en' ? 'Delete?' : 'ይጥፋ?'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleConfirmDelete(item.id)}
                                className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-700 cursor-pointer"
                              >
                                {language === 'en' ? 'Yes' : 'አዎ'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setItemToDelete(null)}
                                className="px-1.5 py-0.5 rounded text-gray-500 hover:text-gray-800 text-[10px] cursor-pointer"
                              >
                                {language === 'en' ? 'No' : 'አይ'}
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setItemToDelete(item.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{language === 'en' ? 'Delete' : 'ሰርዝ'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="p-4 bg-[#F7F5F0] border-t border-[#E5E0D5] flex items-center justify-between text-xs text-gray-500">
                <span>
                  {language === 'en'
                    ? `Showing ${filteredAuctions.length} of ${auctions.length} lots`
                    : `${filteredAuctions.length} ከ ${auctions.length} ጨረታዎች ይታያሉ`}
                </span>
                <span className="text-[11px] text-gray-400">
                  {language === 'en' ? 'Synced with the public live auctions page' : 'ከቀጥታ ጨረታዎች ጋር የተሳሰረ'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {adminDetailItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-gray-200 relative my-8"
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
                    {language === 'en' ? 'Listing inspection' : 'የጨረታ ክትትል'}
                  </span>
                  <span className="bg-[#F7F5F0] text-gray-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-[#E5E0D5]">
                    {adminDetailItem.category}
                  </span>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-[#14274E] leading-snug mb-3">
                {adminDetailItem.title}
              </h3>

              {adminDetailItem.imageUrl?.trim() ? (
                <div className="mb-4 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video">
                  <img
                    src={adminDetailItem.imageUrl}
                    alt={adminDetailItem.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                </div>
              ) : null}

              <div className="mb-4 p-3 bg-[#FBF9F4] rounded-xl border border-[#E5E0D5] flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#0348AB] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                    {language === 'en' ? 'Place / location' : 'ቦታ'}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#14274E]">
                    {adminDetailItem.location || 'Sub-City Central Warehouse'}
                  </span>
                </div>
              </div>

              <div className="mb-4 p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                  {language === 'en' ? 'Starting bid' : 'መነሻ ዋጋ'}
                </span>
                <div className="text-xl font-extrabold text-emerald-900">
                  ETB {adminDetailItem.startingPrice.toLocaleString()} <span className="text-xs font-semibold text-emerald-700">ብር</span>
                </div>
              </div>

              <div className="mb-4 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  {language === 'en' ? 'Description' : 'ማብራሪያ'}
                </span>
                <p className="text-xs text-[#6B6558] bg-[#F7F5F0]/60 p-3 rounded-xl border border-[#E5E0D5]">
                  {adminDetailItem.description || (language === 'en' ? 'No description entered.' : 'ማብራሪያ አልተሰጠም።')}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-end gap-2">
                {isPersistedAuctionId(adminDetailItem.id) && (
                  <button
                    type="button"
                    onClick={() => {
                      startEdit(adminDetailItem);
                      setAdminDetailItem(null);
                    }}
                    className="py-2 px-4 rounded-xl bg-[#0348AB] text-white text-xs font-bold cursor-pointer"
                  >
                    {language === 'en' ? 'Edit listing' : 'አርትዕ'}
                  </button>
                )}
                <button
                  onClick={() => setAdminDetailItem(null)}
                  className="py-2 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold cursor-pointer"
                >
                  {language === 'en' ? 'Close' : 'ዝጋ'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
