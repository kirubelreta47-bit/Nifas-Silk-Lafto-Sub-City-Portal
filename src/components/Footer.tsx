import React from 'react';
import { Building2, ShieldCheck, Activity } from 'lucide-react';
import { SYSTEM_METRICS } from '../data/systemsData';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-[#F7F5F0] text-[#6B6558] border-t border-[#E5E0D5] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#E5E0D5] text-xs">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#14274E] flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base text-[#14274E] block">
                  {language === 'en' ? 'Nifas Silk-Lafto Sub-City' : 'ነፋስ ስልክ ላፍቶ ክፍለ ከተማ'}
                </span>
                <span className="text-[11px] font-semibold text-[#8A8578]">
                  {language === 'en' ? 'ነፋስ ስልክ ላፍቶ ክፍለ ከተማ' : 'Nifas Silk-Lafto Sub-City'}
                </span>
              </div>
            </div>

            <p className="text-[#6B6558] leading-relaxed max-w-md">
              {t('footer.description')}
            </p>

            <div className="flex items-center gap-2 text-[#0F6E56] font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#0F6E56]"></span>
              <span>14 {t('dir.statusProd')} • 7 {t('dir.statusDev')} • 3 {t('dir.statusTest')}</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-2">
            <span className="font-bold text-[#14274E] text-sm block mb-2">{t('footer.quickLinks')}</span>
            <ul className="space-y-1.5 text-[#6B6558]">
              <li>
                <button onClick={() => setActiveTab('overview')} className="hover:text-[#14274E] transition-colors cursor-pointer">
                  {t('nav.overview')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('portals')} className="hover:text-[#14274E] transition-colors cursor-pointer">
                  {t('nav.portals')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('systems')} className="hover:text-[#14274E] transition-colors cursor-pointer">
                  {t('nav.systems')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('analytics')} className="hover:text-[#14274E] transition-colors cursor-pointer">
                  {t('nav.analytics')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('woredas')} className="hover:text-[#14274E] transition-colors cursor-pointer">
                  {t('nav.woredas')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('landmarks')} className="hover:text-[#14274E] transition-colors cursor-pointer">
                  {t('nav.landmarks')}
                </button>
              </li>
            </ul>
          </div>

          {/* Systems Breakdown */}
          <div className="md:col-span-4 space-y-2">
            <span className="font-bold text-[#14274E] text-sm block mb-2">{t('metrics.title')}</span>
            <div className="bg-white border border-[#E5E0D5] p-3.5 rounded-xl space-y-1.5 text-[#6B6558]">
              <div className="flex justify-between">
                <span>{t('metrics.total')}:</span>
                <strong className="text-[#14274E] font-bold">24</strong>
              </div>
              <div className="flex justify-between">
                <span>{t('dir.statusProd')}:</span>
                <strong className="text-[#0F6E56] font-bold">14 (58%)</strong>
              </div>
              <div className="flex justify-between">
                <span>{t('dir.statusDev')}:</span>
                <strong className="text-[#B45309] font-bold">7 (29%)</strong>
              </div>
              <div className="flex justify-between">
                <span>{t('dir.statusTest')}:</span>
                <strong className="text-[#14274E] font-bold">3 (13%)</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Footer Actions */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#8A8578] gap-4">
          <p>
            {t('footer.copyright')}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setActiveTab('systems')}
              className="text-xs font-bold text-[#14274E] hover:text-black px-3.5 py-1.5 bg-white border border-[#D8D3C7] rounded-lg hover:bg-[#F7F5F0] transition-colors cursor-pointer"
            >
              {t('nav.systems')}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

