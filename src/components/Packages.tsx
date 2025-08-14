import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';
import { getActivePackages } from '../services/packageService';
import { getContactInfo } from '../services/contactInfoService';
import { PhotographyPackage } from '../types';

// Configuración responsive del carrusel
const CAROUSEL_CONFIG = {
  mobile: { slides: 1, autoSlideInterval: 4000 },
  tablet: { slides: 2, autoSlideInterval: 5000 },
  desktop: { slides: 3, autoSlideInterval: 6000 },
  animationDuration: 500,
  touchThreshold: 50,
} as const;

// Hook personalizado para manejo responsive
const useResponsiveCarousel = () => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>(
    'desktop'
  );

  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth < 640) setScreenSize('mobile');
      else if (window.innerWidth < 1024) setScreenSize('tablet');
      else setScreenSize('desktop');
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return {
    slidesToShow: CAROUSEL_CONFIG[screenSize].slides,
    autoSlideInterval: CAROUSEL_CONFIG[screenSize].autoSlideInterval,
    screenSize,
  };
};

const Packages: React.FC = () => {
  const [packages, setPackages] = useState<PhotographyPackage[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const autoSlideRef = useRef<number | null>(null);
  const { slidesToShow, autoSlideInterval, screenSize } =
    useResponsiveCarousel();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packagesData, contactData] = await Promise.all([
          getActivePackages(),
          getContactInfo(),
        ]);
        setPackages(packagesData);
        setWhatsappNumber(contactData.whatsapp);
      } catch (err) {
        setError('Error al cargar los datos. Por favor, intenta nuevamente.');
        console.error('Error fetching packages data:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  // Calcular slides máximos
  const totalSlides = packages.length;
  const maxSlideIndex = Math.max(0, totalSlides - slidesToShow);
  const shouldShowNavigation = totalSlides > slidesToShow;
  const totalDots = shouldShowNavigation ? maxSlideIndex + 1 : 0;

  // Auto-slide con configuración responsive
  useEffect(() => {
    if (!shouldShowNavigation || isAnimating) return;

    const startAutoSlide = () => {
      autoSlideRef.current = window.setInterval(() => {
        setCurrentSlide(prev => (prev >= maxSlideIndex ? 0 : prev + 1));
      }, autoSlideInterval);
    };

    const stopAutoSlide = () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
        autoSlideRef.current = null;
      }
    };

    startAutoSlide();

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoSlide);
      carousel.addEventListener('mouseleave', startAutoSlide);
      carousel.addEventListener('focus', stopAutoSlide);
      carousel.addEventListener('blur', startAutoSlide);
    }

    return () => {
      stopAutoSlide();
      if (carousel) {
        carousel.removeEventListener('mouseenter', stopAutoSlide);
        carousel.removeEventListener('mouseleave', startAutoSlide);
        carousel.removeEventListener('focus', stopAutoSlide);
        carousel.removeEventListener('blur', startAutoSlide);
      }
    };
  }, [shouldShowNavigation, maxSlideIndex, autoSlideInterval, isAnimating]);

  // Reset slide on screen size change
  useEffect(() => {
    setCurrentSlide(0);
  }, [screenSize]);

  // Navigation functions
  const goToSlide = useCallback(
    (slideIndex: number) => {
      if (isAnimating || !shouldShowNavigation) return;

      const clampedIndex = Math.max(0, Math.min(slideIndex, maxSlideIndex));
      setIsAnimating(true);
      setCurrentSlide(clampedIndex);

      setTimeout(
        () => setIsAnimating(false),
        CAROUSEL_CONFIG.animationDuration
      );
    },
    [isAnimating, shouldShowNavigation, maxSlideIndex]
  );

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide >= maxSlideIndex ? 0 : currentSlide + 1);
  }, [currentSlide, maxSlideIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide <= 0 ? maxSlideIndex : currentSlide - 1);
  }, [currentSlide, maxSlideIndex, goToSlide]);

  // Touch handlers optimizados
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd || !shouldShowNavigation) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > CAROUSEL_CONFIG.touchThreshold;
    const isRightSwipe = distance < -CAROUSEL_CONFIG.touchThreshold;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  }, [touchStart, touchEnd, shouldShowNavigation, nextSlide, prevSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!shouldShowNavigation) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextSlide();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(maxSlideIndex);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shouldShowNavigation, nextSlide, prevSlide, goToSlide, maxSlideIndex]);

  // WhatsApp message generator
  const generateWhatsAppMessage = useCallback((pkg: PhotographyPackage) => {
    const message = [
      `🌟 ¡Hola! Estoy interesado/a en el paquete "${pkg.title}"`,
      '',
      `📝 Descripción: ${pkg.description}`,
      pkg.showPrice ? `💰 Precio: $${pkg.price.toFixed(2)}` : '',
      '',
      '✨ Características incluidas:',
      ...pkg.features.map(f => `• ${f}`),
      '',
      '¿Podrías darme más información sobre disponibilidad y fechas?',
    ]
      .filter(Boolean)
      .join('\n');

    return encodeURIComponent(message);
  }, []);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  // Loading state
  if (loading) {
    return (
      <motion.div
        className="text-center py-16 md:py-24 bg-gradient-to-br from-slate-100 via-white to-rose-100 shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mb-4"></div>
        <p className="text-gray-600 text-lg">
          Cargando paquetes fotográficos...
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Preparando las mejores opciones para ti
        </p>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        className="text-center py-16 md:py-24 bg-gradient-to-br from-slate-100 via-white to-rose-100 shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-red-600 mb-6">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-red-700 mb-2">
          Error al cargar
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Intentar nuevamente
        </button>
      </motion.div>
    );
  }

  // Empty state
  if (packages.length === 0) {
    return (
      <motion.div
        className="text-center py-16 md:py-24 bg-gradient-to-br from-slate-100 via-white to-rose-100 shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-gray-400 mb-6">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No hay paquetes disponibles
        </h3>
        <p className="text-gray-600">
          Próximamente tendremos nuevos paquetes fotográficos
        </p>
      </motion.div>
    );
  }

  return (
    <section
      id="paquetes"
      className="py-16 md:py-24 bg-gradient-to-br from-slate-100 via-white to-rose-100 shadow-lg"
      aria-labelledby="packages-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="inline-block mb-4" variants={cardVariants}>
            <span className="px-4 py-2 bg-rose-100 text-rose-600 rounded-full text-sm font-medium tracking-wide uppercase">
              Nuestros Servicios
            </span>
          </motion.div>

          <motion.h2
            id="packages-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            variants={cardVariants}
          >
            <span className="bg-gradient-to-r from-slate-900 via-rose-700 to-slate-900 bg-clip-text text-transparent">
              Paquetes Fotográficos
            </span>
          </motion.h2>

          <motion.p
            className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed"
            variants={cardVariants}
          >
            Cada momento merece ser capturado con la perfección que solo un
            profesional puede ofrecer. Descubre nuestros paquetes diseñados
            especialmente para ti.
          </motion.p>
        </motion.div>

        {/* Carousel Container */}
        <motion.div
          ref={carouselRef}
          className="relative overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm shadow-md"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          role="region"
          aria-label="Carrusel de paquetes fotográficos"
          tabIndex={0}
        >
          {/* Carousel Track */}
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${(currentSlide * 100) / slidesToShow}%)`,
            }}
          >
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                className={`flex-shrink-0 px-3 ${
                  slidesToShow === 1
                    ? 'w-full'
                    : slidesToShow === 2
                      ? 'w-1/2'
                      : 'w-1/3'
                }`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group">
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={pkg.imageUrl}
                      alt={`Paquete fotográfico ${pkg.title}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading={index < slidesToShow ? 'eager' : 'lazy'}
                      fetchPriority={index < slidesToShow ? 'high' : 'low'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Price Badge */}
                    {pkg.showPrice && (
                      <div className="absolute top-4 right-4 bg-rose-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        ${pkg.price.toFixed(0)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 group-hover:text-rose-600 transition-colors duration-300">
                        {pkg.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mb-8">
                      <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-4 text-center">
                        Incluye
                      </h4>
                      <ul className="space-y-3">
                        {pkg.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start group/feature"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center group-hover/feature:bg-rose-200 transition-colors duration-200">
                                <svg
                                  className="w-3 h-3 text-rose-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            </div>
                            <span className="ml-3 text-gray-700 text-sm sm:text-base leading-relaxed group-hover/feature:text-gray-900 transition-colors duration-200">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${generateWhatsAppMessage(pkg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full px-6 py-4 bg-gradient-to-r from-rose-600 to-rose-700 text-white font-semibold rounded-xl hover:from-rose-700 hover:to-rose-800 transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group/cta focus:ring-4 focus:ring-rose-200 focus:outline-none"
                        aria-label={`Reservar el paquete ${pkg.title} por WhatsApp`}
                      >
                        <div className="flex items-center justify-center">
                          <svg
                            className="w-5 h-5 mr-2 group-hover/cta:scale-110 transition-transform duration-200"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.696" />
                          </svg>
                          <span>Reservar por WhatsApp</span>
                        </div>
                      </a>

                      <button
                        onClick={() => {
                          const element = document.getElementById('contacto');
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="block w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-rose-600 hover:text-rose-600 transition-all duration-300 text-center group/secondary focus:ring-4 focus:ring-gray-200 focus:outline-none"
                        aria-label={`Obtener más información sobre ${pkg.title}`}
                      >
                        <span className="group-hover/secondary:scale-105 inline-block transition-transform duration-200">
                          Más información
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {shouldShowNavigation && (
            <>
              <button
                onClick={prevSlide}
                disabled={isAnimating}
                className="absolute left-4 top-1/3 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed z-10 group focus:ring-4 focus:ring-rose-200 focus:outline-none"
                aria-label="Paquete anterior"
              >
                <svg
                  className="w-6 h-6 text-gray-700 group-hover:text-rose-600 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                disabled={isAnimating}
                className="absolute right-4 top-1/3 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed z-10 group focus:ring-4 focus:ring-rose-200 focus:outline-none"
                aria-label="Siguiente paquete"
              >
                <svg
                  className="w-6 h-6 text-gray-700 group-hover:text-rose-600 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </motion.div>

        {/* Dots Navigation */}
        {shouldShowNavigation && totalDots > 1 && (
          <motion.div
            className="flex justify-center mt-8 space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            role="tablist"
            aria-label="Navegación de paquetes"
          >
            {Array.from({ length: totalDots }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isAnimating}
                className={`h-3 rounded-full transition-all duration-300 focus:ring-4 focus:ring-rose-200 focus:outline-none ${
                  index === currentSlide
                    ? 'bg-rose-600 w-8 shadow-md'
                    : 'bg-gray-300 hover:bg-gray-400 w-3'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={`Ir al grupo de paquetes ${index + 1}`}
                aria-selected={index === currentSlide}
                role="tab"
              />
            ))}
          </motion.div>
        )}

        {/* Call to Action Section */}
        <motion.div
          className="relative mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 via-transparent to-pink-600/20 rounded-3xl"></div>

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
              ¿No encuentras lo que{' '}
              <span className="text-rose-400">buscas</span>?
            </h3>
            <p className="text-slate-300 text-lg mb-6 leading-relaxed max-w-2xl mx-auto font-light">
              Creamos paquetes personalizados que se adapten perfectamente a tu
              visión y presupuesto. Cada proyecto es único, al igual que
              nuestras soluciones.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('🌟 ¡Hola! Me gustaría información sobre paquetes personalizados de fotografía.\n\nPor favor, cuéntame sobre:\n• Servicios disponibles\n• Opciones de personalización\n• Precios y paquetes\n• Disponibilidad de fechas\n\n¡Espero tu respuesta!')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-rose-600 to-rose-700 text-white font-semibold rounded-xl hover:from-rose-700 hover:to-rose-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:ring-4 focus:ring-rose-200 focus:outline-none"
              aria-label="Solicitar paquete personalizado por WhatsApp"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.696" />
              </svg>
              <span>Solicitar Paquete Personalizado</span>
            </a>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 pt-8 border-t border-slate-700/50">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-slate-300 text-sm">
                  Sesiones Realizadas
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">98%</div>
                <div className="text-slate-300 text-sm">
                  Clientes Satisfechos
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24h</div>
                <div className="text-slate-300 text-sm">
                  Tiempo de Respuesta
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Package Count Indicator */}
        {packages.length > 0 && (
          <motion.div
            className="text-center mt-8 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <p className="text-sm">
              Mostrando {Math.min(slidesToShow, packages.length)} de{' '}
              {packages.length} paquetes disponibles
              {shouldShowNavigation && (
                <span className="ml-2 text-rose-600">
                  • Usa las flechas o desliza para ver más
                </span>
              )}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Packages;
