import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useScroll from '../hooks/useScroll';
import logo from '../assets/images/logo.png';
import { getContactInfo } from '../services/contactInfoService';
import { getInformation } from '../services/informationService';
import { ContactInfo, Information } from '../types';

interface FooterProps {
  setShowPrivacyModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowTermsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Footer: React.FC<FooterProps> = ({
  setShowPrivacyModal,
  setShowTermsModal,
}) => {
  const { scrollToSection } = useScroll();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [information, setInformation] = useState<Information | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contact, info] = await Promise.all([
          getContactInfo(),
          getInformation(),
        ]);
        setContactInfo(contact);
        setInformation(info);
      } catch (err) {
        setError('No se pudo cargar la información del pie de página.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchData();
  }, []);

  return (
    <footer className="bg-gray-900 text-white pt-8 pb-4">
      <div className="container mx-auto px-4">
        {isLoading && <p className="text-gray-400">Cargando...</p>}
        {error && (
          <p className="text-red-500">No se pudo cargar la información.</p>
        )}
        {!isLoading && !error && contactInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-4">
                <motion.img
                  src={logo}
                  alt="Artiles Photography Studio"
                  className="h-12 w-auto mb-2 brightness-0 invert"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
                <h3 className="text-xl font-bold">
                  <span className="text-white">Artiles Photography</span>{' '}
                  <span className="text-red-500">Studio</span>
                </h3>
              </div>

              <p className="text-gray-400 mb-4">
                Capturando momentos especiales y creando recuerdos inolvidables
                desde 2015.
              </p>
              <div className="flex space-x-4">
                {contactInfo.facebook && (
                  <a
                    href={contactInfo.facebook}
                    className="text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                )}
                {contactInfo.instagram && (
                  <a
                    href={contactInfo.instagram}
                    className="text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                )}
                {contactInfo.twitter && (
                  <a
                    href={contactInfo.twitter}
                    className="text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                )}
                {contactInfo.tiktok && (
                  <a
                    href={contactInfo.tiktok}
                    className="text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-tiktok"></i>
                  </a>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                {[
                  'inicio',
                  'nosotros',
                  'servicios',
                  'galeria',
                  'testimonios',
                  'contacto',
                ].map(item => (
                  <li key={item}>
                    <button
                      onClick={() => scrollToSection(item)}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Servicios</h4>
              <ul className="space-y-2">
                {information?.specialties.map((service, index) => (
                  <li key={index}>
                    <a
                      href="#servicios"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <p className="text-gray-400 mb-2">
                Protegemos tu privacidad y garantizamos la seguridad de tus
                datos personales.
              </p>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Política de Privacidad
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowTermsModal(true)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Términos y Condiciones
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Métodos de Pago</h4>
              <p className="text-gray-400 mb-2">
                Aceptamos los siguientes métodos de pago:
              </p>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <i className="fa-solid fa-money-bill-wave text-gray-400 w-6"></i>
                  <span className="text-gray-400 ml-2">Efectivo</span>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-building-columns text-gray-400 w-6"></i>
                  <span className="text-gray-400 ml-2">
                    Transferencia Bancaria
                  </span>
                </div>
                <div className="flex items-center">
                  <i className="fa-brands fa-paypal text-gray-400 w-6"></i>
                  <span className="text-gray-400 ml-2">PayPal</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-2 md:mb-0">
              © 2025 Artiles Photography Studio. Todos los derechos reservados.
            </p>
            <div className="flex flex-col items-center md:items-end">
              <p className="text-gray-400 text-sm mb-1">
                Desarrollado por Anthony J. Rojas Valdez
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/AntRed1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fab fa-github text-xl"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/anthonyrojasv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
