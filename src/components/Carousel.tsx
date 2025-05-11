import React, { useEffect, useState } from 'react';
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
    return <div className="text-center py-16 text-red-600">{error}</div>;
  }

  return (
    <section id="inicio" className="pt-16 md:pt-20">
      <div className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[90vh] max-h-[800px] overflow-hidden">
        {carouselImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 z-10"></div>
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'low'}
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center text-white px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
                {image.title}
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl max-w-3xl animate-fade-in-delay">
                {image.description}
              </p>
              <button
                onClick={() => scrollToSection('contacto')}
                className="mt-6 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-300 shadow-md hover:shadow-lg animate-fade-in-delay"
                aria-label="Reserva tu sesión fotográfica"
              >
                Reserva Tu Sesión
              </button>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-30">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full cursor-pointer transition-colors duration-300 ${
                index === currentSlide
                  ? 'bg-red-600'
                  : 'bg-white/70 hover:bg-white/90'
              }`}
              aria-label={`Ir a diapositiva ${index + 1}`}
            ></button>
          ))}
        </div>
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors duration-300 z-30"
          aria-label="Diapositiva anterior"
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
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors duration-300 z-30"
          aria-label="Diapositiva siguiente"
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
        </button>
      </div>
    </section>
  );
};

export default Carousel;
