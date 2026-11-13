const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5018;
const JWT_SECRET = 'mock-secret-key';

// CORS middleware - must be at the top
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.static('public'));

// Generate a mock JWT token
function generateToken(user) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
}

// Mock user
const mockUser = {
  id_user: 1,
  user_name: 'demo_user',
  user_email: 'demo@savycart.com',
  user_fullname: 'Demo User',
  user_currency: 'USD',
  user_currency_symbol: '$'
};

// Mock products
const products = [
  { id_product: 1, name: 'Organic Whole Milk', brand: 'Green Valley', price: 4.99, id_unit_measurement: 1, id_category: 1, favorite: '1', created_at: '2024-01-15T10:30:00Z', image: null },
  { id_product: 2, name: 'Sourdough Bread', brand: 'Artisan Bakery', price: 5.49, id_unit_measurement: 2, id_category: 2, favorite: '0', created_at: '2024-01-14T08:15:00Z', image: null },
  { id_product: 3, name: 'Free Range Eggs (12pk)', brand: 'Farm Fresh', price: 6.99, id_unit_measurement: 3, id_category: 1, favorite: '1', created_at: '2024-01-13T14:20:00Z', image: null },
  { id_product: 4, name: 'Avocados (3pk)', brand: 'Fresh Harvest', price: 3.99, id_unit_measurement: 4, id_category: 3, favorite: '0', created_at: '2024-01-12T09:45:00Z', image: null },
  { id_product: 5, name: 'Greek Yogurt', brand: 'Mediterranean', price: 3.49, id_unit_measurement: 1, id_category: 1, favorite: '0', created_at: '2024-01-11T11:00:00Z', image: null },
  { id_product: 6, name: 'Chicken Breast', brand: 'Premium Poultry', price: 8.99, id_unit_measurement: 5, id_category: 4, favorite: '1', created_at: '2024-01-10T16:30:00Z', image: null },
  { id_product: 7, name: 'Basmati Rice (2lb)', brand: 'Golden Grain', price: 4.29, id_unit_measurement: 5, id_category: 5, favorite: '0', created_at: '2024-01-09T12:15:00Z', image: null },
  { id_product: 8, name: 'Olive Oil Extra Virgin', brand: 'Mediterranean Gold', price: 12.99, id_unit_measurement: 1, id_category: 5, favorite: '0', created_at: '2024-01-08T07:50:00Z', image: null },
  { id_product: 9, name: 'Bananas (bunch)', brand: 'Tropical Fresh', price: 1.99, id_unit_measurement: 4, id_category: 3, favorite: '1', created_at: '2024-01-07T15:40:00Z', image: null },
  { id_product: 10, name: 'Cheddar Cheese Block', brand: 'Dairy Farms', price: 5.99, id_unit_measurement: 5, id_category: 1, favorite: '0', created_at: '2024-01-06T10:25:00Z', image: null },
  { id_product: 11, name: 'Tomato Sauce', brand: 'Italian Kitchen', price: 2.99, id_unit_measurement: 1, id_category: 5, favorite: '0', created_at: '2024-01-05T13:10:00Z', image: null },
  { id_product: 12, name: 'Pasta Penne (1lb)', brand: 'Golden Grain', price: 1.79, id_unit_measurement: 5, id_category: 5, favorite: '0', created_at: '2024-01-04T09:55:00Z', image: null }
];

// Mock brands
const brands = [
  { id_brand: 1, name: 'Green Valley' },
  { id_brand: 2, name: 'Artisan Bakery' },
  { id_brand: 3, name: 'Farm Fresh' },
  { id_brand: 4, name: 'Fresh Harvest' },
  { id_brand: 5, name: 'Mediterranean' },
  { id_brand: 6, name: 'Premium Poultry' },
  { id_brand: 7, name: 'Golden Grain' },
  { id_brand: 8, name: 'Mediterranean Gold' },
  { id_brand: 9, name: 'Tropical Fresh' },
  { id_brand: 10, name: 'Dairy Farms' },
  { id_brand: 11, name: 'Italian Kitchen' }
];

// Mock categories
const categories = [
  { id_category: 1, name: 'Dairy & Eggs' },
  { id_category: 2, name: 'Bakery' },
  { id_category: 3, name: 'Fruits & Vegetables' },
  { id_category: 4, name: 'Meat & Poultry' },
  { id_category: 5, name: 'Pantry Staples' }
];

// Mock measurement units
const measurementUnits = [
  { id_unit_measurement: 1, name: 'Liter' },
  { id_unit_measurement: 2, name: 'Piece' },
  { id_unit_measurement: 3, name: 'Pack' },
  { id_unit_measurement: 4, name: 'Bunch' },
  { id_unit_measurement: 5, name: 'Pound' }
];

// Mock tax
const tax = { quantity: 16 }; // 16% tax

