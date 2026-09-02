export interface GovPortalService {
  name: string;
  amharicName: string;
  description: string;
}

export interface GovPortal {
  id: string;
  title: string;
  amharicTitle: string;
  url: string;
  domain: string;
  department: string;
  amharicDepartment: string;
  category: 'land_housing' | 'trade_industry' | 'roads_infrastructure' | 'municipal_governance';
  categoryLabel: string;
  amharicCategoryLabel: string;
  description: string;
  amharicDescription: string;
  iconName: string;
  status: 'online' | 'active';
  uptime: string;
  badge: string;
  amharicBadge: string;
  targetAudience: string;
  amharicTargetAudience: string;
  keyServices: GovPortalService[];
  tags: string[];
  subCityScope: string;
  amharicSubCityScope: string;
}

export const GOV_PORTALS: GovPortal[] = [
  {
    id: 'eland-cadaster',
    title: 'Addis e-Land & Cadastre Portal',
    amharicTitle: 'አዲስ የመሬት ይዞታ እና ካዳስተር መረጃ ሥርዓት (e-Land)',
    url: 'https://eland.addiscadaster.gov.et',
    domain: 'eland.addiscadaster.gov.et',
    department: 'Addis Ababa Land Holding Registration & Information Agency (Cadastre)',
    amharicDepartment: 'የአዲስ አበባ የመሬት ይዞታ ምዝገባ እና መረጃ ኤጀንሲ (ካዳስተር)',
    category: 'land_housing',
    categoryLabel: 'Land, Property & Cadastre',
    amharicCategoryLabel: 'የመሬት ይዞታ እና ካዳስተር',
    description: 'Official digital land registry and cadastre administration platform. Verify title deeds, view cadastral plot coordinates, track land lease agreements, verify ownership status, and request legal property boundary certificates across all 15 Woredas of Nifas Silk-Lafto.',
    amharicDescription: 'ኦፊሴላዊ የመሬት ይዞታ ምዝገባ እና የካዳስተር አገልግሎት መድረክ:: የመሬት ካርታ ትክክለኛነት ማረጋገጥ፣ የይዞታ ወሰን መረጃ፣ የሊዝ ውል ክትትል እና የባለቤትነት ማስተላለፍ አገልግሎት በሁሉም 15 የንፋስ  ስልክ ላፍቶ ወረዳዎች::',
    iconName: 'MapPin',
    status: 'online',
    uptime: '99.8%',
    badge: 'Official Land Cadastre',
    amharicBadge: 'የመሬት ካዳስተር ፖርታል',
    targetAudience: 'Property Owners, Land Buyers, Legal Representatives, Surveyors',
    amharicTargetAudience: 'የመሬት ባለይዞታዎች፣ ዜጎች፣ የሕግ ባለሙያዎች',
    keyServices: [
      {
        name: 'Cadastral Title Deed Verification',
        amharicName: 'የመሬት ይዞታ ካርታ ማረጋገጫ',
        description: 'Verify digital authenticity and QR security signatures of municipal land title certificates.',
      },
      {
        name: 'Plot Boundary & GIS Coordinates',
        amharicName: 'የይዞታ ወሰን እና የጂአይኤስ መረጃ',
        description: 'Lookup cadastral parcel boundaries, satellite plot mapping, and neighborhood zoning.',
      },
      {
        name: 'Land Lease Payment & Tracking',
        amharicName: 'የሊዝ ክፍያ እና ውል ክትትል',
        description: 'Calculate lease settlement balances, payment schedules, and renewal clearances.',
      },
      {
        name: 'Property Transfer Clearance',
        amharicName: 'የይዞታ ዝውውር ማረጋገጫ',
        description: 'Initiate ownership transfer documents, inheritance declarations, and legal encumbrance checks.',
      }
    ],
    tags: ['Land Title', 'Cadastre', 'Lease', 'GIS Map', 'Addis Cadaster', 'Deed'],
    subCityScope: 'Covers all 15 Woredas: Jemo, Haile Garment, Mekanisa, Saris & Lebu',
    amharicSubCityScope: 'ሁሉንም 15 ወረዳዎች ያካትታል (ጀሞ፣ ኃይሌ ጋርመንት፣ መካኒሳ፣ ሳሪስ)'
  },
  {
    id: 'aahdab-housing',
    title: 'Addis Ababa Housing Development & Administration (AAHDAB)',
    amharicTitle: 'የአዲስ አበባ ቤቶች ልማት እና አስተዳደር ቢሮ ፖርታል',
    url: 'https://aahdabrhrcas.gov.et/',
    domain: 'aahdabrhrcas.gov.et',
    department: 'Addis Ababa Housing Development & Administration Bureau / Rental & Cooperative Admin',
    amharicDepartment: 'የአዲስ አበባ ቤቶች ልማት እና አስተዳደር ቢሮ / የኪራይና ህብረት ስራ ማህበራት',
    category: 'land_housing',
    categoryLabel: 'Housing & Condominiums',
    amharicCategoryLabel: 'የኮንዶሚኒየም ቤቶች ልማት',
    description: 'Centralized government administration system for public housing schemes (20/80, 40/60, and 10/90 condominium programs), cooperative housing societies, rental administration, and housing registry documentation in sub-city sites like Jemo, Gotera, and Haile Garment.',
    amharicDescription: 'የኮንዶሚኒየም ቤቶች (20/80 እና 40/60)፣ የህብረት ሥራ ማህበራት፣ የመንግሥት ቤቶች ኪራይ አስተዳደር እና የባለቤትነት ማስረጃ ማረጋገጫ ማዕከላዊ የመንግሥት ፖርታል::',
    iconName: 'Building2',
    status: 'online',
    uptime: '99.5%',
    badge: 'Housing & Condominium Registry',
    amharicBadge: 'የቤቶች ልማት እና አስተዳደር',
    targetAudience: 'Condominium Beneficiaries, Cooperative Members, Homeowners, Renters',
    amharicTargetAudience: 'የኮንዶሚኒየም ተጠቃሚዎች፣ የቤት ፈላጊዎች፣ ነዋሪዎች',
    keyServices: [
      {
        name: 'Condominium Registry & Lottery Status',
        amharicName: 'የኮንዶሚኒየም ምዝገባ እና እጣ ሁኔታ',
        description: 'Check 20/80 & 40/60 bank savings verification, lottery eligibility, and site assignment lists.',
      },
      {
        name: 'Condominium Handover & Key Processing',
        amharicName: 'የቤት ርክክብ እና ቁልፍ አሰጣጥ',
        description: 'Download handover certifications, site inspection forms, and occupancy authorizations.',
      },
      {
        name: 'Cooperative Housing Society Admin',
        amharicName: 'የቤቶች ህብረት ስራ ማህበራት አስተዳደር',
        description: 'Register cooperative unions, submit architectural plot plans, and track building milestones.',
      },
      {
        name: 'Kebele & Government House Rental Admin',
        amharicName: 'የቀበሌ እና የኪራይ ቤቶች አስተዳደር',
        description: 'Submit rental renewals, maintenance petitions, and tenant documentation for municipal housing.',
      }
    ],
    tags: ['Condominium', '20/80', '40/60', 'AAHDAB', 'Housing Bureau', 'Rental'],
    subCityScope: 'Major sites: Jemo 1-3, Gotera Condos, Haile Garment & Vatican hills',
    amharicSubCityScope: 'ዋና ዋና ሳይቶች: ጀሞ 1-3፣ ጎተራ፣ ኃይሌ ጋርመንት'
  },
  {
    id: 'iimis-industry',
    title: 'Integrated Industry Management Information System (IIMIS)',
    amharicTitle: 'የኢንዱስትሪ ልማት የተቀናጀ መረጃ ሥርዓት (IIMIS)',
    url: 'https://www.iimis.industrydevelopment.gov.et/',
    domain: 'iimis.industrydevelopment.gov.et',
    department: 'Ministry of Industry & Addis Ababa Industry Development Bureau',
    amharicDepartment: 'የኢንዱስትሪ ሚኒስቴር እና የአዲስ አበባ ኢንዱስትሪ ልማት ቢሮ',
    category: 'trade_industry',
    categoryLabel: 'Industry & Enterprise',
    amharicCategoryLabel: 'ኢንዱስትሪ እና ኢንተርፕራይዝ',
    description: 'National industrial registry and manufacturing enterprise intelligence platform. Manages industrial park allocations, tax incentive clearances, raw material duty exemptions, manufacturing capacity audits, and industrial cluster coordination for Nifas Silk industrial corridor.',
    amharicDescription: 'የኢንዱስትሪ ልማት፣ የማምረቻ ተቋማት ፈቃድ፣ የጥሬ ዕቃ ማበረታቻ ማረጋገጫ እና የፋብሪካዎች መረጃ የሚስተናገድበት ብሔራዊ መድረክ::',
    iconName: 'Factory',
    status: 'online',
    uptime: '99.4%',
    badge: 'National Industrial Portal',
    amharicBadge: 'የኢንዱስትሪ መረጃ ሥርዓት',
    targetAudience: 'Manufacturers, Factory Owners, Industrial Investors, Exporters, Agro-Processors',
    amharicTargetAudience: 'አምራቾች፣ የፋብሪካ ባለቤቶች፣ የኢንዱስትሪ ባለሀብቶች',
    keyServices: [
      {
        name: 'Industrial Enterprise Profiling & Registration',
        amharicName: 'የኢንዱስትሪ ኢንተርፕራይዝ ምዝገባ',
        description: 'Official profiling for medium and large-scale manufacturing establishments and agro-industries.',
      },
      {
        name: 'Raw Material Duty Incentive Clearance',
        amharicName: 'የቀረጥ ነጻ እና የግብአት ማበረታቻ',
        description: 'Apply for capital goods tax exemptions, input duty reductions, and industrial incentives.',
      },
      {
        name: 'Industrial Park Land & Shed Allocation',
        amharicName: 'የኢንዱስትሪ ሼድ እና መሬት ድልድል',
        description: 'Explore available manufacturing sheds, industrial zone infrastructure, and utility linkages.',
      },
      {
        name: 'Factory Production & Capacity Auditing',
        amharicName: 'የምርት አቅም እና የጥራት ቁጥጥር',
        description: 'Submit monthly output benchmarks, energy utilization audits, and export performance reports.',
      }
    ],
    tags: ['Industry', 'Manufacturing', 'IIMIS', 'Industrial Zone', 'Duty Free', 'Factory'],
    subCityScope: 'Saris Industrial Zone, Haile Garment Manufacturing Corridor & Gotera Hub',
    amharicSubCityScope: 'የሳሪስ ኢንዱስትሪ ዞን፣ ኃይሌ ጋርመንት እና ጎተራ'
  },
  {
    id: 'smart-addismayor',
    title: 'Addis Smart Mayor & Executive Governance Portal',
    amharicTitle: 'የከንቲባ ጽሕፈት ቤት ዘመናዊ አስተዳደር መድረክ (Smart Mayor)',
    url: 'https://smart.addismayor.gov.et/admin',
    domain: 'smart.addismayor.gov.et',
    department: 'Office of the Mayor & Addis Ababa City Government Executive Manager',
    amharicDepartment: 'የከንቲባ ጽሕፈት ቤት እና የአዲስ አበባ ከተማ ስራ አስኪያጅ',
    category: 'municipal_governance',
    categoryLabel: 'Executive Governance & Smart City',
    amharicCategoryLabel: 'የከተማ አስተዳደር እና ዘመናዊ አገልግሎት',
    description: 'High-level executive municipal dashboard and smart city operations center. Enables citizen grievance submission, executive service performance monitoring, municipal task dispatching, and digital coordination between city hall and Nifas Silk-Lafto sub-city leadership.',
    amharicDescription: 'የከንቲባ ጽሕፈት ቤት ዘመናዊ የአስተዳደር መድረክ:: የህዝብ ቅሬታዎች አቀባበል፣ የማዘጋጃ ቤት አገልግሎቶች ፍጥነት ክትትል እና የከተማ አስተዳደር ውሳኔዎች መከታተያ::',
    iconName: 'ShieldCheck',
    status: 'online',
    uptime: '99.9%',
    badge: 'Executive City Administration',
    amharicBadge: 'የከንቲባ ጽሕፈት ቤት አስተዳደር',
    targetAudience: 'Citizens, Municipal Administrators, Community Leaders, Civic Ombudsmen',
    amharicTargetAudience: 'ዜጎች፣ የማዘጋጃ ቤት አመራሮች፣ የህዝብ ተወካዮች',
    keyServices: [
      {
        name: 'Mayor Citizen Grievance & Petition Desk',
        amharicName: 'የዜጎች ቅሬታ እና አቤቱታ መስኮት',
        description: 'Direct citizen feedback channel to city hall with automated escalation and tracking tickets.',
      },
      {
        name: 'Sub-City Performance Index & KPIs',
        amharicName: 'የክፍለ ከተማው የአፈፃፀም መለኪያ',
        description: 'Real-time monitoring of service delivery turnaround times across all 15 Woredas.',
      },
      {
        name: 'Inter-Bureau Municipal Task Dispatch',
        amharicName: 'የተቀናጀ የቢሮዎች ስራ አመራር',
        description: 'Coordination between sanitation, water, electrical grid, and traffic emergency teams.',
      },
      {
        name: 'City Development Project Intelligence',
        amharicName: 'የከተማ ልማት ፕሮጀክቶች ክትትል',
        description: 'Track municipal infrastructure budgets, corridor upgrades, and public park construction.',
      }
    ],
    tags: ['Mayor Office', 'Smart City', 'Governance', 'Grievance', 'City Hall', 'KPI'],
    subCityScope: 'All Sub-City administration bureaus, Woreda Cabinets & Civic Desks',
    amharicSubCityScope: 'ሁሉንም የክፍለ ከተማ መምሪያዎች እና 15 ወረዳዎችን ይመለከታል'
  },
  {
    id: 'etrade-gov',
    title: 'eTrade Ethiopia - National Trade & Licensing Portal',
    amharicTitle: 'የኢትዮጵያ ንግድ እና ምዝገባ ዲጂታል ፖርታል (eTrade)',
    url: 'https://etrade.gov.et',
    domain: 'etrade.gov.et',
    department: 'Ministry of Trade and Regional Integration & Sub-City Trade Bureau',
    amharicDepartment: 'የንግድና ቀጣናዊ ትስስር ሚኒስቴር እና የክፍለ ከተማው ንግድ ጽ/ቤት',
    category: 'trade_industry',
    categoryLabel: 'Commerce & Business Licensing',
    amharicCategoryLabel: 'ንግድ እና የንግድ ፈቃድ',
    description: 'Ethiopia’s official national online portal for commercial registration and business licensing. Reserve business names, apply for new commercial licenses, process annual renewals, verify tax clearances, and download verified digital QR trade certificates.',
    amharicDescription: 'የንግድ ስም ማስያዝ፣ አዲስ የንግድ ፈቃድ ማውጣት፣ ዓመታዊ ፈቃድ ማደስ፣ የብቃት ማረጋገጫ እና ዲጂታል የንግድ ፈቃድ በኦንላይን የሚያገኙበት ብሔራዊ ፖርታል::',
    iconName: 'Briefcase',
    status: 'online',
    uptime: '99.7%',
    badge: 'National Trade & Licensing',
    amharicBadge: 'ብሔራዊ የንግድ ፖርታል',
    targetAudience: 'Business Owners, Sole Proprietors, PLC Companies, Importers, Retailers',
    amharicTargetAudience: 'ነጋዴዎች፣ ድርጅቶች፣ የንግድ ማህበራት፣ ባለሀብቶች',
    keyServices: [
      {
        name: 'Online Business Name Reservation',
        amharicName: 'የንግድ ስም ምርመራ እና ማስያዣ',
        description: 'Instant national trade name availability search and official 30-day reservation certificate.',
      },
      {
        name: 'New Commercial Registration & License Issuance',
        amharicName: 'አዲስ የንግድ ምዝገባ እና ፈቃድ አሰጣጥ',
        description: 'Register sole proprietorships, PLC entities, and commercial partnerships 100% online.',
      },
      {
        name: 'Annual Trade License Renewal',
        amharicName: 'ዓመታዊ የንግድ ፈቃድ እድሳት',
        description: 'Renew commercial licenses with automated Ministry of Revenue tax clearance synchronization.',
      },
      {
        name: 'Competency Certificate Verification',
        amharicName: 'የሙያ ብቃት ማረጋገጫ ማረጋገጥ',
        description: 'Link sector competency clearances (health, construction, education) directly to trade files.',
      }
    ],
    tags: ['eTrade', 'Business License', 'Commercial Registration', 'Tax Clearance', 'Trade Name'],
    subCityScope: 'Saris, Mekanisa, Jemo, Gotera & all commercial hubs of Nifas Silk',
    amharicSubCityScope: 'ሳሪስ፣ መካኒሳ፣ ጀሞ፣ ጎተራ እና ሁሉም የንግድ ማዕከላት'
  },
  {
    id: 'aacrrsa-roads',
    title: 'Addis Ababa City Roads & Regulatory Service Authority (AACRRSA)',
    amharicTitle: 'የአዲስ አበባ ከተማ መንገዶች እና ደንብ አገልግሎት ባለሥልጣን (AACRRSA)',
    url: 'https://portal.aacrrsa.gov.et/',
    domain: 'portal.aacrrsa.gov.et',
    department: 'Addis Ababa City Roads Authority (AACRA / AACRRSA)',
    amharicDepartment: 'የአዲስ አበባ ከተማ መንገዶች ባለሥልጣን (መንገዶችና ደንብ አገልግሎት)',
    category: 'roads_infrastructure',
    categoryLabel: 'Roads & Infrastructure Regulation',
    amharicCategoryLabel: 'መንገዶች እና የመሰረተ-ልማት ደንብ',
    description: 'Official digital portal for road infrastructure regulation, utility excavation and road cut permits, right-of-way compliance clearances, corridor development monitoring, and municipal road network maintenance in Nifas Silk-Lafto.',
    amharicDescription: 'የመንገድ መሰረተ-ልማት ቁጥጥር፣ የውኃ እና መብራት መስመር ቁፋሮ ፈቃድ (Road Cut Permit)፣ የመንገድ ዳርቻ ደንብ ማስከበር እና የኮሪደር ልማት መረጃ ፖርታል::',
    iconName: 'TrafficCone',
    status: 'online',
    uptime: '99.6%',
    badge: 'Roads & Infrastructure Authority',
    amharicBadge: 'የመንገዶች እና ደንብ ባለሥልጣን',
    targetAudience: 'Contractors, Ethio Telecom / EEU Utility Teams, Real Estate Developers, Drivers',
    amharicTargetAudience: 'ተቋራጮች፣ የፍጆታ ተቋማት (ቴሌ/መብራት/ውኃ)፣ አሽከርካሪዎች',
    keyServices: [
      {
        name: 'Utility Road Cut & Excavation Permit',
        amharicName: 'የመንገድ ቁፋሮ ፈቃድ (Road Cut)',
        description: 'Apply for telecommunication, water, sewerage, and power cable underground crossing permits.',
      },
      {
        name: 'Right-of-Way (RoW) Clearance Certification',
        amharicName: 'የመንገድ ወሰን ክሊራንስ',
        description: 'Verify building setback compliance, fence construction limits, and road encroachment clearances.',
      },
      {
        name: 'Corridor Development Status & Detour Notices',
        amharicName: 'የኮሪደር ልማት እና የመንገድ አቅጣጫ መረጃ',
        description: 'Live alerts for road maintenance, smart asphalt rehabilitation, and pedestrian walkway projects.',
      },
      {
        name: 'Heavy Vehicle & Construction Transport Permits',
        amharicName: 'የከባድ ተሽከርካሪ እና ግንባታ ፈቃድ',
        description: 'Obtain designated transport corridor passes for heavy construction machinery and logistics.',
      }
    ],
    tags: ['AACRRSA', 'AACRA', 'Road Cut', 'Excavation', 'Right of Way', 'Corridor', 'Infrastructure'],
    subCityScope: 'Debre Zeit Road, Ring Road, Saris-Gotera Expressway & Jemo arterial roads',
    amharicSubCityScope: 'የደብረዘይት መንገድ፣ ቀለበት መንገድ፣ ሳሪስ-ጎተራ እና ጀሞ አውራ መንገዶች'
  }
];
