import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { NewNavigation } from './NewNavigation';
import { Footer } from './Footer';
import { 
  Calendar, 
  Users, 
  Clock, 
  MapPin, 
  Star, 
  Share2, 
  Facebook, 
  Twitter, 
  Instagram,
  ChevronLeft,
  ChevronRight,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found' | 'blogs' | 'tours' | 'about' | 'contact' | 'tour-details' | 'blog-details';

interface TourDetailsProps {
  tourId: string;
  onNavigate: (page: Page) => void;
  user: SupabaseUser | null;
  isAdmin?: boolean;
}

interface Tour {
  id: string;
  name: string;
  heroImage: string;
  gallery: string[];
  price: number;
  duration: string;
  difficulty: string;
  region: string;
  description: string;
  itinerary: string[];
  highlights: string[];
  reviews: Review[];
}

interface Review {
  id: string;
  avatar: string;
  name: string;
  date: string;
  rating: number;
  text: string;
}

// Mock tour data
const mockTours: Tour[] = [
  {
    id: '1',
    name: 'Great Barrier Reef Diving Adventure',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=600&fit=crop&auto=format&q=75',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&auto=format&q=75',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format&q=75',
      'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&h=600&fit=crop&auto=format&q=75',
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=600&fit=crop&auto=format&q=75'
    ],
    price: 299,
    duration: '3 days',
    difficulty: 'Moderate',
    region: 'Queensland',
    description: 'Dive into the world\'s largest coral reef system and discover the incredible marine biodiversity of the Great Barrier Reef. This 3-day adventure includes guided diving sessions, snorkeling, and marine life education.',
    itinerary: [
      'Day 1: Arrival and orientation, shallow water diving practice',
      'Day 2: Deep reef diving, marine life photography workshop',
      'Day 3: Advanced diving sites, underwater cave exploration'
    ],
    highlights: [
      'Professional diving instructors',
      'All diving equipment included',
      'Underwater photography',
      'Marine life education',
      'Small group sizes',
      'Lunch included'
    ],
    reviews: [
      {
        id: '1',
        avatar: 'SM',
        name: 'Sarah Mitchell',
        date: '2024-01-15',
        rating: 5,
        text: 'Absolutely incredible experience! The coral formations were breathtaking and our guide was extremely knowledgeable.'
      },
      {
        id: '2',
        avatar: 'JD',
        name: 'James Davis',
        date: '2024-01-10',
        rating: 5,
        text: 'Best diving experience of my life. The equipment was top-notch and safety was clearly a priority.'
      }
    ]
  },
  {
    id: '2',
    name: 'Uluru Sunrise Cultural Experience',
    heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop&auto=format&q=75',
    gallery: [
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&auto=format&q=75',
      'https://images.unsplash.com/photo-1464822759844-d150baec013a?w=800&h=600&fit=crop&auto=format&q=75',
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop&auto=format&q=75'
    ],
    price: 189,
    duration: '1 day',
    difficulty: 'Easy',
    region: 'Northern Territory',
    description: 'Experience the spiritual heart of Australia with a sunrise viewing at Uluru, combined with cultural storytelling and traditional Aboriginal art workshops.',
    itinerary: [
      'Pre-dawn departure to viewing area',
      'Sunrise viewing with traditional welcome',
      'Cultural storytelling session',
      'Aboriginal art workshop',
      'Traditional bush tucker tasting'
    ],
    highlights: [
      'Sunrise at Uluru',
      'Aboriginal cultural guides',
      'Traditional art workshop',
      'Bush tucker experience',
      'Small group setting',
      'Cultural storytelling'
    ],
    reviews: [
      {
        id: '1',
        avatar: 'ER',
        name: 'Emma Rodriguez',
        date: '2024-01-20',
        rating: 5,
        text: 'A deeply moving cultural experience. The sunrise was magical and learning about Aboriginal culture was enlightening.'
      }
    ]
  }
  // Add more tours as needed...
];

