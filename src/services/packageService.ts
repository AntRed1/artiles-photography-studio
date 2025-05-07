import api from './api';
import { PhotographyPackage } from '../types';

export const getActivePackages = async (): Promise<PhotographyPackage[]> => {
  const response = await api.get<PhotographyPackage[]>('/packages/active');
  return response.data.map(pkg => ({
    ...pkg,
    imageUrl: optimizeCloudinaryUrl(pkg.imageUrl),
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