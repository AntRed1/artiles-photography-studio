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
    fetchConfig();
  }, []);

  const fallbackLogo = '/images/logo-fallback.png';

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center flex-col sm:flex-row">
          <div className="flex items-center">
            <motion.img
              src={config?.logoUrl || fallbackLogo}
              alt={config?.logoAltText || 'Artiles Photography Studio'}
              className="h-12 w-auto mr-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1, rotate: 3 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onError={e => {
                console.error('Error cargando logo:', e);
                e.currentTarget.src = fallbackLogo;
              }}
            />
            <h1 className="text-xl md:text-2xl font-bold flex items-center space-x-1">
              <span className="text-black">Artiles</span>
              <span className="text-red-600">Photography Studio</span>
            </h1>
          </div>
          {error && (
            <span className="text-red-600 text-sm mt-2 sm:mt-0 sm:ml-4">
              {error}
            </span>
          )}
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          {[
            'inicio',
            'nosotros',
            'servicios',
            'galeria',
            'testimonios',
            'contacto',
          ].map(item => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className={`text-sm font-medium cursor-pointer whitespace-nowrap ${
                activeSection === item
                  ? 'text-red-600'
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </nav>
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i
            className={`fa-solid ${
              isMenuOpen ? 'fa-times' : 'fa-bars'
            } text-2xl`}
          ></i>
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="container mx-auto px-4">
            {[
              'inicio',
              'nosotros',
              'servicios',
              'galeria',
              'testimonios',
              'contacto',
            ].map(item => (
              <button
                key={item}
                onClick={() => {
                  scrollToSection(item);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left py-2 px-4 cursor-pointer ${
                  activeSection === item ? 'text-red-600' : 'text-gray-700'
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
