const { MongoClient, MongoDB } = require('mongodb')

// export const MONGODB_URI = process.env.MONGODB_URI; // retrieves connection string uri from environment variables 😁
// export const mongoClient = new MongoClient(MONGODB_URI); // stores our mongoClient as the name very heavily implies 😏

// console.log(process.env.MONGODB_URI);
// const MONGODB_URI = process.env.MONGODB_URI;
// const mongoClient = new MongoClient(MONGODB_URI);

module.exports = {
    fetchTest: async (m_client) => {
        try {
            await m_client.connect();

            await listDatabases(m_client);
        } catch (e) {
            console.log(e);
        }

    },
}

async function listDatabases(client) {
    console.log("Attempting to list database on client...");
    // console.log(client);
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
