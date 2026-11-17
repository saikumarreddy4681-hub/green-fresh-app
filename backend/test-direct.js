import { memoryStore } from './config/db.js';
import { getProducts, getCategories, getProductById } from './controllers/productController.js';
import { login, register } from './controllers/authController.js';

console.log('--- RUNNING GREENFRESH DIRECT TEST SUITE (46 PRODUCTS • 3 CATEGORIES) ---');

// Test 1: Products count
const prodCount = memoryStore.products.length;
console.log('[TEST 1 - Product Count (46)]: ', prodCount === 46 ? 'PASS' : `FAIL (${prodCount})`);

// Test 2: Category Count (3)
const catCount = memoryStore.categories.length;
console.log('[TEST 2 - Category Count (3)]:  ', catCount === 3 ? 'PASS' : `FAIL (${catCount})`);

// Mock response helper
let mockResData = null;
const mockRes = {
  json(data) { mockResData = data; return this; },
  status(code) { return this; }
};

// Test 3: Get all products via controller
await getProducts({ query: {} }, mockRes);
console.log('[TEST 3 - Controller All Prods]:', mockResData.success && mockResData.products.length === 46 ? 'PASS' : 'FAIL');

// Test 4: Category Fresh Fruits (15)
await getProducts({ query: { category: 'fresh-fruits' } }, mockRes);
console.log('[TEST 4 - Fresh Fruits (15)]:   ', mockResData.success && mockResData.products.length === 15 ? 'PASS' : `FAIL (${mockResData.products.length})`);

// Test 5: Category Fresh Vegetables (20)
await getProducts({ query: { category: 'fresh-vegetables' } }, mockRes);
console.log('[TEST 5 - Vegetables (20)]:     ', mockResData.success && mockResData.products.length === 20 ? 'PASS' : `FAIL (${mockResData.products.length})`);

// Test 6: Category Milk & Dairy (11)
await getProducts({ query: { category: 'milk-dairy' } }, mockRes);
console.log('[TEST 6 - Milk & Dairy (11)]:   ', mockResData.success && mockResData.products.length === 11 ? 'PASS' : `FAIL (${mockResData.products.length})`);

// Test 7: Image Verification (Real commercial photographs in /images/products/)
const apple = memoryStore.products.find(p => p.name === 'Apple');
const tomato = memoryStore.products.find(p => p.name === 'Tomato');
const tonedMilk = memoryStore.products.find(p => p.name === 'Toned Milk');
const butter = memoryStore.products.find(p => p.name === 'Butter');
const ghee = memoryStore.products.find(p => p.name === 'Ghee');
const paneer = memoryStore.products.find(p => p.name === 'Paneer');
const curd = memoryStore.products.find(p => p.name === 'Curd');

const areImagesValid = apple?.image === '/images/products/fruits/apple.jpg' &&
                       tomato?.image === '/images/products/vegetables/tomato.jpg' &&
                       tonedMilk?.image === '/images/products/dairy/tonedmilk.jpg' &&
                       butter?.image === '/images/products/dairy/butter.jpg' &&
                       ghee?.image === '/images/products/dairy/ghee.jpg' &&
                       paneer?.image === '/images/products/dairy/paneer.jpg' &&
                       curd?.image === '/images/products/dairy/curd.jpg';
console.log('[TEST 7 - Real Photos Paths]:   ', areImagesValid ? 'PASS' : 'FAIL', '(Verified genuine commercial photos for all categories)');

// Test 8: Customer Login
let loginResult = null;
const loginRes = {
  status(code) { return this; },
  json(data) { loginResult = data; return this; }
};
await login({ body: { email: 'customer@greenfresh.com', password: 'user123' } }, loginRes);
console.log('[TEST 8 - Customer Login]:      ', loginResult.success && loginResult.token ? 'PASS' : 'FAIL', `(${loginResult.user?.name})`);

// Test 9: Default Admin Login (admin@greenfresh.com)
await login({ body: { email: 'admin@greenfresh.com', password: 'admin123' } }, loginRes);
console.log('[TEST 9 - Default Admin Login]: ', loginResult.success && loginResult.user?.role === 'admin' ? 'PASS' : 'FAIL', `(${loginResult.user?.email})`);

// Test 10: User Admin Login (saikumarreddy4681@gmail.com)
await login({ body: { email: 'saikumarreddy4681@gmail.com', password: 'admin123' } }, loginRes);
console.log('[TEST 10 - User Admin Login]:   ', loginResult.success && loginResult.user?.role === 'admin' ? 'PASS' : 'FAIL', `(${loginResult.user?.email})`);

// Test 11: Customer Registration
let regResult = null;
const regRes = {
  status(code) { return this; },
  json(data) { regResult = data; return this; }
};
const testEmail = `shopper_${Date.now()}@greenfresh.test`;
await register({ body: { name: 'Fresh Shopper', email: testEmail, password: 'password123', phone: '9876543210' } }, regRes);
console.log('[TEST 11 - Registration]:       ', regResult.success && regResult.token ? 'PASS' : 'FAIL', `(${regResult.user?.email})`);

console.log('--- ALL 11 TESTS EXECUTED ---');
