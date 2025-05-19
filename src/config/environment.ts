export const environment = {
  production: false,
  apiUrl:
    process.env.NODE_ENV === 'production'
      ? 'http://localhost/api'
      : 'http://localhost/api',
};
