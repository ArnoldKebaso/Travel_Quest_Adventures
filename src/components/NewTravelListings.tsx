import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { NewNavigation } from './NewNavigation';
import { Footer } from './Footer';
import { Search, Star, Clock, MapPin, Map, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found';

interface TravelListingsProps {
  onDestinationSelect: (destinationId: string) => void;
  onNavigate: (page: Page) => void;
  user: User | null;
  isAdmin?: boolean;
}

interface Destination {
  id: string;
  name: string;
  description: string;
  category: string;
  region: string;
  images: string[];
  rating: number;
  reviews: number;
  duration: string;
  price: number;
}

// Dummy data for destinations
const generateDestinations = (startId: number, count: number): Destination[] => {
  const categories = ['Adventure', 'Cultural', 'Romantic', 'Beach', 'Food', 'Wildlife'];
  const regions = ['Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania'];
  const destinations = [];

  for (let i = 0; i < count; i++) {
    const id = startId + i;
    destinations.push({
      id: id.toString(),
      name: `Destination ${id}`,
      description: `Experience the wonders of this amazing location with breathtaking views, rich culture, and unforgettable adventures that will create memories to last a lifetime.`,
      category: categories[Math.floor(Math.random() * categories.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      images: [
        `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&random=${id}`,
        `https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&h=600&fit=crop&random=${id + 100}`,
        `https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&random=${id + 200}`
      ],
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
      reviews: Math.floor(Math.random() * 500) + 50,
      duration: `${Math.floor(Math.random() * 7) + 3} days`,
      price: Math.floor(Math.random() * 1000) + 299
    });
  }

  return destinations;
};

const categories = ['All', 'Adventure', 'Cultural', 'Romantic', 'Beach', 'Food', 'Wildlife'];
const regions = ['All', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania'];
const sortOptions = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price', label: 'Price' },
  { value: 'duration', label: 'Duration' }
];

export function NewTravelListings({ onDestinationSelect, onNavigate, user, isAdmin }: TravelListingsProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [showMap, setShowMap] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const destinationsPerPage = 8;

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setDestinations(generateDestinations(1, 40)); // Generate 40 destinations for pagination
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort destinations
  const filteredDestinations = destinations
    .filter(dest => {
      const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dest.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || dest.category === selectedCategory;
      const matchesRegion = selectedRegion === 'All' || dest.region === selectedRegion;
      return matchesSearch && matchesCategory && matchesRegion;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.price - b.price;
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration);
        default:
          return 0;
      }
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredDestinations.length / destinationsPerPage);
  const startIndex = (currentPage - 1) * destinationsPerPage;
  const endIndex = startIndex + destinationsPerPage;
  const currentDestinations = filteredDestinations.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedRegion, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of destinations grid
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedRegion('All');
    setSortBy('rating');
    setCurrentPage(1);
    toast.success('Filters reset');
  };

  const handleDestinationClick = (destinationId: string) => {
    onDestinationSelect(destinationId);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation 
        currentPage="listings" 
        onNavigate={onNavigate} 
        user={user}
        isAdmin={isAdmin}
      />

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-40 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-full border-gray-300 focus:border-primary focus:ring-primary"
                aria-label="Search destinations"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-full sm:w-[140px] rounded-full border-gray-300 focus:border-primary focus:ring-primary">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[140px] rounded-full border-gray-300 focus:border-primary focus:ring-primary">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[140px] rounded-full border-gray-300 focus:border-primary focus:ring-primary">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Destinations Grid */}
          <div className="flex-1">
            {isLoading ? (
              // Loading skeletons
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="bg-gray-200 animate-pulse h-48 w-full" />
                    <CardContent className="p-4">
                      <div className="bg-gray-200 animate-pulse h-4 w-3/4 mb-2" />
                      <div className="bg-gray-200 animate-pulse h-3 w-full mb-1" />
                      <div className="bg-gray-200 animate-pulse h-3 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredDestinations.length === 0 ? (
              // Empty state
              <div className="text-center py-16">
                <img
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop"
                  alt="Empty atlas"
                  className="w-48 h-36 mx-auto mb-6 rounded-lg object-cover opacity-50"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filters to find more destinations.</p>
                <Button onClick={handleResetFilters}>
                  Reset All Filters
                </Button>
              </div>
            ) : (
              // Destinations grid with pagination
              <>
                {/* Results count */}
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredDestinations.length)} of {filteredDestinations.length} destinations
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {currentDestinations.map((destination) => (
                    <Card
                      key={destination.id}
                      className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.03]"
                      onClick={() => handleDestinationClick(destination.id)}
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={destination.images[0]}
                          alt={destination.name}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Badges */}
                        <Badge className="absolute top-3 left-3 bg-white/90 text-black">
                          {destination.category}
                        </Badge>
                        <Badge className="absolute top-3 right-3 bg-black/80 text-white">
                          {destination.region}
                        </Badge>

                        {/* Hover button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button variant="secondary" size="sm">
                            View Details
                          </Button>
                        </div>

                        {/* Bottom info overlay */}
                        <div className="absolute bottom-3 left-3 text-white">
                          <div className="flex items-center space-x-1 mb-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{destination.rating}</span>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-2 line-clamp-1">{destination.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{destination.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{destination.duration}</span>
                          </div>
                          <span>{destination.reviews} reviews</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary text-lg">
                            ${destination.price}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            From ${destination.price}/night
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center mt-8">
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

          {/* Desktop Map Sidebar */}
          <aside className="hidden lg:block w-80 sticky top-32 h-fit">
            <Card className="overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center border rounded-lg">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Interactive Map</p>
                  <p className="text-sm text-gray-500 mt-1">Coming Soon</p>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>

      {/* Mobile Map Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowMap(!showMap)}
          className="rounded-full h-14 w-14 shadow-lg"
          size="icon"
        >
          <Map className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile Map Modal */}
      {showMap && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md aspect-square bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Interactive Map</p>
              <p className="text-gray-500 mt-2">Coming Soon</p>
              <Button 
                onClick={() => setShowMap(false)}
                className="mt-4"
                variant="outline"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
