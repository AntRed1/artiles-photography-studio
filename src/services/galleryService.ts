import api from './api';
import { GalleryImage } from '../types';

export const getGallery = async (): Promise<GalleryImage[]> => {
  const response = await api.get<GalleryImage[]>('/gallery');
  return response.data;
};