export function TourDetails({ tourId, onNavigate, user, isAdmin }: TourDetailsProps) {
  const [tour, setTour] = useState<Tour | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState('2');
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  useEffect(() => {
    // Simulate loading
    const foundTour = mockTours.find(t => t.id === tourId) || mockTours[0];
    setTour(foundTour);
    
    // Simulate review loading
    setTimeout(() => {
      setIsLoadingReviews(false);
    }, 1000);
  }, [tourId]);

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please login to book this tour');
      return;
    }
    
    if (!selectedDate || !guests) {
      toast.error('Please select date and number of guests');
      return;
    }
    
    toast.success('Booked! Confirmation details sent to your email.');
  };

  const handleShare = (platform: string) => {
    toast.success(`Shared on ${platform}!`);
  };

  const nextImage = () => {
    if (tour) {
      setCurrentImageIndex((prev) => (prev + 1) % tour.gallery.length);
    }
  };

  const prevImage = () => {
    if (tour) {
      setCurrentImageIndex((prev) => (prev - 1 + tour.gallery.length) % tour.gallery.length);
    }
  };

  const ReviewSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    </div>
  );

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NewNavigation currentPage="tours" onNavigate={onNavigate} user={user} isAdmin={isAdmin} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading tour details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation currentPage="tours" onNavigate={onNavigate} user={user} isAdmin={isAdmin} />

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-[60vh] overflow-hidden"
      >
        <img
          src={tour.heroImage}
          alt={tour.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              {tour.name}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xl flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              {tour.region} • {tour.duration} • {tour.difficulty}
            </motion.p>
            
            {/* Social Share */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex items-center justify-center gap-4 mt-6"
            >
              <span className="text-sm">Share:</span>
              <button 
                onClick={() => handleShare('Facebook')}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleShare('Twitter')}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleShare('Instagram')}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                aria-label="Share on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Carousel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-4"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={tour.gallery[currentImageIndex]}
                  alt={`${tour.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto">
                {tour.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* About Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-4">About this Tour</h2>
              <p className="text-gray-700 leading-relaxed">{tour.description}</p>
            </motion.section>

            {/* Itinerary */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-4">What You'll Do</h2>
              <ul className="space-y-2">
                {tour.itinerary.map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.section>

            {/* Highlights */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-4">Highlights</h2>
              <div className="flex flex-wrap gap-2">
                {tour.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0 + index * 0.1, duration: 0.3 }}
                  >
                    <Badge variant="secondary" className="text-sm">
                      {highlight}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Reviews */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-6">Traveler Reviews</h2>
              
              {isLoadingReviews ? (
                <div className="space-y-6">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <ReviewSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {tour.reviews.map((review, index) => (
                    <motion.div 
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + index * 0.2, duration: 0.4 }}
                      className="flex items-start gap-4"
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="" alt={review.name} />
                        <AvatarFallback>{review.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{review.name}</h4>
                          <span className="text-gray-500 text-sm">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>
          </div>

          {/* Right Column - 1/3 */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="sticky top-8"
            >
              <Card className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    From ${tour.price} <span className="text-base font-normal text-gray-600">per person</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date Selection */}
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium mb-2">
                      Select Date
                    </label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Guests Selection */}
                  <div>
                    <label htmlFor="guests" className="block text-sm font-medium mb-2">
                      Guests
                    </label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} guest{num > 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Book Button */}
                  {user ? (
                    <Button 
                      onClick={handleBookNow}
                      className="w-full"
                      size="lg"
                    >
                      Book Now
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        disabled
                        className="w-full"
                        size="lg"
                      >
                        Login to Book
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => onNavigate('auth')}
                        className="w-full"
                      >
                        Sign In
                      </Button>
                    </div>
                  )}

                  {/* Tour Info */}
                  <div className="pt-4 border-t space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Up to 12 people</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Heart className="w-4 h-4" />
                      <span>Free cancellation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
