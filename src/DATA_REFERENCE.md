# Static Data Reference

This document provides a quick reference to all static data in the application located in `/utils/staticData.ts`.

## Destinations (6 total)

### 1. Great Barrier Reef Adventure
- **ID:** 1
- **Location:** Queensland, Australia
- **Category:** Nature
- **Region:** QLD
- **Price:** $250/night
- **Best Time:** June to October
- **Description:** World's largest coral reef system with pristine waters and vibrant marine life

### 2. Sydney Harbor Experience
- **ID:** 2
- **Location:** Sydney, NSW
- **Category:** City
- **Region:** NSW
- **Price:** $300/night
- **Best Time:** September to November, March to May
- **Description:** Iconic landmarks including Opera House and Harbor Bridge

### 3. Uluru Sacred Journey
- **ID:** 3
- **Location:** Northern Territory, Australia
- **Category:** Cultural
- **Region:** NT
- **Price:** $220/night
- **Best Time:** May to September
- **Description:** Spiritual heart of Australia with indigenous cultural experiences

### 4. Daintree Rainforest Retreat
- **ID:** 4
- **Location:** Queensland, Australia
- **Category:** Nature
- **Region:** QLD
- **Price:** $280/night
- **Best Time:** May to September
- **Description:** World's oldest tropical rainforest with unique wildlife

### 5. Melbourne Arts & Culture
- **ID:** 5
- **Location:** Melbourne, VIC
- **Category:** City
- **Region:** VIC
- **Price:** $270/night
- **Best Time:** March to May, September to November
- **Description:** Australia's cultural capital with galleries and street art

### 6. Whitsunday Islands Paradise
- **ID:** 6
- **Location:** Queensland, Australia
- **Category:** Beach
- **Region:** QLD
- **Price:** $320/night
- **Best Time:** June to September
- **Description:** Crystal-clear waters and pristine white sand beaches

## Tours (6 total)

### 1. Great Barrier Reef Diving Expedition
- **ID:** t1
- **Duration:** 3 Days
- **Price:** $1,200
- **Max Group:** 12 people
- **Difficulty:** Moderate
- **Category:** Adventure

### 2. Outback Explorer Tour
- **ID:** t2
- **Duration:** 5 Days
- **Price:** $1,800
- **Max Group:** 16 people
- **Difficulty:** Easy
- **Category:** Cultural

### 3. Tasmania Wilderness Trek
- **ID:** t3
- **Duration:** 6 Days
- **Price:** $2,100
- **Max Group:** 10 people
- **Difficulty:** Challenging
- **Category:** Adventure

### 4. Sydney Food & Wine Experience
- **ID:** t4
- **Duration:** 2 Days
- **Price:** $950
- **Max Group:** 20 people
- **Difficulty:** Easy
- **Category:** Food & Wine

### 5. Kakadu National Park Safari
- **ID:** t5
- **Duration:** 4 Days
- **Price:** $1,650
- **Max Group:** 14 people
- **Difficulty:** Moderate
- **Category:** Wildlife

### 6. Great Ocean Road Coastal Drive
- **ID:** t6
- **Duration:** 3 Days
- **Price:** $890
- **Max Group:** 18 people
- **Difficulty:** Easy
- **Category:** Nature

## Blog Posts (6 total)

### 1. Ultimate Guide to Exploring the Great Barrier Reef
- **ID:** b1
- **Author:** Sarah Mitchell
- **Date:** 2025-01-20
- **Category:** Nature
- **Read Time:** 8 min

### 2. Hidden Gems: Sydney Beyond the Opera House
- **ID:** b2
- **Author:** James Chen
- **Date:** 2025-01-18
- **Category:** City
- **Read Time:** 6 min

### 3. Aboriginal Culture: Respectful Travel in Indigenous Australia
- **ID:** b3
- **Author:** Emily Nguyen
- **Date:** 2025-01-15
- **Category:** Cultural
- **Read Time:** 10 min

### 4. Tasmania's Wilderness: A Photographer's Paradise
- **ID:** b4
- **Author:** Michael Torres
- **Date:** 2025-01-12
- **Category:** Nature
- **Read Time:** 7 min

### 5. Sustainable Travel: Protecting Australia's Natural Wonders
- **ID:** b5
- **Author:** Rebecca Johnson
- **Date:** 2025-01-10
- **Category:** Sustainability
- **Read Time:** 9 min

### 6. Australian Wine Regions: A Sommelier's Guide
- **ID:** b6
- **Author:** David Williams
- **Date:** 2025-01-08
- **Category:** Food & Wine
- **Read Time:** 11 min

## Reviews (6 total)

Distributed across destinations 1, 2, 3, and 4:
- Great Barrier Reef: 2 reviews (5 stars each)
- Sydney Harbor: 2 reviews (4-5 stars)
- Uluru: 1 review (5 stars)
- Daintree Rainforest: 1 review (5 stars)

## Categories Used

### Destination Categories
- Adventure
- Cultural
- Nature
- Beach
- City
- Historical
- Wildlife
- Luxury

### Tour Categories
- Adventure
- Cultural
- Wildlife
- Food & Wine
- Nature

### Blog Categories
- Nature
- City
- Cultural
- Food & Wine
- Sustainability

## Regions (Australian States/Territories)
- NSW (New South Wales)
- VIC (Victoria)
- QLD (Queensland)
- WA (Western Australia)
- SA (South Australia)
- TAS (Tasmania)
- NT (Northern Territory)
- ACT (Australian Capital Territory)

## Image Sources
All images are sourced from Unsplash with appropriate URLs. Each destination has:
- 1 main image
- 3 gallery images

## Adding New Data

To add new destinations, tours, or blog posts, edit `/utils/staticData.ts`:

```typescript
// Add new destination
export const destinations: Destination[] = [
  // ... existing destinations
  {
    id: '7',
    title: 'New Destination',
    location: 'Location, State',
    description: 'Description...',
    image_url: 'https://images.unsplash.com/...',
    gallery_urls: ['url1', 'url2', 'url3'],
    category: 'Category',
    region: 'State',
    best_time_to_visit: 'Month to Month',
    price_per_night: 250,
    created_at: '2025-01-01T00:00:00Z'
  }
];
```

## Data Relationships
- Reviews reference destination IDs
- Mock trips reference destination IDs
- Mock saved destinations store destination IDs

When migrating to a real backend, maintain these relationships through foreign keys or document references.
