import React, { useEffect, useState } from 'react';
import { Gallery } from '../types';
import { getGallery } from '../services/galleryService';

const Carousel: React.FC = () => {
  const [images, setImages] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getGallery();
        setImages(
          data.filter((img: Gallery) =>
            img.description.toLowerCase().includes('carousel')
          )
        );
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las imágenes del carrusel');
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (loading) {
    return <div className="text-center py-16">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-600">{error}</div>;
  }

  return (
    <div className="carousel w-full">
      {images.map((image, index) => (
        <div key={image.id || index} className="carousel-item w-full">
          <img
            src={image.imageUrl}
            alt={image.description}
            className="w-full h-96 object-cover"
          />
          <p className="text-center mt-4">{image.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Carousel;
