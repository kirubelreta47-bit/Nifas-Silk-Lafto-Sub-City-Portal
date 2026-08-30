import React, { useState } from 'react';
import { 
  Users, 
  ArrowRight,
  MapPin, 
  Search, 
  FileText, 
  FileSearch,
  Landmark,
  HandCoins,
  Building,
  Globe
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  onNavigateToSystems?: (statusFilter?: 'all' | 'production' | 'development' | 'testing') => void;
  onNavigateToAnalytics?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigateToSystems,
  onNavigateToAnalytics,
}) => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNavigateToSystems) {
      onNavigateToSystems('all');
    }
    const directory = document.getElementById('systems-directory');
    if (directory) {
      directory.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePopularClick = (serviceName: string) => {
    setSearchTerm(serviceName);
    if (onNavigateToSystems) {
      onNavigateToSystems('all');
    }
    const directory = document.getElementById('systems-directory');
    if (directory) {
      directory.scrollIntoView({ behavior: 'smooth' });
      const searchInput = directory.querySelector('input') as HTMLInputElement | null;
      if (searchInput) {
        searchInput.value = serviceName;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-[#FBF9F4] border-b border-gray-200/70 pt-6 pb-12">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 flex-1 flex flex-col justify-center">
        
        {/* Main Hero 2-Column Balanced Grid (50% Left / 50% Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Heading, Info, Search, Popular Tags */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Administration Location Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200/80 text-xs font-medium text-gray-600 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>
                {language === 'en' 
                  ? 'Nifas Silk-Lafto Sub-City Administration • Addis Ababa' 
                  : 'የነፋስ ስልክ ላፍቶ ክፍለ ከተማ አስተዳደር • አዲስ አበባ'}
              </span>
            </div>

            {/* Large 2-Line Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[46px] xl:text-[50px] font-extrabold text-[#0a1e36] tracking-tight leading-[1.14]">
              {language === 'en' ? (
                <>
                  Access Fast &amp; Reliable <br className="hidden sm:inline" />
                  Public Services Online
                </>
              ) : (
                <>
                  ፈጣን እና አስተማማኝ <br className="hidden sm:inline" />
                  የህዝብ አገልግሎቶችን በኦንላይን ያግኙ
                </>
              )}
            </h1>

            {/* Supporting Text Paragraph */}
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl">
              {language === 'en' ? (
                'Welcome to the official public portal for Nifas Silk-Lafto Sub-City. Access 24 municipal services, find your local Woreda office, pay property taxes, or verify vital event records online.'
              ) : (
                'ወደ ነፋስ ስልክ ላፍቶ ክፍለ ከተማ ኦፊሴላዊ የህዝብ ፖርታል እንኳን በደህና መጡ:: 24ቱን የማዘጋጃ ቤት አገልግሎቶች ያግኙ፣ የወረዳ ቢሮዎችን ያግኙ፣ የንብረት ግብር ይክፈሉ ወይም የነዋሪነትና ወሳኝ ኩነቶችን በመስመር ላይ ያረጋግጡ::'
              )}
            </p>

            {/* Search Bar Form */}
            <form 
              onSubmit={handleSearchSubmit}
              className="bg-white p-1.5 rounded-full border border-gray-200/90 shadow-sm flex items-center max-w-xl transition-all focus-within:border-[#0b2138] focus-within:ring-2 focus-within:ring-[#0b2138]/10"
            >
              <div className="pl-4 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input 
                id="hero-service-search"
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === 'en' ? 'Search for any municipal service...' : 'የሚፈልጉትን አገልግሎት ይፈልጉ...'} 
                className="w-full px-3 py-2 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
              <button 
                type="submit"
                className="bg-[#0b2138] hover:bg-[#123152] text-white text-xs font-semibold px-5 py-3 rounded-full flex items-center gap-2 transition-all shrink-0 cursor-pointer"
              >
                <span>{language === 'en' ? 'Search Service' : 'አገልግሎት ፈልግ'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Popular Service Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
              <span className="text-gray-500 font-medium mr-0.5">
                {language === 'en' ? 'Popular:' : 'ተወዳጅ:'}
              </span>
              <button 
                type="button"
                onClick={() => handlePopularClick('Kebele ID')}
                className="px-3.5 py-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-gray-700 font-medium transition-all shadow-xs cursor-pointer"
              >
                {language === 'en' ? 'Kebele ID' : 'የቀበሌ መታወቂያ'}
              </button>
              <button 
                type="button"
                onClick={() => handlePopularClick('Tax Payment')}
                className="px-3.5 py-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-gray-700 font-medium transition-all shadow-xs cursor-pointer"
              >
                {language === 'en' ? 'Tax Payment' : 'የግብር ክፍያ'}
              </button>
              <button 
                type="button"
                onClick={() => handlePopularClick('Land Permits')}
                className="px-3.5 py-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-gray-700 font-medium transition-all shadow-xs cursor-pointer"
              >
                {language === 'en' ? 'Land Permits' : 'የይዞታ ፈቃድ'}
              </button>
              <button 
                type="button"
                onClick={() => handlePopularClick('Marriage Certificate')}
                className="px-3.5 py-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-gray-700 font-medium transition-all shadow-xs cursor-pointer"
              >
                {language === 'en' ? 'Marriage Certificate' : 'የጋብቻ ምስክር ወረቀት'}
              </button>
            </div>
          </motion.div>

          {/* Right Column: Hero Illustration & Info Cards */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-6 relative flex flex-col items-center justify-center"
          >
            {/* Upper Right Status Badge */}
            <div className="w-full flex justify-end mb-3 lg:mb-0 lg:absolute lg:top-0 lg:right-2 z-20">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-gray-200/90 text-gray-700 text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Available Online (14)</span>
              </div>
            </div>

            {/* Illustration Image Container - Blends seamlessly into background */}
            <div className="w-full flex items-center justify-center pt-2 lg:pt-6">
              <img 
                src="/side-image.png" 
                alt="Nifas Silk-Lafto Sub-City Municipal Portal & Citizen Services" 
                className="w-full h-auto max-h-[480px] object-contain select-none pointer-events-none drop-shadow-xs"
                loading="eager"
              />
            </div>
          </motion.div>

        </div>

        {/* 4 Bottom Metric Highlights Cards with unified hover animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 sm:mt-10">
          
          {/* Card 1: Available Services */}
          <div 
            onClick={() => {
              if (onNavigateToSystems) onNavigateToSystems('all');
              scrollToSection('systems-directory');
            }}
            className="bg-white p-5 rounded-2xl border border-gray-200/80 hover:border-[#0d2d4c]/40 hover:-translate-y-1.5 shadow-xs hover:shadow-md active:scale-[0.98] transition-all duration-200 ease-out cursor-pointer group flex items-center justify-between min-h-[90px]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700 group-hover:bg-[#0d2d4c]/5 group-hover:scale-105 transition-all">
                <FileText className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block">
                  {language === 'en' ? 'Available Services' : 'ዝግጁ አገልግሎቶች'}
                </span>
                <strong className="text-2xl font-bold text-[#0a1e36]">24</strong>
              </div>
            </div>
            <Building className="w-5 h-5 text-gray-300 group-hover:text-[#0d2d4c]/60 group-hover:scale-110 transition-all" />
          </div>

          {/* Card 2: Connect & Track Applications */}
          <div 
            onClick={() => scrollToSection('government-portals-section')}
            className="bg-white p-5 rounded-2xl border border-gray-200/80 hover:border-[#0d2d4c]/40 hover:-translate-y-1.5 shadow-xs hover:shadow-md active:scale-[0.98] transition-all duration-200 ease-out cursor-pointer group flex items-center justify-between min-h-[90px]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700 group-hover:bg-[#0d2d4c]/5 group-hover:scale-105 transition-all">
                <FileSearch className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block">
                  {language === 'en' ? 'Connect & Track' : 'ይከታተሉና ያገናኙ'}
                </span>
                <strong className="text-xl font-bold text-[#0a1e36] leading-tight block">
                  {language === 'en' ? 'Applications' : 'ማመልከቻዎች'}
                </strong>
              </div>
            </div>
            <Globe className="w-5 h-5 text-gray-300 group-hover:text-[#0d2d4c]/60 group-hover:scale-110 transition-all" />
          </div>

          {/* Card 3: Woreda Offices */}
          <div 
            onClick={() => scrollToSection('woredas-section')}
            className="bg-white p-5 rounded-2xl border border-gray-200/80 hover:border-[#0d2d4c]/40 hover:-translate-y-1.5 shadow-xs hover:shadow-md active:scale-[0.98] transition-all duration-200 ease-out cursor-pointer group flex items-center justify-between min-h-[90px]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700 group-hover:bg-[#0d2d4c]/5 group-hover:scale-105 transition-all">
                <Landmark className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block">
                  {language === 'en' ? 'Woreda Offices' : 'የወረዳ ቢሮዎች'}
                </span>
                <strong className="text-2xl font-bold text-[#0a1e36]">15</strong>
              </div>
            </div>
            <MapPin className="w-5 h-5 text-gray-300 group-hover:text-[#0d2d4c]/60 group-hover:scale-110 transition-all" />
          </div>

          {/* Card 4: Daily Citizen Transactions */}
          <div 
            onClick={() => {
              if (onNavigateToAnalytics) onNavigateToAnalytics();
              scrollToSection('analytics-section');
            }}
            className="bg-white p-5 rounded-2xl border border-gray-200/80 hover:border-[#0d2d4c]/40 hover:-translate-y-1.5 shadow-xs hover:shadow-md active:scale-[0.98] transition-all duration-200 ease-out cursor-pointer group flex items-center justify-between min-h-[90px]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700 group-hover:bg-[#0d2d4c]/5 group-hover:scale-105 transition-all">
                <HandCoins className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium block">
                  {language === 'en' ? 'Daily Citizen Transactions' : 'የዕለት የዜጎች ግብይቶች'}
                </span>
                <strong className="text-2xl font-bold text-[#0a1e36]">18.4k+</strong>
              </div>
            </div>
            <Users className="w-5 h-5 text-gray-300 group-hover:text-[#0d2d4c]/60 group-hover:scale-110 transition-all" />
          </div>

        </div>

      </div>
    </section>
  );
};
