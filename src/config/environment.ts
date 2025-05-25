export const environment = {
  production: false,
  apiUrl:
    process.env.NODE_ENV === 'production'
      ? 'http://localhost:8080/api'
      : 'http://localhost:8080/api',
};
