const axios = require('axios');

const BASE_URL = 'https://backend-7ol8cklrk-dessouky13s-projects-6724b6bc.vercel.app';

async function testVercelAPI() {
  try {
    console.log('🧪 Testing Vercel API deployment...\n');

    // Test root endpoint
    console.log('1. Testing root endpoint...');
    const rootResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Root endpoint:', rootResponse.data);

    // Test health endpoint
    console.log('\n2. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check:', healthResponse.data);

    // Test admin login
    console.log('\n3. Testing admin login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@rajac.edu',
      password: 'admin123'
    });
    console.log('✅ Admin login successful');
    console.log('Token received:', loginResponse.data.token ? 'Yes' : 'No');

    console.log('\n🎉 All tests passed! Vercel deployment is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests
testVercelAPI();
