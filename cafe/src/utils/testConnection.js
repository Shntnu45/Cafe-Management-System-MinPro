// Test backend connectivity
export const testBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test123',
        role: 'user'
      })
    });
    
    console.log('Backend Response Status:', response.status);
    const data = await response.text();
    console.log('Backend Response:', data);
    return response.ok;
  } catch (error) {
    console.error('Backend Connection Error:', error);
    return false;
  }
};