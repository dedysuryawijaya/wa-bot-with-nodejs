const PORT = process.env.PORT;
const API_KEY_GEMINI = process.env.API_KEY_GEMINI;

const MONGODB_ENABLED = !!(
    process.env.MONGODB_ENABLED && process.env.MONGODB_ENABLED === 'true'
)

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/whatsapp-bot'

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
    port: PORT,
    apiKeyGemini: API_KEY_GEMINI,
}