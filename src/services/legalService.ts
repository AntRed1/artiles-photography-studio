import api from './api';
import { Legal } from '../types';

export const getLegalDocuments = async (): Promise<Legal[]> => {
  const response = await api.get<Legal[]>('/legal');
  return response.data;
};
