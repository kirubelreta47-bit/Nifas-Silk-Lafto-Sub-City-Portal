import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  Filter, 
  UserCheck, 
  MapPin, 
  CreditCard, 
  FileCheck2, 
  MessageSquareWarning, 
  Stethoscope, 
  BarChart3, 
  GraduationCap, 
  ShieldAlert, 
  HeartHandshake, 
  Users, 
  Trees, 
  BookOpen, 
  Car, 
  Trash2, 
  Layers, 
  Briefcase, 
  Zap, 
  ShoppingBag, 
  ShieldCheck, 
  Monitor, 
  Navigation, 
  Syringe,
  Sparkles,
  ArrowRight,
  Search,
  ChevronDown,
  ChevronUp,
  Compass,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SUB_CITY_SYSTEMS, SYSTEM_METRICS } from '../data/systemsData';
import { useLanguage } from '../context/LanguageContext';

interface SystemsDirectoryProps {
  selectedStatusFilter: 'all' | 'production' | 'development' | 'testing';
  setSelectedStatusFilter: (status: 'all' | 'production' | 'development' | 'testing') => void;
  onOpenSystemModal: (systemId: string) => void;
}

const INITIAL_CARD_LIMIT = 6;

// Card sliding appearance animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const cardSlideVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    scale: 0.96
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      type: 'spring' as const,
      damping: 22,
      stiffness: 260,
    } 
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    scale: 0.95,
    transition: { duration: 0.2 } 
  },
};

