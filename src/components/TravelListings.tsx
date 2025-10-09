import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Search, MapPin, Star, Clock } from 'lucide-react';
import { destinations } from '../utils/staticData';

const categories = ['All', 'Adventure', 'Cultural', 'Nature', 'Beach', 'City', 'Historical', 'Wildlife', 'Luxury'];
const regions = ['All', 'NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function TravelListings() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const filteredDestinations = destinations
    .filter(dest => {
      const matchesSearch = dest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dest.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || dest.category === selectedCategory;
      const matchesRegion = selectedRegion === 'All' || dest.region === selectedRegion;
      
      return matchesSearch && matchesCategory && matchesRegion;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price_per_night - b.price_per_night;
        case 'price-high':
          return b.price_per_night - a.price_per_night;
        case 'name':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

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
      case 'historical':
        return 'bg-amber-500/90 text-white';
      case 'wildlife':
        return 'bg-emerald-500/90 text-white';
      case 'luxury':
        return 'bg-gold-500/90 text-white';
      default:
        return 'bg-slate-500/90 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4">Explore Destinations</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover amazing destinations across Australia. From pristine beaches to ancient rainforests, 
            vibrant cities to cultural landmarks.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Region</label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name: A to Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                      setSelectedRegion('All');
                      setSortBy('newest');
                    }}
                    className="w-full cursor-pointer"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4 text-muted-foreground">
          Showing {filteredDestinations.length} {filteredDestinations.length === 1 ? 'destination' : 'destinations'}
        </div>

        {/* Destinations Grid */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => (
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
                    
                    <div className="flex items-center text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{destination.location}</span>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                      {destination.description}
                    </p>

                    <div className="flex items-center text-muted-foreground text-sm mb-4">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Best: {destination.best_time_to_visit}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-primary">
                        ${destination.price_per_night}/night
                      </span>
                      <Button size="sm" className="cursor-pointer">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No destinations found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedRegion('All');
              }}
              className="cursor-pointer"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
