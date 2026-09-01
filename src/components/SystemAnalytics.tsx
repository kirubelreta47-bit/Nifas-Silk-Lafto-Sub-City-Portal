import React, { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  AreaChart, 
  Area,
  Legend
} from 'recharts';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  Building2,
  Users,
  Radio,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { SYSTEM_METRICS } from '../data/systemsData';
import { useLanguage } from '../context/LanguageContext';

export const SystemAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'distribution' | 'departments' | 'traffic'>('distribution');
  const { language } = useLanguage();

  // Status distribution data
  const statusData = [
    { name: language === 'en' ? 'Available Online' : 'በመስመር ላይ የሚገኝ', value: SYSTEM_METRICS.inProduction, color: '#0F6E56', label: '14 Services' },
    { name: language === 'en' ? 'In Preparation' : 'በዝግጅት ላይ', value: SYSTEM_METRICS.inDevelopment, color: '#B45309', label: '7 Services' },
    { name: language === 'en' ? 'Pilot Testing' : 'የሙከራ ደረጃ', value: SYSTEM_METRICS.inTesting, color: '#14274E', label: '3 Services' },
  ];

  // Departmental breakdown data
  const departmentData = [
    { name: language === 'en' ? 'Citizen' : 'ዜጎች', total: 7, production: 5, dev: 1, testing: 1 },
    { name: language === 'en' ? 'Land/Tax' : 'መሬት/ገቢ', total: 4, production: 3, dev: 1, testing: 0 },
    { name: language === 'en' ? 'Infra' : 'መሠረተ-ልማት', total: 5, production: 2, dev: 3, testing: 0 },
    { name: language === 'en' ? 'Health' : 'ጤና/ደህንነት', total: 4, production: 2, dev: 1, testing: 1 },
    { name: language === 'en' ? 'Admin' : 'አስተዳደር', total: 4, production: 2, dev: 1, testing: 1 },
  ];

  // Hourly transaction volume simulation (24 hours)
  const trafficData = [
    { hour: '08:00', requests: 1850 },
    { hour: '10:00', requests: 3420 },
    { hour: '12:00', requests: 2980 },
    { hour: '14:00', requests: 3890 },
    { hour: '16:00', requests: 3120 },
    { hour: '18:00', requests: 1640 },
  ];

  // Live activity stream simulation
  const liveEvents = [
    { time: language === 'en' ? 'Just now' : 'አሁን', worn: 'Woreda 03 (Mekanisa)', event: language === 'en' ? 'Resident ID application verified & approved' : 'የነዋሪነት መታወቂያ ተረጋግጦ ፀደቀ', sys: 'Civil Registry' },
    { time: language === 'en' ? '2m ago' : 'ከ2 ደቂቃ በፊት', worn: 'Woreda 08 (Jemo 1)', event: language === 'en' ? 'Business tax payment of ETB 18,400 received via Telebirr' : 'የንግድ ግብር ክፍያ በቴሌብር ተፈጸመ', sys: 'Revenue Desk' },
    { time: language === 'en' ? '5m ago' : 'ከ5 ደቂቃ በፊት', worn: 'Woreda 05 (Vatican)', event: language === 'en' ? 'Building permit application received for review' : 'የግንባታ ፈቃድ ማመልከቻ ለግምገማ ደረሰ', sys: 'Permit Portal' },
    { time: language === 'en' ? '8m ago' : 'ከ8 ደቂቃ በፊት', worn: 'Woreda 06 (Kera)', event: language === 'en' ? 'Municipal sanitation team dispatched' : 'የፅዳት አገልግሎት ቡድን ተሰማራ', sys: 'Sanitation' },
    { time: language === 'en' ? '12m ago' : 'ከ12 ደቂቃ በፊት', worn: 'Woreda 04 (German Sq)', event: language === 'en' ? 'Health certification issued to community clinic' : 'የጤና ጥበቃ ማረጋገጫ ተሰጠ', sys: 'Health Services' },
    { time: language === 'en' ? '15m ago' : 'ከ15 ደቂቃ በፊት', worn: 'Woreda 02 (Nifas Silk)', event: language === 'en' ? 'Trade license renewal certificate processed' : 'የንግድ ፈቃድ እድሳት ተጠናቀቀ', sys: 'Trade & Industry' },
  ];

  return (
    <section id="analytics-section" className="py-12 bg-[#F7F5F0] text-[#6B6558] border-t border-[#E5E0D5] relative">
      <div className="w-full max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-[#E5E0D5]">
          <div>
            <div className="flex items-center gap-2 text-[#14274E] text-xs font-bold uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4 text-[#14274E]" />
              <span>{language === 'en' ? 'Public Service Analytics • 24 Portals' : 'የአገልግሎቶች ሁኔታ እና መረጃ'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14274E] tracking-tight">
              {language === 'en' ? 'Service Status & Municipal Activity' : 'የአገልግሎት ዝግጁነት እና እንቅስቃሴ'}
            </h2>
            <p className="text-sm text-[#6B6558] mt-1">
              {language === 'en' 
                ? 'Overview of digital municipal readiness, citizen utilization, and service performance across all 15 Woredas.' 
                : 'በሁሉም 15 ወረዳዎች የሚሰጡ የህዝብ አገልግሎቶች ዝግጁነት እና የዜጎች ተጠቃሚነት ሁኔታ::'}
            </p>
          </div>

          <div className="flex flex-wrap items-center bg-white p-1 rounded-xl border border-[#D8D3C7] self-start md:self-auto gap-1">
            <button
              onClick={() => setActiveTab('distribution')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'distribution'
                  ? 'bg-[#0348AB] text-white shadow-xs'
                  : 'text-[#6B6558] hover:text-[#0348AB]'
              }`}
            >
              {language === 'en' ? 'Readiness Status' : 'የዝግጁነት ሁኔታ'}
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'departments'
                  ? 'bg-[#0348AB] text-white shadow-xs'
                  : 'text-[#6B6558] hover:text-[#0348AB]'
              }`}
            >
              {language === 'en' ? 'By Sector' : 'በዘርፍ'}
            </button>
            <button
              onClick={() => setActiveTab('traffic')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'traffic'
                  ? 'bg-[#0348AB] text-white shadow-xs'
                  : 'text-[#6B6558] hover:text-[#0348AB]'
              }`}
            >
              {language === 'en' ? 'Daily Volume' : 'ዕለታዊ እንቅስቃሴ'}
            </button>
          </div>
        </div>

        {/* Top 3 Quick Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: Production (14) */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-white border border-[#E5E0D5] rounded-2xl p-5 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[#14274E] font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-[#0F6E56]" />
                <span>{language === 'en' ? 'Available Online' : 'በመስመር ላይ የሚገኙ'}</span>
              </div>
              <span className="text-[#0F6E56] text-xs font-bold">
                58.3%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#14274E]">14 {language === 'en' ? 'Services' : 'አገልግሎቶች'}</span>
              <span className="text-xs text-[#8A8578] font-medium">{language === 'en' ? 'out of 24' : 'ከ 24'}</span>
            </div>
            <p className="text-xs text-[#6B6558] mt-2">
              {language === 'en' 
                ? 'Fully accessible 24/7 across all 15 Woredas including ID verification, Land Title, and Tax payment.' 
                : 'በሁሉም 15 ወረዳዎች ያለማቋረጥ አገልግሎት እየሰጡ ያሉ (የነዋሪ መታወቂያ፣ የመሬት ካርታ እና ግብር)::'}
            </p>
          </motion.div>

          {/* Card 2: Development / In Preparation (7) */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-white border border-[#E5E0D5] rounded-2xl p-5 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[#14274E] font-bold text-sm">
                <Clock className="w-5 h-5 text-[#B45309]" />
                <span>{language === 'en' ? 'In Preparation' : 'በዝግጅት ላይ ያሉ'}</span>
              </div>
              <span className="text-[#B45309] text-xs font-bold">
                29.2%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#14274E]">7 {language === 'en' ? 'Services' : 'አገልግሎቶች'}</span>
              <span className="text-xs text-[#8A8578] font-medium">{language === 'en' ? 'out of 24' : 'ከ 24'}</span>
            </div>
            <p className="text-xs text-[#6B6558] mt-2">
              {language === 'en' 
                ? 'Under final development: Smart Traffic, Waste Collection Dispatch, 3D GIS mapping, and Streetlight automation.' 
                : 'የመጨረሻ ዝግጅት ላይ ያሉ (ዘመናዊ የትራፊክ መረጃ፣ የቆሻሻ አሰባሰብ እና የጎዳና መብራቶች)::'}
            </p>
          </motion.div>

          {/* Card 3: Pilot Testing (3) */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-white border border-[#E5E0D5] rounded-2xl p-5 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[#14274E] font-bold text-sm">
                <Sparkles className="w-5 h-5 text-[#14274E]" />
                <span>{language === 'en' ? 'Pilot Testing Phase' : 'በሙከራ ደረጃ ላይ ያሉ'}</span>
              </div>
              <span className="text-[#14274E] text-xs font-bold">
                12.5%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#14274E]">3 {language === 'en' ? 'Services' : 'አገልግሎቶች'}</span>
              <span className="text-xs text-[#8A8578] font-medium">{language === 'en' ? 'out of 24' : 'ከ 24'}</span>
            </div>
            <p className="text-xs text-[#6B6558] mt-2">
              {language === 'en' 
                ? 'Field-testing in selected Woredas: Citizen Touch Kiosks, Fleet GPS monitoring, and Maternal Health Tracker.' 
                : 'በተመረጡ ወረዳዎች የሙከራ ትግበራ ላይ ያሉ (የዜጎች የኪዮስክ መረጃ፣ የተሽከርካሪ ክትትል እና የጤና አገልግሎት)::'}
            </p>
          </motion.div>

        </div>

        {/* Graphical Section Container */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Chart Column */}
          <div className="lg:col-span-7 bg-white border border-[#E5E0D5] rounded-2xl p-6">
            
            {activeTab === 'distribution' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-[#14274E] text-base">
                      {language === 'en' ? 'Service Readiness Ratio' : 'የአገልግሎቶች ዝግጁነት ምጥጥን'}
                    </h3>
                    <p className="text-xs text-[#8A8578]">
                      {language === 'en' ? 'Breakdown of 24 sub-city digital municipal services' : 'የ24ቱ የክፍለ ከተማ አገልግሎቶች ወቅታዊ ሁኔታ'}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#14274E] bg-[#F7F5F0] px-2.5 py-1 rounded-lg border border-[#E5E0D5]">
                    {language === 'en' ? 'Total: 24 Services' : 'ጠቅላላ: 24 አገልግሎቶች'}
                  </span>
                </div>

                <div className="h-64 sm:h-72 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E5E0D5', borderRadius: '12px', color: '#14274E', fontSize: '12px' }}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#E5E0D5] text-center text-xs">
                  <div className="bg-[#F7F5F0] border border-[#E5E0D5] rounded-xl p-2.5">
                    <span className="block text-[#0F6E56] font-semibold">{language === 'en' ? 'Online' : 'በመስመር ላይ'}</span>
                    <span className="text-lg font-bold text-[#14274E]">14 (58%)</span>
                  </div>
                  <div className="bg-[#F7F5F0] border border-[#E5E0D5] rounded-xl p-2.5">
                    <span className="block text-[#B45309] font-semibold">{language === 'en' ? 'In Prep' : 'በዝግጅት ላይ'}</span>
                    <span className="text-lg font-bold text-[#14274E]">7 (29%)</span>
                  </div>
                  <div className="bg-[#F7F5F0] border border-[#E5E0D5] rounded-xl p-2.5">
                    <span className="block text-[#14274E] font-semibold">{language === 'en' ? 'Pilot' : 'ሙከራ'}</span>
                    <span className="text-lg font-bold text-[#14274E]">3 (13%)</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'departments' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-[#14274E] text-base">
                      {language === 'en' ? 'Services by Sector' : 'አገልግሎቶች በሴክተር'}
                    </h3>
                    <p className="text-xs text-[#8A8578]">
                      {language === 'en' ? 'Distribution across key administrative bureaus' : 'በዋና ዋና መምሪያዎች የተከፋፈሉ'}
                    </p>
                  </div>
                </div>

                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#8A8578" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#8A8578" tick={{ fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E5E0D5', borderRadius: '12px', color: '#14274E', fontSize: '12px' }}
                      />
                      <Legend />
                      <Bar dataKey="production" name={language === 'en' ? 'Online' : 'በመስመር ላይ'} fill="#0F6E56" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="dev" name={language === 'en' ? 'In Preparation' : 'በዝግጅት ላይ'} fill="#B45309" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="testing" name={language === 'en' ? 'Pilot' : 'ሙከራ'} fill="#14274E" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'traffic' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-[#14274E] text-base">
                      {language === 'en' ? 'Citizen Service Inquiries by Hour' : 'የተገልጋይ ዜጎች ቁጥር በሰዓት'}
                    </h3>
                    <p className="text-xs text-[#8A8578]">
                      {language === 'en' ? 'Hourly service requests during sub-city municipal hours' : 'በስራ ሰዓታት ውስጥ የሚስተናገዱ የዜጎች ጥያቄዎች'}
                    </p>
                  </div>
                </div>

                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <XAxis dataKey="hour" stroke="#8A8578" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#8A8578" tick={{ fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E5E0D5', borderRadius: '12px', color: '#14274E', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="requests" name={language === 'en' ? 'Citizen Inquiries' : 'የተጠቃሚ ጥያቄዎች'} stroke="#14274E" fill="#E5E0D5" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

          </div>

          {/* Live Activity & Community Feed Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Citizen Activity Feed */}
            <div className="bg-white border border-[#E5E0D5] rounded-2xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D5]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0F6E56]"></span>
                  <span className="font-bold text-sm text-[#14274E]">
                    {language === 'en' ? 'Live Citizen Service Activity' : 'የቀጥታ የአገልግሎት እንቅስቃሴ'}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#0F6E56] bg-[#F7F5F0] px-2 py-0.5 rounded-full border border-[#E5E0D5]">
                  {language === 'en' ? '15 Woredas Connected' : '15 ወረዳዎች ንቁ'}
                </span>
              </div>

              <div className="space-y-3 pt-3 max-h-72 overflow-y-auto text-xs pr-1">
                {liveEvents.map((evt, idx) => (
                  <div key={idx} className="bg-[#F7F5F0] hover:bg-white p-2.5 rounded-xl border border-[#E5E0D5] transition-colors">
                    <div className="flex items-center justify-between text-[#8A8578] text-[11px] mb-1">
                      <span className="font-bold text-[#14274E]">{evt.worn}</span>
                      <span className="text-[10px] text-[#8A8578]">{evt.time}</span>
                    </div>
                    <p className="text-[#6B6558] font-medium text-[11px]">{evt.event}</p>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-[#8A8578]">
                      <span className="bg-white text-[#14274E] px-1.5 py-0.5 rounded border border-[#E5E0D5] font-medium">
                        {evt.sys}
                      </span>
                      <span className="text-[#0F6E56] font-semibold">
                        {language === 'en' ? '✓ Completed' : '✓ ተጠናቀቀ'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-City Connectivity Card */}
            <div className="bg-white border border-[#E5E0D5] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#14274E] font-bold text-sm">
                  <Radio className="w-4 h-4 text-[#14274E]" />
                  <span>{language === 'en' ? 'Woreda Connectivity Status' : 'የወረዳዎች ግንኙነት ሁኔታ'}</span>
                </div>
                <span className="text-[#0F6E56] font-bold text-xs">
                  {language === 'en' ? 'All Active' : 'ሁሉም ንቁ'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#6B6558]">
                  <span>{language === 'en' ? 'Municipal Fiber Network:' : 'የፋይበር መስመር:'}</span>
                  <span className="font-bold text-[#14274E]">15 / 15 {language === 'en' ? 'Branches Online' : 'ወረዳዎች'}</span>
                </div>
                <div className="flex justify-between text-[#6B6558]">
                  <span>{language === 'en' ? 'Citizen Service Speed:' : 'የአገልግሎት ፍጥነት:'}</span>
                  <span className="font-bold text-[#14274E]">&lt; 15 min {language === 'en' ? 'Average' : 'አማካይ'}</span>
                </div>
                <div className="flex justify-between text-[#6B6558]">
                  <span>{language === 'en' ? 'Telebirr Payment Gateway:' : 'የቴሌብር ክፍያ:'}</span>
                  <span className="font-bold text-[#0F6E56]">{language === 'en' ? 'Active & Verified' : 'የተረጋገጠ'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

