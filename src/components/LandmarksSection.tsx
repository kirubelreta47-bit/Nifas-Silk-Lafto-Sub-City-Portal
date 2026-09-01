import React from 'react';
import { Landmark, Building2, Building, Shield, Hotel, TreePine, MapPin, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { LANDMARKS_LIST } from '../data/subcityData';
import { useLanguage } from '../context/LanguageContext';

const landmarkContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const landmarkCardSlideVariants = {
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
};

export const LandmarksSection: React.FC = () => {
  const { language } = useLanguage();

  const renderLandmarkIcon = (iconName: string) => {
    const props = { className: "w-6 h-6 text-[#14274E]" };
    switch (iconName) {
      case 'Building': return <Building {...props} />;
      case 'Landmark': return <Landmark {...props} />;
      case 'Hotel': return <Hotel {...props} />;
      case 'Shield': return <Shield {...props} />;
      case 'TreePine': return <TreePine {...props} />;
      default: return <Building2 {...props} />;
    }
  };

  return (
    <section id="landmarks-section" className="py-12 bg-white text-[#6B6558] border-t border-[#E5E0D5] relative">
      <div className="w-full max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10 relative z-10">
        
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-[#E5E0D5]">
          <div className="flex items-center gap-2 text-[#14274E] text-xs font-bold uppercase tracking-wider mb-1">
            <Landmark className="w-4 h-4 text-[#14274E]" />
            <span>{language === 'en' ? 'Key Sub-City Destinations' : 'ዋና ዋና የመዳረሻ ስፍራዎች'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14274E] tracking-tight">
            {language === 'en' ? 'Major Landmarks & Economic Centers' : 'ታዋቂ ሥፍራዎች እና የኢኮኖሚ ማዕከላት'}
          </h2>
          <p className="text-sm text-[#6B6558] mt-1">
            {language === 'en' 
              ? 'Key commercial, diplomatic, eco-park, and civic facilities across Nifas Silk-Lafto sub-city.' 
              : 'በነፋስ ስልክ ላፍቶ ክፍለ ከተማ የሚገኙ ዋና ዋና የንግድ፣ የዲፕሎማሲ፣ የመናፈሻ እና የማህበራዊ አገልግሎት ተቋማት::'}
          </p>
        </div>

        {/* Landmarks Grid */}
        <motion.div 
          variants={landmarkContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
        >
          {LANDMARKS_LIST.map((landmark) => (
            <motion.div
              key={landmark.id}
              variants={landmarkCardSlideVariants}
              whileHover={{ 
                y: -6, 
                transition: { type: 'spring' as const, stiffness: 350, damping: 25 } 
              }}
              className="bg-[#F7F5F0] border border-[#E5E0D5] hover:border-[#14274E] hover:-translate-y-1.5 active:scale-[0.98] rounded-2xl p-5 transition-all duration-200 ease-out hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E0D5] flex items-center justify-center">
                    {renderLandmarkIcon(landmark.icon)}
                  </div>
                  <span className="text-xs font-bold bg-white text-[#14274E] border border-[#E5E0D5] px-2.5 py-0.5 rounded-full">
                    {landmark.category}
                  </span>
                </div>

                <h3 className="font-bold text-[#14274E] text-base leading-snug">
                  {landmark.name}
                </h3>

                <p className="text-xs font-medium text-[#8A8578] my-1">
                  {landmark.amharicName}
                </p>

                <p className="text-xs text-[#6B6558] my-2 leading-relaxed">
                  {landmark.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5E0D5] space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-[#8A8578] font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#14274E] shrink-0" />
                  <span>{landmark.location} ({landmark.woreda})</span>
                </div>

                <div className="space-y-1">
                  {landmark.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#6B6558]">
                      <CheckCircle2 className="w-3 h-3 text-[#0F6E56] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

