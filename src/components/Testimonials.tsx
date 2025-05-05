import React, { useEffect, useState } from 'react';
import { getTestimonials } from '../services/testimonialService';
import { Testimonial } from '../types';

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
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

  if (error) {
    return <div className="text-center py-16 text-red-600">{error}</div>;
  }

  return (
    <section id="testimonios" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Testimonios</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700">
            Lo que nuestros clientes dicen sobre nosotros.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-lg shadow-md p-6"
            >
              <p className="text-gray-600 mb-4">{testimonial.message}</p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <div className="flex">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <i
                        key={i}
                        className="fa-solid fa-star text-yellow-400"
                      ></i>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
