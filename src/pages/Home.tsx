import React, { useState } from 'react';
import Header from '../components/Header';
import Carousel from '../components/Carousel';
import AboutUs from '../components/AboutUs';
import Services from '../components/Services';
import Packages from '../components/Packages';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import ShareModal from '../components/ShareModal';
import PrivacyModal from '../components/PrivacyModal';
import TermsModal from '../components/TermsModal';

const Home: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <Carousel />
      <AboutUs />
      <Services />
      <Packages />
      <Gallery />
      <Testimonials setShowShareModal={setShowShareModal} />
      <Contact />
      <Footer
        setShowPrivacyModal={setShowPrivacyModal}
        setShowTermsModal={setShowTermsModal}
      />
      <WhatsAppButton />
      <ShareModal
        showShareModal={showShareModal}
        setShowShareModal={setShowShareModal}
      />
      <PrivacyModal
        showPrivacyModal={showPrivacyModal}
        setShowPrivacyModal={setShowPrivacyModal}
      />
      <TermsModal
        showTermsModal={showTermsModal}
        setShowTermsModal={setShowTermsModal}
      />
    </div>
  );
};

export default Home;
