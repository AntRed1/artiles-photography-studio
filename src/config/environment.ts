// src/environments/environment.ts
interface Environment {
  production: boolean;
  apiUrl: string;
}

// Validación estricta - todas las variables son requeridas
const requiredEnvVars = ['REACT_APP_API_URL', 'NODE_ENV'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}. ` +
      `Please check your .env file and ensure all variables are defined.`
  );
}

const environment: Environment = {
  production: process.env.NODE_ENV === 'production',
  apiUrl: process.env.REACT_APP_API_URL as string,
};

// Validación adicional para URL
if (
  !environment.apiUrl.startsWith('http') &&
  !environment.apiUrl.startsWith('/')
) {
  throw new Error('REACT_APP_API_URL must be a valid URL or relative path');
}

export { environment };
