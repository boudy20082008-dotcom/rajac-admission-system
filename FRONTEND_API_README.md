# Frontend API Integration Guide

## 🚀 Migration from Supabase to Vercel Backend

This guide explains how to update your frontend to use the new Vercel backend instead of Supabase.

## 📋 What's New

### ✅ **New API Client**
- **Location**: `src/lib/api.ts`
- **Features**: Complete REST API client for all backend endpoints
- **Authentication**: JWT-based with automatic token management
- **Error Handling**: Comprehensive error handling and loading states

### ✅ **React Hooks**
- **Location**: `src/hooks/useApi.ts`
- **Features**: Pre-built hooks for all API operations
- **States**: Loading, error, and data states management
- **Cancellation**: Automatic request cancellation on unmount

### ✅ **Configuration**
- **Location**: `src/lib/config.ts`
- **Features**: Centralized configuration for API, UI, and features
- **Environment**: Environment variable support
- **Theming**: Consistent UI configuration

## 🔧 Setup Instructions

### 1. **Environment Variables**
Create a `.env.local` file in your project root:

```env
# Frontend Environment Variables
VITE_API_BASE_URL=https://backend-7ol8cklrk-dessouky13s-projects-6724b6bc.vercel.app
VITE_API_VERSION=v1
VITE_APP_NAME=Rajac Admission System
VITE_APP_VERSION=1.0.0

# Development
VITE_DEV_MODE=true
VITE_DEBUG_MODE=true
```

### 2. **Install Dependencies**
The new API client uses only built-in browser APIs (fetch, FormData) - no additional packages needed!

### 3. **Import and Use**
```typescript
// Import the API client
import { apiClient } from '@/lib/api';

// Import hooks
import { useLogin, useAuth, useSubmitAdmission } from '@/hooks/useApi';

// Use in components
function LoginComponent() {
  const { execute: login, loading, error, data } = useLogin();
  
  const handleLogin = async () => {
    await login({ email: 'user@example.com', password: 'password' });
  };
  
  // ... rest of component
}
```

## 🔄 Migration Steps

### **Step 1: Replace Supabase Imports**
```typescript
// OLD (Supabase)
import { supabase } from '@/integrations/supabase/client';

// NEW (Vercel Backend)
import { apiClient } from '@/lib/api';
import { useAuth, useLogin } from '@/hooks/useApi';
```

### **Step 2: Update Authentication**
```typescript
// OLD (Supabase)
const { data: { user }, error } = await supabase.auth.signInWithPassword({
  email,
  password
});

// NEW (Vercel Backend)
const { execute: login, loading, error, data } = useLogin();
await login({ email, password });
```

### **Step 3: Update Data Fetching**
```typescript
// OLD (Supabase)
const { data, error } = await supabase
  .from('admissions')
  .select('*')
  .eq('email', userEmail);

// NEW (Vercel Backend)
const { execute: getApplications, loading, error, data } = useGetApplications();
await getApplications();
```

### **Step 4: Update File Uploads**
```typescript
// OLD (Supabase)
const { data, error } = await supabase.storage
  .from('documents')
  .upload(filePath, file);

// NEW (Vercel Backend)
const { execute: uploadFile, loading, error, data } = useUploadFile();
await uploadFile(file, 'documents');
```

## 📚 API Endpoints Reference

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### **Admissions**
- `POST /api/admissions/submit` - Submit admission application
- `GET /api/admissions/my-applications` - Get user's applications
- `GET /api/admissions/:id` - Get specific application
- `PUT /api/admissions/:id` - Update application
- `DELETE /api/admissions/:id` - Delete application

### **Admin**
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/applications` - Get all applications
- `PUT /api/admin/applications/:id/status` - Update status
- `GET /api/admin/export` - Export data
- `GET /api/admin/logs` - Get admin logs

### **File Uploads**
- `POST /api/uploads/single` - Upload single file
- `POST /api/uploads/multiple` - Upload multiple files
- `POST /api/uploads/documents` - Upload specific documents

## 🎯 Usage Examples

### **Login Component**
```typescript
import { useLogin } from '@/hooks/useApi';

