import dotenv from 'dotenv'

const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.dev'
dotenv.config({ path: envFile })

export const envs = {
  DB_USERNAME: process.env.DB_USERNAME || '',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  SERVER_PORT: Number(process.env.SERVER_PORT) || 3000,
  SERVER_HOST: process.env.SERVER_HOST || '',
  DB_NAME: process.env.DB_NAME || ''
}
