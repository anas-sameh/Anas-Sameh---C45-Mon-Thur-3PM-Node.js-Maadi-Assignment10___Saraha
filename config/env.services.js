import {config} from "dotenv"
import {resolve} from "node:path"

export const NODE_ENV = process.env.NODE_ENV;


const env_path = {
    development: "./config/.env.development",
    production: "./config/.env.production"
}

config({path:resolve(`${env_path[NODE_ENV]}`)})

export const PORT = process.env.PORT ?? 5000
export const DB_NAME = process.env.DB_NAME
export const DB_HOST = process.env.DB_HOST
export const SALT_ROUND = Number(process.env.SALT_ROUND)
export const SECRET_KEY = process.env.SECRET_KEY
export const JWT_SECRET_System = process.env.JWT_SECRET_System
export const JWT_SECRET_GOOGLE = process.env.JWT_SECRET_GOOGLE
export const Refresh_token_System = process.env.Refresh_token_System
export const Refresh_token_GOOGLE = process.env.Refresh_token_GOOGLE
export const JWT_SECRET_RotateToken = process.env.JWT_SECRET_RotateToken
export const IV_LENGHT = process.env.IV_LENGHT??16


console.log({NODE_ENV },{ path : env_path[NODE_ENV]} );
