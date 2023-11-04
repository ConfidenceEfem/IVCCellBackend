import dotenv from "dotenv"


dotenv.config()

export const environmentalVariables = {
    PORT: process.env.PORT,
    MONGOOSE_URL: process.env.MONGODB_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY!,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    API_KEY: process.env.API_KEY,
    REDIRECT_URL: process.env.REDIRECT_URL,
    CLIENT_ID: process.env.CLIENT_ID,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
}