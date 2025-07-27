import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star, Clock, Loader2, Heart, Trash2 } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

interface SavedDestinationsProps {
  user: User | null;
  onDestinationSelect: (destinationId: string) => void;
}

interface Destination {
  id: string;
  name: string;
  description: string;
  images: string[];
  rating: number;
  reviews: number;
  category: string;
  region: string;
  duration: string;
  price: string;
}

export function SavedDestinations({ user, onDestinationSelect }: SavedDestinationsProps) {
  const [savedDestinations, setSavedDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSavedDestinations();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchSavedDestinations = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Authentication required');
      }

      // Get saved destination IDs
      const savedResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-838db481/user/saved`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!savedResponse.ok) {
        throw new Error('Failed to fetch saved destinations');
      }

      const savedData = await savedResponse.json();
      const savedIds = savedData.saved || [];

      if (savedIds.length === 0) {
        setSavedDestinations([]);
        return;
      }

      // Get all destinations
      const destinationsResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-838db481/destinations`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!destinationsResponse.ok) {
        throw new Error('Failed to fetch destinations');
      }

      const destinationsData = await destinationsResponse.json();
      const allDestinations = destinationsData.destinations || [];

      // Filter to only saved destinations
      const saved = allDestinations.filter((dest: Destination) => 
        savedIds.includes(dest.id)
      );

      setSavedDestinations(saved);
    } catch (err) {
      console.error('Error fetching saved destinations:', err);
      setError('Failed to load saved destinations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsaveDestination = async (destinationId: string) => {
    if (!user) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-838db481/user/saved/${destinationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove destination');
      }

      // Remove from local state
      setSavedDestinations(prev => prev.filter(dest => dest.id !== destinationId));
      toast.success('Destination removed from saved list');
    } catch (err) {
      console.error('Error removing saved destination:', err);
      toast.error('Failed to remove destination');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Save Your Favorite Destinations</h2>
            <p className="text-muted-foreground">
              Sign in to save destinations and create your travel wishlist
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your saved destinations...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={fetchSavedDestinations}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Saved Destinations</h1>
          <p className="text-lg text-muted-foreground">
            {savedDestinations.length > 0 
              ? `You have saved ${savedDestinations.length} destination${savedDestinations.length !== 1 ? 's' : ''}`
              : 'Start exploring and save destinations to your wishlist'
            }
          </p>
        </div>

        {savedDestinations.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No saved destinations yet</h3>
            <p className="text-muted-foreground mb-6">
              Explore our destinations and click the heart icon to save your favorites
            </p>
            <Button onClick={() => window.history.back()} className="cursor-pointer">
              Explore Destinations
            </Button>
          </div>
        ) : (
          /* Destination Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDestinations.map((destination) => (
              <Card 
                key={destination.id} 
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <ImageWithFallback
                      src={destination.images[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop'}
                      alt={destination.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-white/90 text-black">
                      {destination.category}
                    </Badge>
                    <Badge className="absolute top-4 right-4 bg-black/80 text-white">
                      {destination.region}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-12 right-2 bg-white/90 hover:bg-white text-red-500 p-2 h-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnsaveDestination(destination.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div 
                    className="p-6 cursor-pointer" 
                    onClick={() => onDestinationSelect(destination.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">{destination.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{destination.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {destination.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{destination.duration}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {destination.reviews} reviews
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-semibold text-primary">{destination.price}</span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDestinationSelect(destination.id);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}