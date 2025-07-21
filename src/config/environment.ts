export const environment = {
  production: process.env.NODE_ENV === 'production',
  apiUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://artiles-photography-backend.up.railway.app/'
      : 'https://artiles-photography-backend.up.railway.app/',
};
