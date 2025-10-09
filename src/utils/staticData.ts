// Static data simulating backend API responses

export interface Destination {
  id: string;
  title: string;
  location: string;
  description: string;
  image_url: string;
  gallery_urls: string[];
  category: string;
  region: string;
  best_time_to_visit: string;
  price_per_night: number;
  created_at: string;
}

export interface Tour {
  id: string;
  title: string;
  location: string;
  description: string;
  image_url: string;
  duration: string;
  price: number;
  max_group_size: number;
  difficulty: string;
  category: string;
  highlights: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  date: string;
  category: string;
  read_time: string;
}

export interface Review {
  id: string;
  destination_id: string;
  user_name: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Trip {
  id: string;
  destination_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
}

export interface Booking {
  id: string;
  tour_id: string;
  tour_title: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_date: string;
  guests: number;
  total_price: number;
  special_requests: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export const destinations: Destination[] = [
  {
    id: '1',
    title: 'Great Barrier Reef Adventure',
    location: 'Queensland, Australia',
    description: 'Explore the world\'s largest coral reef system with pristine waters, vibrant marine life, and unforgettable snorkeling experiences.',
    image_url: 'https://images.unsplash.com/photo-1587139223877-04cb899fa3e8?w=800',
    gallery_urls: [
      'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'
    ],
    category: 'Nature',
    region: 'QLD',
    best_time_to_visit: 'June to October',
    price_per_night: 250,
    created_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Sydney Harbor Experience',
    location: 'Sydney, NSW',
    description: 'Discover iconic landmarks including the Opera House and Harbor Bridge, world-class dining, and stunning harbor views.',
    image_url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
    gallery_urls: [
      'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800',
      'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=800',
      'https://images.unsplash.com/photo-1549180030-48bf079fb38a?w=800'
    ],
    category: 'City',
    region: 'NSW',
    best_time_to_visit: 'September to November, March to May',
    price_per_night: 300,
    created_at: '2025-01-14T10:00:00Z'
  },
  {
    id: '3',
    title: 'Uluru Sacred Journey',
    location: 'Northern Territory, Australia',
    description: 'Experience the spiritual heart of Australia with guided tours of this sacred monolith and indigenous cultural experiences.',
    image_url: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=800',
    gallery_urls: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800',
      'https://images.unsplash.com/photo-1601645590797-f09c7f1c3c0e?w=800'
    ],
    category: 'Cultural',
    region: 'NT',
    best_time_to_visit: 'May to September',
    price_per_night: 220,
    created_at: '2025-01-13T10:00:00Z'
  },
  {
    id: '4',
    title: 'Daintree Rainforest Retreat',
    location: 'Queensland, Australia',
    description: 'Immerse yourself in the world\'s oldest tropical rainforest with unique wildlife, pristine beaches, and ancient ecosystems.',
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    gallery_urls: [
      'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800',
      'https://images.unsplash.com/photo-1511497584788-876760111969?w=800'
    ],
    category: 'Nature',
    region: 'QLD',
    best_time_to_visit: 'May to September',
    price_per_night: 280,
    created_at: '2025-01-12T10:00:00Z'
  },
  {
    id: '5',
    title: 'Melbourne Arts & Culture',
    location: 'Melbourne, VIC',
    description: 'Experience Australia\'s cultural capital with world-renowned galleries, laneway cafes, and vibrant street art scenes.',
    image_url: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?w=800',
    gallery_urls: [
      'https://images.unsplash.com/photo-1545044846-351ba102b6d5?w=800',
      'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
    ],
    category: 'City',
    region: 'VIC',
    best_time_to_visit: 'March to May, September to November',
    price_per_night: 270,
    created_at: '2025-01-11T10:00:00Z'
  },
  {
    id: '6',
    title: 'Whitsunday Islands Paradise',
    location: 'Queensland, Australia',
    description: 'Sail through crystal-clear waters, relax on pristine white sand beaches, and explore stunning coral gardens.',
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    gallery_urls: [
      'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800'
    ],
    category: 'Beach',
    region: 'QLD',
    best_time_to_visit: 'June to September',
    price_per_night: 320,
    created_at: '2025-01-10T10:00:00Z'
  }
];

export const tours: Tour[] = [
  {
    id: 't1',
    title: 'Great Barrier Reef Diving Expedition',
    location: 'Cairns, Queensland',
    description: 'Join our expert-guided 3-day diving adventure exploring the most spectacular coral reefs and marine life of the Great Barrier Reef.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    duration: '3 Days',
    price: 1200,
    max_group_size: 12,
    difficulty: 'Moderate',
    category: 'Adventure',
    highlights: [
      'Professional diving instruction',
      'Visit 5+ diving sites',
      'Marine biologist guide',
      'All equipment included'
    ]
  },
  {
    id: 't2',
    title: 'Outback Explorer Tour',
    location: 'Uluru, Northern Territory',
    description: 'Discover the ancient landscapes and rich Aboriginal culture of Central Australia on this immersive 5-day journey.',
    image_url: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=800',
    duration: '5 Days',
    price: 1800,
    max_group_size: 16,
    difficulty: 'Easy',
    category: 'Cultural',
    highlights: [
      'Sunrise at Uluru',
      'Aboriginal cultural experiences',
      'Star gazing tours',
      'Traditional bush tucker tastings'
    ]
  },
  {
    id: 't3',
    title: 'Tasmania Wilderness Trek',
    location: 'Cradle Mountain, Tasmania',
    description: 'Trek through pristine wilderness, ancient rainforests, and rugged mountain peaks on this challenging 6-day adventure.',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    duration: '6 Days',
    price: 2100,
    max_group_size: 10,
    difficulty: 'Challenging',
    category: 'Adventure',
    highlights: [
      'Cradle Mountain summit',
      'Lake St Clair exploration',
      'Wildlife spotting',
      'Professional trekking guides'
    ]
  },
  {
    id: 't4',
    title: 'Sydney Food & Wine Experience',
    location: 'Sydney, NSW',
    description: 'Indulge in a culinary journey through Sydney\'s best restaurants, markets, and wine regions on this gourmet 2-day tour.',
    image_url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
    duration: '2 Days',
    price: 950,
    max_group_size: 20,
    difficulty: 'Easy',
    category: 'Food & Wine',
    highlights: [
      'Fine dining experiences',
      'Fish market tour',
      'Hunter Valley wine tasting',
      'Cooking masterclass'
    ]
  },
  {
    id: 't5',
    title: 'Kakadu National Park Safari',
    location: 'Northern Territory',
    description: 'Explore ancient rock art, wetlands teeming with wildlife, and stunning waterfalls on this 4-day safari adventure.',
    image_url: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800',
    duration: '4 Days',
    price: 1650,
    max_group_size: 14,
    difficulty: 'Moderate',
    category: 'Wildlife',
    highlights: [
      'Aboriginal rock art sites',
      'Crocodile spotting cruise',
      'Waterfall swimming',
      '4WD wilderness access'
    ]
  },
  {
    id: 't6',
    title: 'Great Ocean Road Coastal Drive',
    location: 'Victoria',
    description: 'Drive along one of the world\'s most scenic coastal routes, visiting the Twelve Apostles and charming seaside towns.',
    image_url: 'https://images.unsplash.com/photo-1545044846-351ba102b6d5?w=800',
    duration: '3 Days',
    price: 890,
    max_group_size: 18,
    difficulty: 'Easy',
    category: 'Nature',
    highlights: [
      'Twelve Apostles viewing',
      'Rainforest walks',
      'Coastal wildlife spotting',
      'Gourmet regional food'
    ]
  }
];

export const blogs: BlogPost[] = [
  {
    id: 'b1',
    title: 'Ultimate Guide to Exploring the Great Barrier Reef',
    excerpt: 'Discover everything you need to know about visiting one of the world\'s most spectacular natural wonders.',
    content: `The Great Barrier Reef is one of the seven natural wonders of the world, and for good reason. Stretching over 2,300 kilometers along the Queensland coast, this massive coral reef system is home to an incredible diversity of marine life.

## Best Time to Visit

The ideal time to visit the Great Barrier Reef is during the Australian winter months (June to October). During this period, you'll experience:
- Clear, calm waters perfect for diving and snorkeling
- Comfortable temperatures ranging from 23-27°C
- Lower humidity and minimal rainfall
- Excellent visibility underwater

## Top Activities

### Snorkeling and Diving
Whether you're a beginner or experienced diver, the reef offers experiences for all levels. Many tour operators provide guided snorkeling trips, while certified divers can explore deeper sections.

### Glass-Bottom Boat Tours
For those who prefer to stay dry, glass-bottom boat tours offer spectacular views of the coral and marine life without getting wet.

### Island Hopping
The Whitsunday Islands provide the perfect base for exploring different sections of the reef while enjoying luxury accommodations.

## Marine Life You'll Encounter

- Over 1,500 species of fish
- 400 types of coral
- Sea turtles and dugongs
- Manta rays and reef sharks
- Dolphins and whales (seasonal)

## Conservation Tips

Remember to practice responsible tourism:
- Don't touch the coral
- Use reef-safe sunscreen
- Follow your guide's instructions
- Take only photos, leave only bubbles`,
    image_url: 'https://images.unsplash.com/photo-1587139223877-04cb899fa3e8?w=800',
    author: 'Sarah Mitchell',
    date: '2025-01-20',
    category: 'Nature',
    read_time: '8 min read'
  },
  {
    id: 'b2',
    title: 'Hidden Gems: Sydney Beyond the Opera House',
    excerpt: 'Explore the lesser-known attractions and local favorites that make Sydney truly special.',
    content: `While the Sydney Opera House and Harbour Bridge are iconic, the city offers so much more for those willing to explore beyond the tourist hotspots.

## Secret Beaches

### Milk Beach
Tucked away in Vaucluse, this hidden gem offers stunning harbor views and calm waters perfect for swimming.

### Store Beach
Accessible only by a steep bush track, this secluded beach near Manly rewards adventurous visitors with pristine sands and clear waters.

## Laneway Discoveries

Sydney's laneways are filled with street art, boutique cafes, and hidden bars. Don't miss:
- Angel Place for its bird cage art installation
- The Rocks for historic pub crawls
- Surry Hills for trendy coffee spots

## Local Markets

### Carriageworks Farmers Market
Every Saturday, this market showcases the best local produce, artisan foods, and fresh flowers.

### Glebe Markets
A treasure trove of vintage clothing, handmade crafts, and delicious street food every Saturday.

## Inner-West Cafe Culture

The inner-west suburbs of Newtown, Marrickville, and Enmore offer some of Sydney's best cafes, restaurants, and live music venues away from the tourist crowds.`,
    image_url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
    author: 'James Chen',
    date: '2025-01-18',
    category: 'City',
    read_time: '6 min read'
  },
  {
    id: 'b3',
    title: 'Aboriginal Culture: Respectful Travel in Indigenous Australia',
    excerpt: 'Learn how to engage with Aboriginal culture respectfully and meaningfully during your Australian travels.',
    content: `Australia's Aboriginal culture is the oldest living culture in the world, spanning over 65,000 years. Engaging with this rich heritage requires respect, understanding, and mindfulness.

## Cultural Protocols

### Permission and Respect
Always seek permission before entering sacred sites or taking photographs of Aboriginal people or cultural sites.

### Acknowledgement of Country
Learn to acknowledge the traditional custodians of the land you're visiting.

## Authentic Experiences

### Guided Tours
Choose tours led by Aboriginal guides who can share their stories and knowledge firsthand.

### Art Centers
Visit Aboriginal-owned art centers to purchase authentic artwork directly from artists.

### Cultural Festivals
Attend cultural festivals and events that celebrate Aboriginal music, dance, and art.

## Sacred Sites

### Uluru-Kata Tjuta
Visit this sacred site with respect. Climbing Uluru is now prohibited out of respect for its cultural significance.

### Kakadu National Park
Explore ancient rock art sites with authorized guides who can explain their significance.

## Supporting Indigenous Communities

- Buy authentic art from reputable sources
- Choose tours operated by Aboriginal people
- Stay at Aboriginal-owned accommodations
- Learn about the local language and customs`,
    image_url: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=800',
    author: 'Emily Nguyen',
    date: '2025-01-15',
    category: 'Cultural',
    read_time: '10 min read'
  },
  {
    id: 'b4',
    title: 'Tasmania\'s Wilderness: A Photographer\'s Paradise',
    excerpt: 'Capture the raw beauty of Tasmania with our comprehensive photography guide.',
    content: `Tasmania offers some of Australia's most dramatic and photogenic landscapes, from rugged coastlines to ancient rainforests.

## Best Photography Locations

### Cradle Mountain
Photograph the iconic mountain reflected in Dove Lake at sunrise for unforgettable shots.

### Bay of Fires
Capture the contrast of orange lichen-covered rocks against white sand and turquoise waters.

### Wineglass Bay
Hike to the lookout for the classic curved bay shot, or descend to the beach for unique perspectives.

## Wildlife Photography Tips

Tasmania is home to unique wildlife including:
- Tasmanian devils
- Wombats
- Wallabies
- Platypus

Visit wildlife parks early morning or late afternoon for best lighting and active animals.

## Seasonal Considerations

### Autumn (March-May)
Brilliant fall colors in deciduous trees, particularly around Cradle Mountain.

### Winter (June-August)
Snow-capped mountains and dramatic moody skies.

### Spring (September-November)
Wildflowers and baby wildlife.

## Essential Gear

- Wide-angle lens for landscapes
- Telephoto lens for wildlife
- Neutral density filters for waterfalls
- Weatherproof camera bag`,
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    author: 'Michael Torres',
    date: '2025-01-12',
    category: 'Nature',
    read_time: '7 min read'
  },
  {
    id: 'b5',
    title: 'Sustainable Travel: Protecting Australia\'s Natural Wonders',
    excerpt: 'How to minimize your environmental impact while exploring Australia\'s incredible landscapes.',
    content: `As travelers, we have a responsibility to protect the natural wonders we visit. Here's how to travel sustainably in Australia.

## Leave No Trace Principles

### Plan Ahead
Research your destination and understand local regulations and environmental concerns.

### Stick to Trails
Prevent erosion and protect native vegetation by staying on marked paths.

### Pack It In, Pack It Out
Take all your rubbish with you, including organic waste like fruit peels.

## Wildlife Protection

### Observe from Distance
Use binoculars or telephoto lenses instead of approaching wildlife.

### Don't Feed Wildlife
Feeding animals disrupts natural behaviors and can make them dependent on humans.

### Respect Nesting Areas
Keep well away from nesting sites, especially during breeding seasons.

## Sustainable Accommodation

Choose eco-certified accommodations that:
- Use renewable energy
- Implement water conservation
- Support local communities
- Minimize waste

## Reduce Your Carbon Footprint

- Choose direct flights when possible
- Use public transport or bike rentals
- Join group tours to reduce vehicle numbers
- Offset your carbon emissions

## Support Conservation

- Visit national parks (fees support conservation)
- Volunteer for environmental projects
- Donate to conservation organizations
- Choose tour operators committed to sustainability`,
    image_url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800',
    author: 'Rebecca Johnson',
    date: '2025-01-10',
    category: 'Sustainability',
    read_time: '9 min read'
  },
  {
    id: 'b6',
    title: 'Australian Wine Regions: A Sommelier\'s Guide',
    excerpt: 'Explore Australia\'s premier wine regions and discover world-class vintages.',
    content: `Australia produces some of the world's finest wines. Let's explore the top wine regions you shouldn't miss.

## Hunter Valley, NSW

Australia's oldest wine region, just 2 hours from Sydney.

### What to Try
- Semillon (the region's signature wine)
- Shiraz
- Chardonnay

### Top Wineries
- Tyrrell's Wines
- Brokenwood Wines
- Audrey Wilkinson

## Barossa Valley, SA

Known for rich, full-bodied reds, particularly Shiraz.

### What to Try
- Shiraz (the region's specialty)
- Grenache
- Riesling

### Experience
- Multi-generational family wineries
- German heritage influence
- Gourmet food producers

## Yarra Valley, VIC

Cool-climate wines with elegance and finesse.

### What to Try
- Pinot Noir
- Chardonnay
- Sparkling wines

### Unique Features
- Just 1 hour from Melbourne
- Stunning mountain views
- Excellent restaurants

## Margaret River, WA

Premium wines in a stunning coastal setting.

### What to Try
- Cabernet Sauvignon
- Chardonnay
- Sauvignon Blanc Semillon blends

## Wine Tasting Tips

- Start with lighter wines, progress to fuller
- Spit if tasting multiple wines
- Drink water between tastings
- Book a driver or join a tour`,
    image_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800',
    author: 'David Williams',
    date: '2025-01-08',
    category: 'Food & Wine',
    read_time: '11 min read'
  }
];

export const reviews: Review[] = [
  {
    id: 'r1',
    destination_id: '1',
    user_name: 'John Smith',
    rating: 5,
    comment: 'Absolutely incredible experience! The marine life was breathtaking and the guides were knowledgeable.',
    date: '2025-01-05',
    status: 'approved'
  },
  {
    id: 'r2',
    destination_id: '1',
    user_name: 'Emma Wilson',
    rating: 5,
    comment: 'A once in a lifetime trip. The coral reefs are even more beautiful in person!',
    date: '2025-01-03',
    status: 'approved'
  },
  {
    id: 'r3',
    destination_id: '2',
    user_name: 'Michael Brown',
    rating: 4,
    comment: 'Great city experience. Loved the Opera House tour and harbor cruise.',
    date: '2024-12-28',
    status: 'approved'
  },
  {
    id: 'r4',
    destination_id: '2',
    user_name: 'Sophie Taylor',
    rating: 5,
    comment: 'Sydney exceeded all expectations! So much to see and do.',
    date: '2024-12-25',
    status: 'approved'
  },
  {
    id: 'r5',
    destination_id: '3',
    user_name: 'David Lee',
    rating: 5,
    comment: 'A spiritual and unforgettable experience. The sunset at Uluru is magical.',
    date: '2024-12-20',
    status: 'approved'
  },
  {
    id: 'r6',
    destination_id: '4',
    user_name: 'Lisa Anderson',
    rating: 5,
    comment: 'The rainforest is stunning! Saw so much unique wildlife.',
    date: '2024-12-15',
    status: 'approved'
  },
  {
    id: 'r7',
    destination_id: '5',
    user_name: 'Alex Thompson',
    rating: 5,
    comment: 'Melbourne is fantastic! The coffee culture and street art are amazing.',
    date: '2025-01-08',
    status: 'pending'
  },
  {
    id: 'r8',
    destination_id: '6',
    user_name: 'Jessica Martinez',
    rating: 4,
    comment: 'Beautiful islands and clear waters. Perfect for relaxation.',
    date: '2025-01-07',
    status: 'pending'
  },
  {
    id: 'r9',
    destination_id: '1',
    user_name: 'Tom Harris',
    rating: 5,
    comment: 'Best diving experience ever! The guides were professional and friendly.',
    date: '2025-01-06',
    status: 'pending'
  }
];

// Mock user trips data
export const mockTrips: Trip[] = [
  {
    id: 'trip1',
    destination_id: '1',
    check_in: '2025-02-15',
    check_out: '2025-02-20',
    guests: 2,
    total_price: 1250,
    status: 'confirmed'
  },
  {
    id: 'trip2',
    destination_id: '3',
    check_in: '2025-03-10',
    check_out: '2025-03-15',
    guests: 4,
    total_price: 1100,
    status: 'confirmed'
  }
];

// Mock saved destinations
export const mockSavedDestinations: string[] = ['1', '2', '4'];

// Mock bookings data
export const bookings: Booking[] = [
  {
    id: 'bk1',
    tour_id: 't1',
    tour_title: 'Great Barrier Reef Diving Expedition',
    customer_name: 'Sarah Johnson',
    customer_email: 'sarah.j@email.com',
    customer_phone: '+61 412 345 678',
    start_date: '2025-02-15',
    guests: 2,
    total_price: 2400,
    special_requests: 'Vegetarian meals please',
    status: 'confirmed',
    created_at: '2025-01-20T10:00:00Z'
  },
  {
    id: 'bk2',
    tour_id: 't2',
    tour_title: 'Outback Explorer Tour',
    customer_name: 'Mark Wilson',
    customer_email: 'mark.wilson@email.com',
    customer_phone: '+61 423 456 789',
    start_date: '2025-03-01',
    guests: 4,
    total_price: 7200,
    special_requests: 'Need wheelchair accessible vehicle',
    status: 'confirmed',
    created_at: '2025-01-18T14:30:00Z'
  },
  {
    id: 'bk3',
    tour_id: 't3',
    tour_title: 'Tasmania Wilderness Trek',
    customer_name: 'Emily Chen',
    customer_email: 'emily.chen@email.com',
    customer_phone: '+61 434 567 890',
    start_date: '2025-03-15',
    guests: 2,
    total_price: 4200,
    special_requests: 'None',
    status: 'pending',
    created_at: '2025-01-22T09:15:00Z'
  },
  {
    id: 'bk4',
    tour_id: 't4',
    tour_title: 'Sydney Food & Wine Experience',
    customer_name: 'Robert Taylor',
    customer_email: 'rob.taylor@email.com',
    customer_phone: '+61 445 678 901',
    start_date: '2025-02-20',
    guests: 2,
    total_price: 1900,
    special_requests: 'Wine allergy - prefer beer tastings',
    status: 'confirmed',
    created_at: '2025-01-19T16:45:00Z'
  },
  {
    id: 'bk5',
    tour_id: 't5',
    tour_title: 'Kakadu National Park Safari',
    customer_name: 'Amanda White',
    customer_email: 'amanda.w@email.com',
    customer_phone: '+61 456 789 012',
    start_date: '2025-04-10',
    guests: 3,
    total_price: 4950,
    special_requests: 'Celebrating anniversary - any special touches appreciated',
    status: 'pending',
    created_at: '2025-01-23T11:20:00Z'
  },
  {
    id: 'bk6',
    tour_id: 't6',
    tour_title: 'Great Ocean Road Coastal Drive',
    customer_name: 'James Brown',
    customer_email: 'j.brown@email.com',
    customer_phone: '+61 467 890 123',
    start_date: '2025-02-28',
    guests: 2,
    total_price: 1780,
    special_requests: 'Photography enthusiast - extra stops for photos would be great',
    status: 'confirmed',
    created_at: '2025-01-21T13:00:00Z'
  },
  {
    id: 'bk7',
    tour_id: 't1',
    tour_title: 'Great Barrier Reef Diving Expedition',
    customer_name: 'Lisa Rodriguez',
    customer_email: 'lisa.r@email.com',
    customer_phone: '+61 478 901 234',
    start_date: '2025-03-20',
    guests: 1,
    total_price: 1200,
    special_requests: 'First time diver - need extra instruction',
    status: 'pending',
    created_at: '2025-01-24T08:30:00Z'
  }
];
