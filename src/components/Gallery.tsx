import React, { useEffect, useState } from 'react';
import { getGallery } from '../services/galleryService';
import { Gallery } from '../types';

const GallerySection: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<Gallery[]>([]);
  const [carouselImages, setCarouselImages] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await getGallery();
        setCarouselImages(
          data
            .filter(img => img.description.toLowerCase().includes('carousel'))
            .slice(0, 3)
        );
        setGalleryImages(
          data.filter(
            img => !img.description.toLowerCase().includes('carousel')
          )
        );
        setLoading(false);
      } catch (err) {
        setError('Error al cargar la galería');
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  if (loading) {
    return <div className="text-center py-16">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-600">{error}</div>;
  }

  return (
    <section id="galeria" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Galería</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700">
            Explora algunos de nuestros trabajos más recientes.
          </p>
        </div>
        {/* Carrusel */}
        <div className="mb-12">
          <div className="carousel w-full">
            {carouselImages.map(image => (
              <div key={image.id} className="carousel-item w-full">
                <img
                  src={image.imageUrl}
                  alt={image.description}
                  className="w-full h-96 object-cover"
                />
                <p className="text-center mt-4">
                  {image.description.replace('carousel: ', '')}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Galería */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map(image => (
            <div key={image.id} className="bg-white rounded-lg shadow-md">
              <img
                src={image.imageUrl}
                alt={image.description}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <p className="p-4 text-center">{image.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
