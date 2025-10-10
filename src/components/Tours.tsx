import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Clock, Users, TrendingUp, MapPin, Check } from 'lucide-react';
import { tours } from '../utils/staticData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useAuth } from '../utils/authContext';
import { toast } from 'sonner';
import { TourBookingForm } from './TourBookingForm';

const categories = ['All', 'Adventure', 'Cultural', 'Wildlife', 'Food & Wine', 'Nature'];
const difficulties = ['All', 'Easy', 'Moderate', 'Challenging'];

export function Tours() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTour, setSelectedTour] = useState<typeof tours[0] | null>(null);
  const [bookingTour, setBookingTour] = useState<typeof tours[0] | null>(null);

  const filteredTours = tours.filter(tour => {
    const categoryMatch = selectedCategory === 'All' || tour.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'All' || tour.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="mb-4">Guided Tours & Experiences</h1>
          <p className="max-w-2xl mx-auto">
            Join our expert-led tours and create unforgettable memories exploring Australia's most incredible destinations.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-border bg-background/95 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-muted-foreground mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <Badge
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-muted-foreground mb-2 block">Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map(diff => (
                  <Badge
                    key={diff}
                    variant={selectedDifficulty === diff ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedDifficulty(diff)}
                  >
                    {diff}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map(tour => (
            <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={tour.image_url}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 right-4">{tour.category}</Badge>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="flex-1">{tour.title}</h3>
                </div>
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{tour.location}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{tour.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Max {tour.max_group_size} guests</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{tour.difficulty}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <span className="text-muted-foreground text-sm">From</span>
                    <p className="text-primary">${tour.price}</p>
                  </div>
                  <Button 
                    onClick={() => setSelectedTour(tour)}
                    className="cursor-pointer"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTours.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tours found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Tour Detail Dialog */}
      <Dialog open={!!selectedTour} onOpenChange={() => setSelectedTour(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTour && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTour.title}</DialogTitle>
                <DialogDescription>{selectedTour.location}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={selectedTour.image_url}
                    alt={selectedTour.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{selectedTour.location}</span>
                </div>

                <p>{selectedTour.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p>{selectedTour.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Group Size</p>
                    <p>Max {selectedTour.max_group_size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Difficulty</p>
                    <p>{selectedTour.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-primary">${selectedTour.price}</p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3">Tour Highlights</h4>
                  <ul className="space-y-2">
                    {selectedTour.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      setBookingTour(selectedTour);
                    }}
                  >
                    Book Now
                  </Button>
                  <Button variant="outline" className="cursor-pointer">Contact Us</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      {bookingTour && (
        <TourBookingForm
          tourId={bookingTour.id}
          tourTitle={bookingTour.title}
          price={bookingTour.price}
          maxGroupSize={bookingTour.max_group_size}
          open={!!bookingTour}
          onOpenChange={(open) => {
            if (!open) setBookingTour(null);
          }}
        />
      )}
    </div>
  );
}
