import 'dotenv/config'

const APP_URL = process.env.APP_URL
const PORT = process.env.PORT
const API_KEY_GEMINI = process.env.API_KEY_GEMINI

const MONGODB_ENABLED = !!(
    process.env.MONGODB_ENABLED && process.env.MONGODB_ENABLED === 'true'
)

const MONGODB_URL = process.env.MONGODB_URL

const API_KEY = process.env.API_KEY;

export default {
    mongoose: {
        enable: MONGODB_ENABLED,
        url: MONGODB_URL,
        options: {
            // useCreateParser: true,
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        }
    },
    app_url: APP_URL,
    port: PORT,
    api_key: API_KEY,
    apiKeyGemini: API_KEY_GEMINI,
}