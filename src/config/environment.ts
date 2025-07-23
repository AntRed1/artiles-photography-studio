export const environment = {
  production: process.env.NODE_ENV === 'production',
  apiUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://api-photoquince-backend.up.railway.app/api'
      : 'https://api-photoquince-backend.up.railway.app/api',
};
