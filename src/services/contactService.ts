// src/services/contactService.ts
import { environment } from '../config/environment';
import { ContactFormPayload } from '../types/index';

export const submitContactForm = async (
  data: ContactFormPayload
): Promise<void> => {
  try {
    // Mostrar spinner o estado de carga
    const response = await fetch(`${environment.apiUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al enviar el formulario');
    }

    // Mostrar mensaje de éxito inmediatamente
    // (El backend procesará los correos asíncronamente)
    //console.log('Formulario enviado, procesando correos...');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
