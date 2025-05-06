import api from './api';
import { Configuration } from '../types';

export const getConfiguration = async (): Promise<Configuration> => {
  const response = await api.get<Configuration>('/config');
  return response.data;
};