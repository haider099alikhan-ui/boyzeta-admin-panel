# BoyZeta Admin System Setup Guide

## 🚀 Complete Setup Instructions

This guide will help you set up the enhanced BoyZeta Admin System with multi-admin accounts, role-based permissions, and secure authentication.

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or cloud)
- Git

## 🔧 Step 1: Environment Configuration

1. **Create environment file:**
   ```bash
   cp env.example .env
   ```

2. **Edit `.env` file:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/boyzeta
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=30d
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Update MongoDB URI** to point to your MongoDB instance

## 🗄️ Step 2: Database Setup

1. **Start MongoDB** (if using local instance):
   ```bash
   mongod
   ```

2. **Create the first super admin user:**
   ```bash
   npm run setup:admin
   ```

   This will create:
   - **Email**: admin@boyzeta.com
   - **Username**: superadmin
   - **Password**: SuperAdmin123!
   - **Role**: super_admin

## 📦 Step 3: Install Dependencies

1. **Backend dependencies:**
   ```bash
   npm install
   ```

2. **Frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

## 🚀 Step 4: Start the System

### Option A: Start Both Servers (Recommended)
```bash
npm run dev:full
```

### Option B: Start Separately
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## 🌐 Step 5: Access the System

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Login with**: admin@boyzeta.com / SuperAdmin123!

## 👥 Step 6: Create Additional Admin Accounts

1. **Login as super admin**
2. **Navigate to User Management** (super admin only)
3. **Create new users** with different roles:

### Available Roles:

#### 🟣 **Super Admin**
- Full system access
- Can manage all users
- All permissions enabled

#### 🔵 **Admin**
- Can create/edit companies
- Can bulk upload
- Cannot delete companies
- Cannot manage users

#### 🟢 **Moderator**
- Can create/edit companies
- Cannot bulk upload
- Cannot delete companies
- Cannot manage users

## 🔐 Authentication & Security

### JWT Tokens
- Tokens expire after 30 days (configurable)
- Automatic token refresh
- Secure password hashing with bcrypt

### Permission System
- **canCreateCompanies**: Add new companies
- **canEditCompanies**: Modify existing companies
- **canDeleteCompanies**: Remove companies
- **canBulkUpload**: Import CSV files
- **canManageUsers**: Create/edit/delete users
- **canViewAnalytics**: View system statistics

## 📊 Features Overview

### 🏢 Company Management
- ✅ Add companies with multiple barcodes
- ✅ Search by company name or barcode
- ✅ Edit existing companies
- ✅ Delete companies (with permissions)
- ✅ Duplicate barcode prevention

### 📁 Bulk Upload
- ✅ CSV import with validation
- ✅ Smart merging (add barcodes to existing companies)
- ✅ Detailed error reporting
- ✅ Barcode conflict detection

### 👥 User Management
- ✅ Multi-admin accounts
- ✅ Role-based permissions
- ✅ Secure authentication
- ✅ User activity tracking

### 🔍 Search & Filter
- ✅ Real-time search
- ✅ Pagination
- ✅ Barcode lookup
- ✅ Company status filtering

## 🧪 Testing the System

### 1. **Login Test**
- Use admin@boyzeta.com / SuperAdmin123!
- Verify JWT token is stored
- Check user permissions display

### 2. **Company Operations**
- Create a new company
- Add multiple barcodes
- Search by company name
- Search by barcode
- Edit company details

### 3. **Bulk Upload Test**
- Download sample CSV
- Upload with valid data
- Test duplicate barcode handling
- Verify error reporting

### 4. **Permission Testing**
- Create different user roles
- Test permission restrictions
- Verify role-based navigation

## 🐛 Troubleshooting

### Common Issues:

#### **MongoDB Connection Failed**
```bash
# Check MongoDB status
mongosh --eval "db.runCommand('ping')"

# Verify connection string in .env
MONGODB_URI=mongodb://localhost:27017/boyzeta
```

#### **Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

#### **JWT Token Issues**
```bash
# Clear browser storage
# Check JWT_SECRET in .env
# Restart both servers
```

#### **Permission Denied Errors**
- Verify user role and permissions
- Check if user account is active
- Ensure proper JWT token

## 📈 Production Deployment

### Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/boyzeta
JWT_SECRET=very-long-random-secret-key
JWT_EXPIRE=7d
```

### Security Considerations
- Use strong JWT secrets
- Enable HTTPS
- Set up proper CORS
- Implement rate limiting
- Regular security updates

## 🔄 Updates & Maintenance

### Adding New Features
1. Update backend models/routes
2. Add frontend components
3. Update permission system
4. Test thoroughly
5. Deploy incrementally

### User Management
- Regular permission reviews
- Account deactivation for inactive users
- Audit logs for sensitive operations
- Password policy enforcement

## 📞 Support

For issues or questions:
1. Check the logs in both terminals
2. Verify environment configuration
3. Test database connectivity
4. Review permission settings
5. Check browser console for errors

## 🎯 Next Steps

After successful setup:
1. **Customize company fields** as needed
2. **Set up monitoring** and logging
3. **Configure backup** strategies
4. **Train team members** on the system
5. **Plan scaling** for growth

---

**🎉 Congratulations!** Your BoyZeta Admin System is now ready with enterprise-grade features including multi-admin accounts, role-based permissions, and secure authentication.
