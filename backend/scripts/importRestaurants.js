/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Configuration
const CSV_FILE_PATH = path.join(__dirname, '..', '..', 'michelin_my_maps.csv');
const BATCH_SIZE = 100; // Process records in batches
const PROGRESS_INTERVAL = 10; // Log progress every N batches

/**
 * Parse CSV file
 */
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    let errorCount = 0;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        try {
          // Validate and normalize data
          const restaurant = normalizeRestaurantData(data);
          if (restaurant) {
            results.push(restaurant);
          } else {
            errorCount++;
          }
        } catch (error) {
          console.warn('Warning: Failed to parse CSV row:', error.message);
          errorCount++;
        }
      })
      .on('end', () => {
        if (errorCount > 0) {
          console.warn(`Completed with ${errorCount} parsing warnings`);
        }
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Normalize restaurant data from CSV
 */
function normalizeRestaurantData(data) {
  if (!data.Name && !data.name) {
    return null; // Skip rows without name
  }

  const name = data.Name || data.name;
  const address = data.Address || data.address || '';
  const location = data.Location || data.location || '';
  const price = data.Price || data.price || '';
  const cuisine = data.Cuisine || data.cuisine || '';
  const award = data.Award || data.award || '';
  const greenStar = data.GreenStar || data.greenstar || '';
  const longitude = parseFloat(data.Longitude || data.longitude) || null;
  const latitude = parseFloat(data.Latitude || data.latitude) || null;
  const phone = data.Phone || data.phone || '';
  const website = data.Website || data.website || '';
  const description = data.Description || data.description || '';

  // Extract city from location if available
  const city = location.split(',').pop().trim() || 'Unknown';

  return {
    name: name.trim(),
    address: address.trim(),
    location: location.trim(),
    city: city,
    price: price.trim(),
    priceRange: parsePriceRange(price),
    cuisine: cuisine.trim(),
    award: award.trim(),
    greenStar: greenStar.trim(),
    stars: parseStars(award),
    coordinates: {
      longitude,
      latitude
    },
    phone: phone.trim(),
    website: website.trim(),
    description: description.trim(),
    // Generated fields
    slug: generateSlug(name),
    rating: 4.5, // Default rating
    reviews: Math.floor(Math.random() * 1000) + 100, // Random review count
    tags: extractTags(cuisine),
    gallery: [], // Can be enhanced with image scraping
    chef: '',
    neighborhood: '',
    mood: []
  };
}

/**
 * Parse price range from price string
 */
function parsePriceRange(price) {
  const euroCount = (price.match(/€/g) || []).length;
  return Math.max(1, Math.min(4, euroCount));
}

/**
 * Parse Michelin stars from award string
 */
function parseStars(award) {
  if (!award) return 0;
  if (award.includes('3*') || award.includes('three stars')) return 3;
  if (award.includes('2*') || award.includes('two stars')) return 2;
  if (award.includes('1*') || award.includes('one star') || award.includes('Starred')) return 1;
  if (award.includes('Bib Gourmand')) return 0.5;
  return 0;
}

/**
 * Generate URL-friendly slug
 */
function generateSlug(name) {
  return String(name)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Extract tags from cuisine string
 */
function extractTags(cuisine) {
  if (!cuisine) return [];
  return cuisine
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
}

/**
 * Import restaurants to MongoDB in batches
 */
async function importRestaurants(restaurants) {
  const mongoUrl = process.env.MONGO_URL;
  const dbName = process.env.DB_NAME;

  if (!mongoUrl) throw new Error('MONGO_URL missing');
  if (!dbName) throw new Error('DB_NAME missing');

  const client = new MongoClient(mongoUrl);
  await client.connect();

  try {
    const db = client.db(dbName);
    const collection = db.collection('restaurants');

    // Clear existing data
    console.log('Clearing existing restaurants...');
    await collection.deleteMany({});

    // Import in batches
    let importedCount = 0;
    const totalBatches = Math.ceil(restaurants.length / BATCH_SIZE);

    console.log(`Starting batch import: ${restaurants.length} restaurants in ${totalBatches} batches...`);

    for (let i = 0; i < restaurants.length; i += BATCH_SIZE) {
      const batch = restaurants.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;

      try {
        await collection.insertMany(batch, { ordered: false });
        importedCount += batch.length;

        if (batchNum % PROGRESS_INTERVAL === 0 || batchNum === totalBatches) {
          console.log(`Progress: ${importedCount}/${restaurants.length} restaurants imported (${Math.round((importedCount / restaurants.length) * 100)}%)`);
        }
      } catch (error) {
        // Some duplicates might exist, handle gracefully
        if (error.code === 11000) { // Duplicate key error
          console.warn(`Batch ${batchNum}: Some duplicates skipped`);
          importedCount += batch.length; // Count as processed
        } else {
          console.error(`Batch ${batchNum}: Import failed`, error.message);
          throw error;
        }
      }
    }

    // Create indexes
    console.log('Creating database indexes...');
    await collection.createIndex({ city: 1 });
    await collection.createIndex({ slug: 1 }, { unique: true });
    await collection.createIndex({ stars: -1 });
    await collection.createIndex({ name: 'text', cuisine: 'text', location: 'text' });

    console.log(`Import completed: ${importedCount} restaurants imported`);
    console.log(`Database: ${dbName}`);
    console.log(`Collection: restaurants`);

    return importedCount;
  } finally {
    await client.close();
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🏁 Starting restaurant import...');

    // Check if CSV file exists
    if (!fs.existsSync(CSV_FILE_PATH)) {
      console.error(`CSV file not found: ${CSV_FILE_PATH}`);
      console.log('Please ensure michelin_my_maps.csv exists in the project root');
      process.exit(1);
    }

    console.log(`📖 Reading CSV file: ${CSV_FILE_PATH}`);
    const restaurants = await parseCSV(CSV_FILE_PATH);
    console.log(`✅ Parsed ${restaurants.length} restaurants from CSV`);

    // Import to MongoDB
    const importedCount = await importRestaurants(restaurants);

    console.log('🎉 Import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseCSV,
  normalizeRestaurantData,
  importRestaurants
};