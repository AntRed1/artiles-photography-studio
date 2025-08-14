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
  mobile: { slides: 1, autoSlideInterval: 3500, aspectRatio: '4/3' },
  tablet: { slides: 2, autoSlideInterval: 4000, aspectRatio: '4/3' },
  desktop: { slides: 3, autoSlideInterval: 4500, aspectRatio: '4/3' },
  animationDuration: 400,
  touchThreshold: 50,
  imageLoadTimeout: 10000,
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
    // Precargar las primeras imágenes visibles
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
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const imageVariants: Variants = {
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

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Loading state
  if (loading) {
    return (
      <motion.section
        className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Cargando galería
          </h3>
          <p className="text-gray-600">
            Preparando nuestras mejores fotografías...
          </p>

          {/* Loading skeleton */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] bg-gray-200 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.section
        className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-700 mb-2">
            Error al cargar la galería
          </h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
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
        className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <div className="text-gray-400 mb-6">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Galería temporalmente vacía
          </h3>
          <p className="text-gray-600">
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
        className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100"
        aria-labelledby="gallery-heading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <motion.div
            className="text-center mb-12 md:mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="inline-block mb-4" variants={imageVariants}>
              <span className="px-4 py-2 bg-rose-100 text-rose-600 rounded-full text-sm font-medium tracking-wide uppercase">
                Nuestra Galería
              </span>
            </motion.div>

            <motion.h2
              id="gallery-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
              variants={imageVariants}
            >
              <span className="bg-gradient-to-r from-slate-900 via-rose-700 to-slate-900 bg-clip-text text-transparent">
                Galería de Momentos
              </span>
            </motion.h2>

            <motion.p
              className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed"
              variants={imageVariants}
            >
              Explora nuestro trabajo y descubre cómo capturamos momentos
              inolvidables con pasión, creatividad y técnica profesional.
            </motion.p>
          </motion.div>

          {/* Gallery Stats */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center p-4 bg-white/70 rounded-xl backdrop-blur-sm">
              <div className="text-2xl font-bold text-rose-600 mb-1">
                {totalImages}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Fotografías
              </div>
            </div>
            <div className="text-center p-4 bg-white/70 rounded-xl backdrop-blur-sm">
              <div className="text-2xl font-bold text-rose-600 mb-1">HD+</div>
              <div className="text-sm text-gray-600 font-medium">Calidad</div>
            </div>
            <div className="text-center p-4 bg-white/70 rounded-xl backdrop-blur-sm">
              <div className="text-2xl font-bold text-rose-600 mb-1">Pro</div>
              <div className="text-sm text-gray-600 font-medium">Edición</div>
            </div>
          </motion.div>

          {/* Carousel Container */}
          <motion.div
            ref={carouselRef}
            className="relative overflow-hidden rounded-2xl bg-white/30 backdrop-blur-sm shadow-lg"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            role="region"
            aria-label="Carrusel de galería fotográfica"
            tabIndex={0}
          >
            {/* Carousel Track */}
            <div
              className="flex transition-transform duration-400 ease-out"
              style={{
                transform: `translateX(-${(currentSlide * 100) / slidesToShow}%)`,
              }}
            >
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  className={`flex-shrink-0 px-2 ${
                    slidesToShow === 1
                      ? 'w-full'
                      : slidesToShow === 2
                        ? 'w-1/2'
                        : 'w-1/3'
                  }`}
                  variants={imageVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className="relative bg-white rounded-xl shadow-lg overflow-hidden h-full transform transition-all duration-300 hover:scale-[1.03] hover:shadow-xl group cursor-pointer"
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
                    {/* Loading placeholder */}
                    {!loadedImages.has(image.id.toString()) && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-gray-400"
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
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading={index < slidesToShow ? 'eager' : 'lazy'}
                      fetchPriority={index < slidesToShow ? 'high' : 'low'}
                    />

                    {/* Overlay with zoom icon */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          />
                        </svg>
                      </div>

                      {/* Image description overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-medium text-sm sm:text-base bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 text-center truncate">
                          {image.description}
                        </p>
                      </div>
                    </div>

                    {/* Image number indicator */}
                    <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                      {index + 1}
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed z-10 group focus:ring-4 focus:ring-rose-200 focus:outline-none"
                  aria-label="Imágenes anteriores"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed z-10 group focus:ring-4 focus:ring-rose-200 focus:outline-none"
                  aria-label="Siguientes imágenes"
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
              transition={{ duration: 0.3, delay: 0.5 }}
              role="tablist"
              aria-label="Navegación de galería"
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
                  aria-label={`Ver grupo de imágenes ${index + 1}`}
                  aria-selected={index === currentSlide}
                  role="tab"
                />
              ))}
            </motion.div>
          )}

          {/* Gallery Count Indicator */}
          {galleryImages.length > 0 && (
            <motion.div
              className="text-center mt-8 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <p className="text-sm">
                Mostrando {Math.min(slidesToShow, galleryImages.length)} de{' '}
                {galleryImages.length} fotografías
                {shouldShowNavigation && (
                  <span className="ml-2 text-rose-600">
                    • Haz clic en cualquier imagen para ampliarla
                  </span>
                )}
              </p>
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            className="relative mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 via-transparent to-pink-600/20 rounded-3xl"></div>

            <div className="relative z-10 p-8 sm:p-12 max-w-4xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                ¿Te gusta lo que <span className="text-rose-400">ves</span>?
              </h3>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed max-w-2xl mx-auto font-light">
                Cada fotografía cuenta una historia única. Permítenos capturar
                la tuya con la misma pasión y profesionalismo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    const element = document.getElementById('paquetes');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-rose-600 to-rose-700 text-white font-semibold rounded-xl hover:from-rose-700 hover:to-rose-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:ring-4 focus:ring-rose-200 focus:outline-none"
                  aria-label="Ver paquetes fotográficos disponibles"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <span>Ver Nuestros Paquetes</span>
                </button>

                <button
                  onClick={() => {
                    const element = document.getElementById('contacto');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white font-medium rounded-xl hover:border-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm focus:ring-4 focus:ring-white/20 focus:outline-none"
                  aria-label="Ir a la sección de contacto"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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
          </motion.div>
        </div>
      </section>

      {/* Image Modal/Lightbox */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 z-10 focus:ring-4 focus:ring-white/20 focus:outline-none"
              aria-label="Cerrar imagen ampliada"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal content */}
            <div
              className="relative max-w-full max-h-full bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.description}
                className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
                style={{ maxWidth: '90vw' }}
              />

              {/* Image info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3
                  id="modal-title"
                  className="text-white text-lg sm:text-xl font-semibold mb-2 capitalize"
                >
                  {selectedImage.description}
                </h3>
                <p className="text-white/80 text-sm">
                  Fotografía profesional • Click fuera para cerrar
                </p>
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 focus:ring-4 focus:ring-white/20 focus:outline-none"
                  aria-label="Imagen anterior en lightbox"
                >
                  <svg
                    className="w-6 h-6"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 focus:ring-4 focus:ring-white/20 focus:outline-none"
                  aria-label="Siguiente imagen en lightbox"
                >
                  <svg
                    className="w-6 h-6"
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
          </div>

          {/* Modal indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
            {galleryImages.findIndex(img => img.id === selectedImage.id) + 1} de{' '}
            {galleryImages.length}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Gallery;
