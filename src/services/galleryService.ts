import api from './api';
import { GalleryImage } from '../types';

export const getGallery = async (
  page = 1,
  size = 9
): Promise<GalleryImage[]> => {
  const response = await api.get<GalleryImage[]>(
    `/gallery?page=${page}&size=${size}`
  );
  return response.data.map(image => ({
    ...image,
    imageUrl: optimizeCloudinaryUrl(image.imageUrl),
  }));
};

// Optimiza URLs de Cloudinary para mejor rendimiento
const optimizeCloudinaryUrl = (url: string): string => {
  const transformation = 'w_800,h_600,c_fill,f_auto,q_auto';
  const parts = url.split('/image/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/image/upload/${transformation}/${parts[1]}`;
  }
  return url;
};
