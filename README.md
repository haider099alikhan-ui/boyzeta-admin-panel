# 🚀 BoyZeta Admin Panel

A comprehensive, production-ready admin panel for managing companies, barcodes, boycott status, and alternatives with country-specific features and multi-admin support.

## ✨ Features

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

### 📊 **Analytics Dashboard**
- **Real-time statistics** for companies, boycotts, and barcodes
- **Country-based filtering** for localized insights
- **Boycott percentage visualization** with progress bars
- **Upload metrics** and recent activity tracking
- **Performance indicators** for admin decision-making

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

### **Frontend (React + TypeScript + Tailwind CSS)**
```
frontend/src/
├── components/      # Reusable UI components
├── contexts/        # React Context for state management
├── pages/          # Main application pages
├── services/       # API client and data fetching
├── types/          # TypeScript type definitions
└── utils/          # Utility functions and constants
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB database
- Modern web browser

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd boyzeta-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   cd ..
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

5. **Start development servers**
   ```bash
   npm run dev:full
   ```

### **Default Super Admin Credentials**
- **Email**: `admin@boyzeta.com`
- **Password**: `SuperAdmin123!`
- **⚠️ Change password after first login!**

## 📱 **Usage Guide**

### **Adding a Company**
1. Navigate to "Add Company"
2. Fill in company details:
   - **Name**: Company/brand name
   - **Boycott Status**: true/false
   - **Reason**: Why company is boycotted (if applicable)
   - **Country**: Company's primary market
   - **Alternatives**: Country-specific alternatives with descriptions
   - **Barcodes**: 8-14 digit product codes
   - **Proof URLs**: Links to supporting articles

### **Bulk Upload**
1. Prepare CSV file with headers:
   ```
   name,boycott,reason,country,alternatives,barcodes,proofurls
   ```
2. **Alternatives format**: `"Name:CountryCode:Description;Name2:CountryCode2:Description2"`
3. Upload via "Bulk Upload" page
4. Review validation results and conflicts
5. Confirm import

### **Country-Specific Alternatives**
- **Format**: `AlternativeName:CountryCode:Description`
- **Examples**:
  - `"Dr Pepper:IN:Organic alternative"`
  - `"Local Brand:PK:Regional option"`
  - `"Generic Brand:GLOBAL:Universal alternative"`
- **Fallback**: If no country-specific alternative exists, GLOBAL alternatives are shown

### **User Management**
1. **Super Admin** can create new admin accounts
2. **Assign roles** based on responsibilities:
   - **Super Admin**: Full access, user management
   - **Admin**: Company management, bulk uploads
   - **Moderator**: View companies, limited editing

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

### **Analytics**
- `GET /api/companies` - Raw data for analytics
- **Frontend processing** for real-time statistics

## 🛡️ **Security Features**

- **JWT authentication** with secure token storage
- **Password hashing** with bcrypt (salt rounds: 12)
- **Role-based access control** (RBAC)
- **Permission-based feature access**
- **Input validation** and sanitization
- **Rate limiting** to prevent abuse
- **CORS configuration** for secure cross-origin requests

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

## 🎨 **UI/UX Features**

- **Responsive design** for all device sizes
- **Modern Tailwind CSS** styling
- **Toast notifications** for user feedback
- **Loading states** and progress indicators
- **Error handling** with helpful messages
- **Search and filtering** capabilities
- **Pagination** for large datasets
- **Real-time updates** and live data

## 🚀 **Deployment**

### **Production Build**
```bash
# Build frontend
npm run build:frontend

# Start production server
npm start
```

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
