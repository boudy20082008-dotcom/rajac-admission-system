# Rajac Admission Backend API

A complete Node.js/Express backend for the Rajac Admission System with SQLite database, JWT authentication, and file upload capabilities.

## Features

- 🔐 **JWT Authentication** - Secure login/register system
- 📝 **Admission Management** - Complete CRUD operations for applications
- 👨‍💼 **Admin Dashboard** - Full admin interface with statistics
- 📁 **File Upload** - Document upload with validation
- 🗄️ **SQLite Database** - Lightweight, file-based database
- 🔒 **Security** - Rate limiting, CORS, input validation
- 📊 **Statistics** - Dashboard with application analytics
- 📤 **Export** - CSV export functionality

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_PATH=./database/admission.db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Admin Configuration
ADMIN_EMAIL=admin@rajac.edu
ADMIN_PASSWORD=admin123
```

### 3. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Admissions

- `POST /api/admissions/submit` - Submit admission application
- `GET /api/admissions/my-applications` - Get user's applications
- `GET /api/admissions/:applicationId` - Get specific application
- `PUT /api/admissions/:applicationId` - Update application
- `DELETE /api/admissions/:applicationId` - Delete application
- `GET /api/admissions/:applicationId/status` - Get application status

### Admin

- `GET /api/admin/applications` - Get all applications (with filters)
- `GET /api/admin/applications/:applicationId` - Get specific application
- `PUT /api/admin/applications/:applicationId/status` - Update application status
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/export` - Export applications (JSON/CSV)
- `GET /api/admin/logs` - Get admin activity logs
- `POST /api/admin/users` - Create new user

### File Upload

- `POST /api/uploads/single` - Upload single file
- `POST /api/uploads/multiple` - Upload multiple files
- `POST /api/uploads/documents` - Upload specific document types
- `DELETE /api/uploads/:filename` - Delete file
- `GET /api/uploads/:filename` - Get file info

## Database Schema

### Users Table
- `id` - Primary key
- `email` - User email (unique)
- `password` - Hashed password
- `role` - User role (user/admin)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Admissions Table
- `id` - Primary key
- `application_id` - Unique application identifier
- `student_name` - Student's full name
- `student_email` - Student's email
- `student_phone` - Student's phone number
- `student_dob` - Date of birth
- `student_gender` - Gender
- `parent_name` - Parent's name
- `parent_email` - Parent's email
- `parent_phone` - Parent's phone
- `address` - Address
- `city` - City
- `country` - Country
- `nationality` - Nationality
- `previous_school` - Previous school
- `grade_level` - Grade level
- `academic_year` - Academic year
- `documents` - JSON string of document paths
- `status` - Application status (pending/approved/rejected/waitlisted)
- `payment_status` - Payment status
- `payment_id` - Payment reference
- `notes` - Admin notes
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Payments Table
- `id` - Primary key
- `admission_id` - Foreign key to admissions
- `payment_id` - Unique payment identifier
- `amount` - Payment amount
- `currency` - Currency (default: SAR)
- `status` - Payment status
- `payment_method` - Payment method
- `transaction_data` - JSON string of transaction details
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Admin Logs Table
- `id` - Primary key
- `admin_id` - Foreign key to users
- `action` - Action performed
- `details` - Action details
- `ip_address` - IP address
- `created_at` - Creation timestamp

## Default Admin Account

The system creates a default admin account on first run:

- **Email**: `admin@rajac.edu` (configurable via `ADMIN_EMAIL`)
- **Password**: `admin123` (configurable via `ADMIN_PASSWORD`)

⚠️ **Important**: Change the default password immediately after first login!

## File Upload

The system supports various file types:
- Images: JPG, JPEG, PNG, GIF
- Documents: PDF, DOC, DOCX, TXT
- Maximum file size: 5MB (configurable)
- Maximum files per request: 10

Files are stored in organized directories:
- `/uploads/documents/` - General documents
- `/uploads/birthCertificate/` - Birth certificates
- `/uploads/passport/` - Passport copies
- `/uploads/previousReport/` - Previous school reports
- `/uploads/medicalReport/` - Medical reports
- `/uploads/otherDocuments/` - Other documents

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt with configurable rounds
- **Rate Limiting** - Prevents abuse
- **CORS Protection** - Configurable allowed origins
- **Input Validation** - Express-validator for all inputs
- **File Type Validation** - Whitelist of allowed file types
- **SQL Injection Protection** - Parameterized queries

## Development

### Project Structure

```
backend/
├── database/
│   └── init.js          # Database initialization
├── middleware/
│   └── auth.js          # Authentication middleware
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── admissions.js    # Admission routes
│   ├── admin.js         # Admin routes
│   └── uploads.js       # File upload routes
├── uploads/             # File storage directory
├── server.js            # Main server file
├── package.json         # Dependencies
├── env.example          # Environment variables example
└── README.md           # This file
```

### Adding New Features

1. **New Routes**: Add route files in the `routes/` directory
2. **New Middleware**: Add middleware files in the `middleware/` directory
3. **Database Changes**: Modify `database/init.js` for schema changes
4. **Environment Variables**: Add new variables to `env.example`

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Production Deployment

### Environment Variables

Set these for production:

```env
NODE_ENV=production
JWT_SECRET=your-very-secure-jwt-secret
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-secure-admin-password
ALLOWED_ORIGINS=https://yourdomain.com
```

### Security Checklist

- [ ] Change default admin password
- [ ] Set strong JWT secret
- [ ] Configure CORS origins
- [ ] Set up HTTPS
- [ ] Configure proper file permissions
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring

## Support

For issues and questions:
1. Check the logs in the console
2. Verify environment variables
3. Check database file permissions
4. Ensure all dependencies are installed

## License

MIT License - see LICENSE file for details
