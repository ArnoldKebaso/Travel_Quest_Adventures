#!/usr/bin/env node

/**
 * 🌱 TravelQuest Development Data Seeding Script
 * Academic Excellence: Comprehensive sample data for development and testing
 * 
 * Features:
 * - Realistic travel destination data
 * - Multiple categories and regions
 * - Rich metadata for testing
 * - Performance data for analytics
 * - User-generated content samples
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

// Configure DynamoDB client for local development
const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000'
});

const docClient = DynamoDBDocumentClient.from(client);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.cyan) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function error(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

// Comprehensive seed data for academic excellence
const seedDestinations = [
  {
    id: '1',
    name: 'Great Barrier Reef Marine Park',
    description: 'Explore the world\'s largest coral reef system with over 2,900 individual reefs and 900 islands stretching over 2,300 kilometers. A UNESCO World Heritage site offering unparalleled marine biodiversity.',
    price: 2500,
    category: 'adventure',
    region: 'oceania',
    country: 'Australia',
    city: 'Cairns',
    coordinates: { lat: -16.2899, lng: 145.7781 },
    images: [
      'https://example.com/great-barrier-reef-1.jpg',
      'https://example.com/great-barrier-reef-2.jpg',
      'https://example.com/great-barrier-reef-3.jpg'
    ],
    amenities: ['snorkeling_gear', 'guided_tours', 'underwater_photography', 'marine_biologist_guide', 'reef_protection_briefing'],
    activities: ['snorkeling', 'scuba_diving', 'glass_bottom_boat', 'helicopter_tour', 'island_hopping'],
    rating: 4.8,
    reviewCount: 1247,
    difficulty: 'moderate',
    duration: '3-7 days',
    bestTimeToVisit: 'May-October',
    tags: ['unesco_heritage', 'marine_life', 'coral_reef', 'diving', 'conservation'],
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  {
    id: '2',
    name: 'Milford Sound Fjord Experience',
    description: 'Journey through New Zealand\'s most spectacular fjord, featuring towering waterfalls, pristine rainforests, and dramatic peaks. Rudyard Kipling called it the eighth wonder of the world.',
    price: 1800,
    category: 'nature',
    region: 'oceania',
    country: 'New Zealand',
    city: 'Queenstown',
    coordinates: { lat: -44.6773, lng: 167.9264 },
    images: [
      'https://example.com/milford-sound-1.jpg',
      'https://example.com/milford-sound-2.jpg'
    ],
    amenities: ['scenic_cruise', 'wildlife_viewing', 'photography_guide', 'weather_protection', 'onboard_dining'],
    activities: ['fjord_cruise', 'wildlife_watching', 'waterfall_viewing', 'photography', 'nature_walks'],
    rating: 4.9,
    reviewCount: 892,
    difficulty: 'easy',
    duration: '1-2 days',
    bestTimeToVisit: 'October-April',
    tags: ['fjord', 'waterfall', 'wildlife', 'scenic_cruise', 'world_heritage'],
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString()
  },
  {
    id: '3',
    name: 'Blue Mountains Cultural Heritage Trail',
    description: 'Discover Aboriginal culture and colonial history in the stunning Blue Mountains. Experience ancient rock art, learn traditional stories, and enjoy breathtaking eucalyptus forest views.',
    price: 950,
    category: 'cultural',
    region: 'oceania',
    country: 'Australia',
    city: 'Sydney',
    coordinates: { lat: -33.7094, lng: 150.3128 },
    images: [
      'https://example.com/blue-mountains-1.jpg',
      'https://example.com/blue-mountains-2.jpg',
      'https://example.com/blue-mountains-3.jpg'
    ],
    amenities: ['aboriginal_guide', 'cultural_center', 'bush_tucker_tasting', 'art_workshops', 'storytelling'],
    activities: ['rock_art_viewing', 'bush_walking', 'cultural_workshops', 'traditional_ceremonies', 'nature_photography'],
    rating: 4.6,
    reviewCount: 534,
    difficulty: 'easy',
    duration: '1-3 days',
    bestTimeToVisit: 'March-May, September-November',
    tags: ['aboriginal_culture', 'rock_art', 'heritage', 'bush_walking', 'education'],
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString()
  },
  {
    id: '4',
    name: 'Luxury Maldives Resort Experience',
    description: 'Indulge in ultimate luxury at an overwater villa resort in the pristine Maldives. Crystal-clear waters, white sand beaches, and world-class spa treatments await.',
    price: 8500,
    category: 'luxury',
    region: 'asia',
    country: 'Maldives',
    city: 'Malé',
    coordinates: { lat: 3.2028, lng: 73.2207 },
    images: [
      'https://example.com/maldives-1.jpg',
      'https://example.com/maldives-2.jpg',
      'https://example.com/maldives-3.jpg',
      'https://example.com/maldives-4.jpg'
    ],
    amenities: ['overwater_villa', 'private_beach', 'spa_services', 'fine_dining', 'butler_service', 'infinity_pool'],
    activities: ['snorkeling', 'sunset_cruise', 'spa_treatments', 'fine_dining', 'water_sports', 'dolphin_watching'],
    rating: 4.9,
    reviewCount: 756,
    difficulty: 'easy',
    duration: '5-14 days',
    bestTimeToVisit: 'November-April',
    tags: ['luxury', 'overwater_villa', 'spa', 'romantic', 'tropical_paradise'],
    createdAt: new Date('2024-02-10').toISOString(),
    updatedAt: new Date('2024-02-10').toISOString()
  },
  {
    id: '5',
    name: 'Amazon Rainforest Eco-Adventure',
    description: 'Immerse yourself in the world\'s largest tropical rainforest. Stay in eco-lodges, spot exotic wildlife, and learn about conservation efforts from local guides.',
    price: 3200,
    category: 'adventure',
    region: 'south_america',
    country: 'Brazil',
    city: 'Manaus',
    coordinates: { lat: -3.1190, lng: -60.0217 },
    images: [
      'https://example.com/amazon-1.jpg',
      'https://example.com/amazon-2.jpg'
    ],
    amenities: ['eco_lodge', 'expert_guides', 'wildlife_equipment', 'canoe_tours', 'night_walks'],
    activities: ['wildlife_spotting', 'canoe_expeditions', 'night_walks', 'bird_watching', 'indigenous_visits'],
    rating: 4.7,
    reviewCount: 423,
    difficulty: 'challenging',
    duration: '7-14 days',
    bestTimeToVisit: 'June-November',
    tags: ['rainforest', 'wildlife', 'eco_tourism', 'conservation', 'indigenous_culture'],
    createdAt: new Date('2024-02-15').toISOString(),
    updatedAt: new Date('2024-02-15').toISOString()
  },
  {
    id: '6',
    name: 'Bali Spiritual Wellness Retreat',
    description: 'Rejuvenate your mind, body, and spirit in the cultural heart of Bali. Daily yoga, meditation, traditional healing, and organic cuisine in a sacred mountain setting.',
    price: 2100,
    category: 'wellness',
    region: 'asia',
    country: 'Indonesia',
    city: 'Ubud',
    coordinates: { lat: -8.5069, lng: 115.2625 },
    images: [
      'https://example.com/bali-1.jpg',
      'https://example.com/bali-2.jpg',
      'https://example.com/bali-3.jpg'
    ],
    amenities: ['yoga_pavilion', 'meditation_garden', 'spa_treatments', 'organic_meals', 'healing_ceremonies'],
    activities: ['daily_yoga', 'meditation', 'traditional_healing', 'temple_visits', 'rice_terrace_walks'],
    rating: 4.8,
    reviewCount: 687,
    difficulty: 'easy',
    duration: '7-21 days',
    bestTimeToVisit: 'April-October',
    tags: ['wellness', 'yoga', 'meditation', 'spiritual', 'healing'],
    createdAt: new Date('2024-02-20').toISOString(),
    updatedAt: new Date('2024-02-20').toISOString()
  },
  {
    id: '7',
    name: 'Antarctic Expedition Cruise',
    description: 'Journey to the bottom of the world on an expedition cruise to Antarctica. Witness massive icebergs, diverse wildlife, and pristine wilderness in Earth\'s last frontier.',
    price: 12000,
    category: 'adventure',
    region: 'antarctica',
    country: 'Antarctica',
    city: 'Ushuaia (Departure)',
    coordinates: { lat: -77.8500, lng: 166.6000 },
    images: [
      'https://example.com/antarctica-1.jpg',
      'https://example.com/antarctica-2.jpg'
    ],
    amenities: ['expedition_ship', 'expert_naturalists', 'zodiac_boats', 'all_weather_gear', 'lectures'],
    activities: ['wildlife_viewing', 'zodiac_excursions', 'iceberg_photography', 'penguin_colonies', 'research_stations'],
    rating: 4.9,
    reviewCount: 234,
    difficulty: 'challenging',
    duration: '10-21 days',
    bestTimeToVisit: 'November-March',
    tags: ['expedition', 'wildlife', 'penguins', 'icebergs', 'pristine_wilderness'],
    createdAt: new Date('2024-03-01').toISOString(),
    updatedAt: new Date('2024-03-01').toISOString()
  },
  {
    id: '8',
    name: 'Kyoto Traditional Arts Experience',
    description: 'Immerse yourself in traditional Japanese culture through tea ceremony, calligraphy, kimono wearing, and visits to ancient temples and zen gardens.',
    price: 1650,
    category: 'cultural',
    region: 'asia',
    country: 'Japan',
    city: 'Kyoto',
    coordinates: { lat: 35.0116, lng: 135.7681 },
    images: [
      'https://example.com/kyoto-1.jpg',
      'https://example.com/kyoto-2.jpg',
      'https://example.com/kyoto-3.jpg'
    ],
    amenities: ['tea_house', 'kimono_rental', 'calligraphy_studio', 'temple_access', 'cultural_guide'],
    activities: ['tea_ceremony', 'calligraphy_lessons', 'temple_meditation', 'garden_contemplation', 'traditional_crafts'],
    rating: 4.7,
    reviewCount: 512,
    difficulty: 'easy',
    duration: '3-7 days',
    bestTimeToVisit: 'March-May, October-November',
    tags: ['traditional_culture', 'tea_ceremony', 'temples', 'zen', 'crafts'],
    createdAt: new Date('2024-03-05').toISOString(),
    updatedAt: new Date('2024-03-05').toISOString()
  }
];

async function checkExistingData() {
  try {
    const scanCommand = new ScanCommand({
      TableName: 'TravelQuest-Destinations-local',
      Select: 'COUNT'
    });
    
    const result = await docClient.send(scanCommand);
    return result.Count || 0;
  } catch (error) {
    return 0;
  }
}

async function seedDestination(destination) {
  try {
    const putCommand = new PutCommand({
      TableName: 'TravelQuest-Destinations-local',
      Item: destination
    });
    
    await docClient.send(putCommand);
    return true;
  } catch (error) {
    console.error(`Failed to seed destination ${destination.name}:`, error.message);
    return false;
  }
}

async function main() {
  log('🌱 TravelQuest Data Seeding Starting...\\n', colors.blue);
  
  try {
    // Check if data already exists
    const existingCount = await checkExistingData();
    
    if (existingCount > 0) {
      log(`⚠️  Found ${existingCount} existing destinations`, colors.yellow);
      console.log('Do you want to proceed and add more sample data? (y/N): ');
      
      // For automated setup, we'll skip the prompt and just add data
      log('Adding additional sample data...', colors.cyan);
    }
    
    log('📊 Seeding destination data...', colors.cyan);
    
    let successCount = 0;
    let failureCount = 0;
    
    for (const destination of seedDestinations) {
      const success = await seedDestination(destination);
      if (success) {
        successCount++;
        log(`✅ Seeded: ${destination.name}`, colors.green);
      } else {
        failureCount++;
        error(`❌ Failed: ${destination.name}`);
      }
    }
    
    // Summary
    log(`\\n🎉 Data seeding completed!`, colors.bright);
    success(`Successfully seeded: ${successCount} destinations`);
    
    if (failureCount > 0) {
      error(`Failed to seed: ${failureCount} destinations`);
    }
    
    // Performance data summary
    log(`\\n📈 Sample Data Statistics:`, colors.cyan);
    console.log(`- Total destinations: ${seedDestinations.length}`);
    console.log(`- Categories: ${[...new Set(seedDestinations.map(d => d.category))].join(', ')}`);
    console.log(`- Regions: ${[...new Set(seedDestinations.map(d => d.region))].join(', ')}`);
    console.log(`- Price range: $${Math.min(...seedDestinations.map(d => d.price))} - $${Math.max(...seedDestinations.map(d => d.price))}`);
    console.log(`- Average rating: ${(seedDestinations.reduce((sum, d) => sum + d.rating, 0) / seedDestinations.length).toFixed(1)}`);
    
    log(`\\n🚀 Ready for development and testing!`, colors.green);
    
  } catch (error) {
    error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);
