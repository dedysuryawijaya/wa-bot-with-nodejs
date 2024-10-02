import { web } from "./application/web.js";
import { logger } from "./application/logging.js";
import mongoose from "mongoose";
import { connectToCluster } from "./application/mongoConnection.js";
import 'dotenv/config'
import config from './application/config.js';

logger.info(config);

if (config.mongoose.enable) {
    mongoose.set('strictQuery', true);
    mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
        logger.info("Connected to MongoDB")
    })
}

logger.info(config)

web.listen(3000, async () => {
    logger.info("App start in port : " + 3000);
    global.mongoClient = await connectToCluster(config.mongoose.url)
})