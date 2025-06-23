export const environment = {
  production: process.env.NODE_ENV === 'production',
  apiUrl:
    process.env.NODE_ENV === 'production'
      ? 'http://10.0.16.173:8080/api'
      : 'http://localhost:8080/api',
};
