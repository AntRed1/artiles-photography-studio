import api from './api';
import { Configuration, Gallery } from '../types';

export const getConfiguration = async (): Promise<Configuration> => {
  const response = await api.get<{ data: Configuration }>('/config');
  return response.data.data;
};

export const getGalleryImages = async (): Promise<Gallery[]> => {
  const response = await api.get<{ data: Gallery[] }>('/config/gallery');
  return response.data.data;
};

export const getHeroBackgroundImage = async (): Promise<string> => {
  const response = await api.get<{ data: string }>('/config/hero');
  return response.data.data;
};
