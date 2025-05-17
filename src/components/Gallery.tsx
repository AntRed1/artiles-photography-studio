import React, { useEffect, useState } from 'react';
import { getGallery } from '../services/galleryService';
import { GalleryImage } from '../types';

const Gallery: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const imagesPerPage = 9;

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await getGallery(page, imagesPerPage);
        setGalleryImages(prev => (page === 1 ? data : [...prev, ...data]));
        setHasMore(data.length === imagesPerPage);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar la galería');
        setLoading(false);
      }
    };
    void fetchGallery();
  }, [page]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  if (loading && page === 1) {
    return <div className="text-center py-16 text-gray-600">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-600">{error}</div>;
  }

  return (
    <section id="galeria" className="py-16 md:py-24 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
            Nuestra Galería
          </h2>
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-700 animate-fade-in-delay">
            Explora nuestro trabajo y descubre cómo capturamos momentos
            inolvidables.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className="relative overflow-hidden rounded-xl shadow-md group aspect-[4/3]"
            >
              <img
                src={image.imageUrl}
                alt={image.description}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading={index < 3 ? 'eager' : 'lazy'}
                fetchPriority={index < 3 ? 'high' : 'low'}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <p className="text-white font-medium text-base sm:text-lg lg:text-xl text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 capitalize">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              disabled={loading}
              className={`px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-300 shadow-md hover:shadow-lg ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Cargar más imágenes"
            >
              {loading ? 'Cargando...' : 'Cargar Más'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
