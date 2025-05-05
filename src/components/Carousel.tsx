import React, { useEffect, useState } from 'react';
import { carouselImages } from '../data/carouselImages';
import { useScroll } from '../hooks/useScroll';

const Carousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollToSection } = useScroll();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="inicio" className="pt-20 md:pt-24">
      <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
        {carouselImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center text-white p-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                {image.title}
              </h2>
              <p className="text-xl md:text-2xl max-w-2xl">
                {image.description}
              </p>
              <button
                onClick={() => scrollToSection('contacto')}
                className="mt-8 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer"
              >
                Reserva Tu Sesión
              </button>
            </div>
          </div>
        ))}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-2 z-30">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                index === currentSlide ? 'bg-red-600' : 'bg-white/60'
              }`}
              aria-label={`Ir a diapositiva ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
