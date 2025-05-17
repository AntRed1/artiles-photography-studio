export const environment = {
  production: false,
  apiUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://artilesphotography.com/api'
      : 'http://localhost:8080/api',
};
