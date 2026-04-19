const axios = require('axios');

async function testApiResponse() {
    try {
        console.log('=== Testing API Response ===\n');

        // First, login to get a token
        console.log('1. Logging in...');
        const loginResponse = await axios.post('http://localhost:5002/api/auth/login', {
            username: 'test',
            password: 'test123'
        });

        const token = loginResponse.data.data?.accessToken;
        if (!token) {
            console.log('Failed to get token');
            return;
        }
        console.log('Token obtained:', token.substring(0, 20) + '...');

        // Get student profile
        console.log('\n2. Fetching student profile...');
        const profileResponse = await axios.get('http://localhost:5002/api/student/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('\n3. Profile Response:');
        console.log('- Success:', profileResponse.data.success);
        console.log('- Full Name:', profileResponse.data.data?.full_name);
        console.log('- personal_info exists:', !!profileResponse.data.data?.personal_info);
        console.log('- personal_info.photo_url:', profileResponse.data.data?.personal_info?.photo_url);
        console.log('- photo_url (top level):', profileResponse.data.data?.photo_url);

        console.log('\n=== Test Complete ===');
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testApiResponse();
