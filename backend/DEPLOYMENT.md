# Deployment Guide

## Vercel Deployment

### 1. Prerequisites
- Vercel account
- Vercel CLI installed (`npm i -g vercel`)
- Git repository

### 2. Environment Variables
Set these in your Vercel project settings:

```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
ADMIN_EMAIL=admin@rajac.edu
ADMIN_PASSWORD=admin123
ALLOWED_ORIGINS=https://your-frontend-domain.com
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
BCRYPT_ROUNDS=12
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production
vercel --prod
```

### 4. Database Considerations

**Important**: Vercel uses serverless functions, which means:
- Each function instance has its own memory space
- SQLite database will be in-memory and reset on each cold start
- For production, consider using:
  - Vercel Postgres
  - Supabase
  - PlanetScale
  - Any cloud database service

### 5. File Upload Considerations

For file uploads in production:
- Vercel has a 4.5MB payload limit
- Use cloud storage like:
  - AWS S3
  - Cloudinary
  - Vercel Blob Storage
  - Supabase Storage

## Alternative Deployment Options

### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Render
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Heroku
```bash
# Install Heroku CLI
# Create app and deploy
heroku create your-app-name
git push heroku main
```

## Environment Variables for Production

### Required Variables
- `JWT_SECRET` - Strong secret key for JWT tokens
- `ADMIN_EMAIL` - Admin email address
- `ADMIN_PASSWORD` - Admin password (change after first login)

### Optional Variables
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins
- `RATE_LIMIT_WINDOW` - Rate limiting window in minutes (default: 15)
- `RATE_LIMIT_MAX` - Maximum requests per window (default: 100)
- `BCRYPT_ROUNDS` - Password hashing rounds (default: 12)

## Security Checklist

- [ ] Change default admin password
- [ ] Set strong JWT secret
- [ ] Configure CORS origins
- [ ] Set up HTTPS (automatic with Vercel)
- [ ] Configure rate limiting
- [ ] Set up monitoring/logging
- [ ] Regular security updates

## API Endpoints

After deployment, your API will be available at:
- `https://your-app.vercel.app/api/health` - Health check
- `https://your-app.vercel.app/api/auth/*` - Authentication
- `https://your-app.vercel.app/api/admissions/*` - Admissions
- `https://your-app.vercel.app/api/admin/*` - Admin functions
- `https://your-app.vercel.app/api/uploads/*` - File uploads

## Testing Deployment

```bash
# Test health endpoint
curl https://your-app.vercel.app/api/health

# Test admin login
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rajac.edu","password":"admin123"}'
```

## Troubleshooting

### Common Issues

1. **Database not persisting**: Use cloud database instead of SQLite
2. **File uploads failing**: Use cloud storage service
3. **CORS errors**: Check ALLOWED_ORIGINS configuration
4. **Rate limiting**: Adjust RATE_LIMIT settings
5. **JWT errors**: Verify JWT_SECRET is set correctly

### Logs
- Vercel: Check function logs in dashboard
- Railway: `railway logs`
- Render: Check deployment logs
- Heroku: `heroku logs --tail`
