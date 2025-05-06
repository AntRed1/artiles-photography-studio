import React, { useEffect, useState } from 'react';
import { getGallery } from '../services/galleryService';
import { GalleryImage } from '../types';

const Gallery: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await getGallery();
        const galleryData = data
          .filter(img => !img.description.toLowerCase().includes('carousel'))
          .map(img => ({
            id: img.id,
            imageUrl: img.imageUrl,
            description: img.description,
          }));
        setGalleryImages(galleryData);
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nuestra Galería
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700">
            Explora nuestro trabajo y descubre cómo capturamos momentos
            inolvidables.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map(image => (
            <div
              key={image.id}
              className="relative overflow-hidden rounded-lg group"
            >
              <img
                src={image.imageUrl}
                alt={`Fotografía de ${image.description}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white font-medium text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 capitalize">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
