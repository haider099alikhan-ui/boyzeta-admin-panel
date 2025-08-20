const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://haider099alikhan:KwCv78HaZh13c81p@cluster0.ylsuqzx.mongodb.net/boyzeta?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
    
    if (existingSuperAdmin) {
      console.log('⚠️  Super admin already exists:', existingSuperAdmin.email);
      process.exit(0);
    }

    // Create super admin user
    const superAdmin = new User({
      username: 'superadmin',
      email: 'admin@boyzeta.com',
      password: 'SuperAdmin123!',
      role: 'super_admin'
    });

    await superAdmin.save();
    
    console.log('✅ Super admin created successfully!');
    console.log('📧 Email:', superAdmin.email);
    console.log('👤 Username:', superAdmin.username);
    console.log('🔑 Password: SuperAdmin123!');
    console.log('⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    process.exit(1);
  }
};

createSuperAdmin();
