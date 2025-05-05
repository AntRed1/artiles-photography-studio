import React, { useState, useEffect } from 'react';
import {
  Testimonial,
  Gallery,
  PhotographyPackage,
  Configuration,
} from '../types';
import { getAllTestimonials } from '../services/testimonialService';
import { getActivePackages } from '../services/packageService';
import { getGalleryImages } from '../services/configService';
import { getConfiguration } from '../services/configService';

const Home: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [packages, setPackages] = useState<PhotographyPackage[]>([]);
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [config, setConfig] = useState<Configuration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testimonialData, packageData, galleryData, configData] =
          await Promise.all([
            getAllTestimonials(),
            getActivePackages(),
            getGalleryImages(),
            getConfiguration(),
          ]);
        setTestimonials(testimonialData);
        setPackages(packageData);
        setGallery(galleryData);
        setConfig(configData);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos de la página de inicio');
        setLoading(false);
      }
    };

    void fetchData(); // Marca la promesa como ignorada explícitamente
  }, []);

  const addTestimonial = (name: string, rating: number, message: string) => {
    const newTestimonial: Testimonial = {
      id: testimonials.length + 1,
      name,
      rating,
      message,
      createdAt: new Date().toISOString(),
    };
    setTestimonials([...testimonials, newTestimonial]);
  };

  const handleAddTestimonial = () => {
    addTestimonial(
      'Nuevo Cliente',
      5,
      '¡Gran servicio, las fotos quedaron increíbles!'
    );
  };

  return (
    <div className="bg-gray-100">
      <section
        className="relative bg-cover bg-center h-screen"
        style={{
          backgroundImage: `url(${config?.heroBackgroundImage || '/images/hero.jpg'})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Artiles Photography Studio
            </h1>
            <p className="text-lg md:text-2xl mb-6">
              Capturando momentos inolvidables desde 2013
            </p>
            <button
              className="bg-red-500 text-white px-6 py-3 rounded Rounded-full hover:bg-red-600 transition-colors"
              onClick={() => {
                window.location.href = '#contacto';
              }}
            >
              Contáctanos
            </button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Nuestros Paquetes
          </h2>
          {loading ? (
            <div>Cargando...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map(pkg => (
                <div key={pkg.id} className="bg-white p-6 rounded-lg shadow-lg">
                  <img
                    src={pkg.imageUrl}
                    alt={pkg.title}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  <p className="text-lg font-bold">
                    RD${pkg.price.toLocaleString()}
                  </p>
                  <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    Reservar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Galería</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map(image => (
              <div key={image.id || image.imageUrl} className="relative">
                <img
                  src={image.imageUrl}
                  alt={image.description}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                  <p className="text-white text-center opacity-0 hover:opacity-100 transition-opacity">
                    {image.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Testimonios</h2>
          <button
            onClick={handleAddTestimonial}
            className="mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Añadir Testimonio
          </button>
          {loading ? (
            <div>Cargando...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map(testimonial => (
                <div
                  key={testimonial.id}
                  className="bg-white p-6 rounded-lg shadow-lg"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {testimonial.name}
                  </h3>
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
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
