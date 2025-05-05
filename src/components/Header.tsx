import React, { useEffect, useState } from 'react';
import useScroll from '../hooks/useScroll';
import { Configuration } from '../types';
import { getConfiguration } from '../services/configService';

const Header: React.FC = () => {
  const [config, setConfig] = useState<Configuration | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollToSection } = useScroll();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getConfiguration();
        setConfig(data);
      } catch (err) {
        console.error('Error al cargar la configuración:', err);
      }
    };
    fetchConfig();
  }, []);

  return (
    <header className="bg-gray-800 text-white fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          {config?.logoUrl && (
            <img
              src={config.logoUrl}
              alt="Artiles Photography Studio"
              className="h-10"
            />
          )}
        </div>
        <nav className="hidden md:flex space-x-6">
          <button
            onClick={() => scrollToSection('home')}
            className="hover:text-red-500 transition-colors"
          >
            Inicio
          </button>
          <button
            onClick={() => scrollToSection('packages')}
            className="hover:text-red-500 transition-colors"
          >
            Paquetes
          </button>
          <button
            onClick={() => scrollToSection('gallery')}
            className="hover:text-red-500 transition-colors"
          >
            Galería
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="hover:text-red-500 transition-colors"
          >
            Contacto
          </button>
        </nav>
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i
            className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}
          ></i>
        </button>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden bg-gray-700 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <button
              onClick={() => {
                scrollToSection('home');
                setIsMenuOpen(false);
              }}
              className="hover:text-red-500 transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={() => {
                scrollToSection('packages');
                setIsMenuOpen(false);
              }}
              className="hover:text-red-500 transition-colors"
            >
              Paquetes
            </button>
            <button
              onClick={() => {
                scrollToSection('gallery');
                setIsMenuOpen(false);
              }}
              className="hover:text-red-500 transition-colors"
            >
              Galería
            </button>
            <button
              onClick={() => {
                scrollToSection('contact');
                setIsMenuOpen(false);
              }}
              className="hover:text-red-500 transition-colors"
            >
              Contacto
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
