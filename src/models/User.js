const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  permissions: {
    canCreateCompanies: { type: Boolean, default: true },
    canEditCompanies: { type: Boolean, default: true },
    canDeleteCompanies: { type: Boolean, default: false },
    canBulkUpload: { type: Boolean, default: true },
    canManageUsers: { type: Boolean, default: false },
    canViewAnalytics: { type: Boolean, default: true }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check permission method
userSchema.methods.hasPermission = function(permission) {
  if (this.role === 'super_admin') return true;
  return this.permissions[permission] || false;
};

// Set default permissions based on role
userSchema.pre('save', function(next) {
  if (this.role === 'super_admin') {
    this.permissions = {
      canCreateCompanies: true,
      canEditCompanies: true,
      canDeleteCompanies: true,
      canBulkUpload: true,
      canManageUsers: true,
      canViewAnalytics: true
    };
  } else if (this.role === 'admin') {
    this.permissions = {
      canCreateCompanies: true,
      canEditCompanies: true,
      canDeleteCompanies: false,
      canBulkUpload: true,
      canManageUsers: false,
      canViewAnalytics: true
    };
  } else if (this.role === 'moderator') {
    this.permissions = {
      canCreateCompanies: true,
      canEditCompanies: true,
      canDeleteCompanies: false,
      canBulkUpload: false,
      canManageUsers: false,
      canViewAnalytics: false
    };
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
