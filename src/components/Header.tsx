import React from 'react';
import useScroll from '../hooks/useScroll';
import logo from '../assets/images/logo.png'; // Verifica que este archivo exista

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { activeSection, scrollToSection } = useScroll();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Artiles Photography Studio"
            className="h-12 w-auto mr-4"
            onError={e => {
              console.error('Error loading logo:', e);
              e.currentTarget.src = '/images/logo-fallback.png'; // Fallback si logo.png no se encuentra
            }}
          />
          <h1 className="text-xl md:text-2xl font-bold flex items-center space-x-1">
            <span className="text-black">Artiles</span>
            <span className="text-red-600">Photography Studio</span>
          </h1>
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
