import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: {
    wine?: mongoDB.Collection
} = {};

export async function connectToDB() {
    dotenv.config();
    const connString = process.env.DB_CONN_STRING;
    const dbName = process.env.DB_NAME;
    const wineCollect = process.env.WINES_COLLECTION_NAME;

    if (connString !== undefined && dbName !== undefined
        && wineCollect !== undefined) {
        const client = new mongoDB.MongoClient(connString);
        await client.connect();
        
        const db = client.db(dbName);
        const wineCollection = db.collection(wineCollect);
        collections.wine = wineCollection;

        console.log(`Successfully connected to database: ${db.databaseName} 
        and collection: ${wineCollection.collectionName}`);
    }
}