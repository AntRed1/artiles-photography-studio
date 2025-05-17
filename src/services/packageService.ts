/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import api from './api';
import type { PhotographyPackage } from '../types';

interface PhotographyPackageResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
  showPrice: boolean;
  features: string[];
}

export const getActivePackages = async (): Promise<PhotographyPackage[]> => {
  try {
    const response =
      await api.get<PhotographyPackageResponse[]>('/packages/active');
    return response.data.map(pkg => ({
      ...pkg,
      imageUrl: optimizeCloudinaryUrl(pkg.imageUrl),
    }));
  } catch (error) {
    throw new Error('No se pudieron cargar los paquetes activos');
  }
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
