import api from './api';
import { CarouselImage } from '../types';

export const getCarousel = async (): Promise<CarouselImage[]> => {
  const response = await api.get<CarouselImage[]>('/carousel');
  return response.data.map(image => ({
    ...image,
    url: optimizeCloudinaryUrl(image.url),
  }));
};

// Optimiza URLs de Cloudinary para mejor rendimiento
const optimizeCloudinaryUrl = (url: string): string => {
  const transformation = 'w_1920,h_1080,c_fill,f_auto,q_auto';
  const parts = url.split('/image/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/image/upload/${transformation}/${parts[1]}`;
  }
  return url;
};
