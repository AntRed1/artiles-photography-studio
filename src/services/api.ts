import axios, { AxiosResponse, AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message || 'Error desconocido';
    console.error(`Error en la solicitud: ${message}`);
    return Promise.reject(error);
  }
);

export default api;
