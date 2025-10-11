/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';
import { getGallery } from '../services/galleryService';
import { GalleryImage } from '../types';

// Configuración responsive del carrusel de galería
const GALLERY_CONFIG = {
  mobile: { slides: 1, autoSlideInterval: 4000, aspectRatio: '16/9' },
  tablet: { slides: 2, autoSlideInterval: 4500, aspectRatio: '16/9' },
  desktop: { slides: 3, autoSlideInterval: 5000, aspectRatio: '16/9' },
  animationDuration: 500,
  touchThreshold: 50,
} as const;

// Hook personalizado para manejo responsive de galería
const useResponsiveGallery = () => {
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
    const debouncedResize = debounce(updateScreenSize, 150);
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  return {
    slidesToShow: GALLERY_CONFIG[screenSize].slides,
    autoSlideInterval: GALLERY_CONFIG[screenSize].autoSlideInterval,
    aspectRatio: GALLERY_CONFIG[screenSize].aspectRatio,
    screenSize,
  };
};

// Utility function for debouncing
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Hook para precargar imágenes
const useImagePreloader = (images: GalleryImage[], visibleCount: number) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const preloadImages = images.slice(0, visibleCount + 2);

    preloadImages.forEach(img => {
      const image = new Image();
      image.onload = () => {
        setLoadedImages(prev => new Set(prev).add(img.id.toString()));
      };
      image.src = img.imageUrl;
    });
  }, [images, visibleCount]);

  return loadedImages;
};

