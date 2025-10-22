const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/User');

async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in .env. Aborting.');
    process.exit(1);
  }
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');
}

async function seed() {
  try {
    await connect();

    const users = [
      { name: 'Admin User', email: 'admin@example.com', password: 'AdminPass123!', role: 'admin' },
      { name: 'Alice Example', email: 'alice@example.com', password: 'Password1', role: 'user' },
      { name: 'Bob Example', email: 'bob@example.com', password: 'Password1', role: 'user' }
    ];

    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`Skipping existing user: ${u.email}`);
        continue;
      }

      const hash = await bcrypt.hash(u.password, 10);
      const doc = new User({ name: u.name, email: u.email, password: hash, role: u.role });
      await doc.save();
      console.log(`Created user: ${u.email} (${u.role})`);
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
