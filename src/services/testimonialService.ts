import api from './api';
import { Testimonial } from '../types';

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const response = await api.get<Testimonial[]>('/testimonials');
  return response.data;
};

export const saveTestimonial = async (
  testimonial: Testimonial
): Promise<Testimonial> => {
  const response = await api.post<Testimonial>('/testimonials', testimonial);
  return response.data;
};
