import api from './api';
import { Testimonial } from '../types';

export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  const response = await api.get<{ data: Testimonial[] }>('/testimonials');
  return response.data.data;
};

export const addTestimonial = async (
  testimonial: Testimonial
): Promise<Testimonial> => {
  const response = await api.post<{ data: Testimonial }>(
    '/testimonials',
    testimonial
  );
  return response.data.data;
};
