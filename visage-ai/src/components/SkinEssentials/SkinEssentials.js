import React from 'react';
import './SkinEssentials.css';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import IntroSection from './IntroSection';
import EssentialsGrid from './EssentialsGrid';
import SkinTypeTabs from './SkinTypeTabs';
import TrustSection from './TrustSection';
import FooterCTA from './FooterCTA';
import Footer from './Footer';

const SkinEssentials = () => {
  return (
    <div className="skin-essentials">
      <Navbar />
      <main>
        <HeroSection />
        <IntroSection />
        <EssentialsGrid />
        <SkinTypeTabs />
        <TrustSection />
        <FooterCTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default SkinEssentials;