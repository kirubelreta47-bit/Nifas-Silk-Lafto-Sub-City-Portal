import React, { useState } from 'react';
import { 
  Building2, 
  Menu, 
  X,
  ChevronRight,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSystemModal?: (systemId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  const navLinks = [
    { id: 'systems', label: language === 'en' ? 'Services' : 'አገልግሎቶች', targetId: 'systems-directory' },
    { id: 'portals', label: language === 'en' ? 'Sub-City Hub' : 'የክፍለ ከተማ ማዕከል', targetId: 'government-portals-section' },
    { id: 'woredas', label: language === 'en' ? 'Woredas Directory' : 'የወረዳዎች ማውጫ', targetId: 'woredas-section' },
    { id: 'analytics', label: language === 'en' ? 'Data & Stats' : 'መረጃና ስታቲስቲክስ', targetId: 'analytics-section' },
  ];

  const handleNavClick = (id: string, targetId: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="w-full bg-[#FBF9F4] border-b border-gray-200/60 sticky top-0 z-40">
      <div className="w-full max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
        
        {/* Logo Brand */}
        <div 
          onClick={() => {
            setActiveTab('overview');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-[#0348AB] shrink-0 group-hover:shadow-md transition-shadow">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-extrabold text-xs min-[360px]:text-sm sm:text-base tracking-tight text-[#0a1e36] whitespace-nowrap truncate leading-tight">
                {language === 'en' ? 'Nifas Silk-Lafto' : 'ነፋስ ስልክ ላፍቶ'}
              </h1>
              {/* Short badge on mobile, full badge on larger screens */}
              <span className="sm:hidden inline-flex items-center bg-[#f0ece1] text-[#4a5568] text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                {language === 'en' ? 'Portal' : 'ፖርታል'}
              </span>
              <span className="hidden sm:inline-flex items-center bg-[#f0ece1] text-[#4a5568] text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shrink-0">
                {language === 'en' ? 'Sub-City Portal' : 'ክፍለ ከተማ ፖርታል'}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium whitespace-nowrap truncate leading-tight mt-0.5">
              {language === 'en' ? 'Addis Ababa City Administration' : 'አዲስ አበባ ከተማ አስተዳደር'}
            </p>
          </div>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-700 shrink-0">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id, link.targetId)}
                className={`transition-colors cursor-pointer relative py-1 ${
                  isActive 
                    ? 'text-[#0348AB] font-bold' 
                    : 'hover:text-[#0348AB]'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0348AB] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Action: Language Switch & Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button 
            onClick={toggleLanguage}
            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-gray-200/90 bg-white hover:bg-blue-50/40 hover:border-[#0348AB]/30 text-xs font-semibold text-[#0a1e36] transition-colors shadow-2xs cursor-pointer flex items-center gap-1 sm:gap-1.5"
            title="Toggle Language / ቋንቋ ቀይር"
          >
            <Globe className="w-3.5 h-3.5 text-[#0348AB] shrink-0" />
            <span className="hidden sm:inline">{language === 'en' ? 'አማርኛ' : 'English'}</span>
            <span className="sm:hidden">{language === 'en' ? 'አማ' : 'EN'}</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-2"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id, link.targetId)}
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-[#FBF9F4] flex items-center justify-between cursor-pointer"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                {language === 'en' ? 'Language / ቋንቋ' : 'ቋንቋ / Language'}
              </span>
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700"
              >
                {language === 'en' ? 'አማርኛ' : 'English'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
