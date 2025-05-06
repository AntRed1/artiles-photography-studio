import React, { useState, useEffect } from 'react';
import { getTestimonials } from '../services/testimonialService';
import { Testimonial } from '../types';

interface TestimonialsProps {
  setShowShareModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Testimonials: React.FC<TestimonialsProps> = ({ setShowShareModal }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getTestimonials();
        setTestimonials(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los testimonios');
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading) {
    return <div className="text-center py-16">Cargando...</div>;
  }

  if (error || testimonials.length === 0) {
    return (
      <div className="text-center py-16 text-red-600">
        {error || 'No se encontraron testimonios'}
      </div>
    );
  }

  return (
    <section id="testimonios" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700">
            La satisfacción de nuestros clientes es nuestra mejor carta de
            presentación.
          </p>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex mb-4 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fa-solid fa-star ${
                            i < testimonial.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          } mr-1`}
                        ></i>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic text-center">
                      "{testimonial.message}"
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(testimonial.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() =>
              setCurrentSlide(prev =>
                prev > 0 ? prev - 1 : testimonials.length - 1
              )
            }
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white rounded-full w-10 h-10 shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-300"
          >
            <i className="fa-solid fa-chevron-left text-gray-600"></i>
          </button>
          <button
            onClick={() =>
              setCurrentSlide(prev =>
                prev < testimonials.length - 1 ? prev + 1 : 0
              )
            }
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white rounded-full w-10 h-10 shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-300"
          >
            <i className="fa-solid fa-chevron-right text-gray-600"></i>
          </button>
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentSlide ? 'bg-red-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
        <div className="text-center mt-12">
          <button
            onClick={() => setShowShareModal(true)}
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer"
          >
            Compartir Mi Experiencia
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
