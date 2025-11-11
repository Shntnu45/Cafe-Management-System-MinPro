import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

// Test function to check if server is running
async function testServerHealth() {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Server health check:', data);
    return true;
  } catch (error) {
    console.error('❌ Server health check failed:', error.message);
    return false;
  }
}

// Test function to get categories
async function testGetCategories() {
  try {
    const response = await fetch(`${BASE_URL}/menu/categories`);
    const data = await response.json();
    console.log('✅ Get categories:', data.success ? 'Success' : 'Failed');
    console.log('Categories count:', data.data?.categories?.length || 0);
    return data.data?.categories || [];
  } catch (error) {
    console.error('❌ Get categories failed:', error.message);
    return [];
  }
}

// Test function to get menu items
async function testGetMenuItems() {
  try {
    const response = await fetch(`${BASE_URL}/menu/items?includeUnavailable=true`);
    const data = await response.json();
    console.log('✅ Get menu items:', data.success ? 'Success' : 'Failed');
    console.log('Menu items count:', data.data?.menus?.length || 0);
    return data.data?.menus || [];
  } catch (error) {
    console.error('❌ Get menu items failed:', error.message);
    return [];
  }
}

// Main test function
async function runTests() {
  console.log('🧪 Testing Menu Endpoints...\n');
  
  const isServerRunning = await testServerHealth();
  if (!isServerRunning) {
    console.log('\n❌ Server is not running. Please start the server first.');
    return;
  }
  
  console.log('\n📋 Testing menu endpoints...');
  const categories = await testGetCategories();
  const menuItems = await testGetMenuItems();
  
  console.log('\n📊 Test Summary:');
  console.log(`- Categories found: ${categories.length}`);
  console.log(`- Menu items found: ${menuItems.length}`);
  
  if (menuItems.length > 0) {
    console.log('\n🔍 Sample menu item structure:');
    console.log(JSON.stringify(menuItems[0], null, 2));
  }
  
  console.log('\n✅ Basic endpoint tests completed!');
  console.log('\n💡 If you\'re still getting server errors when updating:');
  console.log('1. Check the browser console for detailed error messages');
  console.log('2. Check the server console for backend error logs');
  console.log('3. Verify you\'re logged in as an admin user');
  console.log('4. Make sure the database is connected properly');
}

// Run the tests
runTests().catch(console.error);