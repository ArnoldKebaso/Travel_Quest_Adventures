import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { NewNavigation } from './NewNavigation';
import { Footer } from './Footer';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Heart, 
  Calendar, 
  Users, 
  Send, 
  Loader2, 
  AlertCircle,
  Facebook,
  Twitter,
  Mail,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found';

interface DestinationDetailProps {
  destinationId: string | null;
  onBack: () => void;
  onNavigate: (page: Page) => void;
  user: User | null;
  isAdmin?: boolean;
}

interface Destination {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  images: string[];
  rating: number;
  reviews: number;
  category: string;
  region: string;
  duration: string;
  price: number;
  highlights: string[];
  experiences: string[];
  bestTime: string;
  difficulty: string;
  groupSize: string;
  latitude: number;
  longitude: number;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  comment: string;
  rating: number;
  date: string;
}

// Mock destination data
const getMockDestination = (id: string): Destination => ({
  id,
  name: `Amazing Destination ${id}`,
  description: 'Discover the breathtaking beauty and rich culture of this incredible destination.',
  longDescription: 'Embark on an extraordinary journey through landscapes that will leave you speechless. This destination offers a perfect blend of natural wonders, cultural heritage, and unforgettable experiences. From pristine beaches to ancient temples, every moment promises adventure and discovery.',
  images: [
    `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&random=${id}`,
    `https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&h=600&fit=crop&random=${parseInt(id) + 100}`,
    `https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&random=${parseInt(id) + 200}`,
    `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&random=${parseInt(id) + 300}`,
    `https://images.unsplash.com/photo-1601467034225-609c87b8e678?w=800&h=600&fit=crop&random=${parseInt(id) + 400}`
  ],
  rating: 4.8,
  reviews: 247,
  category: 'Adventure',
  region: 'Australia',
  duration: '7 days',
  price: 1299,
  highlights: [
    'Expert local guides',
    'All meals included',
    'Accommodation in premium lodges',
    'Transportation included',
    'Small group experience'
  ],
  experiences: [
    'Sunrise hot air balloon rides',
    'Traditional cooking classes',
    'Wildlife photography sessions',
    'Cultural heritage tours',
    'Adventure hiking trails',
    'Scenic helicopter flights'
  ],
  bestTime: 'April to October',
  difficulty: 'Moderate',
  groupSize: '8-12 people',
  latitude: -25.2744,
  longitude: 133.7751
});

// Mock comments data
const getMockComments = (): Comment[] => [
  {
    id: '1',
    userId: 'user1',
    userName: 'Sarah Mitchell',
    userAvatar: 'SM',
    comment: 'Absolutely incredible experience! The guides were knowledgeable and the scenery was breathtaking. Would definitely recommend to anyone looking for an adventure.',
    rating: 5,
    date: '2024-12-15'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'David Chen',
    userAvatar: 'DC',
    comment: 'Great trip overall. The accommodations were comfortable and the food was excellent. Only minor issue was the weather, but that\'s beyond anyone\'s control.',
    rating: 4,
    date: '2024-12-10'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Emma Rodriguez',
    userAvatar: 'ER',
    comment: 'This was the trip of a lifetime! Every single day brought new adventures and amazing sights. The group was fantastic and our guide was exceptional.',
    rating: 5,
    date: '2024-12-05'
  }
];

