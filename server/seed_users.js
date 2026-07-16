import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import { User } from './src/models/User.model.js';
import mongoose from 'mongoose';

dotenv.config({ path: '../.env' });

const users = [
    // Volunteers
    { name: 'Alice Johnson', email: 'alice.v@example.com', password: 'Password123!', role: 'volunteer' },
    { name: 'Bob Smith', email: 'bob.v@example.com', password: 'Password123!', role: 'volunteer' },
    { name: 'Charlie Davis', email: 'charlie.v@example.com', password: 'Password123!', role: 'volunteer' },
    
    // NGOs
    { name: 'Green Earth Initiative', email: 'contact@greenearth.org', password: 'Password123!', role: 'ngo' },
    { name: 'Hope Foundation', email: 'info@hopefoundation.org', password: 'Password123!', role: 'ngo' },
    { name: 'EduCare Trust', email: 'hello@educaretrust.org', password: 'Password123!', role: 'ngo' },
    
    // Sponsors
    { name: 'TechCorp Inc', email: 'csr@techcorp.com', password: 'Password123!', role: 'sponsor' },
    { name: 'Global Ventures', email: 'giving@globalventures.com', password: 'Password123!', role: 'sponsor' },
    { name: 'Philanthropy Partners', email: 'sponsor@philanthropypartners.com', password: 'Password123!', role: 'sponsor' }
];

const seedUsers = async () => {
    try {
        await connectDB();
        
        // Remove existing users with these emails to avoid unique index errors
        const emails = users.map(u => u.email);
        await User.deleteMany({ email: { $in: emails } });

        for (const userData of users) {
            await User.create(userData);
            console.log(`Created user: ${userData.name} (${userData.role})`);
        }
        
        console.log('Successfully seeded 9 users.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
