import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { NewNavigation } from './NewNavigation';
import { Footer } from './Footer';
import { Star, Clock, MapPin, ArrowUpDown, Map, Mail, Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found' | 'blogs' | 'tours' | 'about' | 'contact' | 'tour-details' | 'blog-details';

interface Tour {
  id: string;
  title: string;
  category: 'Culture' | 'Adventure';
  region: string;
  duration: string;
  durationDays: number;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  highlights: string[];
  latitude: number;
  longitude: number;
}

interface ToursPageProps {
  onNavigate: (page: Page) => void;
  onTourSelect: (tourId: string) => void;
  user: User | null;
  isAdmin?: boolean;
}

// Mock tours data
const generateMockTours = (): Tour[] => {
  const regions = ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Darwin', 'Cairns', 'Gold Coast', 'Tasmania', 'Blue Mountains'];
  
  const tourTemplates = [
    { title: 'Aboriginal Art & Culture Experience', type: 'Culture' },
    { title: 'Great Barrier Reef Diving Adventure', type: 'Adventure' },
    { title: 'Outback Wilderness Safari', type: 'Adventure' },
    { title: 'Wine Region Cultural Tour', type: 'Culture' },
    { title: 'Coastal Hiking Expedition', type: 'Adventure' },
    { title: 'Historic Walking Tour', type: 'Culture' },
    { title: 'Rainforest Canopy Adventure', type: 'Adventure' },
    { title: 'Local Food & Markets Tour', type: 'Culture' },
    { title: 'Rock Climbing & Rappelling', type: 'Adventure' },
    { title: 'Traditional Music & Dance', type: 'Culture' },
    { title: 'Surfing & Beach Culture', type: 'Adventure' },
    { title: 'Architecture Heritage Walk', type: 'Culture' },
    { title: 'Wildlife Photography Safari', type: 'Adventure' },
    { title: 'Indigenous Storytelling Tour', type: 'Culture' },
    { title: 'Mountain Biking Adventure', type: 'Adventure' },
    { title: 'Colonial History Walk', type: 'Culture' },
    { title: 'Cave Exploration Tour', type: 'Adventure' },
    { title: 'Artisan Craft Workshop', type: 'Culture' },
    { title: 'River Rafting Experience', type: 'Adventure' },
    { title: 'Folk Music & Dance', type: 'Culture' },
    { title: 'Desert Camping Adventure', type: 'Adventure' },
    { title: 'Maritime Heritage Tour', type: 'Culture' },
    { title: 'Rock Art Discovery', type: 'Adventure' },
    { title: 'Traditional Cooking Class', type: 'Culture' }
  ];

  // Curated Unsplash tour images
  const tourImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=350&fit=crop&auto=format&q=75', // Sydney Harbor Bridge
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=350&fit=crop&auto=format&q=75', // Great Barrier Reef
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=350&fit=crop&auto=format&q=75', // Uluru
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=350&fit=crop&auto=format&q=75', // Tropical beach
    'https://images.unsplash.com/photo-1601467034225-609c87b8e678?w=500&h=350&fit=crop&auto=format&q=75', // Blue Mountains
    'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=500&h=350&fit=crop&auto=format&q=75', // Melbourne street art
    'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=500&h=350&fit=crop&auto=format&q=75', // Rainforest
    'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=500&h=350&fit=crop&auto=format&q=75', // Darwin wetlands
    'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=500&h=350&fit=crop&auto=format&q=75', // Mountain climbing
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=350&fit=crop&auto=format&q=75', // Gold Coast surfing
    'https://images.unsplash.com/photo-1548625361-3c8b9d1c67d3?w=500&h=350&fit=crop&auto=format&q=75', // Bondi Beach
    'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?w=500&h=350&fit=crop&auto=format&q=75', // Architecture
    'https://images.unsplash.com/photo-1586276390037-9c09a71dd3d3?w=500&h=350&fit=crop&auto=format&q=75', // Wildlife photography
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=350&fit=crop&auto=format&q=75', // Indigenous culture
    'https://images.unsplash.com/photo-1558618990-fbd2c02c45f5?w=500&h=350&fit=crop&auto=format&q=75', // Mountain biking
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500&h=350&fit=crop&auto=format&q=75', // Colonial architecture
    'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=350&fit=crop&auto=format&q=75', // Cave exploration
    'https://images.unsplash.com/photo-1563906267088-b029e7101114?w=500&h=350&fit=crop&auto=format&q=75', // Artisan crafts
    'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=500&h=350&fit=crop&auto=format&q=75', // River rafting
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=350&fit=crop&auto=format&q=75', // Folk music
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=500&h=350&fit=crop&auto=format&q=75', // Desert camping
    'https://images.unsplash.com/photo-1520637836862-4d197d17c92a?w=500&h=350&fit=crop&auto=format&q=75'  // Maritime heritage
  ];

  return tourTemplates.map((template, i) => {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const durationDays = Math.floor(Math.random() * 10) + 1;
    const duration = durationDays === 1 ? '1 day' : durationDays <= 3 ? `${durationDays} days` : durationDays <= 7 ? `${durationDays} days` : `${durationDays} days`;
    
    return {
      id: `tour-${i + 1}`,
      title: `${region} ${template.title}`,
      category: template.type as 'Culture' | 'Adventure',
      region,
      duration,
      durationDays,
      price: Math.floor(Math.random() * 800) + 199,
      rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 200) + 25,
      image: tourImages[i % tourImages.length],
      description: `Experience the best of ${region} with this incredible ${template.type.toLowerCase()} tour featuring local guides and authentic experiences.`,
      highlights: [
        'Expert local guides',
        'Small group experience',
        'All equipment included',
        'Cultural immersion',
        'Photo opportunities'
      ],
      latitude: -25.2744 + (Math.random() - 0.5) * 20,
      longitude: 133.7751 + (Math.random() - 0.5) * 30
    };
  });
};

