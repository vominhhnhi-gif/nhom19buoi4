// Seed script: insert sample users (admin, moderator, user)
// Usage: set MONGODB_URI env var or create Backend/.env then run: node Backend/seeds/seedUsers.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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

    const existing = await User.find().lean();
    if (existing.length) {
      console.log('Users already exist in DB. Aborting seed to avoid duplicates.');
      existing.forEach(u => console.log({ email: u.email, role: u.role }));
      process.exit(0);
    }

    const users = [
      { name: 'Admin User', email: 'admin@example.test', password: 'password123', role: 'admin' },
      { name: 'Moderator User', email: 'mod@example.test', password: 'password123', role: 'moderator' },
      { name: 'Normal User', email: 'user@example.test', password: 'password123', role: 'user' }
    ];

    for (const u of users) {
      const hash = await bcrypt.hash(u.password, 10);
      const doc = new User({ name: u.name, email: u.email, password: hash, role: u.role });
      await doc.save();
      console.log('Created user:', u.email, u.role);
    }

    await mongoose.disconnect();
    console.log('Seeding completed');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message || err);
    process.exit(1);
  }
})();