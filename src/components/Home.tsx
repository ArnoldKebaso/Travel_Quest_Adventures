import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight, MapPin, Star } from 'lucide-react';

type Page = 'home' | 'listings' | 'destination' | 'account';

interface HomeProps {
  onDestinationSelect: (destinationId: string) => void;
  onNavigate: (page: Page) => void;
}

const featuredDestinations = [
  {
    id: '1',
    name: 'Santorini, Greece',
    description: 'Stunning sunsets and white-washed buildings overlooking the Aegean Sea',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop',
    rating: 4.9,
    reviews: 234,
    category: 'Romantic',
    price: 'From $299/night'
  },
  {
    id: '2',
    name: 'Kyoto, Japan',
    description: 'Ancient temples, traditional gardens, and authentic cultural experiences',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 456,
    category: 'Cultural',
    price: 'From $180/night'
  },
  {
    id: '3',
    name: 'Banff, Canada',
    description: 'Breathtaking mountain landscapes and pristine wilderness adventures',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    rating: 4.7,
    reviews: 189,
    category: 'Adventure',
    price: 'From $220/night'
  }
];

export function Home({ onDestinationSelect, onNavigate }: HomeProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=1080&fit=crop"
            alt="Beautiful travel destination"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl md:text-3xl lg:text-4xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
            Explore breathtaking destinations with curated travel guides from local experts
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              onClick={() => onNavigate('listings')}
              className="bg-white text-black hover:bg-white/90 px-8 py-4 text-lg font-semibold"
            >
              Explore Destinations
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold"
            >
              Watch Travel Stories
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Featured Destinations</h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Hand-picked destinations that offer unforgettable experiences and memories that last a lifetime
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredDestinations.map((destination) => (
            <Card 
              key={destination.id} 
              className="group cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg"
              onClick={() => onDestinationSelect(destination.id)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <ImageWithFallback
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-6 left-6 bg-white/95 text-black px-4 py-2 text-sm font-medium">
                    {destination.category}
                  </Badge>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">{destination.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-medium">{destination.rating}</span>
                      <span className="text-base text-muted-foreground">({destination.reviews})</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 line-clamp-2 text-lg leading-relaxed">
                    {destination.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span className="text-base">View Details</span>
                    </div>
                    <span className="font-bold text-primary text-lg">{destination.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => onNavigate('listings')}
            className="px-8 py-4 text-lg font-semibold"
          >
            View All Destinations
            <ArrowRight className="ml-3 w-6 h-6" />
          </Button>
        </div>
      </section>

      {/* Why Choose TravelQuest */}
      <section className="bg-accent/50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Why Choose TravelQuest?</h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We make travel planning effortless with expert guides and authentic experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Expert Local Guides</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Discover hidden gems with guides written by locals who know their destinations best
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Authentic Experiences</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Skip the tourist traps and experience destinations like a local with our curated recommendations
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowRight className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Easy Planning</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                From inspiration to booking, we make travel planning simple and stress-free
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}