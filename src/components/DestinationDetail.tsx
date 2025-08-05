import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BookingForm } from './BookingForm';
import { ArrowLeft, Star, MapPin, Clock, Heart, Share2, Calendar, Users, Send, Loader2, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

interface DestinationDetailProps {
  destinationId: string | null;
  onBack: () => void;
  user: User | null;
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
  price: string;
  highlights: string[];
  bestTime: string;
  difficulty: string;
  groupSize: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  rating: number;
  date: string;
  created_at?: string;
}

export function DestinationDetail({ destinationId, onBack, user }: DestinationDetailProps) {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);
  const [isCheckingVisit, setIsCheckingVisit] = useState(false);
  const [isTogglingSave, setIsTogglingSave] = useState(false);

  useEffect(() => {
    if (destinationId) {
      fetchDestination();
      fetchComments();
      if (user) {
        checkUserVisit();
        checkSavedStatus();
      }
    }
  }, [destinationId, user]);

  const fetchDestination = async () => {
    if (!destinationId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-838db481/destinations/${destinationId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setDestination(data.destination);
    } catch (err) {
      console.error('Error fetching destination:', err);
      setError('Failed to load destination details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!destinationId) return;

    try {
      setIsLoadingComments(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-838db481/destinations/${destinationId}/comments`, {
        headers: {
          'Authorization': session?.access_token ? `Bearer ${session.access_token}` : `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setComments(data.comments || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const checkUserVisit = async () => {
    if (!destinationId || !user) return;

    try {
      setIsCheckingVisit(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) return;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-838db481/user/visited/${destinationId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHasVisited(data.hasVisited || false);
      }
    } catch (err) {
      console.error('Error checking visit status:', err);
    } finally {
      setIsCheckingVisit(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user || !destinationId) return;

    try {
      setIsSubmittingComment(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-838db481/destinations/${destinationId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          comment: newComment,
          rating: newRating
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit comment');
      }

      const data = await response.json();
      
      // Add the new comment to the list
      setComments([data.comment, ...comments]);
      setNewComment('');
      setNewRating(5);
      toast.success('Review posted successfully!');
    } catch (err) {
      console.error('Error submitting comment:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to submit comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const checkSavedStatus = async () => {
    if (!destinationId || !user) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) return;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-838db481/user/saved`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const savedIds = data.saved || [];
        setIsSaved(savedIds.includes(destinationId));
      }
    } catch (err) {
      console.error('Error checking saved status:', err);
    }
  };

  const handleToggleSave = async () => {
    if (!destinationId || !user || isTogglingSave) return;

    try {
      setIsTogglingSave(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Authentication required');
      }

      const method = isSaved ? 'DELETE' : 'POST';
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-838db481/user/saved/${destinationId}`, {
        method,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update saved status');
      }

      setIsSaved(!isSaved);
      toast.success(isSaved ? 'Destination removed from saved list' : 'Destination saved successfully!');
    } catch (err) {
      console.error('Error toggling save status:', err);
      toast.error('Failed to update saved status');
    } finally {
      setIsTogglingSave(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      return `${Math.ceil(diffDays / 30)} months ago`;
    } catch {
      return 'Recently';
    }
  };

  const getUserInitials = (userName: string | undefined | null) => {
    if (!userName || typeof userName !== 'string') {
      return 'U';
    }
    
    try {
      return userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    } catch {
      return 'U';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading destination...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {error || 'Destination not found'}
          </h2>
          <Button onClick={onBack} className="cursor-pointer">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Destinations</span>
            </Button>
            <div className="flex items-center space-x-2">
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleSave}
                  disabled={isTogglingSave}
                  className={`cursor-pointer ${isSaved ? 'text-red-500' : ''}`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
              )}
              <Button variant="ghost" size="sm" className="cursor-pointer">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative rounded-lg overflow-hidden mb-4">
                <ImageWithFallback
                  src={destination.images?.[selectedImage] || destination.images?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop'}
                  alt={destination.name}
                  className="w-full h-96 object-cover"
                />
              </div>
              {destination.images && destination.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {destination.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative rounded-lg overflow-hidden cursor-pointer ${
                        selectedImage === index ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`${destination.name} ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title and Basic Info */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="secondary">{destination.category}</Badge>
                <Badge variant="outline">{destination.region}</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{destination.name}</h1>
              <div className="flex items-center space-x-6 text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{destination.rating}</span>
                  <span>({destination.reviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{destination.region}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{destination.duration}</span>
                </div>
              </div>
              <p className="text-lg leading-relaxed">{destination.description}</p>
            </div>

            {/* Detailed Description */}
            {destination.longDescription && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">About This Destination</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {destination.longDescription}
                </p>
              </div>
            )}

            {/* Highlights */}
            {destination.highlights && destination.highlights.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">What You'll Experience</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destination.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Traveler Reviews</h2>
              
              {/* Add Comment */}
              {user ? (
                hasVisited ? (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Share Your Experience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setNewRating(star)}
                              className={`p-1 cursor-pointer ${star <= newRating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              <Star className={`w-5 h-5 ${star <= newRating ? 'fill-current' : ''}`} />
                            </button>
                          ))}
                          <span className="ml-2 text-sm text-muted-foreground">({newRating} stars)</span>
                        </div>
                      </div>
                      <Textarea
                        placeholder="Tell other travelers about your experience..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="mb-4"
                      />
                      <Button 
                        onClick={handleSubmitComment} 
                        disabled={!newComment.trim() || isSubmittingComment}
                        className="cursor-pointer"
                      >
                        {isSubmittingComment ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4 mr-2" />
                        )}
                        Post Review
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="mb-6 border-orange-200 bg-orange-50/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-orange-800 mb-1">
                            Reviews from verified travelers only
                          </p>
                          <p className="text-sm text-orange-700">
                            Book and complete a trip with TravelQuest to share your authentic experience and help other travelers.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              ) : (
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center">
                      <span>Sign in to book trips and share your travel experiences</span>
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Comments List */}
              {isLoadingComments ? (
                <div className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Loading reviews...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              {getUserInitials(comment.userName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium">{comment.userName || 'Anonymous User'}</span>
                              {comment.rating && (
                                <div className="flex items-center">
                                  {[...Array(Math.max(1, Math.min(5, comment.rating)))].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                              )}
                              <span className="text-sm text-muted-foreground">
                                {formatDate(comment.date || comment.created_at)}
                              </span>
                            </div>
                            <p className="text-muted-foreground">{comment.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {comments.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No reviews yet. Book a trip to be the first to share your experience!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <Card className="sticky top-32 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Book Your Trip</span>
                  <span className="text-2xl font-bold text-primary">{destination.price}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user ? (
                  <BookingForm 
                    destinationId={destination.id}
                    destinationName={destination.name}
                    price={destination.price}
                    onBookingSuccess={() => {
                      // Refresh the visit status after booking
                      setTimeout(() => checkUserVisit(), 1000);
                    }}
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Sign in to book this amazing destination
                    </p>
                    <Button className="w-full cursor-pointer" size="lg" onClick={() => {
                      // This would typically trigger a sign-in modal
                      toast.info('Please sign in to book trips');
                    }}>
                      Sign In to Book
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trip Details */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {destination.bestTime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Best time to visit</span>
                    <span>{destination.bestTime}</span>
                  </div>
                )}
                {destination.difficulty && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty level</span>
                    <span>{destination.difficulty}</span>
                  </div>
                )}
                {destination.groupSize && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Group size</span>
                    <span>{destination.groupSize}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{destination.duration}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}