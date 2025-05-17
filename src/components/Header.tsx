import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useScroll from '../hooks/useScroll';
import { getConfiguration } from '../services/configService';
import { Configuration } from '../types';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { activeSection, scrollToSection } = useScroll();
  const [config, setConfig] = useState<Configuration | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getConfiguration();
        setConfig(data);
      } catch (err) {
        console.error('Error al cargar configuración:', err);
        setError('No se pudo cargar el logo');
      }
    };
    void fetchConfig();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fallbackLogo = '/images/logo-fallback.png';

  const navItems = [
    'inicio',
    'nosotros',
    'servicios',
    'galeria',
    'testimonios',
    'contacto',
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md'
          : 'bg-white/80 backdrop-blur-md shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center flex-col sm:flex-row">
          <div className="flex items-center">
            <motion.img
              src={config?.logoUrl || fallbackLogo}
              alt={config?.logoAltText || 'Artiles Photography Studio'}
              className="h-10 sm:h-12 w-auto mr-3 sm:mr-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1, rotate: 3 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onError={e => {
                console.error('Error cargando logo:', e);
                e.currentTarget.src = fallbackLogo;
              }}
            />
            <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold flex items-center space-x-1">
              <span className="text-gray-900">Artiles</span>
              <span className="text-rose-600">Photography Studio</span>
            </h1>
          </div>
          {error && (
            <span className="text-rose-600 text-sm mt-2 sm:mt-0 sm:ml-4">
              {error}
            </span>
          )}
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map(item => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className={`relative text-sm font-medium cursor-pointer whitespace-nowrap transition-colors duration-200 group ${
                activeSection === item
                  ? 'text-rose-600'
                  : 'text-gray-700 hover:text-rose-600 hover:shadow-glow'
              }`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 transform transition-transform duration-300 ${
                  activeSection === item
                    ? 'scale-x-100'
                    : 'scale-x-0 group-hover:scale-x-100'
                }`}
              ></span>
            </button>
          ))}
        </nav>
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <i
            className={`fa-solid ${
              isMenuOpen ? 'fa-times' : 'fa-bars'
            } text-2xl`}
          ></i>
        </button>
      </div>
      <div
        className={`md:hidden bg-white border-t border-gray-200 py-2 overflow-hidden ${
          isMenuOpen ? 'animate-fade-in' : 'hidden'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          {navItems.map(item => (
            <button
              key={item}
              onClick={() => {
                scrollToSection(item);
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left py-3 px-4 text-sm font-medium cursor-pointer transition-colors duration-200 ${
                activeSection === item ? 'text-rose-600' : 'text-gray-700'
              } hover:bg-gray-50 hover:text-rose-600 hover:shadow-glow`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
