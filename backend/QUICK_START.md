# Quick Start Guide

## 🚀 Deploy to Vercel in 5 Minutes

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
cd backend
vercel
```

### 4. Set Environment Variables
In your Vercel dashboard, add these environment variables:

```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
ADMIN_EMAIL=admin@rajac.edu
ADMIN_PASSWORD=admin123
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### 5. Deploy to Production
```bash
vercel --prod
```

## 🔧 Local Development

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set Environment
```bash
cp env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test API
```bash
node test-api.js
```

## 📋 Default Admin Account

- **Email**: `admin@rajac.edu`
- **Password**: `admin123`

⚠️ **Important**: Change the password immediately after first login!

## 🔗 API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/profile` - Get profile
- `POST /api/admissions/submit` - Submit application
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/applications` - List applications

## 🗄️ Database

**Development**: SQLite file-based database
**Production**: In-memory (resets on cold start)

For production persistence, consider:
- Vercel Postgres
- Supabase
- PlanetScale

## 📁 File Uploads

**Development**: Local file system
**Production**: Use cloud storage (AWS S3, Cloudinary, etc.)

## 🛡️ Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Rate Limiting
- CORS Protection
- Input Validation
- SQL Injection Protection

## 📞 Support

If you encounter issues:
1. Check the logs in Vercel dashboard
2. Verify environment variables
3. Test locally first
4. Check the full README.md for detailed instructions
