import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const updateExistingUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all existing users to have last_login set to their created_at date
    // This makes them "returning users" by default
    const result = await User.updateMany(
      { last_login: { $exists: false } }, // Users without last_login field
      { $set: { last_login: new Date() } } // Set to current date
    );

    console.log(`✅ Updated ${result.modifiedCount} existing users`);
    console.log('All existing users will now be treated as returning users');
    
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error updating users:', error);
    process.exit(1);
  }
};

updateExistingUsers();
