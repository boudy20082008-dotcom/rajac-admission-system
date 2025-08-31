// Frontend Configuration
export const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://backend-7ol8cklrk-dessouky13s-projects-6724b6bc.vercel.app',
    version: import.meta.env.VITE_API_VERSION || 'v1',
    timeout: 30000, // 30 seconds
  },
  
  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Rajac Admission System',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    description: 'Complete admission management system for Rajac School',
  },
  
  // Development Configuration
  dev: {
    mode: import.meta.env.VITE_DEV_MODE === 'true',
    debug: import.meta.env.VITE_DEBUG_MODE === 'true',
  },
  
  // Features Configuration
  features: {
    fileUpload: {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ],
      maxFiles: 10,
    },
    
    pagination: {
      defaultPageSize: 10,
      maxPageSize: 100,
    },
  },
  
  // UI Configuration
  ui: {
    theme: {
      primary: '#16a34a', // Green
      secondary: '#059669',
      accent: '#10b981',
      background: '#f6fef9',
      text: '#1f2937',
    },
    
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  
  // Localization
  i18n: {
    defaultLocale: 'en',
    supportedLocales: ['en', 'ar'],
    fallbackLocale: 'en',
  },
  
  // Security
  security: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  },
};

// Environment-specific overrides
if (config.dev.mode) {
  console.log('🔧 Development mode enabled');
  console.log('🌐 API Base URL:', config.api.baseURL);
  console.log('📱 App Version:', config.app.version);
}

export default config;
