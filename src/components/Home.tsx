import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import { destinations } from '../utils/staticData';

export function Home() {
  const navigate = useNavigate();
  // Get first 3 destinations as featured
  const featuredDestinations = destinations.slice(0, 3);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'adventure':
        return 'bg-orange-500/90 text-white';
      case 'cultural':
        return 'bg-purple-500/90 text-white';
      case 'nature':
        return 'bg-green-500/90 text-white';
      case 'beach':
        return 'bg-blue-500/90 text-white';
      case 'city':
        return 'bg-gray-500/90 text-white';
      case 'romantic':
        return 'bg-pink-500/90 text-white';
      default:
        return 'bg-slate-500/90 text-white';
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=1080&fit=crop"
            alt="Beautiful travel destination"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl mb-6">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Explore breathtaking destinations with curated travel guides from local experts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/destinations')}
              className="bg-white text-black hover:bg-white/90 cursor-pointer"
            >
              Explore Destinations
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/tours')}
              className="border-white text-white hover:bg-white hover:text-black cursor-pointer"
            >
              Browse Tours
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="mb-4">Featured Destinations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hand-picked destinations that offer unforgettable experiences and memories that last a lifetime
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredDestinations.map((destination) => (
            <Card 
              key={destination.id} 
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => navigate(`/destinations/${destination.id}`)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <ImageWithFallback
                    src={destination.image_url}
                    alt={destination.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className={`absolute top-4 left-4 ${getCategoryColor(destination.category)}`}>
                    {destination.category}
                  </Badge>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3>{destination.title}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">4.8</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {destination.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{destination.location}</span>
                    </div>
                    <span className="text-primary">
                      From ${destination.price_per_night}/night
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/destinations')}
            className="cursor-pointer"
          >
            View All Destinations
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Why Choose TravelQuest */}
      <section className="bg-accent/50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Why Choose TravelQuest?</h2>
            <p className="text-muted-foreground">
              We make travel planning effortless with expert guides and authentic experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="mb-2">Expert Local Guides</h3>
              <p className="text-muted-foreground">
                Discover hidden gems with guides written by locals who know their destinations best
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="mb-2">Authentic Experiences</h3>
              <p className="text-muted-foreground">
                Skip the tourist traps and experience destinations like a local with our curated recommendations
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="mb-2">Easy Planning</h3>
              <p className="text-muted-foreground">
                From inspiration to booking, we make travel planning simple and stress-free
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
