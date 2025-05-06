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
    return <div className="text-center py-20 text-gray-600">Cargando...</div>;
  }

  if (error || testimonials.length === 0) {
    return (
      <div className="text-center py-20 text-red-600">
        {error || 'No se encontraron testimonios'}
      </div>
    );
  }

  return (
    <section
      id="testimonios"
      className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-gray-100"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
            La satisfacción de nuestros clientes es nuestra mejor carta de
            presentación.
          </p>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              role="list"
            >
              {testimonials.map(testimonial => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                  role="listitem"
                >
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex mb-4 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fa-solid fa-star ${
                            i < testimonial.rating
                              ? 'text-rose-600'
                              : 'text-gray-300'
                          } mr-1`}
                          aria-label={`Estrella ${i + 1} de ${testimonial.rating}`}
                        ></i>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic text-center line-clamp-4">
                      "{testimonial.message}"
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-800">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonial.createdAt
                          ? new Date(testimonial.createdAt).toLocaleDateString(
                              'es-ES',
                              {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              }
                            )
                          : 'Fecha no disponible'}
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
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center hover:bg-rose-50 transition-colors duration-300"
            aria-label="Testimonio anterior"
          >
            <i className="fa-solid fa-chevron-left text-rose-600"></i>
          </button>
          <button
            onClick={() =>
              setCurrentSlide(prev =>
                prev < testimonials.length - 1 ? prev + 1 : 0
              )
            }
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center hover:bg-rose-50 transition-colors duration-300"
            aria-label="Testimonio siguiente"
          >
            <i className="fa-solid fa-chevron-right text-rose-600"></i>
          </button>
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentSlide ? 'bg-rose-600' : 'bg-gray-300'
                }`}
                aria-label={`Ir al testimonio ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
        <div className="text-center mt-12">
          <button
            onClick={() => setShowShareModal(true)}
            className="px-6 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 hover:shadow-lg transition-all duration-300"
            aria-label="Abrir formulario para compartir experiencia"
          >
            Compartir Mi Experiencia
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
