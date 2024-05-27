import dotenv from 'dotenv'
dotenv.config({path:'./.env'})

const mongo_url = process.env.MONGO_URL
const db_name = process.env.MONGO_DB
const cloud_name = process.env.CLOUD_NAME
const cloud_api = process.env.CLOUD_API
const api_secret = process.env.CLOUD_SECRET
const tokenSecret = process.env.JWT_SECRET

export {mongo_url, db_name, cloud_name, cloud_api, api_secret,tokenSecret}