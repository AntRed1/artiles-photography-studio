/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import useScroll from '../hooks/useScroll';
import logo from '../assets/images/logo.png';
import { getContactInfo } from '../services/contactInfoService';
import { getInformation } from '../services/informationService';
import { ContactInfo, Information } from '../types';

interface FooterProps {
  setShowPrivacyModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowTermsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

// Definir variantes con tipos explícitos
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1] as [number, number, number, number], // Curva de Bezier explícita
    },
  },
};

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
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-24 sm:w-32 lg:w-48 h-24 sm:h-32 lg:h-48 bg-rose-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-20 sm:w-28 lg:w-40 h-20 sm:h-28 lg:h-40 bg-pink-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-16 sm:w-24 lg:w-36 h-16 sm:h-24 lg:h-36 bg-rose-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
        <div className="pt-6 sm:pt-8 lg:pt-12 pb-4 sm:pb-6">
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-8 sm:py-12">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-sm sm:text-base">
                  Cargando...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex justify-center items-center py-8 sm:py-12">
              <p className="text-rose-400 text-sm sm:text-base text-center">
                No se pudo cargar la información.
              </p>
            </div>
          )}

          {/* Main Content */}
          {!isLoading && !error && contactInfo && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8"
            >
              {/* Company Info */}
              <motion.div
                variants={itemVariants}
                className="sm:col-span-2 lg:col-span-1 xl:col-span-1"
              >
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-4 sm:mb-6">
                  <motion.img
                    src={logo}
                    alt="Artiles Photography Studio"
                    className="h-8 sm:h-10 md:h-12 w-auto mb-2 sm:mb-3 brightness-0 invert"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    transition={{ duration: 0.3 }}
                  />
                  <h3 className="text-base sm:text-lg md:text-xl font-bold">
                    <span className="text-white">Artiles Photography</span>{' '}
                    <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                      Studio
                    </span>
                  </h3>
                </div>

                <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base leading-relaxed">
                  Capturando momentos especiales y creando recuerdos
                  inolvidables desde 2015.
                </p>

                {/* Social Media */}
                <div className="flex justify-center lg:justify-start space-x-3 sm:space-x-4">
                  {contactInfo.facebook && (
                    <motion.a
                      href={contactInfo.facebook}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-rose-600 hover:to-pink-600 rounded-full flex items-center justify-center transition-all duration-300 group"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fab fa-facebook-f text-xs sm:text-sm text-gray-400 group-hover:text-white transition-colors"></i>
                    </motion.a>
                  )}
                  {contactInfo.instagram && (
                    <motion.a
                      href={contactInfo.instagram}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-rose-600 hover:to-pink-600 rounded-full flex items-center justify-center transition-all duration-300 group"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fab fa-instagram text-xs sm:text-sm text-gray-400 group-hover:text-white transition-colors"></i>
                    </motion.a>
                  )}
                  {contactInfo.twitter && (
                    <motion.a
                      href={contactInfo.twitter}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-rose-600 hover:to-pink-600 rounded-full flex items-center justify-center transition-all duration-300 group"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fab fa-twitter text-xs sm:text-sm text-gray-400 group-hover:text-white transition-colors"></i>
                    </motion.a>
                  )}
                  {contactInfo.tiktok && (
                    <motion.a
                      href={contactInfo.tiktok}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-rose-600 hover:to-pink-600 rounded-full flex items-center justify-center transition-all duration-300 group"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fab fa-tiktok text-xs sm:text-sm text-gray-400 group-hover:text-white transition-colors"></i>
                    </motion.a>
                  )}
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                variants={itemVariants}
                className="sm:col-span-1 lg:col-span-1"
              >
                <h4 className="text-sm sm:text-base md:text-lg font-bold mb-3 sm:mb-4 text-center sm:text-left">
                  Enlaces Rápidos
                </h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  {[
                    'inicio',
                    'nosotros',
                    'servicios',
                    'galeria',
                    'testimonios',
                    'contacto',
                  ].map((item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.1,
                        ease: [0.4, 0.0, 0.2, 1] as [
                          number,
                          number,
                          number,
                          number,
                        ],
                      }}
                      viewport={{ once: true }}
                    >
                      <button
                        onClick={() => scrollToSection(item)}
                        className="text-gray-400 hover:text-rose-400 hover:bg-gray-800/50 transition-all duration-200 cursor-pointer text-xs sm:text-sm md:text-base px-2 py-1 rounded-md w-full text-center sm:text-left group relative overflow-hidden"
                      >
                        <span className="relative z-10">
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-pink-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Services */}
              <motion.div
                variants={itemVariants}
                className="sm:col-span-1 lg:col-span-1"
              >
                <h4 className="text-sm sm:text-base md:text-lg font-bold mb-3 sm:mb-4 text-center sm:text-left">
                  Servicios
                </h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  {information?.specialties
                    .slice(0, 6)
                    .map((service, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.1,
                          ease: [0.4, 0.0, 0.2, 1] as [
                            number,
                            number,
                            number,
                            number,
                          ],
                        }}
                        viewport={{ once: true }}
                      >
                        <a
                          href="#servicios"
                          className="text-gray-400 hover:text-rose-400 hover:bg-gray-800/50 transition-all duration-200 text-xs sm:text-sm md:text-base px-2 py-1 rounded-md w-full block text-center sm:text-left group relative overflow-hidden"
                        >
                          <span className="relative z-10">{service}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-pink-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </a>
                      </motion.li>
                    ))}
                </ul>
              </motion.div>

              {/* Legal */}
              <motion.div
                variants={itemVariants}
                className="sm:col-span-2 lg:col-span-1 xl:col-span-1"
              >
                <h4 className="text-sm sm:text-base md:text-lg font-bold mb-3 sm:mb-4 text-center sm:text-left">
                  Legal
                </h4>
                <p className="text-gray-400 mb-2 sm:mb-3 text-xs sm:text-sm leading-relaxed text-center sm:text-left">
                  Protegemos tu privacidad y garantizamos la seguridad de tus
                  datos personales.
                </p>
                <ul className="space-y-1.5 sm:space-y-2">
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.1,
                      ease: [0.4, 0.0, 0.2, 1] as [
                        number,
                        number,
                        number,
                        number,
                      ],
                    }}
                    viewport={{ once: true }}
                  >
                    <button
                      onClick={() => setShowPrivacyModal(true)}
                      className="text-gray-400 hover:text-rose-400 hover:bg-gray-800/50 transition-all duration-200 text-xs sm:text-sm md:text-base px-2 py-1 rounded-md w-full text-center sm:text-left group relative overflow-hidden"
                    >
                      <span className="relative z-10">
                        Política de Privacidad
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-pink-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </button>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.2,
                      ease: [0.4, 0.0, 0.2, 1] as [
                        number,
                        number,
                        number,
                        number,
                      ],
                    }}
                    viewport={{ once: true }}
                  >
                    <button
                      onClick={() => setShowTermsModal(true)}
                      className="text-gray-400 hover:text-rose-400 hover:bg-gray-800/50 transition-all duration-200 text-xs sm:text-sm md:text-base px-2 py-1 rounded-md w-full text-center sm:text-left group relative overflow-hidden"
                    >
                      <span className="relative z-10">
                        Términos y Condiciones
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-pink-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </button>
                  </motion.li>
                </ul>
              </motion.div>

              {/* Payment Methods */}
              <motion.div
                variants={itemVariants}
                className="sm:col-span-2 lg:col-span-1 xl:col-span-1"
              >
                <h4 className="text-sm sm:text-base md:text-lg font-bold mb-3 sm:mb-4 text-center sm:text-left">
                  Métodos de Pago
                </h4>
                <p className="text-gray-400 mb-2 sm:mb-3 text-xs sm:text-sm leading-relaxed text-center sm:text-left">
                  Aceptamos los siguientes métodos de pago:
                </p>
                <div className="flex flex-col space-y-2 sm:space-y-3">
                  <motion.div
                    className="flex items-center justify-center sm:justify-start group cursor-pointer"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-800 group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-pink-600 rounded-full flex items-center justify-center transition-all duration-300 mr-2 sm:mr-3">
                      <i className="fa-solid fa-money-bill-wave text-gray-400 group-hover:text-white text-xs sm:text-sm transition-colors"></i>
                    </div>
                    <span className="text-gray-400 group-hover:text-rose-400 text-xs sm:text-sm md:text-base transition-colors">
                      Efectivo
                    </span>
                  </motion.div>

                  <motion.div
                    className="flex items-center justify-center sm:justify-start group cursor-pointer"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-800 group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-pink-600 rounded-full flex items-center justify-center transition-all duration-300 mr-2 sm:mr-3">
                      <i className="fa-solid fa-building-columns text-gray-400 group-hover:text-white text-xs sm:text-sm transition-colors"></i>
                    </div>
                    <span className="text-gray-400 group-hover:text-rose-400 text-xs sm:text-sm md:text-base transition-colors">
                      Transferencia Bancaria
                    </span>
                  </motion.div>

                  <motion.div
                    className="flex items-center justify-center sm:justify-start group cursor-pointer"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-800 group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-pink-600 rounded-full flex items-center justify-center transition-all duration-300 mr-2 sm:mr-3">
                      <i className="fa-brands fa-paypal text-gray-400 group-hover:text-white text-xs sm:text-sm transition-colors"></i>
                    </div>
                    <span className="text-gray-400 group-hover:text-rose-400 text-xs sm:text-sm md:text-base transition-colors">
                      PayPal
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Contact Info - Hidden on small screens, shown on larger */}
              <motion.div
                variants={itemVariants}
                className="hidden lg:block xl:col-span-1"
              >
                <h4 className="text-sm sm:text-base md:text-lg font-bold mb-3 sm:mb-4">
                  Contacto
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-rose-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="fa-solid fa-envelope text-rose-400 text-xs"></i>
                    </div>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-gray-400 hover:text-rose-400 transition-colors text-xs sm:text-sm break-all"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-rose-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="fa-solid fa-phone text-rose-400 text-xs"></i>
                    </div>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-gray-400 hover:text-rose-400 transition-colors text-xs sm:text-sm"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Additional Services on larger screens */}
              <motion.div variants={itemVariants} className="hidden xl:block">
                <h4 className="text-sm sm:text-base md:text-lg font-bold mb-3 sm:mb-4">
                  Más Servicios
                </h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  {information?.specialties
                    .slice(6, 10)
                    .map((service, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.1,
                          ease: [0.4, 0.0, 0.2, 1] as [
                            number,
                            number,
                            number,
                            number,
                          ],
                        }}
                        viewport={{ once: true }}
                      >
                        <a
                          href="#servicios"
                          className="text-gray-400 hover:text-rose-400 hover:bg-gray-800/50 transition-all duration-200 text-xs sm:text-sm px-2 py-1 rounded-md block group relative overflow-hidden"
                        >
                          <span className="relative z-10">{service}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-pink-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </a>
                      </motion.li>
                    ))}
                </ul>
              </motion.div>
            </motion.div>
          )}

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              ease: [0.4, 0.0, 0.2, 1] as [number, number, number, number],
            }}
            viewport={{ once: true }}
            className="border-t border-gray-700/50 pt-4 sm:pt-6"
          >
            <div className="flex flex-col space-y-3 sm:space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
              {/* Copyright */}
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-xs sm:text-sm">
                  © 2025{' '}
                  <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent font-medium">
                    Artiles Photography Studio
                  </span>
                  . Todos los derechos reservados.
                </p>
              </div>

              {/* Developer Info */}
              <div className="flex flex-col items-center md:items-end space-y-2">
                <p className="text-gray-500 text-xs sm:text-sm">
                  Desarrollado por{' '}
                  <span className="text-gray-300 font-medium">
                    Anthony J. Rojas Valdez
                  </span>
                </p>
                <div className="flex space-x-3 sm:space-x-4">
                  <motion.a
                    href="https://github.com/AntRed1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 hover:bg-gradient-to-r hover:from-rose-600 hover:to-pink-600 rounded-full flex items-center justify-center transition-all duration-300 group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="fab fa-github text-sm sm:text-base lg:text-lg text-gray-400 group-hover:text-white transition-colors"></i>
                  </motion.a>
                  <motion.a
                    href="https://www.linkedin.com/in/anthonyrojasv/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 hover:bg-gradient-to-r hover:from-rose-600 hover:to-pink-600 rounded-full flex items-center justify-center transition-all duration-300 group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="fab fa-linkedin text-sm sm:text-base lg:text-lg text-gray-400 group-hover:text-white transition-colors"></i>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
