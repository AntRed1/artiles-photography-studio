import React, { useState, useEffect } from 'react';
import { Testimonial } from '../types';
import {
  getAllTestimonials,
  addTestimonial,
} from '../services/testimonialService';

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getAllTestimonials();
        setTestimonials(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar testimonios');
        setLoading(false);
      }
    };

    void fetchTestimonials();
  }, []);

  const handleAddTestimonial = async () => {
    const newTestimonial: Testimonial = {
      id: testimonials.length + 1,
      name: 'Nuevo Cliente',
      rating: 5,
      message: '¡Gran servicio!',
      createdAt: new Date().toISOString(),
    };

    try {
      const savedTestimonial = await addTestimonial(newTestimonial);
      setTestimonials([...testimonials, savedTestimonial]);
    } catch (err) {
      setError('Error al añadir testimonio');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Testimonios</h2>
        <button
          onClick={handleAddTestimonial}
          className="mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Añadir Testimonio
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map(testimonial => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-2">{testimonial.name}</h3>
              <p className="text-gray-600 mb-2">{testimonial.message}</p>
              <p className="text-yellow-500">
                {'★'.repeat(testimonial.rating)}
              </p>
              {testimonial.createdAt && (
                <p className="text-sm text-gray-500">
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
