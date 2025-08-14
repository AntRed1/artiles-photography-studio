import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCarousel } from '../services/carouselService';
import { CarouselImage } from '../types';
import useScroll from '../hooks/useScroll';

// Hook for device detection
const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isTablet };
};

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div className="text-center px-4">
      <div className="relative">
        <div className="w-16 sm:w-20 h-16 sm:h-20 border-4 border-rose-200/30 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
        <div className="absolute inset-0 w-16 sm:w-20 h-16 sm:h-20 border-4 border-transparent border-r-rose-400/50 rounded-full animate-pulse mx-auto"></div>
      </div>
      <p className="mt-4 sm:mt-6 text-white/80 font-medium text-base sm:text-lg">
        Cargando experiencia...
      </p>
      <div className="mt-2 sm:mt-3 flex justify-center space-x-1">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-rose-500 rounded-full animate-bounce"></div>
        <div
          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-rose-500 rounded-full animate-bounce"
          style={{ animationDelay: '0.1s' }}
        ></div>
        <div
          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-rose-500 rounded-full animate-bounce"
          style={{ animationDelay: '0.2s' }}
        ></div>
      </div>
    </div>
  </div>
);

// Error Component
const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div className="text-center max-w-xs sm:max-w-md mx-auto px-4 sm:px-6">
      <div className="relative mb-6 sm:mb-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-red-400"
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
        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
      </div>
      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">
        Error de Carga
      </h3>
      <p className="text-red-400 mb-6 sm:mb-8 text-base sm:text-lg">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white/10 border border-white/20 text-white rounded-lg sm:rounded-xl hover:bg-white/20 transition-all duration-300 font-medium backdrop-blur-sm text-sm sm:text-base"
      >
        Reintentar Carga
      </button>
    </div>
  </div>
);

// Slide Content Component
interface SlideContentProps {
  image: CarouselImage;
  isActive: boolean;
  onCTAClick: () => void;
  isMobile: boolean;
  isTablet: boolean;
}

const SlideContent: React.FC<SlideContentProps> = ({
  image,
  isActive,
  onCTAClick,
  isMobile,
  isTablet,
}) => (
  <motion.div
    className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center text-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16"
    initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
    animate={{
      opacity: isActive ? 1 : 0,
      y: isActive ? 0 : isMobile ? 20 : 30,
    }}
    transition={{
      duration: isMobile ? 0.6 : 0.8,
      delay: isActive ? (isMobile ? 0.2 : 0.3) : 0,
    }}
  >
    <div className="max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0.95,
        }}
        transition={{
          duration: isMobile ? 0.5 : 0.6,
          delay: isActive ? (isMobile ? 0.3 : 0.5) : 0,
        }}
        className="mb-6 sm:mb-8"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black mb-4 sm:mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white via-rose-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
            {image.title}
          </span>
        </h2>
        <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mx-auto mb-6 sm:mb-8"></div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 15,
        }}
        transition={{
          duration: isMobile ? 0.5 : 0.6,
          delay: isActive ? (isMobile ? 0.5 : 0.7) : 0,
        }}
        className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-light text-white/90 drop-shadow-lg mb-8 sm:mb-10"
      >
        {image.description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 15,
        }}
        transition={{
          duration: isMobile ? 0.5 : 0.6,
          delay: isActive ? (isMobile ? 0.7 : 0.9) : 0,
        }}
      >
        <button
          onClick={onCTAClick}
          className={`group inline-flex items-center ${
            isMobile
              ? 'px-6 py-3 text-sm'
              : isTablet
                ? 'px-8 py-3.5 text-base'
                : 'px-10 py-4 text-base lg:text-lg'
          } bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl sm:rounded-2xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-2xl hover:shadow-rose-500/50 transform hover:-translate-y-1 hover:scale-105 active:scale-95`}
          aria-label="Reserva tu sesión fotográfica"
        >
          <svg
            className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5 lg:w-6 lg:h-6'} mr-2 sm:mr-3 group-hover:translate-x-1 transition-transform duration-300`}
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
          <span className="hidden xs:inline"> </span>Reserva Tu Sesión
          <div className="absolute inset-0 bg-white/20 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </motion.div>
    </div>
  </motion.div>
);