function LoginForm() {
  const { execute: login, loading, error, data } = useLogin();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    await login({
      email: formData.get('email') as string,
      password: formData.get('password') as string
    });
  };
  
  if (data?.token) {
    // Redirect to dashboard
    navigate('/dashboard');
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### **Admission Form Submission**
```typescript
import { useSubmitAdmission } from '@/hooks/useApi';

function AdmissionForm() {
  const { execute: submitForm, loading, error, data } = useSubmitAdmission();
  
  const handleSubmit = async (formData: AdmissionForm) => {
    await submitForm(formData);
    
    if (data) {
      // Show success message
      toast.success('Application submitted successfully!');
      navigate('/dashboard');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
```

### **Admin Dashboard**
```typescript
import { useAdminDashboard, useGetAllApplications } from '@/hooks/useApi';

function AdminDashboard() {
  const { execute: getDashboard, data: dashboard, loading: dashboardLoading } = useAdminDashboard();
  const { execute: getApplications, data: applications, loading: appsLoading } = useGetAllApplications();
  
  useEffect(() => {
    getDashboard();
    getApplications(1, 10); // page 1, 10 items
  }, []);
  
  return (
    <div>
      {dashboardLoading ? (
        <div>Loading dashboard...</div>
      ) : (
        <div>
          <h2>Total Applications: {dashboard?.total_applications}</h2>
          <h3>Pending: {dashboard?.pending_applications}</h3>
          {/* More stats */}
        </div>
      )}
      
      {/* Applications list */}
    </div>
  );
}
```

## 🛡️ Security Features

### **JWT Authentication**
- Automatic token storage in localStorage
- Token validation on each request
- Automatic logout on token expiry

### **CORS Protection**
- Backend configured to allow only specified origins
- Secure cookie handling

### **Rate Limiting**
- Built-in rate limiting on backend
- Configurable limits per endpoint

## 🔍 Debugging

### **Enable Debug Mode**
Set `VITE_DEBUG_MODE=true` in your `.env.local` file to see:
- API request/response logs
- Authentication status
- Configuration values

### **Check Network Tab**
- Monitor API calls in browser DevTools
- Verify request headers and responses
- Check for CORS or authentication errors

### **Console Logs**
The API client logs all requests and errors to the console when debug mode is enabled.

## 🚨 Common Issues & Solutions

### **CORS Errors**
- Ensure your frontend domain is in `ALLOWED_ORIGINS` in backend
- Check that you're using HTTPS in production

### **Authentication Errors**
- Verify JWT_SECRET is set in backend
- Check token expiration
- Ensure Authorization header is sent

### **File Upload Issues**
- Check file size limits (5MB default)
- Verify file type restrictions
- Ensure proper FormData format

## 📱 Mobile Considerations

### **Token Storage**
- Uses localStorage (web) - consider secure storage for mobile
- Automatic token refresh handling

### **Offline Support**
- No built-in offline support
- Consider implementing service worker for offline functionality

## 🔮 Future Enhancements

### **Planned Features**
- Automatic retry on network failures
- Request/response caching
- Real-time updates via WebSocket
- Offline support with service worker

### **Customization**
- Easy to extend with new endpoints
- Configurable request/response interceptors
- Custom error handling per endpoint

## 📞 Support

### **Backend Issues**
- Check Vercel deployment logs
- Verify environment variables
- Test endpoints with curl/Postman

### **Frontend Issues**
- Check browser console for errors
- Verify API client configuration
- Test with different browsers

### **Integration Issues**
- Ensure backend is running and accessible
- Check CORS configuration
- Verify authentication flow

---

## 🎉 Migration Complete!

Your frontend is now fully integrated with the new Vercel backend! 

**Next Steps:**
1. Test all functionality
2. Update any remaining Supabase references
3. Deploy frontend to production
4. Monitor API performance and errors

**Remember**: The new backend uses in-memory SQLite for now, so data will reset on cold starts. Consider upgrading to a persistent database for production use.
