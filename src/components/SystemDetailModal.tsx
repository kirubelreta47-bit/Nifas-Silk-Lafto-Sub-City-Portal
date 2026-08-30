import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Building2, 
  UserCheck, 
  MapPin, 
  CreditCard, 
  FileCheck2, 
  MessageSquareWarning, 
  Stethoscope, 
  BarChart3, 
  ShieldAlert, 
  Users, 
  Trees, 
  Car, 
  Trash2, 
  Layers, 
  Briefcase, 
  Zap, 
  ShoppingBag, 
  ShieldCheck, 
  Monitor, 
  Navigation, 
  Syringe,
  Play,
  QrCode,
  FileText,
  Calculator,
  Search,
  Send,
  Phone,
  HelpCircle,
  Calendar
} from 'lucide-react';
import { SubCitySystem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SystemDetailModalProps {
  system: SubCitySystem | null;
  onClose: () => void;
}

export const SystemDetailModal: React.FC<SystemDetailModalProps> = ({ system, onClose }) => {
  const { language } = useLanguage();
  if (!system) return null;

  // Local states for interactive citizen desks
  const [activeTab, setActiveTab] = useState<'service' | 'guide' | 'contact'>('service');
  
  // Civil ID simulator state
  const [civilIdInput, setCivilIdInput] = useState('NSL-2026-94812');
  const [civilResult, setCivilResult] = useState<any>(null);

  // Tax calculator simulator state
  const [annualRevenue, setAnnualRevenue] = useState(250000);
  const [propertyCategory, setPropertyCategory] = useState('commercial');
  const [woredaSelect, setWoredaSelect] = useState('Woreda 03 (Mekanisa)');
  const [taxPaid, setTaxPaid] = useState(false);

  // Land Cadastre simulator state
  const [parcelId, setParcelId] = useState('NSL-PARCEL-03-882');
  const [parcelResult, setParcelResult] = useState<any>(null);

  // Grievance desk state
  const [grievanceType, setGrievanceType] = useState('Streetlight Outage');
  const [grievanceDesc, setGrievanceDesc] = useState('');
  const [grievanceTicket, setGrievanceTicket] = useState<string | null>(null);

  // Traffic camera simulator state
  const [selectedIntersection, setSelectedIntersection] = useState('Gotera Interchange');

  // Handle Civil ID lookup
  const handleCivilSearch = () => {
    setCivilResult({
      id: civilIdInput,
      fullName: 'Abebe Bikila Tadesse',
      amharicName: 'አበበ ቢቂላ ታደሰ',
      dateOfBirth: '1992-05-14',
      woreda: woredaSelect,
      status: language === 'en' ? 'VERIFIED & ACTIVE' : 'የተረጋገጠ እና ንቁ',
      qrCode: `QR-NSL-VERIFIED-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: '2023-08-10',
      expiryDate: '2028-08-10'
    });
  };

  // Handle Land Parcel search
  const handleParcelSearch = () => {
    setParcelResult({
      parcelId: parcelId,
      owner: 'Nifas Silk Trade Enterprise Plc',
      areaSqM: '850 sq. meters (ካሬ ሜትር)',
      zoning: 'Commercial & Mixed Use',
      leaseStatus: 'Paid in Full (99 Year Lease)',
      woreda: 'Woreda 02 (Nifas Silk)',
      coordinates: '8.9821° N, 38.7412° E'
    });
  };

  // Handle Grievance Submission
  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = `NSL-TICK-${Math.floor(100000 + Math.random() * 900000)}`;
    setGrievanceTicket(ticketId);
  };

  // Tax calculation formula
  const calculatedTax = Math.round(annualRevenue * 0.05 + (propertyCategory === 'commercial' ? 3500 : 1200));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-fade-in">
      
      <div className="bg-white rounded-3xl border border-[#E5E0D5] shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh] text-[#6B6558]">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#0348AB] via-[#0b3b8c] to-[#0a1e36] text-white p-5 sm:p-6 flex items-start justify-between relative border-b border-[#0348AB]/20">
          <div className="space-y-1.5 pr-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                system.status === 'production'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'bg-white/10 text-white border border-white/20'
              }`}>
                {system.status === 'production' 
                  ? (language === 'en' ? 'Available Online' : 'በመስመር ላይ ይገኛል')
                  : system.status === 'development'
                  ? (language === 'en' ? 'In Preparation' : 'በዝግጅት ላይ')
                  : (language === 'en' ? 'Pilot Program' : 'የሙከራ ፕሮግራም')}
              </span>

              <span className="text-xs bg-white/10 text-white/90 px-2.5 py-0.5 rounded-full border border-white/15">
                {system.categoryLabel}
              </span>

              <span className="text-xs text-white/80">
                {system.woredasServed} {language === 'en' ? 'Woredas Connected' : 'የተገናኙ ወረዳዎች'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {system.name}
            </h2>

            <p className="text-sm font-semibold text-white/90 font-sans">
              {system.amharicName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0 border border-white/20 cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Citizen Navigation Tabs */}
        <div className="bg-[#F7F5F0] px-6 py-2 border-b border-[#E5E0D5] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('service')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'service'
                  ? 'bg-[#0348AB] text-white shadow-xs'
                  : 'text-[#6B6558] hover:text-[#0348AB] hover:bg-white'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Online Citizen Desk' : 'የቀጥታ አገልግሎት መስኮት'}</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-[#0348AB] text-white shadow-xs'
                  : 'text-[#6B6558] hover:text-[#0348AB] hover:bg-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Requirements & Guide' : 'ቅድመ ሁኔታዎችና መመሪያ'}</span>
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-[#0348AB] text-white shadow-xs'
                  : 'text-[#6B6558] hover:text-[#0348AB] hover:bg-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Office & Officer Info' : 'የቢሮና ኃላፊ መረጃ'}</span>
            </button>
          </div>

          <span className="hidden sm:inline text-[#8A8578] font-medium text-[11px]">
            {language === 'en' ? 'Bureau:' : 'ቢሮ:'} {system.department}
          </span>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          
          {/* TAB 1: CITIZEN ONLINE SERVICE DESK */}
          {activeTab === 'service' && (
            <div className="space-y-6">
              
              {/* Service Vital Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#F7F5F0] border border-[#E5E0D5] rounded-2xl p-3 text-center">
                  <span className="block text-[11px] text-[#8A8578] font-medium">
                    {language === 'en' ? 'Daily Citizens Served' : 'ዕለታዊ ተገልጋዮች'}
                  </span>
                  <span className="text-lg font-bold text-[#14274E]">{system.dailyTransactions.toLocaleString()}</span>
                </div>
                <div className="bg-[#F7F5F0] border border-[#E5E0D5] rounded-2xl p-3 text-center">
                  <span className="block text-[11px] text-[#8A8578] font-medium">
                    {language === 'en' ? 'System Reliability' : 'የአገልግሎት ዝግጁነት'}
                  </span>
                  <span className="text-lg font-bold text-[#0F6E56]">{system.uptime}</span>
                </div>
                <div className="bg-[#F7F5F0] border border-[#E5E0D5] rounded-2xl p-3 text-center">
                  <span className="block text-[11px] text-[#8A8578] font-medium">
                    {language === 'en' ? 'Active Users' : 'ተጠቃሚ ዜጎች'}
                  </span>
                  <span className="text-lg font-bold text-[#14274E]">{system.activeUsers.toLocaleString()}</span>
                </div>
                <div className="bg-[#F7F5F0] border border-[#E5E0D5] rounded-2xl p-3 text-center">
                  <span className="block text-[11px] text-[#8A8578] font-medium">
                    {language === 'en' ? 'Target Woredas' : 'ሽፋን ያገኙ ወረዳዎች'}
                  </span>
                  <span className="text-lg font-bold text-[#14274E]">{system.woredasServed} / 15</span>
                </div>
              </div>

              {/* DYNAMIC INTERACTIVE MODULE BASED ON DEMO TYPE */}

              {/* 1. CIVIL STATUS & ID REGISTRY SIMULATOR */}
              {system.demoType === 'civil_id' && (
                <div className="bg-[#F7F5F0] border border-[#E5E0D5] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#E5E0D5] pb-3">
                    <UserCheck className="w-5 h-5 text-[#14274E]" />
                    <div>
                      <h4 className="font-bold text-[#14274E] text-sm">
                        {language === 'en' ? 'Resident ID & Civil Status Verification' : 'የነዋሪነት መታወቂያ እና የሲቪል ሁኔታ ማረጋገጫ'}
                      </h4>
                      <p className="text-xs text-[#6B6558]">
                        {language === 'en' ? 'Verify citizen record across Woredas 01 to 15' : 'በሁሉም የክፍለ ከተማው ወረዳዎች መረጃውን ያረጋግጡ'}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-8">
                      <label className="block text-xs font-semibold text-[#14274E] mb-1">
                        {language === 'en' ? 'Enter Resident ID Number:' : 'የነዋሪ መታወቂያ ቁጥር ያስገቡ:'}
                      </label>
                      <input
                        type="text"
                        value={civilIdInput}
                        onChange={(e) => setCivilIdInput(e.target.value)}
                        className="w-full bg-white border border-[#D8D3C7] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#14274E] focus:border-[#14274E] focus:outline-hidden"
                      />
                    </div>
                    <div className="sm:col-span-4 flex items-end">
                      <button
                        onClick={handleCivilSearch}
                        className="w-full bg-[#0348AB] hover:bg-[#023888] text-white font-bold text-xs py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>{language === 'en' ? 'Verify Resident' : 'መረጃውን አረጋግጥ'}</span>
                      </button>
                    </div>
                  </div>

                  {civilResult && (
                    <div className="mt-4 bg-white border border-[#E5E0D5] rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-2">
                        <span className="text-xs font-bold text-[#0F6E56] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0F6E56]" /> {civilResult.status}
                        </span>
                        <span className="text-[11px] text-[#8A8578]">
                          {language === 'en' ? 'Verified by Woreda 03 Registry' : 'በወረዳ 03 አስተዳደር የተረጋገጠ'}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[#8A8578]">{language === 'en' ? 'Resident Name:' : 'የነዋሪ ስም:'}</span>
                          <p className="font-bold text-[#14274E] text-sm">{civilResult.fullName}</p>
                          <p className="font-semibold text-[#14274E]">{civilResult.amharicName}</p>
                        </div>
                        <div>
                          <span className="text-[#8A8578]">{language === 'en' ? 'Registered Woreda:' : 'የተመዘገበበት ወረዳ:'}</span>
                          <p className="font-semibold text-[#6B6558]">{civilResult.woreda}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E5E0D5] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-mono text-[11px] text-[#6B6558]">
                          <QrCode className="w-5 h-5 text-[#14274E]" />
                          <span>{civilResult.qrCode}</span>
                        </div>
                        <span className="text-[#8A8578] text-[11px]">
                          {language === 'en' ? 'Valid Until:' : 'የሚያበቃበት ቀን:'} {civilResult.expiryDate}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. UNIFIED TAX & FEE CALCULATOR SIMULATOR */}
              {system.demoType === 'tax_calc' && (
                <div className="bg-[#F7F5F0] border border-[#E5E0D5] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#E5E0D5] pb-3">
                    <Calculator className="w-5 h-5 text-[#14274E]" />
                    <div>
                      <h4 className="font-bold text-[#14274E] text-sm">
                        {language === 'en' ? 'Trade Tax & Municipal Service Fee Assessment' : 'የንግድ ግብር እና የማዘጋጃ ቤት አገልግሎት ክፍያ ማስያ'}
                      </h4>
                      <p className="text-xs text-[#6B6558]">
                        {language === 'en' ? 'Calculate municipal dues and pay directly through Telebirr' : 'የሚጠበቅብዎትን ግብር አስልተው በቴሌብር ይክፈሉ'}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#14274E] mb-1">
                        {language === 'en' ? 'Annual Turnover (ETB):' : 'ዓመታዊ ገቢ (ብር):'}
                      </label>
                      <input
                        type="number"
                        value={annualRevenue}
                        onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                        className="w-full bg-white border border-[#D8D3C7] rounded-xl px-3 py-2 text-xs font-bold text-[#14274E] focus:border-[#14274E] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#14274E] mb-1">
                        {language === 'en' ? 'Business Type:' : 'የንግድ ዓይነት:'}
                      </label>
                      <select
                        value={propertyCategory}
                        onChange={(e) => setPropertyCategory(e.target.value)}
                        className="w-full bg-white border border-[#D8D3C7] rounded-xl px-3 py-2 text-xs text-[#14274E] focus:border-[#14274E] focus:outline-hidden"
                      >
                        <option value="commercial">{language === 'en' ? 'Commercial / Retail Shop' : 'የንግድ ሱቅ / መደብር'}</option>
                        <option value="industrial">{language === 'en' ? 'Light Manufacturing / Factory' : 'አነስተኛ ፋብሪካ / ማምረቻ'}</option>
                        <option value="residential">{language === 'en' ? 'Rental Property' : 'የኪራይ ቤት / አገልግሎት'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#14274E] mb-1">
                        {language === 'en' ? 'Woreda Office:' : 'ወረዳ ቅርንጫፍ:'}
                      </label>
                      <select
                        value={woredaSelect}
                        onChange={(e) => setWoredaSelect(e.target.value)}
                        className="w-full bg-white border border-[#D8D3C7] rounded-xl px-3 py-2 text-xs text-[#14274E] focus:border-[#14274E] focus:outline-hidden"
                      >
                        <option value="Woreda 03 (Mekanisa)">Woreda 03 (Mekanisa)</option>
                        <option value="Woreda 08 (Jemo 1)">Woreda 08 (Jemo 1)</option>
                        <option value="Woreda 01 (Saris)">Woreda 01 (Saris)</option>
                        <option value="Woreda 02 (Nifas Silk)">Woreda 02 (Nifas Silk)</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#0348AB] to-[#0a1e36] text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-white/80">
                        {language === 'en' ? 'Assessed Tax & Municipal Fee:' : 'የተሰላ ጠቅላላ ክፍያ:'}
                      </span>
                      <div className="text-2xl font-extrabold text-white">
                        ETB {calculatedTax.toLocaleString()}
                      </div>
                      <span className="text-[11px] text-white/70">
                        {language === 'en' ? 'Includes 5% Business Tax + City Sanitation Levy' : 'የንግድ ግብር እና የማዘጋጃ ቤት ፅዳት ክፍያን ጨምሮ'}
                      </span>
                    </div>

                    <button
                      onClick={() => setTaxPaid(true)}
                      disabled={taxPaid}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        taxPaid 
                          ? 'bg-[#0F6E56] text-white' 
                          : 'bg-white text-[#14274E] hover:bg-[#F7F5F0] border border-[#D8D3C7]'
                      }`}
                    >
                      {taxPaid 
                        ? (language === 'en' ? '✓ Receipt Issued (Telebirr)' : '✓ ክፍያው ተፈጽሟል (ቴሌብር)') 
                        : (language === 'en' ? 'Pay via Telebirr' : 'በቴሌብር ይክፈሉ')}
                    </button>
                  </div>
                </div>
              )}

              {/* 3. LAND & CADASTRE LOOKUP SIMULATOR */}
              {system.demoType === 'land_cadastre' && (
                <div className="bg-[#F7F5F0] border border-[#E5E0D5] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#E5E0D5] pb-3">
                    <MapPin className="w-5 h-5 text-[#14274E]" />
                    <div>
                      <h4 className="font-bold text-[#14274E] text-sm">
                        {language === 'en' ? 'Land Cadastre & Parcel Search' : 'የመሬት ይዞታና ካዳስተር መረጃ ፍለጋ'}
                      </h4>
                      <p className="text-xs text-[#6B6558]">
                        {language === 'en' ? 'Verify parcel boundaries, lease certificate and zoning category' : 'የይዞታ ማረጋገጫ ካርታ እና የሊዝ መረጃን ያረጋግጡ'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={parcelId}
                      onChange={(e) => setParcelId(e.target.value)}
                      placeholder={language === 'en' ? 'Enter Parcel Number (e.g. NSL-PARCEL-03-882)...' : 'የይዞታ ቁጥር ያስገቡ...'}
                      className="w-full bg-white border border-[#D8D3C7] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#14274E] focus:border-[#14274E] focus:outline-hidden"
                    />
                    <button
                      onClick={handleParcelSearch}
                      className="bg-[#0348AB] hover:bg-[#023888] text-white font-bold text-xs px-4 py-2 rounded-xl shrink-0 cursor-pointer shadow-sm"
                    >
                      {language === 'en' ? 'Search Record' : 'ይፈልጉ'}
                    </button>
                  </div>

                  {parcelResult && (
                    <div className="bg-white border border-[#E5E0D5] rounded-xl p-4 text-xs space-y-2">
                      <div className="flex justify-between border-b border-[#E5E0D5] pb-2">
                        <span className="font-bold text-[#14274E]">{parcelResult.parcelId}</span>
                        <span className="text-[#0F6E56] font-bold">
                          {language === 'en' ? 'Registered & Verified' : 'የተመዘገበ ይዞታ'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[#8A8578]">{language === 'en' ? 'Owner / Title Holder:' : 'የይዞታ ባለቤት:'}</span>
                          <p className="font-semibold text-[#14274E]">{parcelResult.owner}</p>
                        </div>
                        <div>
                          <span className="text-[#8A8578]">{language === 'en' ? 'Parcel Area:' : 'የቦታ ስፋት:'}</span>
                          <p className="font-semibold text-[#14274E]">{parcelResult.areaSqM}</p>
                        </div>
                        <div>
                          <span className="text-[#8A8578]">{language === 'en' ? 'Zoning Category:' : 'የአጠቃቀም ዓይነት:'}</span>
                          <p className="font-semibold text-[#6B6558]">{parcelResult.zoning}</p>
                        </div>
                        <div>
                          <span className="text-[#8A8578]">{language === 'en' ? 'Lease Status:' : 'የሊዝ ሁኔታ:'}</span>
                          <p className="font-semibold text-[#0F6E56]">{parcelResult.leaseStatus}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4. GRIEVANCE & CITIZEN DESK SIMULATOR */}
              {system.demoType === 'grievance_desk' && (
                <div className="bg-[#F7F5F0] border border-[#E5E0D5] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#E5E0D5] pb-3">
                    <MessageSquareWarning className="w-5 h-5 text-[#14274E]" />
                    <div>
                      <h4 className="font-bold text-[#14274E] text-sm">
                        {language === 'en' ? 'Citizen Feedback & Complaint Submission' : 'የቅሬታ እና አስተያየት ማቅረቢያ መስኮት'}
                      </h4>
                      <p className="text-xs text-[#6B6558]">
                        {language === 'en' ? 'Submit municipal service inquiries directly to Woreda dispatch' : 'አቤቱታዎን ወይም ጥቆማዎን በቀጥታ ለወረዳው ያቅርቡ'}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitGrievance} className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#14274E] mb-1">
                          {language === 'en' ? 'Category of Issue:' : 'የቅሬታው ዘርፍ:'}
                        </label>
                        <select
                          value={grievanceType}
                          onChange={(e) => setGrievanceType(e.target.value)}
                          className="w-full bg-white border border-[#D8D3C7] rounded-xl px-3 py-2 text-xs text-[#14274E] focus:border-[#14274E] focus:outline-hidden"
                        >
                          <option value="Streetlight Outage">{language === 'en' ? 'Streetlight / Power Outage' : 'የመንገድ መብራት / የመብራት መቆራረጥ'}</option>
                          <option value="Water Leakage">{language === 'en' ? 'Water Pipe Leakage / Supply' : 'የንፁህ ውኃ መስመር ብልሽት'}</option>
                          <option value="Road Damage">{language === 'en' ? 'Potholes & Cobblestone Repair' : 'የኮብልስቶን / የመንገድ ጥገና'}</option>
                          <option value="Illegal Waste">{language === 'en' ? 'Solid Waste & Illegal Dumping' : 'የደረቅ ቆሻሻ ማንሳት / የፅዳት ጥያቄ'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#14274E] mb-1">
                          {language === 'en' ? 'Your Woreda:' : 'የሚኖሩበት ወረዳ:'}
                        </label>
                        <select className="w-full bg-white border border-[#D8D3C7] rounded-xl px-3 py-2 text-xs text-[#14274E] focus:border-[#14274E] focus:outline-hidden">
                          <option value="Woreda 08">Woreda 08 (Jemo 1)</option>
                          <option value="Woreda 03">Woreda 03 (Mekanisa)</option>
                          <option value="Woreda 06">Woreda 06 (Kera)</option>
                          <option value="Woreda 01">Woreda 01 (Saris)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#14274E] mb-1">
                        {language === 'en' ? 'Brief Description / Location:' : 'አጭር ማብራሪያ ወይም ልዩ ቦታ:'}
                      </label>
                      <textarea
                        rows={2}
                        value={grievanceDesc}
                        onChange={(e) => setGrievanceDesc(e.target.value)}
                        placeholder={language === 'en' ? 'Describe the location and details of the issue...' : 'ቦታውን እና ያለውን ችግር ይግለጹ...'}
                        className="w-full bg-white border border-[#D8D3C7] rounded-xl px-3 py-2 text-xs text-[#14274E] focus:border-[#14274E] focus:outline-hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#0348AB] hover:bg-[#023888] text-white font-bold text-xs py-2 px-5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Submit Ticket' : 'ቅሬታውን ላክ'}</span>
                    </button>
                  </form>

                  {grievanceTicket && (
                    <div className="bg-white border border-[#E5E0D5] rounded-xl p-3 text-xs flex items-center justify-between text-[#14274E] font-semibold">
                      <span>{language === 'en' ? 'Ticket Reference:' : 'የመከታተያ ቁጥር:'} <strong className="font-mono">{grievanceTicket}</strong></span>
                      <span className="text-[#0F6E56] text-[11px] font-bold">
                        {language === 'en' ? 'Assigned to Woreda Officer' : 'ለወረዳ ኃላፊ ተመርቷል'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* 5. TRAFFIC CAMERA SIMULATOR */}
              {system.demoType === 'traffic_cam' && (
                <div className="bg-[#F7F5F0] border border-[#E5E0D5] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-3">
                    <div className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-[#14274E]" />
                      <div>
                        <h4 className="font-bold text-[#14274E] text-sm">
                          {language === 'en' ? 'Real-Time Traffic & Parking Availability' : 'የቀጥታ የትራፊክ ፍሰት እና የመኪና ማቆሚያ መረጃ'}
                        </h4>
                        <p className="text-xs text-[#6B6558]">
                          {language === 'en' ? 'Live status across major intersections in Nifas Silk-Lafto' : 'በክፍለ ከተማው ዋና ዋና አደባባዮች ላይ ያለው ሁኔታ'}
                        </p>
                      </div>
                    </div>

                    <select
                      value={selectedIntersection}
                      onChange={(e) => setSelectedIntersection(e.target.value)}
                      className="bg-white border border-[#D8D3C7] text-xs text-[#14274E] rounded-xl px-2.5 py-1"
                    >
                      <option value="Gotera Interchange">Gotera Interchange</option>
                      <option value="Jemo 1 Commercial Square">Jemo 1 Square</option>
                      <option value="Saris Abo Intersection">Saris Abo Junction</option>
                    </select>
                  </div>

                  <div className="relative bg-white rounded-xl h-44 border border-[#E5E0D5] overflow-hidden flex items-center justify-center">
                    <div className="absolute top-3 left-3 bg-[#B45309] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      LIVE FEED • {selectedIntersection}
                    </div>

                    <div className="text-center space-y-2 z-10">
                      <p className="text-xs font-bold text-[#14274E]">
                        {language === 'en' ? 'Traffic Flow: Smooth (38 km/h Average)' : 'የትራፊክ ፍሰት: ሰላማዊ እና ክፍት'}
                      </p>
                      <div className="inline-block bg-[#F7F5F0] border border-[#E5E0D5] px-3 py-1 rounded-full text-xs text-[#6B6558]">
                        {language === 'en' ? 'Available Street Parking Nearby:' : 'ክፍት የመኪና ማቆሚያ ቦታ:'} <strong className="text-[#0F6E56]">18 Slots</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* GENERIC SERVICE PORTAL FALLBACK */}
              {(system.demoType === 'generic' || system.demoType === 'health_tracker' || system.demoType === 'permit_portal' || system.demoType === 'waste_dispatch') && (
                <div className="bg-[#F7F5F0] border border-[#E5E0D5] rounded-2xl p-5 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-2">
                    <div className="flex items-center gap-2 text-[#14274E] font-bold">
                      <Building2 className="w-4 h-4 text-[#14274E]" />
                      <span>{language === 'en' ? 'Citizen Service Digital Portal' : 'ዲጂታል የአገልግሎት መረጃ'}</span>
                    </div>
                    <span className="text-[#0F6E56] font-bold text-[11px]">
                      {language === 'en' ? 'ACTIVE & ONLINE' : 'ንቁ'}
                    </span>
                  </div>

                  <p className="text-[#6B6558] leading-relaxed">
                    {system.description}
                  </p>

                  <div className="pt-2">
                    <h5 className="font-bold text-[#14274E] mb-1.5">
                      {language === 'en' ? 'Key Available Digital Services:' : 'የሚሰጡ ዋና ዋና አገልግሎቶች:'}
                    </h5>
                    <ul className="grid sm:grid-cols-2 gap-2 text-[#6B6558]">
                      {system.features.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-[#E5E0D5]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0F6E56] shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* System Features Checklist */}
              <div>
                <h4 className="font-bold text-[#14274E] text-sm mb-3">
                  {language === 'en' ? 'Service Features & Guarantees' : 'የአገልግሎቱ ዋና ዋና ጥቅሞች'}
                </h4>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  {system.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 bg-[#F7F5F0] border border-[#E5E0D5] p-2.5 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-[#0F6E56] shrink-0" />
                      <span className="text-[#6B6558] font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CITIZEN GUIDE & REQUIREMENTS */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <h4 className="font-bold text-[#14274E] text-sm">
                {language === 'en' ? 'Citizen Guide & Required Documents' : 'አስፈላጊ ሰነዶች እና መመሪያ'}
              </h4>
              
              <div className="space-y-3">
                <div className="bg-[#F7F5F0] border border-[#E5E0D5] rounded-2xl p-4 space-y-2 text-xs">
                  <h5 className="font-bold text-[#14274E] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#14274E]" />
                    {language === 'en' ? '1. Identification & Proof of Residency' : '1. የነዋሪነት ማረጋገጫ እና መታወቂያ'}
                  </h5>
                  <p className="text-[#6B6558]">
                    {language === 'en' 
                      ? 'Valid Kebele/Woreda ID card or National Digital ID (Fayda). Power of attorney required if applying on behalf of family.'
                      : 'የታደሰ የወረዳ ነዋሪነት መታወቂያ ወይም የፋይዳ ዲጂታል መታወቂያ:: በውክልና ከሆነ ህጋዊ የውክልና ማስረጃ ያስፈልጋል::'}
                  </p>
                </div>

                <div className="bg-[#F7F5F0] border border-[#E5E0D5] rounded-2xl p-4 space-y-2 text-xs">
                  <h5 className="font-bold text-[#14274E] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#14274E]" />
                    {language === 'en' ? '2. Service Turnaround Time' : '2. አገልግሎቱ የሚወስደው ጊዜ'}
                  </h5>
                  <p className="text-[#6B6558]">
                    {language === 'en' 
                      ? 'Standard processing within 24 to 48 hours for online submissions. Urgent requests processed same day at Woreda counters.'
                      : 'በመስመር ላይ ለሚቀርቡ ማመልከቻዎች ከ24 እስከ 48 ሰዓታት:: አጣዳፊ ጉዳዮች በወረዳው በአካል በአንድ ቀን ውስጥ ይስተናገዳሉ::'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT & OFFICE INFO */}
          {activeTab === 'contact' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-[#14274E] text-sm">
                {language === 'en' ? 'Responsible Department & Contacts' : 'ኃላፊ መምሪያ እና የስራ ሰዓት'}
              </h4>
              
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-[#F7F5F0] border border-[#E5E0D5] p-4 rounded-2xl space-y-1">
                  <span className="text-[#8A8578]">{language === 'en' ? 'Lead Department:' : 'መምሪያ:'}</span>
                  <p className="font-bold text-[#14274E] text-sm">{system.department}</p>
                </div>

                <div className="bg-[#F7F5F0] border border-[#E5E0D5] p-4 rounded-2xl space-y-1">
                  <span className="text-[#8A8578]">{language === 'en' ? 'Service Desk Lead:' : 'ኃላፊ:'}</span>
                  <p className="font-bold text-[#14274E] text-sm">{system.leadOfficer}</p>
                </div>
              </div>

              <div className="bg-[#F7F5F0] border border-[#E5E0D5] p-4 rounded-2xl space-y-2">
                <span className="font-bold text-[#14274E]">{language === 'en' ? 'Working Hours & Location:' : 'የስራ ሰዓት እና አድራሻ:'}</span>
                <p className="text-[#6B6558]">
                  {language === 'en' 
                    ? 'Monday – Friday: 8:30 AM – 5:30 PM | Saturday: 8:30 AM – 12:30 PM. Available at Nifas Silk-Lafto Sub-City HQ and all 15 Woreda branch offices.'
                    : 'ከሰኞ እስከ አርብ: 2:30 ጠዋት – 11:30 ከሰዓት | ቅዳሜ: 2:30 ጠዋት – 6:30 ቀትር:: በክፍለ ከተማው ዋና አስተዳደር እና በሁሉም 15 ወረዳዎች ይገኛል::'}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-[#F7F5F0] px-6 py-3 border-t border-[#E5E0D5] flex items-center justify-between text-xs">
          <span className="text-[#8A8578] font-medium">
            {language === 'en' ? 'Official Municipal Service Desk' : 'የንፋስ ስልክ ላፍቶ ክፍለ ከተማ አስተዳደር'}
          </span>

          <button
            onClick={onClose}
            className="bg-[#0348AB] hover:bg-[#023888] text-white font-bold px-5 py-2 rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            {language === 'en' ? 'Close Window' : 'ዝጋ'}
          </button>
        </div>

      </div>
    </div>
  );
};

