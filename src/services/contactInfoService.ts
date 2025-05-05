import api from './api';
import { ContactInfo } from '../types';

export const getContactInfo = async (): Promise<ContactInfo> => {
  const response = await api.get<{ data: ContactInfo }>('/contact-info');
  return response.data.data;
};
