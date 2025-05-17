import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCarousel } from '../services/carouselService';
import { CarouselImage } from '../types';
import useScroll from '../hooks/useScroll';

const Carousel: React.FC = () => {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { scrollToSection } = useScroll();

  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const data = await getCarousel();
        setCarouselImages(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el carrusel');
        setLoading(false);
      }
    };
    void fetchCarousel();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide(
      prev => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  const goToNext = () => {
    setCurrentSlide(prev => (prev + 1) % carouselImages.length);
  };

  if (loading) {
    return <div className="text-center py-16 text-gray-600">Cargando...</div>;
  }

  if (error || carouselImages.length === 0) {
    return <div className="text-center py-16 text-rose-600">{error}</div>;
  }

  return (
    <section id="inicio" className="pt-16 sm:pt-20">
      <div className="relative w-full aspect-[16/9] max-h-[700px] overflow-hidden">
        {carouselImages.map((image, index) => (
          <motion.div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{
              scale: index === currentSlide ? 1 : 1.1,
              opacity: index === currentSlide ? 1 : 0,
            }}
            transition={{
              duration: 5,
              ease: 'easeOut',
              opacity: { duration: 1 },
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 z-10"></div>
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'low'}
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center text-white px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 animate-fade-in text-shadow-md">
                {image.title}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl max-w-3xl animate-fade-in-delay text-shadow-sm">
                {image.description}
              </p>
              <motion.button
                onClick={() => scrollToSection('contacto')}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white font-medium rounded-lg shadow-md hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2"
                aria-label="Reserva tu sesión fotográfica"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Reserva Tu Sesión
              </motion.button>
            </div>
          </motion.div>
        ))}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-30">
          {carouselImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full cursor-pointer transition-colors duration-300 ${
                index === currentSlide
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700'
                  : 'bg-white/70 hover:bg-white/90'
              }`}
              aria-label={`Ir a diapositiva ${index + 1}`}
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.2 }}
            ></motion.button>
          ))}
        </div>
        <motion.button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-4 rounded-full hover:bg-black/80 hover:shadow-glow shadow-md focus:outline-none focus:ring-2 focus:ring-rose-600 z-30"
          aria-label="Diapositiva anterior"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>
        <motion.button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-4 rounded-full hover:bg-black/80 hover:shadow-glow shadow-md focus:outline-none focus:ring-2 focus:ring-rose-600 z-30"
          aria-label="Diapositiva siguiente"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      </div>
    </section>
  );
};

export default Carousel;
