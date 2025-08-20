# BoyZeta Admin Panel Backend

A production-ready Node.js backend API for managing boycott information, companies, barcodes, and alternatives with country-specific features and multi-admin support.

## 🚀 Features

### 🔐 **Authentication & Authorization**
- **JWT-based authentication** with secure token management
- **Multi-admin user system** with role-based permissions
- **Three user roles**: Super Admin, Admin, Moderator
- **Permission-based access control** for all features
- **Secure password hashing** with bcrypt

### 🏢 **Company Management**
- **Add/Edit/Delete companies** with full CRUD operations
- **Multiple barcodes per company** with validation
- **Boycott status tracking** with reasons and proof URLs
- **Country-specific alternatives** with GLOBAL fallback
- **Duplicate barcode prevention** across all companies
- **Advanced search** by name, barcode, reason, or boycott status

### 🌍 **Country-Specific Features**
- **200+ countries supported** with ISO country codes
- **Country-specific alternatives** for targeted recommendations
- **GLOBAL alternatives** as fallback when country-specific ones don't exist
- **Country filtering** in analytics and company views
- **Smart alternative resolution** based on user's location

### 📊 **Analytics & Data**
- **Real-time statistics** for companies, boycotts, and barcodes
- **Country-based filtering** for localized insights
- **Performance indicators** for admin decision-making
- **Data aggregation** and reporting endpoints

### 📤 **Bulk Upload System**
- **CSV import** with comprehensive validation
- **Smart merging** - adds new barcodes to existing companies
- **Error handling** with detailed feedback
- **Barcode conflict detection** before processing
- **Country-specific alternative parsing** from CSV
- **Progress tracking** and success/failure reporting

### 👥 **User Management**
- **Create new admin accounts** (Super Admin only)
- **Role assignment** and permission management
- **User status tracking** (active/inactive)
- **Last login monitoring** for security
- **Permission-based feature access**

## 🏗️ **Architecture**

### **Backend (Node.js + Express + MongoDB)**
```
src/
├── config/          # Database and environment configuration
├── middlewares/     # Authentication, authorization, validation
├── models/          # Mongoose schemas (User, Product/Company)
├── routes/          # RESTful API endpoints
├── utils/           # Helper functions and utilities
└── index.js         # Main server file
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB database
- Modern web browser

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/haider099alikhan-ui/boyzeta-backend.git
   cd boyzeta-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

4. **Create super admin**
   ```bash
   npm run setup:admin
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### **Default Super Admin Credentials**
- **Email**: `admin@boyzeta.com`
- **Password**: `SuperAdmin123!`
- **⚠️ Change password after first login!**

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Create new admin (Super Admin only)
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/users` - List all users (Super Admin only)

### **Companies**
- `GET /api/companies` - List companies with search/pagination
- `POST /api/companies` - Create new company
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company
- `GET /api/companies/barcode/:barcode` - Find by barcode

### **Bulk Upload**
- `POST /api/bulk-upload` - Upload CSV data
- **Features**: Validation, conflict detection, smart merging

### **Health & Info**
- `GET /health` - Server health check
- `GET /api` - API information and endpoints

## 🛡️ **Security Features**

- **JWT authentication** with secure token storage
- **Password hashing** with bcrypt (salt rounds: 12)
- **Role-based access control** (RBAC)
- **Permission-based feature access**
- **Input validation** and sanitization
- **Rate limiting** to prevent abuse
- **CORS configuration** for secure cross-origin requests
- **Trust proxy** configuration for Vercel deployment

## 📊 **Database Schema**

### **User Model**
```javascript
{
  username: String,        // Unique username
  email: String,           // Unique email
  password: String,        // Hashed password
  role: String,            // super_admin, admin, moderator
  permissions: Object,     // Feature-specific permissions
  isActive: Boolean,       // Account status
  lastLogin: Date,         // Last login timestamp
  createdBy: ObjectId      // Who created this user
}
```

### **Company Model**
```javascript
{
  name: String,            // Company name
  boycott: Boolean,        // Boycott status
  reason: String,          // Boycott reason
  country: String,         // Primary market country
  alternatives: [{         // Country-specific alternatives
    name: String,          // Alternative name
    countryCode: String,   // Country code or GLOBAL
    description: String    // Alternative description
  }],
  barcodes: [String],      // Product barcodes
  proofUrls: [String],     // Supporting URLs
  lastUpdated: Date,       // Last modification
  createdAt: Date,         // Creation timestamp
  updatedAt: Date          // Update timestamp
}
```

## 🚀 **Deployment**

### **Vercel (Recommended)**

1. Connect your GitHub repository to Vercel
2. Set build command: `npm start`
3. Set output directory: `src`
4. Configure environment variables
5. Deploy!

### **Environment Variables**
```bash
NODE_ENV=production
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### **Docker Support**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔗 **Frontend Integration**

This backend is designed to work with the **BoyZeta Frontend** repository:
- **Repository**: `boyzeta-frontend`
- **Tech Stack**: React + TypeScript + Tailwind CSS
- **API Integration**: RESTful endpoints with JWT authentication

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the BoyZeta community**
