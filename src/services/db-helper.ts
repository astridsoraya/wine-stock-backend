import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: {
    wine?: mongoDB.Collection
    category?: mongoDB.Collection,
    user?: mongoDB.Collection,
} = {};

export async function connectToDB() {
    dotenv.config();
    const connString = process.env.DB_CONN_STRING;
    const dbName = process.env.DB_NAME;
    const wineCollect = process.env.WINES_COLLECTION_NAME;
    const categoriesCollect = process.env.CATEGORY_COLLECTION_NAME;
    const userCollect = process.env.USER_COLLECTION_NAME;

    if (connString !== undefined && dbName !== undefined
        && wineCollect !== undefined && categoriesCollect !== undefined && userCollect !== undefined) {
        const client = new mongoDB.MongoClient(connString);
        await client.connect();
        
        const db = client.db(dbName);
        const wineCollection = db.collection(wineCollect);
        const categoriesCollection = db.collection(categoriesCollect);
        const userCollection = db.collection(userCollect);
        collections.wine = wineCollection;
        collections.category = categoriesCollection;
        collections.user = userCollection;

        console.log(`Successfully connected to database: ${db.databaseName} 
        and collection: ${wineCollection.collectionName}`);
    }
}