export interface EnvPayload {
  NODE_ENV: string
  PORT: number

  DATABASE_URL: string

  REDIS_HOST: string
  REDIS_PORT: number

  WALLET_CLIENT_PRIVATE_KEY: string

  ACCESS_TOKEN_SECRET: string
  ACCESS_TOKEN_EXPIRE: string
  REFRESH_TOKEN_SECRET: string
  REFRESH_TOKEN_EXPIRE: string
}
