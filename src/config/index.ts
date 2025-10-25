import 'dotenv/config';

function requireEnv(name: string, defaultValue?: string) {
  const value = process.env[name] || defaultValue;
  if (!value) throw new Error(`Falta variable de entorno: ${name}`);
  return value;
}

export const env = {
  PORT: Number(requireEnv('PORT', '3000')),
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};
