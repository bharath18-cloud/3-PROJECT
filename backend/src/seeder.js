/**
 * Database Seeder Script
 * Run with: node src/seeder.js
 * Clears existing data and inserts a full set of seed documents.
 */
const dotenv   = require('dotenv');
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

dotenv.config({ path: '../.env' });

const connectDB   = require('./config/db');
const User        = require('./models/User');
const Product     = require('./models/Product');
const PriceUpdate = require('./models/PriceUpdate');

// ─── Seed Data ──────────────────────────────────────────────────────────────

const users = [
  {
    name:     'Sai Teja (Admin)',
    email:    'admin@saitejatraders.com',
    password: 'admin123',
    role:     'admin',
    mobile:   '9000012345',
    gstin:    '36AAAAA1111A1Z1',
    address:  'D-No 12-42, Industrial Area, Jeedimetla, Hyderabad, 500055',
  },
  {
    name:     'Bharath Kumar',
    email:    'customer@saitejatraders.com',
    password: 'customer123',
    role:     'customer',
    mobile:   '9876543210',
    gstin:    '36BBBBB2222B2Z2',
    address:  'Plot 42, Hitec City, Hyderabad, Telangana, 500081',
  },
];

const products = [
  {
    name:     'JSW NeoSteel TMT Rebars',
    category: 'Steel TMT Bars',
    brand:    'JSW',
    grade:    'Fe-550D',
    price:    54500,
    unit:     'Ton',
    stock:    120,
    lowStock: 25,
    spec:     'High ductility, earthquake-resistant ribbed design, available in 8mm–32mm sizes. Corrosion-resistant coating.',
    image:    'steel-jsw',
  },
  {
    name:     'Tata Tiscon 550SD',
    category: 'Steel TMT Bars',
    brand:    'Tata',
    grade:    'Fe-550SD',
    price:    56200,
    unit:     'Ton',
    stock:    85,
    lowStock: 20,
    spec:     'Super Ductile rebars, micro-alloyed for superior bendability, rust-resistant ribs for maximum concrete bond.',
    image:    'steel-tata',
  },
  {
    name:     'Vizag Steel TMT Bars',
    category: 'Steel TMT Bars',
    brand:    'Vizag',
    grade:    'Fe-500D',
    price:    51900,
    unit:     'Ton',
    stock:    6,
    lowStock: 15,
    spec:     'RINL Vizag steel, exceptionally clean with low sulphur & phosphorus. Ideal for high-seismic zones.',
    image:    'steel-vizag',
  },
  {
    name:     'UltraTech Premium OPC 53',
    category: 'Cement',
    brand:    'UltraTech',
    grade:    'Grade 53',
    price:    425,
    unit:     'Bag',
    stock:    1450,
    lowStock: 200,
    spec:     'Ordinary Portland Cement with high 28-day compressive strength. Ideal for RCC structures and prestressed concrete.',
    image:    'cement-ultratech',
  },
  {
    name:     'Dalmia Supreme PPC Cement',
    category: 'Cement',
    brand:    'Dalmia',
    grade:    'PPC',
    price:    385,
    unit:     'Bag',
    stock:    950,
    lowStock: 150,
    spec:     'Portland Pozzolana Cement, crack-resistant, low heat of hydration. Excellent for wet or aggressive environments.',
    image:    'cement-dalmia',
  },
  {
    name:     'ACC Gold Water Shield',
    category: 'Cement',
    brand:    'ACC',
    grade:    'Grade 53',
    price:    445,
    unit:     'Bag',
    stock:    18,
    lowStock: 50,
    spec:     'Premium water-repellent cement with Active Water Shield™ technology. Perfect for basements and retaining walls.',
    image:    'cement-acc',
  },
  {
    name:     'Tata Wiron Gi Binding Wire',
    category: 'Binding Wire',
    brand:    'Tata',
    grade:    '18 Gauge',
    price:    7900,
    unit:     'Bundle',
    stock:    45,
    lowStock: 10,
    spec:     'Hot-dip galvanized iron wire. Highly flexible for binding rebar cages. Bundle weight: 25 kg.',
    image:    'wire-tata',
  },
  {
    name:     'Standard Concrete Cover Blocks',
    category: 'Construction Materials',
    brand:    'Local',
    grade:    '20/25/30mm',
    price:    350,
    unit:     'Box',
    stock:    120,
    lowStock: 30,
    spec:     'Pre-cast concrete spacer blocks ensuring specified rebar cover and concrete quality in slabs and columns.',
    image:    'materials-cover',
  },
];

const priceUpdates = [
  {
    category:      'Steel TMT Bars',
    currentPrice:  54500,
    previousPrice: 55000,
  },
  {
    category:      'Cement',
    currentPrice:  425,
    previousPrice: 420,
  },
  {
    category:      'Binding Wire',
    currentPrice:  7900,
    previousPrice: 7850,
  },
];

// ─── Seeder Logic ────────────────────────────────────────────────────────────

const seedDatabase = async () => {
  await connectDB();

  try {
    console.log('🗑  Clearing existing collections...');
    await User.deleteMany();
    await Product.deleteMany();
    await PriceUpdate.deleteMany();

    // Hash passwords before inserting
    console.log('🔐 Hashing passwords...');
    const hashedUsers = await Promise.all(
      users.map(async (u) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.password, salt);
        return { ...u, password: hashedPassword };
      })
    );

    // Find admin user to associate price updates
    const createdUsers = await User.insertMany(hashedUsers);
    const adminUser    = createdUsers.find((u) => u.role === 'admin');

    console.log('👤 Users seeded:', createdUsers.length);

    await Product.insertMany(products);
    console.log('📦 Products seeded:', products.length);

    const priceUpdatesWithAdmin = priceUpdates.map((p) => ({
      ...p,
      lastUpdatedBy: adminUser._id,
    }));
    await PriceUpdate.insertMany(priceUpdatesWithAdmin);
    console.log('💰 Price updates seeded:', priceUpdates.length);

    console.log('');
    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('── Quick Login Credentials ───────────────────────');
    console.log('  Admin   : admin@saitejatraders.com  / admin123');
    console.log('  Customer: customer@saitejatraders.com / customer123');
    console.log('──────────────────────────────────────────────────');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder error:', err.message);
    process.exit(1);
  }
};

seedDatabase();
