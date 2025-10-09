import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BookingForm } from './BookingForm';
import { ArrowLeft, Star, MapPin, Clock, Calendar, MessageSquare } from 'lucide-react';
import { destinations, reviews } from '../utils/staticData';
import { useAuth } from '../utils/authContext';
import { toast } from 'sonner';

export function DestinationDetail() {
  const { id: destinationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  
  const destination = destinations.find(d => d.id === destinationId);
  const destinationReviews = reviews.filter(r => r.destination_id === destinationId && r.status === 'approved');

  useEffect(() => {
    setSelectedImage(0);
  }, [destinationId]);

  if (!destination) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">Destination not found</p>
            <Button onClick={() => navigate('/destinations')} className="cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Destinations
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const allImages = [destination.image_url, ...(destination.gallery_urls || [])];
  const averageRating = destinationReviews.length > 0
    ? (destinationReviews.reduce((sum, r) => sum + r.rating, 0) / destinationReviews.length).toFixed(1)
    : '4.8';

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/destinations')}
          className="mb-6 cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Destinations
        </Button>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="relative h-96 lg:h-[600px] rounded-lg overflow-hidden">
            <ImageWithFallback
              src={allImages[selectedImage]}
              alt={destination.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {allImages.slice(0, 4).map((img, index) => (
              <div
                key={index}
                className={`relative h-44 lg:h-[290px] rounded-lg overflow-hidden cursor-pointer ${
                  selectedImage === index ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <ImageWithFallback
                  src={img}
                  alt={`${destination.title} ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge>{destination.category}</Badge>
                <Badge variant="outline">{destination.region}</Badge>
              </div>
              <h1 className="mb-2">{destination.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{destination.location}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                  <span>{averageRating} ({destinationReviews.length} reviews)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Destination</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {destination.description}
                </p>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle>Travel Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p>Best Time to Visit</p>
                    <p className="text-sm text-muted-foreground">{destination.best_time_to_visit}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p>Price</p>
                    <p className="text-sm text-muted-foreground">${destination.price_per_night} per night</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Reviews ({destinationReviews.length})</CardTitle>
                  {!showReviewForm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!user) {
                          toast.error('Please login to write a review');
                          navigate('/login', { state: { from: `/destinations/${destinationId}` } });
                        } else {
                          setShowReviewForm(true);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Write Review
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Review Form */}
                {showReviewForm && user && (
                  <div className="mb-6 p-4 border border-border rounded-lg bg-accent/50">
                    <h4 className="mb-4">Write Your Review</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm mb-2">Rating</p>
                        <div className="flex items-center gap-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-6 w-6 cursor-pointer transition-colors ${
                                i < reviewRating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 hover:text-yellow-200'
                              }`}
                              onClick={() => setReviewRating(i + 1)}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm mb-2">Your Review</p>
                        <Textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience..."
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowReviewForm(false);
                            setReviewComment('');
                            setReviewRating(5);
                          }}
                          className="cursor-pointer"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            if (!reviewComment.trim()) {
                              toast.error('Please write a review');
                              return;
                            }
                            toast.success('Review submitted! It will be visible after admin approval.');
                            setShowReviewForm(false);
                            setReviewComment('');
                            setReviewRating(5);
                          }}
                          disabled={!reviewComment.trim()}
                          className="cursor-pointer"
                        >
                          Submit Review
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                {destinationReviews.length > 0 ? (
                  <div className="space-y-6">
                    {destinationReviews.map((review) => (
                      <div key={review.id} className="border-b border-border last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {review.user_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p>{review.user_name}</p>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-2">{review.comment}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No reviews yet. Be the first to review this destination!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <BookingForm
                destinationId={destination.id}
                destinationName={destination.title}
                price={destination.price_per_night.toString()}
                maxGuests={50}
                onBookingSuccess={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
