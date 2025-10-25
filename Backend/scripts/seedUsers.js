#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rbac_demo';

async function seed() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding');

  const users = [
    { name: 'Admin User', email: 'admin@example.com', password: 'Admin123!', role: 'admin' },
    { name: 'Moderator User', email: 'mod@example.com', password: 'Mod12345', role: 'moderator' },
    { name: 'Regular User', email: 'user@example.com', password: 'User12345', role: 'user' }
  ];

  for (const u of users) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      console.log(`Skipping existing: ${u.email}`);
      continue;
    }
    const hash = await bcrypt.hash(u.password, 10);
    const created = new User({ name: u.name, email: u.email, password: hash, role: u.role });
    await created.save();
    console.log(`Created ${u.email} (${u.role})`);
  }

  console.log('Seeding finished');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed failed', err);
  process.exit(1);
});
