import api from './api';
import { Configuration, Gallery } from '../types';

export const getConfiguration = async (): Promise<Configuration> => {
  const response = await api.get<Configuration>('/config');
  return response.data;
};

export const getGallery = async (): Promise<Gallery[]> => {
  const response = await api.get<Gallery[]>('/gallery');
  return response.data;
};
