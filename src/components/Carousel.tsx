import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { getCarousel } from '../services/carouselService';
import { CarouselImage } from '../types';

const AUTO_PLAY_INTERVAL = 7000; // 7 segundos

const Carousel: React.FC = () => {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch imágenes
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getCarousel();
        setCarouselImages(data);
      } catch {
        setCarouselImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages().catch(console.error);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentPage(prev => (prev + 1) % carouselImages.length);
  }, [carouselImages.length]);

  const goToPrev = useCallback(() => {
    setCurrentPage(prev => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  }, [carouselImages.length]);

  // Autoplay
  useEffect(() => {
    if (carouselImages.length > 1) {
      intervalRef.current = setInterval(goToNext, AUTO_PLAY_INTERVAL);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [goToNext, carouselImages.length]);

  // Handler mejorado para el botón de reserva
  const handleReservaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('🔍 Botón clickeado - Buscando sección contacto...');

    // Intentar encontrar la sección de contacto
    const contactSection = document.getElementById('contacto');

    if (contactSection) {
      console.log('✅ Sección encontrada, haciendo scroll...');

      // Calcular la posición con offset para el header
      const headerOffset = 80;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    } else {
      console.warn('❌ No se encontró la sección con id="contacto"');
      console.log('Secciones disponibles:');

      // Listar todas las secciones con ID
      const allSections = document.querySelectorAll('section[id]');
      allSections.forEach(section => {
        console.log(`- ${section.id}`);
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin w-16 h-16 border-4 border-rose-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const currentImage = carouselImages[currentPage];

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden"
    >
      {/* Fondo dinámico con imagen HD - z-0 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage.id}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <img
            src={currentImage.url}
            alt={currentImage.title}
            className="w-full h-full object-cover brightness-90"
            loading="eager"
            decoding="sync"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/90 pointer-events-none"></div>
        </motion.div>
      </AnimatePresence>

      {/* Contenido principal - z-30 (más alto que los controles) */}
      <div className="relative z-30 max-w-5xl px-6 text-center pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="pointer-events-none"
          >
            <Camera className="w-10 h-10 text-rose-400 mx-auto mb-4 opacity-80" />
            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-3 drop-shadow-lg">
              {currentImage.title}
            </h2>
            <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
              {currentImage.description}
            </p>

            {/* Botón con pointer-events-auto para que sea clickeable */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReservaClick}
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-rose-400/50 transition-all duration-300 cursor-pointer pointer-events-auto inline-block"
              type="button"
            >
              Reserva tu sesión
            </motion.button>

            {/* Indicadores */}
            <div className="flex justify-center gap-2 mt-8">
              {carouselImages.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: i === currentPage ? 28 : 10,
                    backgroundColor:
                      i === currentPage
                        ? 'rgb(244,63,94)' // rose-500
                        : 'rgba(255,255,255,0.4)',
                  }}
                  className="h-2 rounded-full transition-all duration-500"
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles - z-20 (menor que el contenido) */}
      <div className="absolute inset-y-0 flex justify-between items-center w-full px-6 md:px-12 z-20 pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.2 }}
          onClick={goToPrev}
          className="p-3 bg-white/10 backdrop-blur-lg rounded-full text-white hover:bg-white/20 transition pointer-events-auto"
          aria-label="Imagen anterior"
          type="button"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.2 }}
          onClick={goToNext}
          className="p-3 bg-white/10 backdrop-blur-lg rounded-full text-white hover:bg-white/20 transition pointer-events-auto"
          aria-label="Siguiente imagen"
          type="button"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>
    </section>
  );
};

export default Carousel;
