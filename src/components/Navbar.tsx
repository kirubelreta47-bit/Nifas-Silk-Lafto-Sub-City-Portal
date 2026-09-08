import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Menu, 
  X, 
  ChevronRight, 
  Globe,
  Home,
  FileText,
  Compass,
  MapPin,
  BarChart3,
  PhoneCall,
  Gavel
} from 'lucide-react';

import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSystemModal?: (systemId: string) => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentPath,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { id: 'overview', label: language === 'en' ? 'Overview' : 'ዋና ገጽ', targetId: 'top', icon: Home },
    { id: 'systems', label: language === 'en' ? 'Services' : 'አገልግሎቶች', targetId: 'systems-directory', icon: FileText },
    { id: 'portals', label: language === 'en' ? 'Sub-City Hub' : 'የክፍለ ከተማ ማዕከል', targetId: 'government-portals-section', icon: Compass },
    { id: 'woredas', label: language === 'en' ? 'Woredas Directory' : 'የወረዳዎች ማውጫ', targetId: 'woredas-section', icon: MapPin },
    { id: 'analytics', label: language === 'en' ? 'Data & Stats' : 'መረጃና ስታቲስቲክስ', targetId: 'analytics-section', icon: BarChart3 },
    { id: 'auctions', label: language === 'en' ? 'Live Auctions' : 'ቀጥታ ጨረታዎች', path: '/auctions', icon: Gavel },
  ];

  const handleNavClick = (link: { id: string; path?: string; targetId?: string }) => {
    setMobileMenuOpen(false);
    if (link.path) {
      onNavigate(link.path);
      return;
    }

    setActiveTab(link.id);
    if (currentPath !== '/') {
      onNavigate('/');
      setTimeout(() => {
        if (link.targetId === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (link.targetId) {
          const el = document.getElementById(link.targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
    } else {
      if (link.targetId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (link.targetId) {
        const el = document.getElementById(link.targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="w-full bg-[#FBF9F4] border-b border-gray-200/60 sticky top-0 z-40">
      <div className="w-full max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
        
        {/* Logo Brand */}
        <div 
          onClick={() => {
            if (currentPath !== '/') {
              onNavigate('/');
            } else {
              setActiveTab('overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-[#0348AB] shrink-0 group-hover:shadow-md transition-shadow">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-extrabold text-xs min-[360px]:text-sm sm:text-base tracking-tight text-[#0a1e36] whitespace-nowrap truncate leading-tight">
                {language === 'en' ? 'Nifas Silk-Lafto' : 'ንፋስ  ስልክ ላፍቶ'}
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
        <div className="hidden lg:flex items-center gap-7 text-sm font-semibold text-gray-700 shrink-0">
          {navLinks.filter(link => link.id !== 'overview').map((link) => {
            const isActive = link.path 
              ? currentPath === link.path 
              : (currentPath === '/' && activeTab === link.id);

            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link)}
                className={`transition-colors cursor-pointer relative py-1 flex items-center gap-1.5 ${
                  isActive 
                    ? 'text-[#0348AB] font-bold' 
                    : 'hover:text-[#0348AB]'
                }`}
              >
                <span>{link.label}</span>
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

      {/* Mobile Side Drawer Navigation (Slide from the Side) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Slide-in Sidebar from the Right */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-[290px] sm:w-[340px] max-w-[85vw] h-full bg-[#FBF9F4] shadow-2xl border-l border-gray-200/80 z-50 flex flex-col justify-between overflow-y-auto"
            >
              {/* Drawer Top Header */}
              <div>
                <div className="p-4 sm:p-5 border-b border-gray-200/70 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0348AB] shrink-0">
                      <Building2 className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-extrabold text-sm text-[#0a1e36] block truncate">
                        {language === 'en' ? 'Nifas Silk-Lafto' : 'ንፋስ  ስልክ ላፍቶ'}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium block truncate">
                        {language === 'en' ? 'Sub-City Digital Portal' : 'የክፍለ ከተማ ዲጂታል ፖርታል'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-[#0a1e36] hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="p-3 sm:p-4 space-y-1">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 block mb-2">
                    {language === 'en' ? 'Quick Navigation' : 'ፈጣን ማውጫ'}
                  </span>

                  {navLinks.map((link) => {
                    const isActive = link.path 
                      ? currentPath === link.path 
                      : (currentPath === '/' && activeTab === link.id);
                    const IconComponent = link.icon;

                    return (
                      <button
                        key={link.id}
                        onClick={() => handleNavClick(link)}
                        className={`w-full text-left py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer group ${
                          isActive
                            ? 'bg-[#0348AB] text-white shadow-xs'
                            : 'text-gray-700 hover:bg-white hover:text-[#0348AB] border border-transparent hover:border-gray-200/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#0348AB]'}`} />
                          <span>{link.label}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${isActive ? 'text-white/80' : 'text-gray-300'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>



              {/* Drawer Bottom Footer: Language Toggle & Citizen Support */}
              <div className="p-4 border-t border-gray-200/80 bg-white space-y-3">
                {/* Language Switch */}
                <div className="bg-[#F7F5F0] p-2.5 rounded-xl border border-gray-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    <Globe className="w-4 h-4 text-[#0348AB]" />
                    <span>{language === 'en' ? 'Language / ቋንቋ' : 'ቋንቋ / Language'}</span>
                  </div>
                  <button
                    onClick={toggleLanguage}
                    className="px-3 py-1 bg-white hover:bg-blue-50/50 rounded-lg text-xs font-bold text-[#0348AB] border border-gray-200 shadow-2xs transition-colors cursor-pointer"
                  >
                    {language === 'en' ? 'አማርኛ' : 'English'}
                  </button>
                </div>

                {/* Sub-City Helpline Info */}
                <div className="flex items-center justify-between text-[11px] text-gray-500 px-1">
                  <div className="flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-[#0F6E56]" />
                    <span>{language === 'en' ? 'Helpline:' : 'የስልክ መስመር:'}</span>
                  </div>
                  <span className="font-bold text-[#0a1e36] bg-gray-100 px-2 py-0.5 rounded-md font-mono">8555</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};
