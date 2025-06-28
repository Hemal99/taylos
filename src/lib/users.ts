import { connectToDatabase } from './mongodb';
import { type User } from './types';
import * as data from './data';
import bcrypt from 'bcryptjs';
import { ObjectId, WithId } from 'mongodb';

function mapMongoId<T>(doc: WithId<T>): T & { id: string } {
    const { _id, ...rest } = doc;
    return { id: _id.toHexString(), ...rest } as T & { id: string };
}

export async function createAdminUserIfNeeded() {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    const { db } = await connectToDatabase();
    
    if (!db) {
        // In-memory mode
        const existingUser = data.users.find(u => u.email === adminEmail);
        if (!existingUser) {
            console.log('Creating in-memory admin user...');
            const passwordHash = await bcrypt.hash(adminPassword, 10);
            const newUser: User = {
                id: new Date().getTime().toString(),
                email: adminEmail,
                passwordHash,
            };
            data.users.push(newUser);
        }
        return;
    }
    
    // MongoDB mode
    const usersCollection = db.collection<User>('users');
    const existingUser = await usersCollection.findOne({ email: adminEmail });

    if (!existingUser) {
        console.log('Creating database admin user...');
        const passwordHash = await bcrypt.hash(adminPassword, 10);
        const newUser: Omit<User, 'id'> = {
            email: adminEmail,
            passwordHash,
        };
        await usersCollection.insertOne(newUser as User);
        console.log('Admin user created successfully.');
    }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
    const { db } = await connectToDatabase();

    if (!db) {
        // In-memory mode
        return data.users.find(u => u.email === email);
    }
    
    // MongoDB mode
    const usersCollection = db.collection<User>('users');
    const user = await usersCollection.findOne({ email });

    return user ? mapMongoId(user) : undefined;
}