// Mock shoppings (purchases)
const shoppings = [
  {
    id_purchase: 1,
    names_establishments: 'Whole Foods Market',
    create_at: '2024-01-15T14:30:00Z',
    total: 47.89,
    establishment: { id_establishment: 1, name: 'Whole Foods Market' },
    purchase: { id_purchase: 1, create_at: '2024-01-15T14:30:00Z' },
    purchase_details: [
      { id_product: 1, name: 'Organic Whole Milk', brand: 'Green Valley', unit_price: 4.99, quantity: 2, id_unit_measurement: 1 },
      { id_product: 2, name: 'Sourdough Bread', brand: 'Artisan Bakery', unit_price: 5.49, quantity: 1, id_unit_measurement: 2 },
      { id_product: 3, name: 'Free Range Eggs (12pk)', brand: 'Farm Fresh', unit_price: 6.99, quantity: 1, id_unit_measurement: 3 },
      { id_product: 4, name: 'Avocados (3pk)', brand: 'Fresh Harvest', unit_price: 3.99, quantity: 2, id_unit_measurement: 4 },
      { id_product: 9, name: 'Bananas (bunch)', brand: 'Tropical Fresh', unit_price: 1.99, quantity: 1, id_unit_measurement: 4 }
    ],
    tax: { quantity: 16 }
  },
  {
    id_purchase: 2,
    names_establishments: 'Trader Joe\'s',
    create_at: '2024-01-10T11:15:00Z',
    total: 32.45,
    establishment: { id_establishment: 2, name: 'Trader Joe\'s' },
    purchase: { id_purchase: 2, create_at: '2024-01-10T11:15:00Z' },
    purchase_details: [
      { id_product: 5, name: 'Greek Yogurt', brand: 'Mediterranean', unit_price: 3.49, quantity: 3, id_unit_measurement: 1 },
      { id_product: 6, name: 'Chicken Breast', brand: 'Premium Poultry', unit_price: 8.99, quantity: 1, id_unit_measurement: 5 },
      { id_product: 7, name: 'Basmati Rice (2lb)', brand: 'Golden Grain', unit_price: 4.29, quantity: 1, id_unit_measurement: 5 },
      { id_product: 12, name: 'Pasta Penne (1lb)', brand: 'Golden Grain', unit_price: 1.79, quantity: 2, id_unit_measurement: 5 }
    ],
    tax: { quantity: 16 }
  },
  {
    id_purchase: 3,
    names_establishments: 'Costco Wholesale',
    create_at: '2024-01-05T16:45:00Z',
    total: 89.67,
    establishment: { id_establishment: 3, name: 'Costco Wholesale' },
    purchase: { id_purchase: 3, create_at: '2024-01-05T16:45:00Z' },
    purchase_details: [
      { id_product: 8, name: 'Olive Oil Extra Virgin', brand: 'Mediterranean Gold', unit_price: 12.99, quantity: 2, id_unit_measurement: 1 },
      { id_product: 10, name: 'Cheddar Cheese Block', brand: 'Dairy Farms', unit_price: 5.99, quantity: 3, id_unit_measurement: 5 },
      { id_product: 11, name: 'Tomato Sauce', brand: 'Italian Kitchen', unit_price: 2.99, quantity: 4, id_unit_measurement: 1 },
      { id_product: 6, name: 'Chicken Breast', brand: 'Premium Poultry', unit_price: 8.99, quantity: 2, id_unit_measurement: 5 }
    ],
    tax: { quantity: 16 }
  },
  {
    id_purchase: 4,
    names_establishments: 'Sprouts Farmers Market',
    create_at: '2023-12-28T09:20:00Z',
    total: 25.34,
    establishment: { id_establishment: 4, name: 'Sprouts Farmers Market' },
    purchase: { id_purchase: 4, create_at: '2023-12-28T09:20:00Z' },
    purchase_details: [
      { id_product: 4, name: 'Avocados (3pk)', brand: 'Fresh Harvest', unit_price: 3.99, quantity: 3, id_unit_measurement: 4 },
      { id_product: 9, name: 'Bananas (bunch)', brand: 'Tropical Fresh', unit_price: 1.99, quantity: 2, id_unit_measurement: 4 },
      { id_product: 1, name: 'Organic Whole Milk', brand: 'Green Valley', unit_price: 4.99, quantity: 1, id_unit_measurement: 1 }
    ],
    tax: { quantity: 16 }
  }
];

// Mock currencies
const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' }
];

// Auth routes
app.post('/sheiley-shop-api/auth/login', (req, res) => {
  const { user_name, password } = req.body;
  if (user_name && password) {
    const token = generateToken(mockUser);
    res.json({
      status: 200,
      data: token,
      currencies: currencies
    });
  } else {
    res.status(401).json({ errors: ['Invalid credentials'] });
  }
});

app.post('/sheiley-shop-api/auth/register', (req, res) => {
  const token = generateToken(mockUser);
  res.json({
    status: 201,
    data: token,
    currencies: currencies
  });
});

app.post('/sheiley-shop-api/auth/recovery', (req, res) => {
  res.json({ status: 200, message: 'Recovery email sent' });
});

app.post('/sheiley-shop-api/auth/resetPassword', (req, res) => {
  const token = generateToken(mockUser);
  res.json({ status: 200, data: token, currencies: currencies });
});

