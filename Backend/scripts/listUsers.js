// Simple script to list users from MongoDB
// Usage: node Backend/scripts/listUsers.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!uri) {
  console.error('No MONGODB_URI / MONGO_URI found in environment. Please set it in .env or export env var.');
  process.exit(2);
}

(async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const users = await User.find().lean();
    if (!users.length) {
      console.log('No users found in the database.');
    } else {
      console.log(`Found ${users.length} users:`);
      users.forEach(u => {
        console.log({
          id: u._id.toString(),
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt
        });
      });
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
})();