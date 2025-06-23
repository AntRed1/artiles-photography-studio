import React, { useState, useRef } from 'react';
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

// Componente principal de la página de inicio
const Home: React.FC = () => {
  // Estado para controlar el menú y los modales
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toastTimeout = useRef<number | null>(null);

  // Referencias para las secciones (mantenidas para posibles funcionalidades futuras como desplazamiento suave)
  const sectionRefs = {
    carousel: useRef<HTMLDivElement>(null),
    aboutUs: useRef<HTMLDivElement>(null),
    services: useRef<HTMLDivElement>(null),
    packages: useRef<HTMLDivElement>(null),
    gallery: useRef<HTMLDivElement>(null),
    testimonials: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  // Limpiar notificaciones de error después de 5 segundos
  React.useEffect(() => {
    if (error) {
      if (toastTimeout.current) {
        clearTimeout(toastTimeout.current);
      }
      toastTimeout.current = window.setTimeout(() => setError(null), 5000);
      return () => {
        if (toastTimeout.current) {
          clearTimeout(toastTimeout.current);
        }
      };
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-white">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      {error && (
        <div
          className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
      <div ref={sectionRefs.carousel} data-section="Carousel">
        <Carousel />
      </div>
      <div ref={sectionRefs.aboutUs} data-section="AboutUs">
        <AboutUs />
      </div>
      <div ref={sectionRefs.services} data-section="Services">
        <Services />
      </div>
      <div ref={sectionRefs.packages} data-section="Packages">
        <Packages />
      </div>
      <div ref={sectionRefs.gallery} data-section="Gallery">
        <Gallery />
      </div>
      <div ref={sectionRefs.testimonials} data-section="Testimonials">
        <Testimonials setShowShareModal={setShowShareModal} />
      </div>
      <div ref={sectionRefs.contact} data-section="Contact">
        <Contact />
      </div>
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