export function ToursPage({ onNavigate, onTourSelect, user, isAdmin }: ToursPageProps) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [showMap, setShowMap] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 6;

  // Initialize tours
  useEffect(() => {
    const loadTours = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
      setTours(generateMockTours());
      setIsLoading(false);
    };

    loadTours();
  }, []);

  // Filter and sort tours
  const filteredAndSortedTours = tours
    .filter(tour => {
      const matchesRegion = selectedRegion === 'all' || tour.region === selectedRegion;
      const matchesDuration = selectedDuration === 'all' || 
        (selectedDuration === '1-3' && tour.durationDays <= 3) ||
        (selectedDuration === '4-7' && tour.durationDays >= 4 && tour.durationDays <= 7) ||
        (selectedDuration === '8+' && tour.durationDays >= 8);
      
      return matchesRegion && matchesDuration;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedTours.length / toursPerPage);
  const startIndex = (currentPage - 1) * toursPerPage;
  const endIndex = startIndex + toursPerPage;
  const currentTours = filteredAndSortedTours.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRegion, selectedDuration, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of tours grid
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const regions = ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Darwin', 'Cairns', 'Gold Coast', 'Tasmania', 'Blue Mountains'];

  // Skeleton loading component
  const TourSkeleton = () => (
    <Card className="overflow-hidden">
      <div className="animate-pulse">
        <div className="aspect-[4/3] bg-gray-200" />
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="flex items-center gap-4">
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded w-24" />
              <div className="h-10 bg-gray-200 rounded w-24" />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation 
        currentPage="tours" 
        onNavigate={onNavigate} 
        user={user}
        isAdmin={isAdmin}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cultural & Adventure Tours</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hand-picked Aussie experiences that showcase the best of our culture and natural wonders
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Region Filter */}
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-full sm:w-48">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Duration Filter */}
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger className="w-full sm:w-48">
                  <Clock className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Durations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Durations</SelectItem>
                  <SelectItem value="1-3">1-3 days</SelectItem>
                  <SelectItem value="4-7">4-7 days</SelectItem>
                  <SelectItem value="8+">8+ days</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Filter */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Map Toggle (Mobile) */}
            <div className="lg:hidden">
              <Dialog open={showMap} onOpenChange={setShowMap}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Map className="w-4 h-4" />
                    View Map
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Tour Locations</DialogTitle>
                  </DialogHeader>
                  <div className="aspect-video bg-gray-100 flex items-center justify-center rounded-lg">
                    <div className="text-center">
                      <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Interactive Map</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Showing {filteredAndSortedTours.length} tour locations
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Results count */}
        {!isLoading && filteredAndSortedTours.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedTours.length)} of {filteredAndSortedTours.length} tours
            </p>
          </div>
        )}

        {/* Tours Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <TourSkeleton key={index} />
            ))}
          </div>
        ) : filteredAndSortedTours.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Compass className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tours available</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any tours matching your criteria. Try adjusting your filters or check back later for new adventures.
              </p>
              <Button 
                variant="outline" 
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Contact Us
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentTours.map((tour, index) => (
                <Card 
                  key={tour.id} 
                  className="group overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-xl focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                  tabIndex={0}
                  role="article"
                  aria-label={`Tour: ${tour.title}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => onTourSelect(tour.id)}
                >
                  {/* Tour Image */}
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={tour.image}
                      alt={`${tour.title} tour image`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Dark Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge 
                        variant={tour.category === 'Adventure' ? 'default' : 'secondary'}
                        className="text-white border-white/20"
                      >
                        {tour.category}
                      </Badge>
                    </div>

                    {/* View Tour Button (appears on hover) */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <Button 
                        className="w-full bg-white text-gray-900 hover:bg-gray-100"
                        aria-label={`View details for ${tour.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTourSelect(tour.id);
                        }}
                      >
                        View Tour
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Title */}
                    <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-500">
                      {tour.title}
                    </h3>

                    {/* Rating and Duration */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-sm">{tour.rating}</span>
                        <span className="text-gray-500 text-sm">({tour.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{tour.duration}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {tour.description}
                    </p>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-600">From</span>
                        <div className="text-2xl font-bold text-primary">
                          ${tour.price}
                        </div>
                      </div>
                      <Button 
                        variant="outline"
                        className="group-hover:bg-primary group-hover:text-white transition-colors duration-500"
                        aria-label={`Book ${tour.title} tour`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTourSelect(tour.id);
                        }}
                      >
                        View Tour
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-12">
                <div className="flex items-center space-x-2">
                  {/* Previous button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Button>

                  {/* Page numbers */}
                  <div className="flex items-center space-x-1">
                    {getPageNumbers().map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-10 h-10"
                      >
                        {pageNum}
                      </Button>
                    ))}
                  </div>

                  {/* Next button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center space-x-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
