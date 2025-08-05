import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { NewNavigation } from './NewNavigation';
import { Footer } from './Footer';
import { HeartOff, Luggage } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import type { User } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found' | 'blogs' | 'tours' | 'about' | 'contact';

interface SavedTripsItem {
  id: string;
  name: string;
  region: string;
  image: string;
  savedDate: string;
}

interface SavedDestinationsProps {
  user: User | null;
  onDestinationSelect: (destinationId: string) => void;
  onNavigate?: (page: Page) => void;
  isAdmin?: boolean;
  savedItems?: SavedTripsItem[];
  showNavigation?: boolean;
}

export function SavedDestinations({ 
  user, 
  onDestinationSelect, 
  onNavigate, 
  isAdmin, 
  savedItems = [], 
  showNavigation = true 
}: SavedDestinationsProps) {
  const [savedDestinations, setSavedDestinations] = useState<SavedTripsItem[]>(savedItems);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading when not using provided savedItems
  useEffect(() => {
    if (savedItems.length === 0 && showNavigation) {
      setIsLoading(true);
      setTimeout(() => {
        // Mock saved destinations
        setSavedDestinations([
          {
            id: '1',
            name: 'Sydney Opera House',
            region: 'Sydney',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format&q=75',
            savedDate: '2024-01-15'
          },
          {
            id: '2',
            name: 'Great Barrier Reef',
            region: 'Queensland',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&auto=format&q=75',
            savedDate: '2024-01-20'
          },
          {
            id: '3',
            name: 'Uluru',
            region: 'Northern Territory',
            image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&auto=format&q=75',
            savedDate: '2024-02-01'
          },
          {
            id: '4',
            name: 'Blue Mountains',
            region: 'New South Wales',
            image: 'https://images.unsplash.com/photo-1601467034225-609c87b8e678?w=400&h=300&fit=crop&auto=format&q=75',
            savedDate: '2024-01-25'
          },
          {
            id: '5',
            name: 'Bondi Beach',
            region: 'Sydney',
            image: 'https://images.unsplash.com/photo-1548625361-3c8b9d1c67d3?w=400&h=300&fit=crop&auto=format&q=75',
            savedDate: '2024-02-05'
          },
          {
            id: '6',
            name: 'Daintree Rainforest',
            region: 'Queensland',
            image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=300&fit=crop&auto=format&q=75',
            savedDate: '2024-02-10'
          }
        ]);
        setIsLoading(false);
      }, 500);
    } else {
      setSavedDestinations(savedItems);
    }
  }, [savedItems, showNavigation]);

  const handleRemoveFromSaved = (destinationId: string) => {
    setSavedDestinations(prev => prev.filter(item => item.id !== destinationId));
    toast.success('Removed from saved trips.');
  };

  const SkeletonTile = () => (
    <Card className="overflow-hidden">
      <div className="animate-pulse">
        <Skeleton className="aspect-[4/3] w-full" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </Card>
  );

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1544918013-8fdb5b3b2c85?w=96&h=96&fit=crop&auto=format&q=75" 
            alt="Empty suitcase"
            className="w-12 h-12 opacity-50"
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved trips yet</h3>
        <p className="text-gray-600 mb-6">
          Start saving your favorite destinations to plan your next adventure!
        </p>
        {onNavigate && (
          <Button onClick={() => onNavigate('listings')} className="inline-flex items-center gap-2">
            <Luggage className="w-4 h-4" />
            Browse Destinations
          </Button>
        )}
      </div>
    </div>
  );

  const content = (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      {showNavigation && (
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Saved Trips</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your favorite destinations all in one place
          </p>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonTile key={index} />
          ))}
        </div>
      ) : savedDestinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {savedDestinations.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card 
                className="group overflow-hidden cursor-pointer transition-all duration-300 hover:scale-102 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                onClick={() => onDestinationSelect(item.id)}
                tabIndex={0}
                role="button"
                aria-label={`View ${item.name}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Region Badge */}
                  <Badge 
                    variant="secondary" 
                    className="absolute top-3 left-3 bg-white/90 text-gray-800"
                  >
                    {item.region}
                  </Badge>

                  {/* Remove Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromSaved(item.id);
                    }}
                    aria-label={`Remove ${item.name} from saved trips`}
                  >
                    <HeartOff className="w-4 h-4 text-red-600" />
                  </Button>

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Saved on {new Date(item.savedDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );

  if (!showNavigation) {
    return content;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation 
        currentPage="saved" 
        onNavigate={onNavigate!} 
        user={user}
        isAdmin={isAdmin}
      />
      
      {content}

      <Footer onNavigate={onNavigate!} />
    </div>
  );
}
