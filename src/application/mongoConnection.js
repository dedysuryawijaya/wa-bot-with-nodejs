import { MongoClient } from "mongodb";
import { logger } from "./logging.js";

async function connectToCluster(uri) {
    let mongoClient;
    try {
        mongoClient = new MongoClient(uri, {});
        logger.info('STATE: Connecting to MongoDB')
        await mongoClient.connect()
        logger.info('STATE: Successfully connected to MongoDB')
        return mongoClient;
    } catch (e) {
        logger.error('STATE: Connection to MongoDB failed!', error)
        process.exit()
    }
}

export {
    connectToCluster
}