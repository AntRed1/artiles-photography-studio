import api from './api';
import { Gallery } from '../types';

export const getGallery = async (): Promise<Gallery[]> => {
  const response = await api.get<Gallery[]>('/gallery');
  return response.data;
};