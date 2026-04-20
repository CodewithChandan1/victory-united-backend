const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/victory-united');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      email: process.env.ADMIN_EMAIL || 'admin@victoryunited.com' 
    });

    if (existingAdmin) {
      console.log('❌ Admin already exists with this email');
      process.exit(1);
    }

    // Create new admin
    const admin = new Admin({
      email: process.env.ADMIN_EMAIL || 'admin@victoryunited.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      name: 'Victory United Admin',
      role: 'super-admin'
    });

    await admin.save();
    console.log('✅ Admin created successfully');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('⚠️  Please change the password after first login');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();