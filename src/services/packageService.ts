import api from './api';
import { PhotographyPackage } from '../types';

export const getActivePackages = async (): Promise<PhotographyPackage[]> => {
  const response = await api.get<{ data: PhotographyPackage[] }>(
    '/packages/active'
  );
  return response.data.data;
};
