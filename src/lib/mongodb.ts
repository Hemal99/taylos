import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

if (!MONGODB_URI) {
    console.warn('Please define the MONGODB_URI environment variable inside .env');
}
if (!MONGODB_DB_NAME) {
    console.warn('Please define the MONGODB_DB_NAME environment variable inside .env');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { db: cachedDb };
  }
  
  if (!MONGODB_URI || !MONGODB_DB_NAME) {
      throw new Error('Missing MongoDB environment variables. Please add MONGODB_URI and MONGODB_DB_NAME to your .env file.');
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { db };
}
