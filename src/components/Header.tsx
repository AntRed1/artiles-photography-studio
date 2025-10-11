import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera } from 'lucide-react';
import useScroll from '../hooks/useScroll';
import { getConfiguration } from '../services/configService';
import { Configuration } from '../types';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Animation variants
const headerVariants = {
  transparent: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.3 },
  },
  solid: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    backdropFilter: 'blur(0px)',
    boxShadow:
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: { duration: 0.3 },
  },
};

const mobileMenuVariants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3 },
  },
  open: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

const menuItemVariants = {
  closed: { opacity: 0, x: -20 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
  hover: {
    x: 8,
    color: '#e11d48',
    transition: { duration: 0.2 },
  },
};

// Logo Component - MEJORADO
interface LogoProps {
  config: Configuration | null;
  error: string | null;
}

const Logo: React.FC<LogoProps> = ({ config, error }) => {
  const [imageError, setImageError] = useState(false);
  const shouldShowIcon = !config?.logoUrl || imageError;

  return (
    <div className="flex items-center group cursor-pointer">
      {/* Camera Icon o Logo personalizado */}
      <div className="relative mr-3 sm:mr-4">
        {shouldShowIcon ? (
          <div className="relative">
            {/* Círculo de fondo con gradiente */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-rose-700 rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>

            {/* Cámara */}
            <div className="relative bg-gray-900 p-2.5 sm:p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Camera
                className="h-6 w-6 sm:h-7 sm:w-7 text-white"
                strokeWidth={2.5}
              />
              {/* Detalle decorativo */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></div>
            </div>
          </div>
        ) : (
          <img
            src={config?.logoUrl}
            alt={config?.logoAltText || 'Artiles Photography Studio'}
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Texto del logo */}
      <div className="flex flex-col">
        <div className="flex items-baseline flex-wrap">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-none">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Artiles
            </span>
          </h1>
          <span className="text-base sm:text-lg md:text-xl font-bold text-rose-600 ml-2 group-hover:text-rose-700 transition-colors">
            Photography
          </span>
        </div>

        <div className="flex items-center mt-0.5 sm:mt-1">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-gray-500 group-hover:text-gray-700 transition-colors">
            Studio
          </span>
          {/* Línea decorativa */}
          <div className="ml-2 h-px w-8 bg-gradient-to-r from-rose-500 to-transparent opacity-60"></div>
        </div>

        {error && (
          <span className="text-rose-600 text-xs mt-1.5 font-medium flex items-center">
            <span className="w-1 h-1 bg-rose-600 rounded-full mr-1.5"></span>
            {error}
          </span>
        )}
      </div>
    </div>
  );
};

// Navigation Item Component - CORREGIDO para responsive
interface NavItemProps {
  item: string;
  isActive: boolean;
  onClick: () => void;
  index?: number;
  isMobile?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  item,
  isActive,
  onClick,
  index = 0,
  isMobile = false,
}) => {
  const displayName = item.charAt(0).toUpperCase() + item.slice(1);

  // Handler que asegura el scroll en móvil
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  if (isMobile) {
    return (
      <motion.button
        onClick={handleClick}
        className="block w-full text-left py-4 px-6 text-base font-semibold transition-all duration-300 group relative overflow-hidden"
        variants={menuItemVariants}
        custom={index}
        whileHover="hover"
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative z-10 flex items-center justify-between">
          <span
            className={`${isActive ? 'text-rose-600' : 'text-gray-700'} transition-colors duration-200`}
          >
            {displayName}
          </span>
          {isActive && (
            <motion.div
              className="w-2 h-2 bg-rose-600 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>

        {/* Hover background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-rose-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />

        {/* Active indicator */}
        {isActive && (
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 to-pink-500"
            layoutId="mobile-active-indicator"
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleClick}
      className="relative px-4 py-2 text-sm font-semibold transition-all duration-300 group"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.95 }}
    >
      <span
        className={`relative z-10 ${isActive ? 'text-rose-600' : 'text-gray-700 group-hover:text-rose-600'} transition-colors duration-200`}
      >
        {displayName}
      </span>

      {/* Hover background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />

      {/* Active/Hover underline */}
      <motion.div
        className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full ${
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
        style={{ x: '-50%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        layoutId={isActive ? 'desktop-active-indicator' : undefined}
      />
    </motion.button>
  );
};

// Mobile Menu Toggle
interface MenuToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

const MenuToggle: React.FC<MenuToggleProps> = ({ isOpen, onClick }) => (
  <motion.button
    onClick={onClick}
    className="md:hidden p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200/50 hover:bg-white/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
  >
    <motion.div
      className="w-6 h-6 flex flex-col justify-center items-center"
      animate={isOpen ? 'open' : 'closed'}
    >
      <motion.span
        className="w-5 h-0.5 bg-gray-700 rounded-full block"
        variants={{
          closed: { rotate: 0, y: 0 },
          open: { rotate: 45, y: 2 },
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        className="w-5 h-0.5 bg-gray-700 rounded-full block my-1"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        className="w-5 h-0.5 bg-gray-700 rounded-full block"
        variants={{
          closed: { rotate: 0, y: 0 },
          open: { rotate: -45, y: -2 },
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  </motion.button>
);

// Main Header Component
const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { activeSection, scrollToSection } = useScroll();
  const [config, setConfig] = useState<Configuration | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    'inicio',
    'nosotros',
    'servicios',
    'galeria',
    'testimonios',
    'contacto',
  ];

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getConfiguration();
        setConfig(data);
      } catch (err) {
        console.error('Error al cargar configuración:', err);
        setError('Logo no disponible');
      }
    };
    void fetchConfig();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handler mejorado que cierra el menú y hace scroll
  const handleNavClick = (item: string) => {
    // Primero cerramos el menú si está abierto
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }

    // Pequeño delay para permitir que el menú se cierre antes del scroll
    setTimeout(
      () => {
        scrollToSection(item);
      },
      isMenuOpen ? 300 : 0
    ); // 300ms coincide con la animación del menú
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/20"
      variants={headerVariants}
      animate={isScrolled ? 'solid' : 'transparent'}
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
    >
      {/* Main Header Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Logo config={config} error={error} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navItems.map((item, index) => (
              <NavItem
                key={item}
                item={item}
                isActive={activeSection === item}
                onClick={() => handleNavClick(item)}
                index={index}
              />
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <MenuToggle
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            style={{ overflow: 'hidden' }}
          >
            <div className="container mx-auto">
              {navItems.map((item, index) => (
                <NavItem
                  key={item}
                  item={item}
                  isActive={activeSection === item}
                  onClick={() => handleNavClick(item)}
                  index={index}
                  isMobile
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
