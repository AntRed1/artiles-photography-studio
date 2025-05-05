import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
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
