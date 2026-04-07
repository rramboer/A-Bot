export async function fetchTest(m_client: any) {
    try {
        await m_client.connect();
        await listDatabases(m_client);
    } catch (e) {
        console.log(e);
    }
}

async function listDatabases(client: any) {
    console.log("Attempting to list database on client...");
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach((db: any) => console.log(` - ${db.name}`));
}
