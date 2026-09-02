import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'am';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    'nav.overview': 'Home & Services',
    'nav.portals': 'Official Portals (6)',
    'nav.analytics': 'Public Statistics',
    'nav.systems': 'Citizen e-Services',
    'nav.woredas': 'Woredas & Offices',
    'nav.landmarks': 'Sub-City Landmarks',
    'nav.about': 'About Sub-City',
    'nav.portalVersion': 'Citizen Portal v2.4',
    'nav.hotline': 'Citizen Helpline: 8080',
    'nav.hours': 'Mon - Fri: 8:30 AM - 5:30 PM',

    // Hero
    'hero.badge': 'Nifas Silk-Lafto Sub-City Administration • Addis Ababa',
    'hero.title': 'Citizen e-Services & Municipal Portal',
    'hero.subtitle': 'Welcome to the official public portal for Nifas Silk-Lafto Sub-City. Access 24 municipal services, find your local Woreda office, pay property taxes, or verify vital event records online.',
    'hero.searchPlaceholder': 'Search citizen services (e.g. Kebele ID, Birth Certificate, Land Map, Tax Payment, Trade License)...',
    'hero.exploreBtn': 'Browse All Citizen Services',
    'hero.analyticsBtn': 'View Public Statistics',
    'hero.statPopulation': '335k+',
    'hero.statPopulationLabel': 'Residents Served',
    'hero.statArea': '68.3 km²',
    'hero.statAreaLabel': 'Sub-City Area',
    'hero.statElevation': '15 Woredas',
    'hero.statElevationLabel': 'Municipal Administrative Centers',

    // Metrics
    'metrics.title': 'Public Service Accessibility Status',
    'metrics.total': '24 Municipal Services',
    'metrics.production': '14 Available Online',
    'metrics.development': '7 In Preparation',
    'metrics.testing': '3 Pilot Programs',
    'metrics.woredas': '15 Connected Woredas',
    'metrics.dailyRequests': '18,450+ Daily Transactions',
    'metrics.uptime': '99.9% Portal Reliability',

    // Directory
    'dir.title': 'Public Services & Digital Desks',
    'dir.subtitle': 'Access municipal administrative services online or locate your nearest physical service center.',
    'dir.filterAll': 'All Services (24)',
    'dir.filterProd': 'Available Online (14)',
    'dir.filterDev': 'Coming Soon (7)',
    'dir.filterTest': 'Pilot Testing (3)',
    'dir.launchDemo': 'Open Service Counter',
    'dir.viewDetails': 'Service Details & Requirements',
    'dir.statusProd': 'Available Online',
    'dir.statusDev': 'In Preparation',
    'dir.statusTest': 'Pilot Program',
    'dir.progress': 'Rollout Status',
    'dir.users': 'Daily Beneficiaries',
    'dir.uptime': 'Desk Availability',

    // Categories
    'cat.all': 'All Categories',
    'cat.citizen_services': 'Civil Registry & Vital Events',
    'cat.land_revenue': 'Land, Housing & Taxes',
    'cat.infrastructure_waste': 'Roads, Water & Clean City',
    'cat.health_safety': 'Healthcare & Public Safety',
    'cat.administration': 'Sub-City Administration',

    // Woredas
    'woredas.title': 'Woredas Directory (15 Woredas)',
    'woredas.subtitle': 'Select a Woreda to inspect neighborhood hubs, population metrics, and active digital services.',
    'woredas.spotlight': 'District Spotlight',
    'woredas.activeSystems': 'Active Systems',
    'woredas.population': 'Population',
    'woredas.chiefOfficer': 'Chief Woreda Officer',
    'woredas.officeLoc': 'Office Location',

    // Landmarks
    'landmarks.title': 'Major Landmarks & Economic Centers',
    'landmarks.subtitle': 'Key commercial, diplomatic, eco-park, and civic facilities across Nifas Silk-Lafto sub-city.',

    // Analytics
    'analytics.title': 'Graphical Systems Analytics',
    'analytics.subtitle': 'Real-time performance metrics, deployment status distribution, and service usage stats.',

    // Modal
    'modal.interactiveDemo': 'Interactive System Workspace',
    'modal.features': 'Core System Capabilities',
    'modal.techStack': 'Technology Architecture',
    'modal.leadOfficer': 'Lead Technical Officer',
    'modal.close': 'Close Window',

    // Footer
    'footer.description': 'Official digital governance and municipal systems portal of Nifas Silk-Lafto Sub-City, Addis Ababa Municipal Administration.',
    'footer.quickLinks': 'Quick Navigation',
    'footer.copyright': '© 2026 Nifas Silk-Lafto Sub-City Administration • Addis Ababa, Ethiopia. All rights reserved.',
    'footer.fiberActive': 'Fiber Network Nominal',
  },
  am: {
    // Nav
    'nav.overview': 'መነሻና አገልግሎቶች',
    'nav.portals': 'ኦፊሴላዊ ፖርታሎች (6)',
    'nav.analytics': 'የህዝብ ስታቲስቲክስ',
    'nav.systems': 'የዜጎች e-አገልግሎቶች',
    'nav.woredas': 'ወረዳዎችና ቢሮዎች',
    'nav.landmarks': 'የክፍለ ከተማው ቦታዎች',
    'nav.about': 'ስለ ክፍለ ከተማው',
    'nav.portalVersion': 'የዜጎች ፖርታል v2.4',
    'nav.hotline': 'የነዋሪዎች የስልክ መስመር፡ 8080',
    'nav.hours': 'ከሰኞ - አርብ፡ 2፡30 - 11፡30',

    // Hero
    'hero.badge': 'የንፋስ  ስልክ ላፍቶ ክፍለ ከተማ አስተዳደር • አዲስ አበባ',
    'hero.title': 'የዜጎች e-አገልግሎቶችና የማዘጋጃ ቤት ፖርታል',
    'hero.subtitle': 'ወደ ንፋስ  ስልክ ላፍቶ ክፍለ ከተማ ኦፊሴላዊ የህዝብ ፖርታል እንኳን በደህና መጡ:: 24ቱን የማዘጋጃ ቤት አገልግሎቶች ያግኙ፣ የቀበሌ መታወቂያና የልደት ምስክር ወረቀት ያረጋግጡ ወይም የንብረት ግብርዎን በመስመር ላይ ይክፈሉ::',
    'hero.searchPlaceholder': 'የሚፈልጉትን አገልግሎት ይፈልጉ (ለምሳሌ፡ የቀበሌ መታወቂያ፣ የልደት ካርድ፣ የይዞታ ካርታ፣ የግብር ክፍያ፣ የንግድ ፈቃድ)...',
    'hero.exploreBtn': 'ሁሉንም የዜጎች አገልግሎቶች ይመልከቱ',
    'hero.analyticsBtn': 'የህዝብ ስታቲስቲክስ ይመልከቱ',
    'hero.statPopulation': '335,000+',
    'hero.statPopulationLabel': 'የክፍለ ከተማው ነዋሪዎች',
    'hero.statArea': '68.3 ኪ.ሜ²',
    'hero.statAreaLabel': 'ጠቅላላ የቦታ ስፋት',
    'hero.statElevation': '15 ወረዳዎች',
    'hero.statElevationLabel': 'የአስተዳደር ማዕከላት',

    // Metrics
    'metrics.title': 'የህዝብ አገልግሎቶች ዝግጁነት ሁኔታ',
    'metrics.total': '24 ማዘጋጃ ቤታዊ አገልግሎቶች',
    'metrics.production': '14 በመስመር ላይ ዝግጁ የሆኑ',
    'metrics.development': '7 በዝግጅት ላይ ያሉ',
    'metrics.testing': '3 በሙከራ ላይ ያሉ',
    'metrics.woredas': '15 የተገናኙ ወረዳዎች',
    'metrics.dailyRequests': '18,450+ የዕለት አገልግሎቶች',
    'metrics.uptime': '99.9% የፖርታል ዝግጁነት',

    // Directory
    'dir.title': 'የህዝብ አገልግሎቶችና ዲጂታል መስኮቶች',
    'dir.subtitle': 'የማዘጋጃ ቤትና የአስተዳደር አገልግሎቶችን በመስመር ላይ ያግኙ ወይም በአቅራቢያዎ የሚገኘውን የወረዳ ቢሮ ያግኙ::',
    'dir.filterAll': 'ሁሉም አገልግሎቶች (24)',
    'dir.filterProd': 'በመስመር ላይ የሚገኙ (14)',
    'dir.filterDev': 'በዝግጅት ላይ ያሉ (7)',
    'dir.filterTest': 'በሙከራ ላይ ያሉ (3)',
    'dir.launchDemo': 'የአገልግሎት መስኮት ይክፈቱ',
    'dir.viewDetails': 'የአገልግሎቱ መስፈርቶችና ዝርዝር',
    'dir.statusProd': 'በመስመር ላይ ይገኛል',
    'dir.statusDev': 'በዝግጅት ላይ ያለ',
    'dir.statusTest': 'የሙከራ ፕሮግራም',
    'dir.progress': 'የአገልግሎት ደረጃ',
    'dir.users': 'የዕለት ተጠቃሚዎች',
    'dir.uptime': 'የመስኮቱ ዝግጁነት',

    // Categories
    'cat.all': 'ሁሉም ዘርፎች',
    'cat.citizen_services': 'የነዋሪዎች መዝገብና ወሳኝ ኩነቶች',
    'cat.land_revenue': 'መሬት፣ ቤቶችና ግብር',
    'cat.infrastructure_waste': 'መንገዶች፣ ውኃና ፅዳት',
    'cat.health_safety': 'ጤና ጥበቃና የህዝብ ደህንነት',
    'cat.administration': 'የክፍለ ከተማ አስተዳደር',

    // Woredas
    'woredas.title': 'የወረዳዎችና ቀበሌዎች ማውጫ (15 ወረዳዎች)',
    'woredas.subtitle': 'የወረዳውን መረጃ፣ ህዝብ ቁጥር፣ የዲጂታል አገልግሎቶችና የቀበሌ ማዕከላትን ለመመልከት ወረዳ ይምረጡ::',
    'woredas.spotlight': 'የወረዳው ዝርዝር መረጃ',
    'woredas.activeSystems': 'ንቁ ሲስተሞች',
    'woredas.population': 'የህዝብ ቁጥር',
    'woredas.chiefOfficer': 'የወረዳው ዋና አስተዳዳሪ',
    'woredas.officeLoc': 'የቢሮው አድራሻ',

    // Landmarks
    'landmarks.title': 'ዋና ዋና የልማትና ንግድ ማዕከላት',
    'landmarks.subtitle': 'በንፋስ  ስልክ ላፍቶ ክፍለ ከተማ የሚገኙ ዋና ዋና የንግድ፣ የዲፕሎማሲ፣ የኢኮ-ፓርክና የህዝብ ማዕከላት::',

    // Analytics
    'analytics.title': 'የህዝብ አገልግሎቶችና የማህበረሰብ ስታቲስቲክስ',
    'analytics.subtitle': 'የአገልግሎት አሰጣጥ ፍጥነት፣ የነዋሪዎች ጥያቄዎችና የወረዳዎች ትስስር ግልጽ መረጃ::',

    // Modal
    'modal.interactiveDemo': 'የዲጂታል አገልግሎት መስኮት',
    'modal.features': 'ዋና ዋና የአገልግሎት ባህሪያት',
    'modal.techStack': 'አሰራርና መረጃ',
    'modal.leadOfficer': 'የአገልግሎቱ ኃላፊ',
    'modal.close': 'ዝጋ',

    // Footer
    'footer.description': 'የንፋስ  ስልክ ላፍቶ ክፍለ ከተማ አስተዳደር ኦፊሴላዊ የህዝብ አገልግሎትና ማዘጋጃ ቤታዊ ፖርታል::',
    'footer.quickLinks': 'ፈጣን ማውጫ',
    'footer.copyright': '© 2026 የንፋስ  ስልክ ላፍቶ ክፍለ ከተማ አስተዳደር • አዲስ አበባ፣ ኢትዮጵያ::',
    'footer.fiberActive': 'የማዘጋጃ ቤት አገልግሎት ክፍት ነው',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'am' : 'en'));
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
