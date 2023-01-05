const { MongoDB } = require('mongodb')
const { dotenv } = require('dotenv');

// export const MONGODB_URI = process.env.MONGODB_URI; // retrieves connection string uri from environment variables 😁
// export const mongoClient = new MongoClient(MONGODB_URI); // stores our mongoClient as the name very heavily implies 😏


module.exports = {
    MONGODB_URI: process.env.MONGODB_URI,
    mongoClient: new MongoClient(MONGODB_URI),
    fetchTest: async () => {
        console.log("test");               
        await listDatabases(mongoClient);

        try {
            await mongoClient.connect();

            await listDatabases(mongoClient);
        } catch(e) {
            console.log(e);
        }

    },
}