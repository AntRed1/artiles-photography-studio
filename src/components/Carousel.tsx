import React, { useState, useEffect } from 'react';
import { Gallery } from '../types';
import { getGalleryImages } from '../services/configService';

const Carousel: React.FC = () => {
  const [images, setImages] = useState<Gallery[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getGalleryImages();
        setImages(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las imágenes del carrusel');
        setLoading(false);
      }
    };

    void fetchImages(); // Marca la promesa como ignorada
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!images.length) return null;

  return (
    <div className="relative w-full h-96 overflow-hidden">
      {images.map((image, index) => (
        <div
          key={image.id || image.imageUrl}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.imageUrl}
            alt={image.description}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white p-4">
            <p>{image.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Carousel;
