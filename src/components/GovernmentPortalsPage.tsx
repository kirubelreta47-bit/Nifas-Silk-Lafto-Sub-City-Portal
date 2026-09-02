import React, { useState, useMemo } from 'react';
import { 
  ExternalLink, 
  Building2, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  Factory, 
  TrafficCone, 
  Search, 
  CheckCircle2, 
  Globe, 
  Lock, 
  ArrowUpRight, 
  ChevronRight, 
  Info,
  Sparkles,
  Layers,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GOV_PORTALS, GovPortal } from '../data/govPortalsData';
import { useLanguage } from '../context/LanguageContext';

interface GovernmentPortalsPageProps {
  onBackToOverview?: () => void;
}

// Card sliding appearance animation variants
const portalContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const portalCardSlideVariants = {
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

export const GovernmentPortalsPage: React.FC<GovernmentPortalsPageProps> = ({
  onBackToOverview
}) => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPortalModal, setSelectedPortalModal] = useState<GovPortal | null>(null);

  // Render Category Icon
  const renderPortalIcon = (iconName: string) => {
    const props = { className: "w-5 h-5 text-[#0348AB]" };
    switch (iconName) {
      case 'MapPin': return <MapPin {...props} />;
      case 'Building2': return <Building2 {...props} />;
      case 'Factory': return <Factory {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Briefcase': return <Briefcase {...props} />;
      case 'TrafficCone': return <TrafficCone {...props} />;
      default: return <Building2 {...props} />;
    }
  };

  // Filter Portals by category & search
  const filteredPortals = useMemo(() => {
    return GOV_PORTALS.filter((portal) => {
      if (selectedCategory !== 'all' && portal.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = portal.title.toLowerCase().includes(q);
        const matchAmharic = portal.amharicTitle.toLowerCase().includes(q);
        const matchDept = portal.department.toLowerCase().includes(q);
        const matchDesc = portal.description.toLowerCase().includes(q);
        const matchDomain = portal.domain.toLowerCase().includes(q);
        const matchTag = portal.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchAmharic && !matchDept && !matchDesc && !matchDomain && !matchTag) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const categories = [
    { id: 'all', label: language === 'en' ? 'All Portals (6)' : 'ሁሉም ፖርታሎች (6)' },
    { id: 'land_housing', label: language === 'en' ? 'Land & Housing' : 'መሬትና ቤቶች' },
    { id: 'trade_industry', label: language === 'en' ? 'Trade & Industry' : 'ንግድና ኢንዱስትሪ' },
    { id: 'roads_infrastructure', label: language === 'en' ? 'Roads & Infrastructure' : 'መንገዶችና መሰረተ-ልማት' },
    { id: 'municipal_governance', label: language === 'en' ? 'Mayor & Governance' : 'የከንቲባ ጽ/ቤት' }
  ];

  return (
    <section id="government-portals-section" className="py-12 bg-white text-[#6B6558] border-t border-[#E5E0D5] relative">
      <div className="w-full max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10">
        
        {/* Page Top Header */}
        <div className="mb-10 pb-6 border-b border-[#E5E0D5]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#14274E] text-xs font-bold uppercase tracking-wider mb-2">
                <Globe className="w-4 h-4 text-[#14274E]" />
                <span>{language === 'en' ? 'Official Public Digital Portals' : 'ኦፊሴላዊ የመንግሥት ዲጂታል ፖርታሎች'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F6E56]"></span>
                <span className="text-[#0F6E56] font-bold lowercase">.gov.et verified</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#14274E] tracking-tight">
                {language === 'en' ? 'Official Government Service Portals' : 'የመንግሥትና ማዘጋጃ ቤታዊ አገልግሎት ፖርታሎች'}
              </h1>
              
              <p className="text-sm text-[#6B6558] mt-2 max-w-3xl leading-relaxed">
                {language === 'en'
                  ? 'Direct gateways to authorized municipal and federal digital platforms serving Nifas Silk-Lafto citizens, business owners, and property holders. Click any portal to access real-time applications and verified registries.'
                  : 'ለንፋስ  ስልክ ላፍቶ ነዋሪዎች፣ ነጋዴዎችና ባለይዞታዎች የቀረቡ ኦፊሴላዊ የከተማ አስተዳደርና የፌዴራል ዲጂታል ፖርታሎች:: ቀጥታ ለመጠቀም ካርዶቹን ይጫኑ::'}
              </p>
            </div>

            {/* Quick Security & SSL Guarantee Pill */}
            <div className="bg-[#F7F5F0] border border-[#E5E0D5] rounded-2xl p-4 flex items-center gap-3 shrink-0 self-start lg:self-auto">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E0D5] flex items-center justify-center text-[#0F6E56]">
                <Lock className="w-5 h-5 text-[#0F6E56]" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-[#14274E] flex items-center gap-1.5">
                  <span>{language === 'en' ? 'Official State Gateways' : 'የተረጋገጡ የመንግሥት ፖርታሎች'}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F6E56]" />
                </div>
                <div className="text-[#8A8578] text-[11px] font-mono mt-0.5">
                  *.gov.et domain infrastructure
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-8 bg-[#F7F5F0] p-4 rounded-2xl border border-[#E5E0D5] space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-[#0348AB] text-white shadow-xs'
                      : 'bg-white text-[#0a1e36] hover:text-[#0348AB] hover:border-[#0348AB]/40 hover:bg-blue-50/20 border border-[#D8D3C7]'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="w-4 h-4 text-[#8A8578] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'en' ? 'Search portals, eLand, eTrade...' : 'ፖርታሎችን ፈልግ (ካዳስተር፣ ንግድ...)'}
                className="w-full bg-white border border-[#D8D3C7] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#14274E] placeholder-[#8A8578] focus:outline-hidden focus:border-[#14274E] transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A8578] hover:text-[#14274E] font-bold"
                >
                  ✕
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Portals Cards Grid */}
        {filteredPortals.length === 0 ? (
          <div className="text-center py-16 bg-[#F7F5F0] rounded-2xl border border-[#E5E0D5] p-8">
            <Globe className="w-12 h-12 text-[#8A8578] mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-[#14274E]">
              {language === 'en' ? 'No Portals Match Your Filter' : 'ምንም የተገኘ ፖርታል የለም'}
            </h3>
            <p className="text-xs text-[#6B6558] mt-1 mb-4">
              {language === 'en' ? 'Try adjusting your search keyword or selecting "All Portals".' : 'እባክዎ ሌላ ቃል ይፈልጉ ወይም ሁሉንም ፖርታሎች ይምረጡ::'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="bg-[#0348AB] hover:bg-[#023888] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              {language === 'en' ? 'Reset Filters' : 'ሁሉንም አሳይ'}
            </button>
          </div>
        ) : (
          <motion.div 
            key={`${selectedCategory}-${searchQuery}`}
            variants={portalContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPortals.map((portal) => (
              <motion.div
                key={portal.id}
                layout
                variants={portalCardSlideVariants}
                whileHover={{ 
                  y: -6, 
                  transition: { type: 'spring' as const, stiffness: 350, damping: 25 } 
                }}
                onClick={() => setSelectedPortalModal(portal)}
                className="bg-[#F7F5F0] border border-[#E5E0D5] hover:border-[#0348AB]/50 hover:-translate-y-1.5 active:scale-[0.98] rounded-2xl p-5 transition-all duration-200 ease-out cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div>
                  {/* Header: Icon, Category & Gov Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E0D5] flex items-center justify-center shrink-0 group-hover:border-[#0348AB] transition-colors">
                      {renderPortalIcon(portal.iconName)}
                    </div>
                    
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[11px] font-bold text-[#0F6E56] flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0F6E56] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0F6E56]"></span>
                        </span>
                        {language === 'en' ? 'Available Online' : 'በመስመር ላይ ይገኛል'}
                      </span>
                      <span className="text-[10px] text-[#8A8578] font-medium">
                        {language === 'en' ? portal.categoryLabel : portal.amharicCategoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Portal Title & Amharic Title */}
                  <h3 className="font-bold text-[#14274E] text-base leading-snug group-hover:text-black transition-colors">
                    {portal.title}
                  </h3>
                  
                  <p className="text-xs font-semibold text-[#14274E] my-1 font-sans">
                    {portal.amharicTitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-[#6B6558] line-clamp-2 my-2 leading-relaxed">
                    {language === 'en' ? portal.description : portal.amharicDescription}
                  </p>
                </div>

                <div>
                  {/* Service Feature Tags */}
                  <div className="flex flex-wrap gap-1.5 my-3">
                    {portal.keyServices.slice(0, 2).map((srv, idx) => (
                      <span key={idx} className="text-[10px] bg-white text-[#6B6558] font-medium px-2 py-0.5 rounded-md border border-[#E5E0D5]">
                        {language === 'en' ? srv.name : srv.amharicName}
                      </span>
                    ))}
                  </div>

                  {/* Card Footer: Domain & Action Buttons */}
                  <div className="pt-3 border-t border-[#E5E0D5] flex items-center justify-between gap-2 text-xs">
                    <div className="text-[#8A8578] text-[11px] flex items-center gap-1 font-mono truncate max-w-[130px] sm:max-w-[160px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0F6E56] shrink-0"></span>
                      <span className="truncate">{portal.domain}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPortalModal(portal);
                        }}
                        className="p-1.5 bg-white hover:bg-[#0348AB] hover:text-white hover:border-[#0348AB] text-[#0348AB] rounded-xl border border-[#D8D3C7] transition-all cursor-pointer"
                        title={language === 'en' ? 'View details' : 'ዝርዝር መረጃ'}
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={portal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 font-bold text-[#0348AB] text-xs bg-white hover:bg-[#0348AB] hover:text-white border border-[#0348AB]/25 px-3 py-1.5 rounded-xl transition-all cursor-pointer group-hover:border-[#0348AB] group-hover:bg-[#0348AB] group-hover:text-white"
                      >
                        <span>{language === 'en' ? 'Launch' : 'ክፈት'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Civic Redirection Notice Footer */}
        <div className="mt-12 p-6 bg-[#F7F5F0] rounded-2xl border border-[#E5E0D5] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E0D5] flex items-center justify-center text-[#14274E] shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#14274E]" />
            </div>
            <div className="text-xs">
              <h4 className="font-bold text-[#14274E]">
                {language === 'en' ? 'Secure Official Federal & Municipal Redirection' : 'የተጠበቀ የመንግሥት ድረ-ገጾች ትስስር'}
              </h4>
              <p className="text-[#6B6558] mt-0.5">
                {language === 'en' 
                  ? 'All links directly connect to secure government servers (*.gov.et). Make sure to log in with your valid National ID or commercial credentials.' 
                  : 'ሁሉም ሊንኮች ወደ ኦፊሴላዊ የመንግሥት ሰርቨሮች (*.gov.et) ያቀናሉ:: በብሔራዊ መታወቂያዎ ወይም በንግድ ፈቃድ ቁጥርዎ መጠቀም ይችላሉ::'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onBackToOverview && (
              <button
                onClick={onBackToOverview}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#14274E] bg-white border border-[#D8D3C7] hover:bg-[#F7F5F0] transition-colors cursor-pointer"
              >
                {language === 'en' ? 'Back to Overview' : 'ወደ ዋናው ገጽ'}
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Modal for In-Depth Portal Specifications */}
      <AnimatePresence>
        {selectedPortalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 border-2 border-[#E5E0D5] shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-4 border-b border-[#E5E0D5] pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#F7F5F0] border border-[#E5E0D5] flex items-center justify-center text-[#14274E]">
                    {renderPortalIcon(selectedPortalModal.iconName)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#14274E] text-lg">
                      {selectedPortalModal.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#8A8578]">
                      {selectedPortalModal.amharicTitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPortalModal(null)}
                  className="w-8 h-8 rounded-lg bg-[#F7F5F0] text-[#14274E] hover:bg-[#E5E0D5] flex items-center justify-center font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-4 text-xs text-[#6B6558]">
                
                {/* Bureau Info */}
                <div className="bg-[#F7F5F0] p-3.5 rounded-xl border border-[#E5E0D5]">
                  <span className="text-[10px] font-bold text-[#8A8578] uppercase block mb-1">
                    {language === 'en' ? 'Administering Bureau / Authority' : 'አስተዳዳሪው መምሪያ/ባለሥልጣን'}
                  </span>
                  <p className="font-bold text-[#14274E]">
                    {language === 'en' ? selectedPortalModal.department : selectedPortalModal.amharicDepartment}
                  </p>
                </div>

                {/* Scope & Target Audience */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-[#F7F5F0] p-3 rounded-xl border border-[#E5E0D5]">
                    <span className="text-[10px] font-bold text-[#8A8578] uppercase block mb-1">
                      {language === 'en' ? 'Target Users' : 'የአገልግሎቱ ተጠቃሚዎች'}
                    </span>
                    <p className="font-semibold text-[#14274E]">
                      {language === 'en' ? selectedPortalModal.targetAudience : selectedPortalModal.amharicTargetAudience}
                    </p>
                  </div>

                  <div className="bg-[#F7F5F0] p-3 rounded-xl border border-[#E5E0D5]">
                    <span className="text-[10px] font-bold text-[#8A8578] uppercase block mb-1">
                      {language === 'en' ? 'Sub-City Geographic Coverage' : 'የክፍለ ከተማው ሽፋን'}
                    </span>
                    <p className="font-semibold text-[#14274E]">
                      {language === 'en' ? selectedPortalModal.subCityScope : selectedPortalModal.amharicSubCityScope}
                    </p>
                  </div>
                </div>

                {/* All 4 Analyzed Services */}
                <div className="space-y-2">
                  <span className="font-bold text-[#14274E] text-sm block">
                    {language === 'en' ? 'Detailed Portal Modules & Capabilities:' : 'የፖርታሉ ዝርዝር አገልግሎቶች:'}
                  </span>

                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {selectedPortalModal.keyServices.map((srv, i) => (
                      <div key={i} className="p-3 bg-white rounded-xl border border-[#E5E0D5]">
                        <h5 className="font-bold text-[#14274E] text-xs mb-1">
                          {language === 'en' ? srv.name : srv.amharicName}
                        </h5>
                        <p className="text-[11px] text-[#6B6558] leading-relaxed">
                          {srv.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action Link in Modal */}
                <div className="pt-4 border-t border-[#E5E0D5] flex items-center justify-between gap-3">
                  <span className="font-mono text-[11px] text-[#8A8578]">
                    {selectedPortalModal.url}
                  </span>

                  <a
                    href={selectedPortalModal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#0348AB] hover:bg-[#023888] text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95"
                  >
                    <span>{language === 'en' ? 'Proceed to Official Site' : 'ወደ ኦፊሴላዊ ድረ-ገጽ ቀጥል'}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                  </a>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
