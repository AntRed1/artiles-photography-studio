import axios from 'axios';
import { environment } from '../config/environment';

const api = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || 'Error desconocido';
    console.error(`Error en la solicitud: ${message}`);
    return Promise.reject(error);
  }
);

export default api;
