import dotenv from 'dotenv'

const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.dev'
dotenv.config({ path: envFile })

export const envs = {
  DB_USERNAME: process.env.DB_USERNAME || '',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  SERVER_PORT: Number(process.env.SERVER_PORT) || 3000,
  SERVER_HOST: process.env.SERVER_HOST || '',
  DB_NAME: process.env.DB_NAME || '',
  PASSWORD_SALT: process.env.PASSWORD_SALT || '@@@@@',
  JWT_SECRET: process.env.JWT_SECRET || '@@@@@',
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || '5m',
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d'
}
