import api from './api';
import { Information } from '../types';

export const getInformation = async (): Promise<Information[]> => {
  const response = await api.get<{ data: Information[] }>('/information');
  return response.data.data;
};
