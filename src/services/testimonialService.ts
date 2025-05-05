import api from './api';
import { Testimonial } from '../types';

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const response = await api.get<Testimonial[]>('/testimonials');
  return response.data;
};