export const SystemsDirectory: React.FC<SystemsDirectoryProps> = ({
  selectedStatusFilter,
  setSelectedStatusFilter,
  onOpenSystemModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { language, t } = useLanguage();

  // Map icon names to Lucide icon components
  const renderIcon = (iconName: string) => {
    const props = { className: "w-5 h-5" };
    switch (iconName) {
      case 'UserCheck': return <UserCheck {...props} />;
      case 'MapPin': return <MapPin {...props} />;
      case 'CreditCard': return <CreditCard {...props} />;
      case 'Building2': return <Building2 {...props} />;
      case 'FileCheck2': return <FileCheck2 {...props} />;
      case 'MessageSquareWarning': return <MessageSquareWarning {...props} />;
      case 'Stethoscope': return <Stethoscope {...props} />;
      case 'BarChart3': return <BarChart3 {...props} />;
      case 'GraduationCap': return <GraduationCap {...props} />;
      case 'ShieldAlert': return <ShieldAlert {...props} />;
      case 'HeartHandshake': return <HeartHandshake {...props} />;
      case 'Users': return <Users {...props} />;
      case 'Trees': return <Trees {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Car': return <Car {...props} />;
      case 'Trash2': return <Trash2 {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'Briefcase': return <Briefcase {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'ShoppingBag': return <ShoppingBag {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Monitor': return <Monitor {...props} />;
      case 'Navigation': return <Navigation {...props} />;
      case 'Syringe': return <Syringe {...props} />;
      default: return <Building2 {...props} />;
    }
  };

  // Filter systems by status, category, and search query
  const filteredSystems = useMemo(() => {
    return SUB_CITY_SYSTEMS.filter((sys) => {
      if (selectedStatusFilter !== 'all' && sys.status !== selectedStatusFilter) {
        return false;
      }
      if (selectedCategory !== 'all' && sys.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = sys.name.toLowerCase().includes(q);
        const matchAmharic = sys.amharicName.toLowerCase().includes(q);
        const matchDesc = sys.description.toLowerCase().includes(q);
        const matchCategory = sys.categoryLabel.toLowerCase().includes(q);
        if (!matchName && !matchAmharic && !matchDesc && !matchCategory) {
          return false;
        }
      }
      return true;
    });
  }, [selectedStatusFilter, selectedCategory, searchQuery]);

  // When searching or if total is under threshold, show all; otherwise respect expanded state
  const shouldLimit = !isExpanded && searchQuery.trim() === '' && filteredSystems.length > INITIAL_CARD_LIMIT;
  const visibleSystems = shouldLimit ? filteredSystems.slice(0, INITIAL_CARD_LIMIT) : filteredSystems;
  const hiddenCount = filteredSystems.length - visibleSystems.length;

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
    if (isExpanded) {
      const el = document.getElementById('systems-directory');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="systems-directory" className="py-12 bg-white text-[#6B6558] border-t border-[#E5E0D5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-[#E5E0D5]">
          <div>
            <div className="flex items-center gap-2 text-[#14274E] text-xs font-bold uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4 text-[#14274E]" />
              <span>{t('dir.title')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14274E] tracking-tight flex items-center gap-3">
              <span>{t('dir.title')}</span>
              <span className="text-sm font-bold bg-[#F7F5F0] text-[#14274E] border border-[#E5E0D5] px-3 py-1 rounded-full">
                {filteredSystems.length} {language === 'en' ? 'Desks' : 'አገልግሎቶች'}
              </span>
            </h2>
            <p className="text-sm text-[#6B6558] mt-1">
              {t('dir.subtitle')}
            </p>
          </div>

          {/* Top Quick Status Pill */}
          <div className="flex items-center gap-2.5 text-xs font-bold bg-[#F7F5F0] px-4 py-2.5 rounded-xl border border-[#E5E0D5] text-[#14274E] self-start md:self-auto">
            <Sparkles className="w-4 h-4 text-[#14274E]" />
            <span>
              {language === 'en' 
                ? `Showing ${visibleSystems.length} of ${filteredSystems.length} Available Desks` 
                : `${visibleSystems.length} ከ ${filteredSystems.length} አገልግሎቶች እየታዩ ነው`}
            </span>
          </div>
        </div>

        {/* Filters and Search Bar Row */}
        <div className="bg-[#F7F5F0] border border-[#E5E0D5] rounded-2xl p-4 mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            {/* Status Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setSelectedStatusFilter('all');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedStatusFilter === 'all'
                    ? 'bg-[#0348AB] text-white shadow-xs'
                    : 'bg-white text-[#0a1e36] hover:text-[#0348AB] hover:border-[#0348AB]/40 hover:bg-blue-50/20 border border-[#D8D3C7]'
                }`}
              >
                <span>{t('dir.filterAll')}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  selectedStatusFilter === 'all' ? 'bg-white/20 text-white' : 'bg-[#F7F5F0] text-[#0348AB] border border-[#E5E0D5]'
                }`}>
                  {SYSTEM_METRICS.totalSystems}
                </span>
              </button>

              <button
                onClick={() => {
                  setSelectedStatusFilter('production');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedStatusFilter === 'production'
                    ? 'bg-[#0348AB] text-white shadow-xs'
                    : 'bg-white text-[#0a1e36] hover:text-[#0348AB] hover:border-[#0348AB]/40 hover:bg-blue-50/20 border border-[#D8D3C7]'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${selectedStatusFilter === 'production' ? 'text-white' : 'text-[#0F6E56]'}`} />
                <span>{t('dir.filterProd')}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedStatusFilter('development');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedStatusFilter === 'development'
                    ? 'bg-[#0348AB] text-white shadow-xs'
                    : 'bg-white text-[#0a1e36] hover:text-[#0348AB] hover:border-[#0348AB]/40 hover:bg-blue-50/20 border border-[#D8D3C7]'
                }`}
              >
                <Clock className={`w-3.5 h-3.5 ${selectedStatusFilter === 'development' ? 'text-white' : 'text-[#B45309]'}`} />
                <span>{t('dir.filterDev')}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedStatusFilter('testing');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedStatusFilter === 'testing'
                    ? 'bg-[#0348AB] text-white shadow-xs'
                    : 'bg-white text-[#0a1e36] hover:text-[#0348AB] hover:border-[#0348AB]/40 hover:bg-blue-50/20 border border-[#D8D3C7]'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${selectedStatusFilter === 'testing' ? 'text-white' : 'text-[#B45309]'}`} />
                <span>{t('dir.filterTest')}</span>
              </button>
            </div>

            {/* Quick Search & Category Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 text-[#8A8578] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'en' ? 'Filter by service name...' : 'በስም ይፈልጉ...'}
                  className="w-full bg-white border border-[#D8D3C7] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#0a1e36] placeholder-[#8A8578] focus:outline-hidden focus:border-[#0348AB] focus:ring-1 focus:ring-[#0348AB]/20"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-[#8A8578] shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-48 bg-white border border-[#D8D3C7] rounded-xl px-3 py-1.5 text-xs font-medium text-[#0a1e36] focus:outline-hidden focus:border-[#0348AB] focus:ring-1 focus:ring-[#0348AB]/20 cursor-pointer"
                >
                  <option value="all">{t('cat.all')}</option>
                  <option value="citizen_services">{t('cat.citizen_services')}</option>
                  <option value="land_revenue">{t('cat.land_revenue')}</option>
                  <option value="infrastructure_waste">{t('cat.infrastructure_waste')}</option>
                  <option value="health_safety">{t('cat.health_safety')}</option>
                  <option value="administration">{t('cat.administration')}</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Systems Cards Grid */}
        <AnimatePresence mode="wait">
          {filteredSystems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 bg-[#F7F5F0] rounded-2xl border border-dashed border-[#E5E0D5] space-y-3"
            >
              <Building2 className="w-10 h-10 text-[#8A8578] mx-auto" />
              <h3 className="font-bold text-[#14274E] text-base">
                {language === 'en' ? 'No Services Match Your Search' : 'የተፈለገው አገልግሎት አልተገኘም'}
              </h3>
              <p className="text-xs text-[#6B6558]">
                {language === 'en' ? 'Try adjusting your search query or category filter.' : 'እባክዎ ፍለጋዎን ወይም የተመረጠውን ዘርፍ ይቀይሩ::'}
              </p>
              <button
                onClick={() => {
                  setSelectedStatusFilter('all');
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setIsExpanded(false);
                }}
                className="bg-[#0348AB] hover:bg-[#023888] text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                {language === 'en' ? 'Reset Filters & Show All' : 'ሁሉንም 24 አገልግሎቶች አሳይ'}
              </button>
            </motion.div>
          ) : (
            <div>
              <motion.div 
                key={`${selectedStatusFilter}-${selectedCategory}-${searchQuery}-${isExpanded ? 'expanded' : 'collapsed'}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {visibleSystems.map((system) => {
                  const isProduction = system.status === 'production';
                  const isDev = system.status === 'development';

                  return (
                    <motion.div
                      key={system.id}
                      layout
                      variants={cardSlideVariants}
                      whileHover={{ 
                        y: -6, 
                        transition: { type: 'spring' as const, stiffness: 350, damping: 25 } 
                      }}
                      onClick={() => onOpenSystemModal(system.id)}
                      className="bg-[#F7F5F0] border border-[#E5E0D5] hover:border-[#0348AB]/50 hover:-translate-y-1.5 active:scale-[0.98] rounded-2xl p-5 transition-all duration-200 ease-out cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-md"
                    >
                      <div>
                        {/* Header: Icon, Category & Status Badge */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E0D5] flex items-center justify-center shrink-0 text-[#0348AB] group-hover:border-[#0348AB] group-hover:bg-[#0348AB]/5 transition-colors">
                            {renderIcon(system.iconName)}
                          </div>

                          <div className="flex flex-col items-end gap-0.5">
                            {system.status !== 'production' && (
                              <span className="text-[11px] font-bold text-[#B45309]">
                                {system.status === 'development'
                                  ? (language === 'en' ? 'In Preparation' : 'በዝግጅት ላይ')
                                  : (language === 'en' ? 'Pilot Program' : 'የሙከራ ፕሮግራም')}
                              </span>
                            )}

                            <span className="text-[10px] text-[#8A8578] font-medium">
                              {system.categoryLabel}
                            </span>
                          </div>
                        </div>

                        {/* System Title & Amharic Title */}
                        <h3 className="font-bold text-[#14274E] text-base leading-snug group-hover:text-black transition-colors">
                          {system.name}
                        </h3>
                        
                        <p className="text-xs font-semibold text-[#14274E] my-1 font-sans">
                          {system.amharicName}
                        </p>

                        <p className="text-xs text-[#6B6558] line-clamp-2 my-2 leading-relaxed">
                          {system.description}
                        </p>
                      </div>

                      <div>
                        {/* Progress Bar for Under Development items */}
                        {isDev && system.completionProgress && (
                          <div className="my-3 bg-white p-2.5 rounded-xl border border-[#E5E0D5]">
                            <div className="flex justify-between items-center text-[11px] mb-1 font-semibold text-[#B45309]">
                              <span>{language === 'en' ? 'Service Readiness:' : 'የዝግጅት ደረጃ:'}</span>
                              <span>{system.completionProgress}%</span>
                            </div>
                            <div className="w-full bg-[#E5E0D5] h-1.5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${system.completionProgress}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="bg-[#B45309] h-full rounded-full" 
                              />
                            </div>
                          </div>
                        )}

                        {/* Service Feature Tags */}
                        <div className="flex flex-wrap gap-1.5 my-3">
                          {system.features.slice(0, 2).map((feat, i) => (
                            <span key={i} className="text-[10px] bg-white text-[#6B6558] font-medium px-2 py-0.5 rounded-md border border-[#E5E0D5]">
                              {feat}
                            </span>
                          ))}
                        </div>

                        {/* Card Footer: Woredas & Highly Visible Action Button */}
                        <div className="pt-3 border-t border-[#E5E0D5] flex items-center justify-between gap-2 text-xs">
                          <div className="text-[#8A8578] text-[11px]">
                            <span className="font-bold text-[#0348AB]">{system.woredasServed}</span> {language === 'en' ? 'Woredas Active' : 'ወረዳዎች'}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenSystemModal(system.id);
                            }}
                            className="flex items-center gap-1.5 font-bold text-[#0348AB] text-xs bg-white hover:bg-[#0348AB] hover:text-white border border-[#0348AB]/25 px-3 py-1.5 rounded-xl transition-all cursor-pointer group-hover:border-[#0348AB] group-hover:bg-[#0348AB] group-hover:text-white"
                          >
                            <span>{language === 'en' ? 'Open Desk' : 'አገልግሎቱን ክፈት'}</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </motion.div>

              {/* HIGHLY VISIBLE "EXPLORE MORE / SHOW ALL" ACTION BAR */}
              {filteredSystems.length > INITIAL_CARD_LIMIT && searchQuery.trim() === '' && (
                <div className="mt-10 pt-6 border-t border-[#E5E0D5] flex flex-col items-center justify-center">
                  
                  {/* Visual Overview Info Banner */}
                  <div className="w-full max-w-2xl bg-[#F7F5F0] border-2 border-[#E5E0D5] rounded-2xl p-6 text-center space-y-4 shadow-xs">
                    <div className="flex items-center justify-center gap-2 text-[#0a1e36] font-bold text-sm">
                      <LayoutGrid className="w-4 h-4 text-[#0348AB]" />
                      <span>
                        {language === 'en' 
                          ? `Showing ${visibleSystems.length} of ${filteredSystems.length} Municipal Digital Desks` 
                          : `${visibleSystems.length} ከ ${filteredSystems.length} የማዘጋጃ ቤት አገልግሎቶች እየታዩ ነው`}
                      </span>
                    </div>

                    {/* Progress Bar of Revealed Cards */}
                    <div className="w-full bg-[#E5E0D5] h-2 rounded-full overflow-hidden max-w-md mx-auto">
                      <div 
                        className="bg-[#0348AB] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.round((visibleSystems.length / filteredSystems.length) * 100)}%` }}
                      />
                    </div>

                    <p className="text-xs text-[#6B6558] max-w-lg mx-auto leading-relaxed">
                      {shouldLimit
                        ? (language === 'en'
                            ? `There are ${hiddenCount} additional public services ready for online requests, payment, and district processing.`
                            : `ተጨማሪ ${hiddenCount} የህዝብ አገልግሎቶች ዝግጁ ሆነዋል:: ሁሉንም ለመመልከት ከታች ያለውን አዝራር ይጫኑ::`)
                        : (language === 'en'
                            ? 'All 24 sub-city municipal portals and digital service desks are currently expanded and displayed.'
                            : 'ሁሉም 24ቱ የክፍለ ከተማው ዲጂታል አገልግሎቶች ሙሉ ለሙሉ ቀርበዋል::')}
                    </p>

                    {/* Prominent High-Visibility Primary Explore Button */}
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleToggleExpand}
                        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-extrabold text-sm text-white bg-[#0348AB] hover:bg-[#023888] transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95"
                      >
                        {shouldLimit ? (
                          <>
                            <Compass className="w-4 h-4 text-white animate-pulse" />
                            <span>
                              {language === 'en' 
                                ? `Explore All 24 Services (+${hiddenCount} More)` 
                                : `ሁሉንም 24 አገልግሎቶች ይመልከቱ (+${hiddenCount} ተጨማሪ)`}
                            </span>
                            <ChevronDown className="w-4 h-4 text-white" />
                          </>
                        ) : (
                          <>
                            <ChevronUp className="w-4 h-4 text-white" />
                            <span>
                              {language === 'en' ? 'Show Fewer Services (Collapse)' : 'ጥቂቶቹን ብቻ አሳይ'}
                            </span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

