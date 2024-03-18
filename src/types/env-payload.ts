export interface EnvPayload {
  NODE_ENV: string
  PORT: number

  DB_HOST: string
  DB_PORT: number
  DB_USER: string
  DB_PASSWORD: string
  DB_NAME: string
  DB_URL: string

  REDIS_HOST: string
  REDIS_PORT: number
}
