import { MongoClient, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ db: Db | null }> {
  if (cachedClient && cachedDb) {
    return { db: cachedDb };
  }
  
  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

  if (!MONGODB_URI || !MONGODB_DB_NAME) {
      console.warn('MongoDB environment variables not set. Falling back to in-memory data.');
      return { db: null };
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);

    cachedClient = client;
    cachedDb = db;
    
    console.log("Successfully connected to MongoDB.");
    return { db };

  } catch (error) {
    console.warn("Failed to connect to MongoDB. Falling back to in-memory data. Please check your MONGODB_URI.");
    cachedClient = null;
    cachedDb = null;
    return { db: null };
  }
}