const Gallery: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const autoSlideRef = useRef<number | null>(null);
  const { slidesToShow, autoSlideInterval, aspectRatio, screenSize } =
    useResponsiveGallery();
  const loadedImages = useImagePreloader(galleryImages, slidesToShow);

  // Fetch gallery data
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await getGallery();
        if (!data || data.length === 0) {
          setError('No hay imágenes disponibles en la galería');
        } else {
          setGalleryImages(data);
        }
      } catch (err) {
        setError('Error al cargar la galería. Por favor, intenta nuevamente.');
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchGallery();
  }, []);

  // Calcular slides máximos
  const totalImages = galleryImages.length;
  const maxSlideIndex = Math.max(0, totalImages - slidesToShow);
  const shouldShowNavigation = totalImages > slidesToShow;
  const totalDots = shouldShowNavigation ? maxSlideIndex + 1 : 0;

  // Auto-slide con configuración responsive
  useEffect(() => {
    if (!shouldShowNavigation || isAnimating || selectedImage) return;

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
  }, [
    shouldShowNavigation,
    maxSlideIndex,
    autoSlideInterval,
    isAnimating,
    selectedImage,
  ]);

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

      setTimeout(() => setIsAnimating(false), GALLERY_CONFIG.animationDuration);
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
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (selectedImage) return;
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    },
    [selectedImage]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (selectedImage) return;
      setTouchEnd(e.targetTouches[0].clientX);
    },
    [selectedImage]
  );

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd || !shouldShowNavigation || selectedImage)
      return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > GALLERY_CONFIG.touchThreshold;
    const isRightSwipe = distance < -GALLERY_CONFIG.touchThreshold;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  }, [
    touchStart,
    touchEnd,
    shouldShowNavigation,
    selectedImage,
    nextSlide,
    prevSlide,
  ]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage) {
        if (e.key === 'Escape') setSelectedImage(null);
        return;
      }

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
  }, [
    shouldShowNavigation,
    nextSlide,
    prevSlide,
    goToSlide,
    maxSlideIndex,
    selectedImage,
  ]);

  // Image modal handlers
  const openImageModal = useCallback((image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeImageModal = useCallback(() => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  }, []);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Loading state
  if (loading) {
    return (
      <motion.section
        className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-rose-50/30 to-gray-100 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-96 h-96 bg-rose-500 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center relative z-10">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-rose-500 border-t-transparent mb-6"></div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Cargando galería
          </h3>
          <p className="text-gray-600 text-lg">
            Preparando nuestras mejores fotografías en HD...
          </p>
        </div>
      </motion.section>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.section
        className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-rose-50/30 to-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <div className="text-rose-600 mb-6">
            <svg
              className="w-20 h-20 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Error al cargar la galería
          </h3>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl hover:from-rose-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-rose-500/50"
          >
            Intentar nuevamente
          </button>
        </div>
      </motion.section>
    );
  }

  // Empty state
  if (galleryImages.length === 0) {
    return (
      <motion.section
        className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-rose-50/30 to-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <div className="text-gray-400 mb-6">
            <svg
              className="w-20 h-20 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Galería temporalmente vacía
          </h3>
          <p className="text-gray-600 text-lg">
            Pronto agregaremos nuevas fotografías impresionantes
          </p>
        </div>
      </motion.section>
    );
  }

  return (
    <>
      <section
        id="galeria"
        className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-rose-50/30 to-gray-100 relative overflow-hidden"
        aria-labelledby="gallery-heading"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-96 h-96 bg-rose-500 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          {/* Header */}
          <motion.div
            className="text-center mb-16 md:mb-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="inline-block mb-6" variants={imageVariants}>
              <span className="px-6 py-3 bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20 text-rose-600 rounded-full text-sm font-bold tracking-widest uppercase backdrop-blur-sm">
                Portafolio Visual
              </span>
            </motion.div>

            <motion.h2
              id="gallery-heading"
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-6 tracking-tight"
              variants={imageVariants}
            >
              <span className="bg-gradient-to-r from-gray-900 via-rose-700 to-gray-900 bg-clip-text text-transparent">
                Galería Premium
              </span>
            </motion.h2>

            <motion.p
              className="max-w-3xl mx-auto text-xl sm:text-2xl text-gray-700 leading-relaxed font-light"
              variants={imageVariants}
            >
              Explora nuestro trabajo en{' '}
              <span className="text-rose-600 font-semibold">
                alta definición
              </span>{' '}
              y descubre cómo capturamos momentos inolvidables con pasión y
              técnica profesional.
            </motion.p>
          </motion.div>

          {/* Gallery Stats */}
          <motion.div
            className="grid grid-cols-3 gap-4 sm:gap-6 mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative text-center p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-500/20 shadow-lg">
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {totalImages}
                </div>
                <div className="text-sm sm:text-base text-gray-700 font-semibold uppercase tracking-wider">
                  Fotografías
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative text-center p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-500/20 shadow-lg">
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  HD+
                </div>
                <div className="text-sm sm:text-base text-gray-700 font-semibold uppercase tracking-wider">
                  Calidad
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative text-center p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-500/20 shadow-lg">
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Pro
                </div>
                <div className="text-sm sm:text-base text-gray-700 font-semibold uppercase tracking-wider">
                  Edición
                </div>
              </div>
            </div>
          </motion.div>

          {/* Carousel Container */}
          <motion.div
            ref={carouselRef}
            className="relative overflow-hidden rounded-3xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            role="region"
            aria-label="Carrusel de galería fotográfica"
            tabIndex={0}
          >
            {/* Carousel Track */}
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${(currentSlide * 100) / slidesToShow}%)`,
              }}
            >
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  className={`flex-shrink-0 px-2 sm:px-3 ${
                    slidesToShow === 1
                      ? 'w-full'
                      : slidesToShow === 2
                        ? 'w-1/2'
                        : 'w-1/3'
                  }`}
                  variants={imageVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.08 }}
                >
                  <div
                    className="relative group cursor-pointer overflow-hidden rounded-2xl"
                    style={{ aspectRatio }}
                    onClick={() => openImageModal(image)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Ver imagen en grande: ${image.description}`}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openImageModal(image);
                      }
                    }}
                  >
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>

                    {/* Image container */}
                    <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden border-2 border-gray-200 group-hover:border-rose-500/50 transition-all duration-500 shadow-lg">
                      {/* Loading placeholder */}
                      {!loadedImages.has(image.id.toString()) && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}

                      <img
                        src={image.imageUrl}
                        alt={image.description}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading={index < slidesToShow ? 'eager' : 'lazy'}
                        fetchPriority={index < slidesToShow ? 'high' : 'low'}
                      />

                      {/* Overlay gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/40 opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>

                      {/* Zoom icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="bg-white/20 backdrop-blur-md rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-500 border border-white/30">
                          <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Image description */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="bg-gradient-to-r from-white/95 to-gray-50/95 backdrop-blur-md rounded-xl px-4 py-3 border border-gray-200/50 shadow-lg">
                          <p className="text-gray-900 font-bold text-base sm:text-lg capitalize truncate">
                            {image.description}
                          </p>
                          <p className="text-rose-600 text-sm font-medium mt-1">
                            Click para ampliar
                          </p>
                        </div>
                      </div>

                      {/* HD Badge */}
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shadow-lg">
                        HD
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
                  className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/95 backdrop-blur-md rounded-full shadow-2xl hover:bg-rose-600 transition-all duration-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed z-20 group border border-gray-200 hover:scale-110 hover:border-rose-500"
                  aria-label="Imágenes anteriores"
                >
                  <svg
                    className="w-7 h-7 text-gray-900 group-hover:text-white transition-all duration-300 group-hover:-translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={nextSlide}
                  disabled={isAnimating}
                  className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/95 backdrop-blur-md rounded-full shadow-2xl hover:bg-rose-600 transition-all duration-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed z-20 group border border-gray-200 hover:scale-110 hover:border-rose-500"
                  aria-label="Siguientes imágenes"
                >
                  <svg
                    className="w-7 h-7 text-gray-900 group-hover:text-white transition-all duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
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
              className="flex justify-center mt-10 space-x-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              role="tablist"
              aria-label="Navegación de galería"
            >
              {Array.from({ length: totalDots }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  disabled={isAnimating}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    index === currentSlide
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 w-12 shadow-lg shadow-rose-500/50'
                      : 'bg-gray-300 hover:bg-gray-400 w-2.5 hover:w-8'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label={`Ver grupo de imágenes ${index + 1}`}
                  aria-selected={index === currentSlide}
                  role="tab"
                />
              ))}
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            className="relative mt-20 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-pink-600/20 rounded-3xl blur-3xl"></div>

            <div className="relative bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500"></div>

              <div className="p-10 sm:p-16 max-w-5xl mx-auto">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                  ¿Te gusta lo que{' '}
                  <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                    ves
                  </span>
                  ?
                </h3>
                <p className="text-gray-700 text-lg sm:text-xl mb-10 leading-relaxed max-w-3xl mx-auto">
                  Cada fotografía en{' '}
                  <span className="text-rose-600 font-semibold">
                    alta definición
                  </span>{' '}
                  cuenta una historia única. Permítenos capturar la tuya con la
                  misma pasión, calidad y profesionalismo.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                  <button
                    onClick={() => {
                      const element = document.getElementById('servicios');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-bold text-white rounded-xl transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 transition-all duration-300 group-hover:from-rose-700 group-hover:to-pink-700"></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-rose-400 to-pink-400 blur-xl"></div>
                    <svg
                      className="relative w-6 h-6 mr-2 transition-transform duration-300 group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <span className="relative text-lg">
                      Ver Nuestros Paquetes
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      const element = document.getElementById('contacto');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-900 font-bold text-lg rounded-xl hover:border-rose-500 hover:bg-rose-50 transition-all duration-300"
                  >
                    <svg
                      className="w-6 h-6 mr-2 transition-transform duration-300 group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span>Conversemos</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Image Modal/Lightbox */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={closeImageModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={closeImageModal}
              className="absolute top-6 right-6 w-14 h-14 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 hover:bg-rose-600 hover:text-white transition-all duration-300 z-10 border border-gray-200 hover:border-rose-500 hover:scale-110 group shadow-xl"
              aria-label="Cerrar imagen ampliada"
            >
              <svg
                className="w-7 h-7 transition-transform duration-300 group-hover:rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal content */}
            <div
              className="relative max-w-full max-h-full"
              onClick={e => e.stopPropagation()}
            >
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-rose-600 to-pink-600 rounded-3xl blur-2xl opacity-30"></div>

              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-200">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.description}
                  className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
                  style={{ maxWidth: '90vw' }}
                />

                {/* Image info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-8 backdrop-blur-sm">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                        HD Quality
                      </span>
                      <span className="text-gray-300 text-sm">
                        {galleryImages.findIndex(
                          img => img.id === selectedImage.id
                        ) + 1}{' '}
                        / {galleryImages.length}
                      </span>
                    </div>
                    <h3
                      id="modal-title"
                      className="text-white text-2xl sm:text-3xl font-bold mb-2 capitalize"
                    >
                      {selectedImage.description}
                    </h3>
                    <p className="text-gray-400 text-base">
                      Fotografía profesional • Usa las flechas para navegar o
                      ESC para cerrar
                    </p>
                  </div>
                </div>

                {/* HD Badge en modal */}
                <div className="absolute top-6 left-6 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm px-4 py-2 rounded-full font-bold uppercase tracking-wider shadow-lg">
                  Alta Definición
                </div>
              </div>
            </div>

            {/* Navigation in modal */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    const currentIndex = galleryImages.findIndex(
                      img => img.id === selectedImage.id
                    );
                    const prevIndex =
                      currentIndex === 0
                        ? galleryImages.length - 1
                        : currentIndex - 1;
                    setSelectedImage(galleryImages[prevIndex]);
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 hover:bg-rose-600 hover:text-white transition-all duration-300 border border-gray-200 hover:border-rose-500 hover:scale-110 group shadow-xl"
                  aria-label="Imagen anterior en lightbox"
                >
                  <svg
                    className="w-7 h-7 transition-transform duration-300 group-hover:-translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    const currentIndex = galleryImages.findIndex(
                      img => img.id === selectedImage.id
                    );
                    const nextIndex =
                      currentIndex === galleryImages.length - 1
                        ? 0
                        : currentIndex + 1;
                    setSelectedImage(galleryImages[nextIndex]);
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 hover:bg-rose-600 hover:text-white transition-all duration-300 border border-gray-200 hover:border-rose-500 hover:scale-110 group shadow-xl"
                  aria-label="Siguiente imagen en lightbox"
                >
                  <svg
                    className="w-7 h-7 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Gallery;
