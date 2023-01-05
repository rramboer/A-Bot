const { MongoClient, MongoDB } = require('mongodb')
const { dotenv } = require('dotenv');

// export const MONGODB_URI = process.env.MONGODB_URI; // retrieves connection string uri from environment variables 😁
// export const mongoClient = new MongoClient(MONGODB_URI); // stores our mongoClient as the name very heavily implies 😏

const MONGODB_URI = process.env.MONGODB_URI;
const mongoClient = new MongoClient(MONGODB_URI);

module.exports = {
    MONGODB_URI: MONGODB_URI,
    mongoClient: mongoClient,
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

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
 