import React from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  Wind, 
  Trees, 
  TrendingUp, 
  ShieldCheck, 
  Mountain,
  Zap,
  Globe
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'motion/react';
import { SUBCITY_INFO, ELEVATION_PROFILE } from '../data/subcityData';
import { useLanguage } from '../context/LanguageContext';

export const AboutSubCity: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section id="about-section" className="py-12 bg-white text-[#6B6558] border-t border-[#E5E0D5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex items-center gap-2 text-[#14274E] text-xs font-bold uppercase tracking-wider mb-1">
          <Wind className="w-4 h-4 text-[#14274E]" />
          <span>{t('about.title')}</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14274E] tracking-tight mb-2">
          {t('about.title')} ({language === 'en' ? 'ነፋስ ስልክ ላፍቶ' : 'Nifas Silk-Lafto'})
        </h2>
        
        <p className="text-sm text-[#6B6558] max-w-3xl mb-8 leading-relaxed">
          {t('about.subtext')}
        </p>

        {/* Origin & Meaning Highlight Box */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-[#F7F5F0] text-[#6B6558] rounded-2xl p-6 mb-10 border border-[#E5E0D5]"
        >
          <div className="grid md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 bg-white text-[#14274E] text-xs font-bold px-3 py-1 rounded-full border border-[#E5E0D5]">
                <Wind className="w-3.5 h-3.5 text-[#14274E]" />
                <span>{language === 'en' ? 'Meaning of "Nifas Silk" (ነፋስ ስልክ)' : 'የ"ነፋስ ስልክ" ትርጉም እና ታሪክ'}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#14274E]">
                {language === 'en' 
                  ? '"Wind Wire": Historical Telecommunication Ridge & Acacia Highland' 
                  : 'የቴሌኮሙኒኬሽን ታሪካዊ መነሻ እና የአካሺያ ለም ኮረብታ'}
              </h3>

              <p className="text-sm text-[#6B6558] leading-relaxed font-normal">
                {SUBCITY_INFO.meaning} {language === 'en' 
                  ? 'Today, this historical legacy translates into modern civic digital accessibility across all 15 Woredas.' 
                  : 'ዛሬ ይህ ታሪካዊ ቅርስ በሁሉም 15 ወረዳዎች ለሚኖሩ ዜጎች ምቹ የሆኑ ዘመናዊ አገልግሎቶችን በማቅረብ ቀጥሏል::'}
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#6B6558]">
                <span className="flex items-center gap-1.5">
                  <Trees className="w-4 h-4 text-[#14274E]" />
                  <strong className="text-[#14274E]">Lafto Ridge</strong>: Acacia Eco-Zone
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#14274E]" />
                  <strong className="text-[#14274E]">Connected Woredas</strong>: 01 - 15
                </span>
              </div>
            </div>

            <div className="md:col-span-4 bg-white border border-[#E5E0D5] rounded-xl p-5 space-y-2.5 text-xs">
              <span className="font-bold text-[#14274E] text-sm block border-b border-[#E5E0D5] pb-2">
                {t('stats.population')} & {t('stats.area')}
              </span>
              <div className="flex justify-between text-[#6B6558]">
                <span>{t('stats.population')}:</span>
                <strong className="text-[#14274E] font-bold">{SUBCITY_INFO.population}</strong>
              </div>
              <div className="flex justify-between text-[#6B6558]">
                <span>{t('stats.area')}:</span>
                <strong className="text-[#14274E] font-bold">{SUBCITY_INFO.areaSqKm} km²</strong>
              </div>
              <div className="flex justify-between text-[#6B6558]">
                <span>{t('stats.elevation')}:</span>
                <strong className="text-[#14274E] font-bold">{SUBCITY_INFO.elevationRange}</strong>
              </div>
              <div className="flex justify-between text-[#6B6558]">
                <span>{t('stats.woredas')}:</span>
                <strong className="text-[#14274E] font-bold">15 Woredas</strong>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Graphical Elevation Profile Chart */}
        <div className="bg-[#F7F5F0] border border-[#E5E0D5] rounded-2xl p-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-bold text-[#14274E] text-base flex items-center gap-2">
                <Mountain className="w-5 h-5 text-[#14274E]" />
                <span>{language === 'en' ? 'Geographic Elevation Profile (2,074m – 2,485m)' : 'የመልክዓ ምድር ከፍታ መገለጫ (2,074ሜ – 2,485ሜ)'}</span>
              </h3>
              <p className="text-xs text-[#8A8578]">
                {language === 'en' 
                  ? 'Elevation gradient across Saris, Mekanisa, Jemo, Vatican, and Lafto Ridge' 
                  : 'ከሳሪስ፣ መካኒሳ፣ ጀሞ፣ ቫቲካን እስከ ላፍቶ ተራራ ድረስ ያለው የመሬት አቀማመጥ'}
              </p>
            </div>

            <span className="text-xs font-bold text-[#14274E] bg-white border border-[#E5E0D5] px-3 py-1 rounded-full self-start sm:self-auto">
              {language === 'en' ? 'Highland Ridge' : 'ተራራማ አቀማመጥ'}
            </span>
          </div>

          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ELEVATION_PROFILE} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="zone" stroke="#8A8578" tick={{ fontSize: 11 }} />
                <YAxis domain={[2000, 2600]} stroke="#8A8578" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E5E0D5', borderRadius: '12px', color: '#14274E', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="elevation" name="Elevation (Meters)" stroke="#14274E" fill="#E5E0D5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#E5E0D5] text-xs">
            {ELEVATION_PROFILE.slice(0, 4).map((p, i) => (
              <div key={i} className="bg-white p-3 rounded-xl border border-[#E5E0D5]">
                <span className="block text-[#8A8578] font-medium">{p.zone}</span>
                <span className="font-bold text-[#14274E] text-sm">{p.elevation} m</span>
                <span className="block text-[10px] text-[#8A8578] mt-0.5">{p.density}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

