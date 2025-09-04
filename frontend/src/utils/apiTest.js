// API Test utility for debugging
export const testApiConnection = async () => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
        (process.env.NODE_ENV === 'production' 
            ? "https://task-and-time-tracking-app-mj19.vercel.app" 
            : "http://localhost:3001");

    console.log('Testing API connection...');
    console.log('API_BASE_URL:', API_BASE_URL);

    try {
        // Test health endpoint
        const healthResponse = await fetch(`${API_BASE_URL}/health`);
        console.log('Health check status:', healthResponse.status);
        
        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('Health check data:', healthData);
        } else {
            console.error('Health check failed:', healthResponse.status, healthResponse.statusText);
        }

        // Test root endpoint
        const rootResponse = await fetch(`${API_BASE_URL}/`);
        console.log('Root endpoint status:', rootResponse.status);
        
        if (rootResponse.ok) {
            const rootData = await rootResponse.json();
            console.log('Root endpoint data:', rootData);
        } else {
            console.error('Root endpoint failed:', rootResponse.status, rootResponse.statusText);
        }

    } catch (error) {
        console.error('API test error:', error);
    }
};

// Test login endpoint specifically
export const testLoginEndpoint = async () => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
        (process.env.NODE_ENV === 'production' 
            ? "https://task-and-time-tracking-app-mj19.vercel.app" 
            : "http://localhost:3001");

    console.log('Testing login endpoint...');
    console.log('Login URL:', `${API_BASE_URL}/login`);

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@test.com',
                password: 'test123'
            })
        });

        console.log('Login response status:', response.status);
        console.log('Login response headers:', response.headers);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Login response data:', data);
        } else {
            const errorText = await response.text();
            console.error('Login failed:', response.status, errorText);
        }

    } catch (error) {
        console.error('Login test error:', error);
    }
};
