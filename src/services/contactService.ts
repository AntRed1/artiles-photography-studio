// src/services/contactService.ts
import { environment } from '../config/environment';
import { ContactFormPayload } from '../types/index';

export const submitContactForm = async (
  data: ContactFormPayload
): Promise<void> => {
  const response = await fetch(`${environment.apiUrl}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al enviar el formulario');
  }
};
