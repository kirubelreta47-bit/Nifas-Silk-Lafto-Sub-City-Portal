import React, { useState } from 'react';
import { Building2, MapPin, Users, CheckCircle2, Shield, Radio, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WOREDAS_LIST } from '../data/subcityData';
import { WoredaInfo } from '../types';
import { useLanguage } from '../context/LanguageContext';

const woredaListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.03,
    },
  },
};

const woredaItemVariants = {
  hidden: { 
    opacity: 0, 
    x: -20,
    scale: 0.98
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: { 
      type: 'spring' as const,
      damping: 24,
      stiffness: 280,
    } 
  },
};

export const WoredasExplorer: React.FC = () => {
  const [selectedWoreda, setSelectedWoreda] = useState<WoredaInfo>(WOREDAS_LIST[2]); // Default Woreda 03
  const { language, t } = useLanguage();

  return (
    <section id="woredas-section" className="py-12 bg-white text-[#6B6558] border-t border-[#E5E0D5] relative">
      <div className="w-full max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-[#E5E0D5]">
          <div>
            <div className="flex items-center gap-2 text-[#14274E] text-xs font-bold uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4 text-[#14274E]" />
              <span>{t('woredas.title')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14274E] tracking-tight">
              {t('woredas.title')}
            </h2>
            <p className="text-sm text-[#6B6558] mt-1">
              {t('woredas.subtitle')}
            </p>
          </div>
        </div>

        {/* Layout: Left Sidebar Woredas Grid + Right Detail View */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Woredas Grid List */}
          <motion.div 
            variants={woredaListVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="lg:col-span-7 grid sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1"
          >
            {WOREDAS_LIST.map((woreda) => {
              const isSelected = selectedWoreda.id === woreda.id;

              return (
                <motion.div
                  key={woreda.id}
                  variants={woredaItemVariants}
                  whileHover={{ y: -5, transition: { type: 'spring' as const, stiffness: 350, damping: 25 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedWoreda(woreda)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                    isSelected
                      ? 'bg-[#F7F5F0] text-[#0a1e36] border-[#0348AB] ring-2 ring-[#0348AB]/30'
                      : 'bg-white hover:bg-blue-50/20 hover:border-[#0348AB]/40 text-[#6B6558] border-[#E5E0D5]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-[#0348AB] text-white shadow-xs' : 'bg-blue-50/70 text-[#0348AB] border border-blue-100'
                    }`}>
                      {woreda.numberStr}
                    </span>

                    <span className="text-[11px] font-bold text-[#0F6E56]">
                      {woreda.systemsActive}/24 {t('woredas.activeSystems')}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#14274E]">
                    {language === 'am' ? woreda.amharicName : woreda.name}
                  </h3>

                  <p className="text-xs text-[#8A8578] mb-2 font-medium">
                    {language === 'am' ? woreda.name : woreda.amharicName}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {woreda.neighborhoods.map((n, idx) => (
                      <span 
                        key={idx}
                        className={`text-[10px] px-2 py-0.5 rounded-md ${
                          isSelected ? 'bg-white text-[#14274E] border border-[#E5E0D5]' : 'bg-[#F7F5F0] text-[#6B6558] border border-[#E5E0D5]'
                        }`}
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Selected Woreda Detail Panel with Sliding Appearance */}
          <div className="lg:col-span-5 bg-[#F7F5F0] text-[#6B6558] rounded-2xl p-6 border border-[#E5E0D5] sticky top-20 shadow-xs">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedWoreda.id}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring' as const, damping: 25, stiffness: 280 }}
              >
                <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-3 mb-4">
                  <div>
                    <span className="text-[10px] text-[#8A8578] font-bold uppercase tracking-wider block">
                      {t('woredas.spotlight')} • {selectedWoreda.numberStr}
                    </span>
                    <h3 className="text-xl font-bold text-[#14274E]">
                      {language === 'am' ? selectedWoreda.amharicName : selectedWoreda.name}
                    </h3>
                  </div>

                  <span className="text-[#0F6E56] text-xs font-bold">
                    {selectedWoreda.status}
                  </span>
                </div>

                <p className="text-sm text-[#8A8578] font-medium mb-4">
                  {language === 'am' ? selectedWoreda.name : selectedWoreda.amharicName}
                </p>

                <div className="space-y-3 text-xs mb-6">
                  <div className="flex justify-between text-[#6B6558] pb-2 border-b border-[#E5E0D5]">
                    <span>{t('woredas.population')}:</span>
                    <strong className="text-[#14274E] font-bold">{selectedWoreda.population.toLocaleString()}</strong>
                  </div>

                  <div className="flex justify-between text-[#6B6558] pb-2 border-b border-[#E5E0D5]">
                    <span>{t('woredas.activeSystems')}:</span>
                    <strong className="text-[#0F6E56] font-bold">{selectedWoreda.systemsActive} / 24</strong>
                  </div>

                  <div className="flex justify-between text-[#6B6558] pb-2 border-b border-[#E5E0D5]">
                    <span>{t('woredas.chiefOfficer')}:</span>
                    <strong className="text-[#14274E] font-bold">{selectedWoreda.chiefOfficer}</strong>
                  </div>

                  <div className="flex justify-between text-[#6B6558]">
                    <span>{t('woredas.officeLoc')}:</span>
                    <strong className="text-[#14274E] font-bold text-right max-w-[200px]">{selectedWoreda.officeLocation}</strong>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-[#14274E] block mb-2">
                    {language === 'en' ? 'Key Neighborhood Zones:' : 'ዋና ዋና የመኖሪያ እና የንግድ ሰፈሮች:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWoreda.neighborhoods.map((n, i) => (
                      <span key={i} className="text-xs bg-white text-[#6B6558] px-3 py-1 rounded-lg border border-[#E5E0D5]">
                        📍 {n}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5E0D5] flex items-center justify-between text-xs text-[#8A8578]">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#0F6E56]" />
                    {language === 'en' ? 'Direct Service Sync Active' : 'ቀጥታ ግንኙነት ንቁ'}
                  </span>
                  <span className="text-[#0F6E56] font-bold">100% {language === 'en' ? 'Operational' : 'ዝግጁ'}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};

