# TravelQuest Adventures

A modern, responsive travel application showcasing Australian destinations, tours, and travel content. Built with React, TypeScript, and Tailwind CSS as a pure frontend application ready to integrate with AWS serverless backend services.

## Features

### 🏠 Pages
- **Home** - Hero section with featured destinations and key features
- **Destinations** - Browse all destinations with advanced search and filters
- **Tours** - Explore guided tour packages with detailed information
- **Blogs** - Read travel articles and guides
- **About** - Learn about TravelQuest and meet the team
- **Contact** - Get in touch with contact form and information

### ✨ Key Functionality
- **Destination Browsing** - Search, filter by category/region, sort by price/date
- **Destination Details** - Full destination pages with image galleries and reviews
- **Booking System** - Complete booking forms with date selection and validation
- **Tour Packages** - Browse and view detailed tour information
- **Blog System** - Full blog posts with categories and search
- **Reviews & Ratings** - Display user reviews and ratings
- **Responsive Design** - Mobile-friendly interface across all pages

### 🎨 Design Features
- Clean, modern UI with cohesive design system
- Smooth animations and transitions
- Image galleries with lightbox functionality
- Card-based layouts for content
- Sticky navigation and filters
- Toast notifications for user feedback

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Shadcn/ui** - Component library
- **Lucide React** - Icons
- **Sonner** - Toast notifications

## Project Structure

```
/
├── components/
│   ├── About.tsx           # About page
│   ├── Blogs.tsx           # Blog listing and detail
│   ├── BookingForm.tsx     # Booking form component
│   ├── Contact.tsx         # Contact page
│   ├── DestinationDetail.tsx # Destination detail page
│   ├── Footer.tsx          # Footer component
│   ├── Home.tsx            # Homepage
│   ├── Navigation.tsx      # Navigation bar
│   ├── Tours.tsx           # Tours page
│   ├── TravelListings.tsx  # Destinations listing
│   └── ui/                 # Shadcn UI components
├── utils/
│   └── staticData.ts       # Static data (destinations, tours, blogs, reviews)
├── styles/
│   └── globals.css         # Global styles and Tailwind config
└── App.tsx                 # Main app component with routing
```

## Static Data

The application uses static data defined in `/utils/staticData.ts` that simulates backend API responses:

- **6 Destinations** - Australian travel destinations
- **6 Tours** - Guided tour packages
- **6 Blog Posts** - Travel articles and guides
- **Reviews** - User reviews for destinations

This data structure is designed to be easily replaced with real API calls to AWS services.

## AWS Backend Integration

The application is ready to integrate with AWS serverless services:

### Suggested AWS Services
- **API Gateway** - REST API endpoints
- **Lambda** - Serverless functions for business logic
- **DynamoDB** - NoSQL database for destinations, tours, bookings
- **S3** - Image and media storage
- **CloudFront** - CDN for static assets
- **Cognito** - User authentication (optional)
- **SES** - Email notifications for bookings

### Integration Points
Replace static data imports with API calls:
```typescript
// Current
import { destinations } from '../utils/staticData';

// With AWS
const response = await fetch('https://api.travelquest.com/destinations');
const destinations = await response.json();
```

## Form Validation

The booking form includes comprehensive validation:
- Date validation (no past dates, check-out after check-in)
- Maximum trip duration: 30 days
- Guest count: 1-50 guests
- Email format validation
- Required field validation

## Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- User authentication and profiles
- Real-time booking availability
- Payment processing integration
- Multi-language support
- Favorites/wishlist functionality
- Advanced search with map view
- Social sharing capabilities
- Email notifications
- Admin content management

## License

© 2025 TravelQuest Adventures. All rights reserved.