app.get('/sheiley-shop-api/auth/users/:userName', (req, res) => {
  res.json({ status: 200, data: { exists: false } });
});

app.post('/sheiley-shop-api/auth/emails', (req, res) => {
  res.json({ status: 200, data: { exists: false } });
});

// Products routes
app.get('/sheiley-shop-api/products/products', (req, res) => {
  res.json({ status: 200, data: products });
});

app.get('/sheiley-shop-api/products/products/:id', (req, res) => {
  const product = products.find(p => p.id_product === parseInt(req.params.id));
  if (product) {
    res.json({ status: 200, data: product });
  } else {
    res.status(404).json({ errors: ['Product not found'] });
  }
});

app.post('/sheiley-shop-api/products/products', (req, res) => {
  const newProduct = { ...req.body, id_product: products.length + 1 };
  products.push(newProduct);
  res.json({ status: 201, data: newProduct });
});

app.patch('/sheiley-shop-api/products/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id_product === parseInt(req.params.id));
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    res.json({ status: 200, data: products[index] });
  } else {
    res.status(404).json({ errors: ['Product not found'] });
  }
});

app.delete('/sheiley-shop-api/products/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id_product === parseInt(req.params.id));
  if (index !== -1) {
    products.splice(index, 1);
    res.json({ status: 200, message: 'Product deleted' });
  } else {
    res.status(404).json({ errors: ['Product not found'] });
  }
});

app.get('/sheiley-shop-api/products/brands', (req, res) => {
  res.json({ status: 200, data: brands });
});

// Shoppings routes
app.get('/sheiley-shop-api/shoppings/shoppings', (req, res) => {
  const summary = shoppings.map(s => ({
    id_purchase: s.id_purchase,
    names_establishments: s.names_establishments,
    create_at: s.create_at,
    total: s.total
  }));
  res.json({ status: 200, data: summary });
});

app.get('/sheiley-shop-api/shoppings/shoppings/:id', (req, res) => {
  const shopping = shoppings.find(s => s.id_purchase === parseInt(req.params.id));
  if (shopping) {
    res.json({ status: 200, data: shopping });
  } else {
    res.status(404).json({ errors: ['Shopping not found'] });
  }
});

app.post('/sheiley-shop-api/shoppings/shoppings', (req, res) => {
  const newShopping = { ...req.body, id_purchase: shoppings.length + 1 };
  shoppings.push(newShopping);
  res.json({ status: 201, data: newShopping });
});

app.delete('/sheiley-shop-api/shoppings/shoppings/:id', (req, res) => {
  const index = shoppings.findIndex(s => s.id_purchase === parseInt(req.params.id));
  if (index !== -1) {
    shoppings.splice(index, 1);
    res.json({ status: 200, message: 'Shopping deleted' });
  } else {
    res.status(404).json({ errors: ['Shopping not found'] });
  }
});

// Categories routes
app.get('/sheiley-shop-api/categories/categories', (req, res) => {
  res.json({ status: 200, data: categories });
});

app.post('/sheiley-shop-api/categories/categories', (req, res) => {
  const newCategory = { ...req.body, id_category: categories.length + 1 };
  categories.push(newCategory);
  res.json({ status: 201, data: newCategory });
});

app.delete('/sheiley-shop-api/categories/categories/:id', (req, res) => {
  const index = categories.findIndex(c => c.id_category === parseInt(req.params.id));
  if (index !== -1) {
    categories.splice(index, 1);
    res.json({ status: 200, message: 'Category deleted' });
  } else {
    res.status(404).json({ errors: ['Category not found'] });
  }
});

// Measurement units routes
app.get('/sheiley-shop-api/measurement_units/measurement_units', (req, res) => {
  res.json({ status: 200, data: measurementUnits });
});

app.post('/sheiley-shop-api/measurement_units/measurement_units', (req, res) => {
  const newUnit = { ...req.body, id_unit_measurement: measurementUnits.length + 1 };
  measurementUnits.push(newUnit);
  res.json({ status: 201, data: newUnit });
});

app.delete('/sheiley-shop-api/measurement_units/measurement_units/:id', (req, res) => {
  const index = measurementUnits.findIndex(u => u.id_unit_measurement === parseInt(req.params.id));
  if (index !== -1) {
    measurementUnits.splice(index, 1);
    res.json({ status: 200, message: 'Measurement unit deleted' });
  } else {
    res.status(404).json({ errors: ['Measurement unit not found'] });
  }
});

// Tax routes
app.get('/sheiley-shop-api/taxes/taxes', (req, res) => {
  res.json({ status: 200, data: tax });
});

// Users routes
app.get('/sheiley-shop-api/users/users/:id', (req, res) => {
  res.json({ status: 200, data: mockUser });
});

app.patch('/sheiley-shop-api/users/users/:id', (req, res) => {
  res.json({ status: 200, data: { ...mockUser, ...req.body } });
});

// Currencies
app.get('/sheiley-shop-api/currencies/currencies', (req, res) => {
  res.json({ status: 200, data: currencies });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log(`API base URL: http://localhost:${PORT}/sheiley-shop-api`);
});
