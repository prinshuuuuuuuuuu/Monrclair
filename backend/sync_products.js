const db = require('./src/config/db');

async function seed() {
  try {
    console.log('Seeding products to match frontend IDs...');
    
    // Disable foreign key checks for clearing
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.query('TRUNCATE TABLE products');
    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    const products = [
      { id: 1, name: 'Heritage Chronograph Gold', price: 12400, category: 'classic', collection: 'chronograph', strapType: 'leather' },
      { id: 2, name: 'Deep Sea Diver Bronze', price: 9800, category: 'sport', collection: 'diver', strapType: 'metal' },
      { id: 3, name: 'Monolith Skeleton', price: 18900, category: 'premium', collection: 'heritage', strapType: 'leather' },
      { id: 4, name: 'Nocturne Stealth', price: 18200, category: 'classic', collection: 'heritage', strapType: 'leather' },
      { id: 5, name: 'Apex Sport Chronograph', price: 8500, category: 'sport', collection: 'chronograph', strapType: 'silicone' },
      { id: 6, name: 'Celestial Moonphase III', price: 35000, category: 'premium', collection: 'heritage', strapType: 'leather' }
    ];

    for (const p of products) {
      await db.query(
        'INSERT INTO products (id, name, price, category, collection, strapType) VALUES (?, ?, ?, ?, ?, ?)',
        [p.id, p.name, p.price, p.category, p.collection, p.strapType]
      );
    }

    console.log('Seeding completed. IDs 1-6 are now synchronized.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
