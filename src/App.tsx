import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SystemAnalytics } from './components/SystemAnalytics';
import { SystemsDirectory } from './components/SystemsDirectory';
import { GovernmentPortalsPage } from './components/GovernmentPortalsPage';
import { SystemDetailModal } from './components/SystemDetailModal';
import { AboutSubCity } from './components/AboutSubCity';
import { WoredasExplorer } from './components/WoredasExplorer';
import { LandmarksSection } from './components/LandmarksSection';
import { Footer } from './components/Footer';
import { SUB_CITY_SYSTEMS } from './data/systemsData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'production' | 'development' | 'testing'>('all');
  const [selectedSystemModalId, setSelectedSystemModalId] = useState<string | null>(null);

  // Find the selected system object for modal display
  const activeSystem = SUB_CITY_SYSTEMS.find((s) => s.id === selectedSystemModalId) || null;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const targetId = tab === 'portals' ? 'government-portals-section'
        : tab === 'systems' ? 'systems-directory' 
        : tab === 'analytics' ? 'analytics-section'
        : tab === 'woredas' ? 'woredas-section'
        : tab === 'landmarks' ? 'landmarks-section'
        : 'about-section';
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  const handleNavigateToSystems = (statusFilter?: 'all' | 'production' | 'development' | 'testing') => {
    if (statusFilter) {
      setSelectedStatusFilter(statusFilter);
    }
    handleTabChange('systems');
  };

  const handleNavigateToAnalytics = () => {
    handleTabChange('analytics');
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#FBF9F4] text-[#0f172a] font-sans antialiased selection:bg-[#0d2d4c]/10 selection:text-[#0d2d4c]">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenSystemModal={(id) => setSelectedSystemModalId(id)}
      />

      {/* Main Single-Page Unified Cards Portal */}
      <main className="w-full max-w-full overflow-x-hidden">
        {/* Informative & Attractive Hero Introduction Section */}
        <HeroSection
          onNavigateToSystems={handleNavigateToSystems}
          onNavigateToAnalytics={handleNavigateToAnalytics}
        />

        {/* Collected Cards Single-Page Directory */}
        <div className="space-y-0">
          {/* Official Federal & Municipal Government Gateways (6 Portals) */}
          <GovernmentPortalsPage 
            onBackToOverview={() => handleTabChange('overview')}
          />

          <SystemsDirectory
            selectedStatusFilter={selectedStatusFilter}
            setSelectedStatusFilter={setSelectedStatusFilter}
            onOpenSystemModal={(id) => setSelectedSystemModalId(id)}
          />

          <SystemAnalytics />

          <AboutSubCity />

          <WoredasExplorer />

          <LandmarksSection />
        </div>
      </main>

      {/* Interactive System Workspace Modal */}
      <SystemDetailModal
        system={activeSystem}
        onClose={() => setSelectedSystemModalId(null)}
      />

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
