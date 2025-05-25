/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';
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

interface TrackEventProps {
  name: string;
  props?: Record<string, string>;
}

const Home: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const trackedSections = useRef<Set<string>>(new Set());
  const toastTimeout = useRef<number | null>(null);

  // Referencias para las secciones
  const sectionRefs = {
    carousel: useRef<HTMLDivElement>(null),
    aboutUs: useRef<HTMLDivElement>(null),
    services: useRef<HTMLDivElement>(null),
    packages: useRef<HTMLDivElement>(null),
    gallery: useRef<HTMLDivElement>(null),
    testimonials: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  // Función para rastrear eventos personalizados a través del backend
  const trackEvent = async ({ name, props }: TrackEventProps) => {
    try {
      const response = await fetch('/api/analytics/track-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          url: window.location.href,
          userAgent: navigator.userAgent,
          ipAddress: 'unknown',
          props: props || {},
        }),
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      console.log(`Evento enviado: ${name}`, props);
    } catch (error) {
      console.error('Error al enviar evento:', error);
      setError('No se pudo registrar la acción. Intenta de nuevo.');
    }
  };

  // Función de rastreo con debounce
  const debouncedTrackEvent = useCallback(
    debounce((name: string, props?: Record<string, string>) => {
      void trackEvent({ name, props });
    }, 1000),
    []
  );

  // Mostrar y limpiar notificaciones de error
  useEffect(() => {
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

  // Rastrear cuando se abre el modal de compartir
  useEffect(() => {
    if (showShareModal) {
      debouncedTrackEvent('OpenShareModal');
    }
  }, [showShareModal, debouncedTrackEvent]);

  // Configurar IntersectionObserver para rastrear visibilidad de secciones
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.getAttribute('data-section');
            if (sectionName && !trackedSections.current.has(sectionName)) {
              trackedSections.current.add(sectionName);
              debouncedTrackEvent('ViewSection', { section: sectionName });
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.values(sectionRefs).forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [debouncedTrackEvent, sectionRefs]);

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
        <Contact onSubmit={() => debouncedTrackEvent('ContactFormSubmit')} />
      </div>
      <Footer
        setShowPrivacyModal={setShowPrivacyModal}
        setShowTermsModal={setShowTermsModal}
      />
      <WhatsAppButton
        onClick={() => debouncedTrackEvent('WhatsAppButtonClick')}
      />
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