export function NewDestinationDetail({ destinationId, onBack, onNavigate, user, isAdmin }: DestinationDetailProps) {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedGuests, setSelectedGuests] = useState('2');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (destinationId) {
      // Simulate loading
      setTimeout(() => {
        setDestination(getMockDestination(destinationId));
        setIsLoading(false);
      }, 300);

      // Load comments
      setTimeout(() => {
        setComments(getMockComments());
        setIsLoadingComments(false);
      }, 500);
    }
  }, [destinationId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to post a comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setIsSubmittingComment(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const comment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.email?.split('@')[0] || 'Anonymous',
      userAvatar: user.email?.charAt(0).toUpperCase() || 'A',
      comment: newComment,
      rating: newRating,
      date: new Date().toISOString().split('T')[0]
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    setNewRating(5);
    setIsSubmittingComment(false);
    toast.success('Comment posted successfully!');
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this amazing destination: ${destination?.name}`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
        break;
    }
  };

  const handleBookNow = () => {
    if (!user) {
      onNavigate('auth');
      return;
    }
    toast.success('Booking initiated! Redirecting to payment...');
  };

  const toggleSaved = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved destinations' : 'Added to saved destinations');
  };

  if (isLoading || !destination) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NewNavigation 
          currentPage="destination" 
          onNavigate={onNavigate} 
          user={user}
          isAdmin={isAdmin}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 w-32 mb-6" />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="bg-gray-200 h-96 rounded-lg mb-6" />
                <div className="bg-gray-200 h-6 w-3/4 mb-4" />
                <div className="bg-gray-200 h-4 w-full mb-2" />
                <div className="bg-gray-200 h-4 w-2/3" />
              </div>
              <div>
                <div className="bg-gray-200 h-80 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation 
        currentPage="destination" 
        onNavigate={onNavigate} 
        user={user}
        isAdmin={isAdmin}
      />

      {/* Back Button */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Destinations
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Gallery & Details */}
          <div className="md:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                <img
                  src={destination.images[currentImageIndex]}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={toggleSaved}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>

              {/* Thumbnail Navigation */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {destination.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Destination Info */}
            <div className="space-y-6">
              {/* Badges and Title */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{destination.category}</Badge>
                  <Badge variant="outline">{destination.region}</Badge>
                  <Badge variant="outline">{destination.difficulty}</Badge>
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{destination.name}</h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{destination.rating}</span>
                    <span className="text-gray-600">({destination.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{destination.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{destination.groupSize}</span>
                  </div>
                </div>

                {/* Social Share */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Share:</span>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="text-blue-400 hover:text-blue-500 transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleShare('email')}
                    className="text-gray-600 hover:text-gray-700 transition-colors"
                    aria-label="Share via Email"
                  >
                    <Mail className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* About Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Destination</h2>
                <p className="text-gray-700 leading-relaxed mb-4">{destination.longDescription}</p>
                <p className="text-gray-600">{destination.description}</p>
              </div>

              {/* What You'll Experience */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Experience</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {destination.experiences.map((experience, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{experience}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip Highlights</h2>
                <div className="space-y-2">
                  {destination.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Interactive Map</p>
                      <p className="text-sm text-gray-500">
                        Lat: {destination.latitude}, Lng: {destination.longitude}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="md:col-span-1">
            <div className="sticky top-32">
              <Card className="shadow-lg animate-slide-in-right">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Book Your Trip</span>
                    <Heart className={`w-5 h-5 cursor-pointer transition-colors ${
                      isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`} onClick={toggleSaved} />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-1">
                      ${destination.price}
                    </div>
                    <div className="text-sm text-gray-600">per person</div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          min={new Date().toISOString().split('T')[0]}
                          aria-label="Select travel date"
                          title="Choose your travel date"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Guests
                      </label>
                      <Select value={selectedGuests} onValueChange={setSelectedGuests}>
                        <SelectTrigger>
                          <Users className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 8 }, (_, i) => i + 1).map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Guest' : 'Guests'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {user ? (
                      <Button onClick={handleBookNow} className="w-full" size="lg">
                        Book Now - ${destination.price * parseInt(selectedGuests)}
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <Button disabled className="w-full" size="lg">
                          Sign in to book
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => onNavigate('auth')}
                          className="w-full"
                        >
                          Sign In / Sign Up
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>• Free cancellation up to 24 hours before</p>
                      <p>• Best time to visit: {destination.bestTime}</p>
                      <p>• Group size: {destination.groupSize}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Traveler Reviews</h2>
          
          {/* Add Comment Form */}
          {user ? (
            <Card className="mb-8">
              <CardContent className="p-6">
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Rate your experience:</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setNewRating(i + 1)}
                              className="focus:outline-none"
                              aria-label={`Rate ${i + 1} stars`}
                              title={`Rate ${i + 1} stars`}
                            >
                              <Star 
                                className={`w-5 h-5 ${
                                  i < newRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Textarea
                    placeholder="Share your experience..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px]"
                    maxLength={280}
                  />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {280 - newComment.length} characters remaining
                    </span>
                    <Button 
                      type="submit" 
                      disabled={isSubmittingComment || !newComment.trim()}
                      className="flex items-center gap-2"
                    >
                      {isSubmittingComment ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Post Review
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-8 border-orange-200 bg-orange-50">
              <CardContent className="p-6 flex items-center gap-4">
                <AlertCircle className="w-6 h-6 text-orange-600" />
                <div className="flex-1">
                  <p className="text-orange-800">
                    Please log in to share your experience and help other travelers.
                  </p>
                </div>
                <Button onClick={() => onNavigate('auth')} variant="outline">
                  Login
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Comments List */}
          {isLoadingComments ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full" />
                        <div className="flex-1">
                          <div className="bg-gray-200 h-4 w-24 mb-2" />
                          <div className="bg-gray-200 h-3 w-16" />
                        </div>
                      </div>
                      <div className="bg-gray-200 h-4 w-full mb-2" />
                      <div className="bg-gray-200 h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment, index) => (
                <Card key={comment.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>{comment.userAvatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{comment.userName}</h4>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < comment.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{comment.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
