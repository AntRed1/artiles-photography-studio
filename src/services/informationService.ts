import { Information } from '../types';
import api from './api';

export const getInformation = async (): Promise<Information> => {
  const response = await api.get<Information>('/information');
  return response.data;
};
