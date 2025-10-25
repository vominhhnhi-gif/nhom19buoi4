#!/usr/bin/env node
/**
 * Simple seed script to create sample users with roles:
 * - admin (admin@example.com)
 * - moderator (mod@example.com)
 * - user (user@example.com)
 *
 * Usage: node scripts/seedUsers.js  (ensure BACKEND/.env has MONGODB_URI set)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/testdb';

async function seed() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding');

  const users = [
    { name: 'Admin User', email: 'admin@example.com', password: 'AdminPass123', role: 'admin' },
    { name: 'Moderator User', email: 'mod@example.com', password: 'ModPass123', role: 'moderator' },
    { name: 'Normal User', email: 'user@example.com', password: 'UserPass123', role: 'user' }
  ];

  for (const u of users) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      console.log(`Skipped (exists): ${u.email} (${existing.role})`);
      continue;
    }
    const hash = await bcrypt.hash(u.password, 10);
    const user = new User({ name: u.name, email: u.email, password: hash, role: u.role });
    await user.save();
    console.log(`Created: ${u.email} (${u.role})`);
  }

  console.log('Seeding complete');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