// Slide Image Component
interface SlideImageProps {
  image: CarouselImage;
  index: number;
  isActive: boolean;
}

const SlideImage: React.FC<SlideImageProps> = ({ image, index, isActive }) => (
  <motion.div
    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
      isActive ? 'opacity-100' : 'opacity-0'
    }`}
    initial={{ scale: 1.1, opacity: 0 }}
    animate={{
      scale: isActive ? 1 : 1.1,
      opacity: isActive ? 1 : 0,
    }}
    transition={{
      duration: 5,
      ease: 'easeOut',
      opacity: { duration: 1 },
    }}
  >
    {/* Responsive Overlay Gradients */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/70 sm:from-black/70 sm:via-black/30 sm:to-black/60 z-10"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 sm:from-black/30 sm:to-black/30 z-10"></div>

    {/* Responsive Image with different crops for different screens */}
    <picture>
      <source media="(max-width: 480px)" srcSet={image.url} />
      <source media="(max-width: 768px)" srcSet={image.url} />
      <img
        src={image.url}
        alt={image.title}
        className="w-full h-full object-cover transition-transform duration-[5000ms] ease-out"
        style={{
          transform: isActive ? 'scale(1)' : 'scale(1.05)',
          objectPosition: 'center center',
        }}
        loading={index === 0 ? 'eager' : 'lazy'}
        fetchPriority={index === 0 ? 'high' : 'low'}
      />
    </picture>
  </motion.div>
);

// Navigation Dots Component
interface NavigationDotsProps {
  images: CarouselImage[];
  currentSlide: number;
  onSlideChange: (index: number) => void;
  isMobile: boolean;
}

const NavigationDots: React.FC<NavigationDotsProps> = ({
  images,
  currentSlide,
  onSlideChange,
  isMobile,
}) => (
  <div
    className={`absolute ${isMobile ? 'bottom-4' : 'bottom-6 sm:bottom-8'} left-0 right-0 flex justify-center ${isMobile ? 'space-x-2' : 'space-x-3'} z-30 px-4`}
  >
    {images.map((_, index) => (
      <motion.button
        key={index}
        onClick={() => onSlideChange(index)}
        className={`relative overflow-hidden rounded-full cursor-pointer transition-all duration-300 ${
          index === currentSlide
            ? isMobile
              ? 'w-8 h-3 bg-gradient-to-r from-rose-500 to-pink-500'
              : 'w-10 sm:w-12 h-3 sm:h-4 bg-gradient-to-r from-rose-500 to-pink-500'
            : isMobile
              ? 'w-3 h-3 bg-white/60 hover:bg-white/80'
              : 'w-3 sm:w-4 h-3 sm:h-4 bg-white/60 hover:bg-white/80'
        }`}
        aria-label={`Ir a diapositiva ${index + 1}`}
        whileHover={{ scale: isMobile ? 1.1 : 1.2 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        {index === currentSlide && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 opacity-50"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 5, ease: 'linear', repeat: Infinity }}
          />
        )}
      </motion.button>
    ))}
  </div>
);

// Navigation Arrows Component
interface NavigationArrowsProps {
  onPrevious: () => void;
  onNext: () => void;
  isMobile: boolean;
  isTablet: boolean;
}

const NavigationArrows: React.FC<NavigationArrowsProps> = ({
  onPrevious,
  onNext,
  isMobile,
  isTablet,
}) => {
  if (isMobile) return null; // Hide arrows on mobile to avoid clutter

  return (
    <>
      <motion.button
        onClick={onPrevious}
        className={`absolute ${
          isTablet ? 'left-4' : 'left-6 lg:left-8'
        } top-1/2 transform -translate-y-1/2 bg-black/40 backdrop-blur-sm border border-white/20 text-white ${
          isTablet ? 'p-3' : 'p-3 sm:p-4'
        } rounded-xl sm:rounded-2xl hover:bg-black/60 transition-all duration-300 shadow-2xl z-30 group`}
        aria-label="Diapositiva anterior"
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <svg
          className={`${
            isTablet ? 'w-5 h-5' : 'w-5 h-5 sm:w-6 sm:h-6'
          } group-hover:-translate-x-1 transition-transform duration-300`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </motion.button>

      <motion.button
        onClick={onNext}
        className={`absolute ${
          isTablet ? 'right-4' : 'right-6 lg:right-8'
        } top-1/2 transform -translate-y-1/2 bg-black/40 backdrop-blur-sm border border-white/20 text-white ${
          isTablet ? 'p-3' : 'p-3 sm:p-4'
        } rounded-xl sm:rounded-2xl hover:bg-black/60 transition-all duration-300 shadow-2xl z-30 group`}
        aria-label="Diapositiva siguiente"
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <svg
          className={`${
            isTablet ? 'w-5 h-5' : 'w-5 h-5 sm:w-6 sm:h-6'
          } group-hover:translate-x-1 transition-transform duration-300`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </>
  );
};

// Progress Bar Component
const ProgressBar: React.FC<{
  currentSlide: number;
  totalSlides: number;
  isMobile: boolean;
}> = ({ currentSlide, totalSlides, isMobile }) => (
  <div className="absolute top-0 left-0 right-0 z-30">
    <div className={`${isMobile ? 'h-0.5' : 'h-1'} bg-black/20`}>
      <motion.div
        className="h-full bg-gradient-to-r from-rose-500 to-pink-500"
        initial={{ width: 0 }}
        animate={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  </div>
);

// Slide Counter Component
const SlideCounter: React.FC<{
  current: number;
  total: number;
  isMobile: boolean;
}> = ({ current, total, isMobile }) => (
  <div
    className={`absolute ${isMobile ? 'top-4 right-4' : 'top-6 sm:top-8 right-6 sm:right-8'} z-30`}
  >
    <div
      className={`bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl ${
        isMobile
          ? 'px-3 py-1.5 text-sm'
          : 'px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base'
      } text-white/90 font-medium`}
    >
      <span className="text-rose-400 font-bold">{current + 1}</span>
      <span className="mx-1 sm:mx-2">/</span>
      <span>{total}</span>
    </div>
  </div>
);

// Play/Pause Button Component
interface PlayPauseButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  isPlaying,
  onToggle,
  isMobile,
}) => (
  <motion.button
    onClick={onToggle}
    className={`absolute ${
      isMobile ? 'bottom-4 left-4' : 'bottom-6 sm:bottom-8 left-6 sm:left-8'
    } bg-black/40 backdrop-blur-sm border border-white/20 text-white ${
      isMobile ? 'p-2.5' : 'p-2.5 sm:p-3'
    } rounded-lg sm:rounded-xl hover:bg-black/60 transition-all duration-300 shadow-xl z-30`}
    aria-label={isPlaying ? 'Pausar carrusel' : 'Reproducir carrusel'}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    {isPlaying ? (
      <svg
        className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4 sm:w-5 sm:h-5'}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
      </svg>
    ) : (
      <svg
        className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4 sm:w-5 sm:h-5'}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    )}
  </motion.button>
);

// Touch/Swipe Handler Component
interface TouchHandlerProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  children: React.ReactNode;
}

const TouchHandler: React.FC<TouchHandlerProps> = ({
  onSwipeLeft,
  onSwipeRight,
  children,
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) onSwipeLeft();
    if (isRightSwipe) onSwipeRight();
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="w-full h-full"
    >
      {children}
    </div>
  );
};

// Main Carousel Component
const Carousel: React.FC = () => {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const { scrollToSection } = useScroll();
  const { isMobile, isTablet } = useDeviceDetection();

  // Fetch carousel data
  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const data = await getCarousel();
        setCarouselImages(data);
      } catch (err) {
        setError('Error al cargar el carrusel');
      } finally {
        setLoading(false);
      }
    };

    void fetchCarousel();
  }, []);

  // Auto-play functionality with device-aware timing
  useEffect(() => {
    if (!isPlaying || carouselImages.length === 0) return;

    const interval = setInterval(
      () => {
        setCurrentSlide(prev => (prev + 1) % carouselImages.length);
      },
      isMobile ? 4000 : 5000
    ); // Faster on mobile

    return () => clearInterval(interval);
  }, [carouselImages.length, isPlaying, isMobile]);

  // Navigation handlers
  const goToSlide = useCallback(
    (index: number) => {
      setCurrentSlide(index);
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), isMobile ? 2000 : 3000);
    },
    [isMobile]
  );

  const goToPrevious = useCallback(() => {
    setCurrentSlide(
      prev => (prev - 1 + carouselImages.length) % carouselImages.length
    );
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), isMobile ? 2000 : 3000);
  }, [carouselImages.length, isMobile]);

  const goToNext = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % carouselImages.length);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), isMobile ? 2000 : 3000);
  }, [carouselImages.length, isMobile]);

  const handleCTAClick = useCallback(() => {
    scrollToSection('contacto');
  }, [scrollToSection]);

  // Keyboard navigation (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goToPrevious, goToNext, isMobile]);

  if (loading) return <LoadingSpinner />;
  if (error || carouselImages.length === 0)
    return <ErrorState error={error || 'No hay imágenes disponibles'} />;

  return (
    <section id="inicio" className="relative">
      <div
        className={`relative w-full overflow-hidden ${
          isMobile
            ? 'aspect-[4/5] min-h-[70vh] max-h-[80vh]'
            : isTablet
              ? 'aspect-[16/10] min-h-[60vh] max-h-[85vh]'
              : 'aspect-[16/9] min-h-[65vh] max-h-[100vh]'
        }`}
      >
        {/* Progress Bar */}
        <ProgressBar
          currentSlide={currentSlide}
          totalSlides={carouselImages.length}
          isMobile={isMobile}
        />

        {/* Slide Counter */}
        <SlideCounter
          current={currentSlide}
          total={carouselImages.length}
          isMobile={isMobile}
        />

        {/* Touch/Swipe Handler for Mobile */}
        <TouchHandler onSwipeLeft={goToNext} onSwipeRight={goToPrevious}>
          {/* Slides Container */}
          <div className="relative w-full h-full">
            <AnimatePresence mode="wait">
              {carouselImages.map((image, index) => (
                <div key={image.id}>
                  <SlideImage
                    image={image}
                    index={index}
                    isActive={index === currentSlide}
                  />

                  {index === currentSlide && (
                    <SlideContent
                      image={image}
                      isActive={true}
                      onCTAClick={handleCTAClick}
                      isMobile={isMobile}
                      isTablet={isTablet}
                    />
                  )}
                </div>
              ))}
            </AnimatePresence>
          </div>
        </TouchHandler>

        {/* Navigation Elements */}
        <NavigationDots
          images={carouselImages}
          currentSlide={currentSlide}
          onSlideChange={goToSlide}
          isMobile={isMobile}
        />

        <NavigationArrows
          onPrevious={goToPrevious}
          onNext={goToNext}
          isMobile={isMobile}
          isTablet={isTablet}
        />

        {/* Play/Pause Button */}
        <PlayPauseButton
          isPlaying={isPlaying}
          onToggle={() => setIsPlaying(prev => !prev)}
          isMobile={isMobile}
        />

        {/* Responsive Decorative Elements */}
        <div
          className={`absolute bottom-0 left-0 ${
            isMobile ? 'w-20 h-20' : 'w-24 sm:w-32 h-24 sm:h-32'
          } bg-gradient-to-tr from-rose-500/20 to-transparent rounded-full blur-2xl z-10`}
        ></div>
        <div
          className={`absolute top-0 right-0 ${
            isMobile ? 'w-20 h-20' : 'w-24 sm:w-32 h-24 sm:h-32'
          } bg-gradient-to-bl from-pink-500/20 to-transparent rounded-full blur-2xl z-10`}
        ></div>

        {/* Mobile Swipe Indicator */}
        {isMobile && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30">
            <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 text-white/70 text-xs">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              <span>Desliza</span>
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Carousel;
