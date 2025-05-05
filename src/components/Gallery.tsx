import React, { useState, useEffect } from 'react';
import { Gallery as GalleryType } from '../types';
import { getGalleryImages } from '../services/configService';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getGalleryImages();
        setImages(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar la galería');
        setLoading(false);
      }
    };

    void fetchImages();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="py-12 bg-gray-200">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Galería</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map(image => (
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
  );
};

export default Gallery;
