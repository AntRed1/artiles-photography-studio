import api from './api';
import { Legal } from '../types';

export const getLegalDocuments = async (): Promise<Legal[]> => {
  const response = await api.get<{ data: Legal[] }>('/legal');
  return response.data.data;
};
