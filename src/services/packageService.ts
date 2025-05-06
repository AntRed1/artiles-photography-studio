import api from './api';
import { PhotographyPackage } from '../types';

export const getActivePackages = async (): Promise<PhotographyPackage[]> => {
  const response = await api.get<PhotographyPackage[]>('/packages/active');
  return response.data;
};
