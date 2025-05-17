import api from './api';
import { Testimonial } from '../types';
import { UAParser } from 'ua-parser-js';

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const response = await api.get<Testimonial[]>('/testimonials');
  return response.data;
};

export const saveTestimonial = async (
  testimonial: Partial<Testimonial>
): Promise<Testimonial> => {
  const parser = new UAParser();
  const result = parser.getResult();
  const device = `${result.device.type || 'Desktop'} ${result.browser.name} (${result.device.vendor || 'Unknown'} ${result.device.model || 'Unknown'})`;
  const payload = {
    name: testimonial.name,
    rating: testimonial.rating,
    message: testimonial.message,
    device,
  };
  const response = await api.post<Testimonial>('/testimonials', payload);
  return response.data;
};
