import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Skeleton } from './ui/skeleton';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { NewNavigation } from './NewNavigation';
import { Footer } from './Footer';
import { SavedDestinations } from './SavedDestinations';
import { User, Mail, Lock, MapPin, Heart, Calendar, Star, Settings, LogOut, Loader2, Edit2, Trash2, Check, X } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found' | 'blogs' | 'tours' | 'about' | 'contact';

interface UserAccountProps {
  user: SupabaseUser | null;
  onNavigate: (page: Page) => void;
  isAdmin?: boolean;
}

interface UserComment {
  id: string;
  text: string;
  date: string;
  destinationName: string;
  rating: number;
}

interface SavedTripsItem {
  id: string;
  name: string;
  region: string;
  image: string;
  savedDate: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  memberSince: string;
  totalTrips: number;
  reviewsCount: number;
}

interface Booking {
  id: string;
  destinationId: string;
  destinationName: string;
  destinationImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
  bookingDate: string;
  canReview: boolean;
}

interface SavedDestination {
  id: string;
  name: string;
  image: string;
  category: string;
}

export function UserAccount({ user, onNavigate, isAdmin }: UserAccountProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'User',
    email: user?.email || ''
  });
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [errors, setErrors] = useState({ name: '', email: '' });

  // Mock data for saved trips
  const savedItems: SavedTripsItem[] = [
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
    }
  ];

  // Mock comments data
  const [comments, setComments] = useState<UserComment[]>([
    {
      id: '1',
      text: 'Amazing experience! The views were breathtaking and the tour guide was very knowledgeable.',
      date: '2024-01-15',
      destinationName: 'Sydney Opera House',
      rating: 5
    },
    {
      id: '2',
      text: 'Beautiful location but quite crowded during peak season. Would recommend visiting early morning.',
      date: '2024-01-20',
      destinationName: 'Bondi Beach',
      rating: 4
    },
    {
      id: '3',
      text: 'Incredible diving experience! Saw so many colorful fish and coral formations.',
      date: '2024-02-01',
      destinationName: 'Great Barrier Reef',
      rating: 5
    }
  ]);

  // Load comments with delay
  useEffect(() => {
    if (activeTab === 'comments') {
      setIsLoadingComments(true);
      setTimeout(() => {
        setIsLoadingComments(false);
      }, 300);
    }
  }, [activeTab]);

  const validateProfile = () => {
    const newErrors = { name: '', email: '' };
    let isValid = true;

    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveProfile = () => {
    if (validateProfile()) {
      setIsEditingProfile(false);
      toast.success('Profile updated!');
    }
  };

  const handleEditComment = (comment: UserComment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.text);
  };

  const handleSaveComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, text: editingCommentText }
        : comment
    ));
    setEditingCommentId(null);
    setEditingCommentText('');
    toast.success('Comment updated!');
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    setDeleteCommentId(null);
    toast.success('Comment deleted.');
  };

  const CommentSkeleton = () => (
    <Card className="p-4">
      <div className="animate-pulse">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    </Card>
  );

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation 
        currentPage="account" 
        onNavigate={onNavigate} 
        user={user}
        isAdmin={isAdmin}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your profile, trips, and comments</p>
        </div>

        {/* Tabbed Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger 
              value="profile"
              role="tab"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white border border-gray-200 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="saved-trips"
              role="tab"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white border border-gray-200 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Saved Trips
            </TabsTrigger>
            <TabsTrigger 
              value="comments"
              role="tab"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white border border-gray-200 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              My Comments
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {/* Profile Tab */}
            <TabsContent value="profile" role="tabpanel" className="focus-visible:outline-none">
              <motion.div
                key="profile"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6">
                  <CardHeader className="text-center pb-6">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src="" alt={profileData.name} />
                      <AvatarFallback className="text-2xl">
                        {profileData.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl">{profileData.name}</CardTitle>
                    <p className="text-gray-600">{profileData.email}</p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {!isEditingProfile ? (
                      <div className="text-center">
                        <Button 
                          variant="secondary" 
                          onClick={() => setIsEditingProfile(true)}
                          className="inline-flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit Profile
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => {
                              setProfileData(prev => ({ ...prev, name: e.target.value }));
                              if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                            }}
                            className={errors.name ? 'border-red-500' : ''}
                          />
                          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => {
                              setProfileData(prev => ({ ...prev, email: e.target.value }));
                              if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                            }}
                            className={errors.email ? 'border-red-500' : ''}
                          />
                          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div className="flex gap-2 justify-center">
                          <Button onClick={handleSaveProfile} className="inline-flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            Save
                          </Button>
                          <Button 
                            variant="ghost" 
                            onClick={() => {
                              setIsEditingProfile(false);
                              setErrors({ name: '', email: '' });
                            }}
                            className="inline-flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Saved Trips Tab */}
            <TabsContent value="saved-trips" role="tabpanel" className="focus-visible:outline-none">
              <motion.div
                key="saved-trips"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <SavedDestinations 
                  user={user}
                  onDestinationSelect={(id) => onNavigate('destination')}
                  savedItems={savedItems}
                  showNavigation={false}
                />
              </motion.div>
            </TabsContent>

            {/* My Comments Tab */}
            <TabsContent value="comments" role="tabpanel" className="focus-visible:outline-none">
              <motion.div
                key="comments"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">My Comments</h3>
                  
                  {isLoadingComments ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <CommentSkeleton key={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <Card key={comment.id} className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src="" alt={profileData.name} />
                              <AvatarFallback>
                                {profileData.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-medium">{profileData.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {comment.destinationName} • {comment.date}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditComment(comment)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setDeleteCommentId(comment.id)}
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              {editingCommentId === comment.id ? (
                                <div className="space-y-2">
                                  <Textarea
                                    value={editingCommentText}
                                    onChange={(e) => setEditingCommentText(e.target.value)}
                                    className="min-h-[80px]"
                                  />
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleSaveComment(comment.id)}
                                      className="inline-flex items-center gap-1"
                                    >
                                      <Check className="w-3 h-3" />
                                      Save
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      onClick={() => {
                                        setEditingCommentId(null);
                                        setEditingCommentText('');
                                      }}
                                      className="inline-flex items-center gap-1"
                                    >
                                      <X className="w-3 h-3" />
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-gray-700">{comment.text}</p>
                              )}
                              
                              <div className="flex items-center gap-1 mt-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < comment.rating 
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteCommentId} onOpenChange={() => setDeleteCommentId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Comment</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this comment? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteCommentId(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => deleteCommentId && handleDeleteComment(deleteCommentId)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
    }
  };

  const fetchSavedDestinations = async () => {
    if (!user) return;

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
        // This endpoint returns saved destination IDs, we'd need another call to get full destination details
        // For now, we'll keep the empty array until we implement the full saved destinations feature
        setSavedDestinations([]);
      }
    } catch (err) {
      console.error('Error fetching saved destinations:', err);
    }
  };

  const fetchUserBookings = async () => {
    if (!user) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-838db481/user/bookings`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error('Error fetching user bookings:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First create user via our backend
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-838db481/auth/signup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Then sign in the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
      });
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        throw new Error(error.message);
      }

      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
      });
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUserProfile(null);
      setSavedDestinations([]);
      setBookings([]);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const getUserDisplayName = () => {
    return userProfile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  };

  const formatMemberSince = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    } catch {
      return dateString; // Return as-is if it's already formatted
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-16 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {isSignIn ? 'Welcome Back' : 'Join TravelQuest'}
              </CardTitle>
              <p className="text-muted-foreground">
                {isSignIn 
                  ? 'Sign in to access your travel plans and saved destinations'
                  : 'Create an account to start planning your adventures'
                }
              </p>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={isSignIn ? handleSignIn : handleSignUp} className="space-y-4">
                {!isSignIn && (
                  <div>
                    <Label htmlFor="name">Full Names</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-5"
                      disabled={isLoading}
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-2"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="mt-2"
                    disabled={isLoading}
                  />
                </div>
                
                {!isSignIn && (
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="mt-2"
                      disabled={isLoading}
                    />
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isSignIn ? 'Signing In...' : 'Creating Account...'}
                    </>
                  ) : (
                    isSignIn ? 'Sign In' : 'Create Account'
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsSignIn(!isSignIn);
                    setError(null);
                    setFormData({
                      email: '',
                      password: '',
                      confirmPassword: '',
                      name: ''
                    });
                  }}
                  className="text-sm"
                  disabled={isLoading}
                >
                  {isSignIn 
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"
                  }
                </Button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-lg">
                  {getUserDisplayName().substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl font-bold mb-2">{getUserDisplayName()}</h1>
                <p className="text-muted-foreground mb-4">{user.email}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                  {userProfile && (
                    <>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Member since {userProfile.memberSince}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{userProfile.totalTrips || 0} trips</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{userProfile.reviewsCount || 0} reviews</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Tabs */}
        <Tabs defaultValue="saved" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="saved">Saved Destinations</TabsTrigger>
            <TabsTrigger value="trips">My Trips</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
          </TabsList>

          {/* Saved Destinations */}
          <TabsContent value="saved">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Saved Destinations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedDestinations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedDestinations.map((destination) => (
                      <Card key={destination.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                          <div className="relative overflow-hidden rounded-t-lg">
                            <ImageWithFallback
                              src={destination.image}
                              alt={destination.name}
                              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <Badge className="absolute top-2 left-2 bg-white/90 text-black">
                              {destination.category}
                            </Badge>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium mb-2">{destination.name}</h3>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="w-full"
                              onClick={() => onNavigate('listings')}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No saved destinations yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start exploring and save your favorite destinations for later
                    </p>
                    <Button onClick={() => onNavigate('listings')}>
                      Browse Destinations
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trip History */}
          <TabsContent value="trips">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>My Trips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length > 0 ? (
                  <div className="space-y-6">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                            <div className="md:col-span-1">
                              <ImageWithFallback
                                src={booking.destinationImage}
                                alt={booking.destinationName}
                                className="w-full h-32 md:h-full object-cover"
                              />
                            </div>
                            <div className="md:col-span-3 p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg">{booking.destinationName}</h3>
                                <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                                  {booking.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                                <div>
                                  <span className="font-medium">Check-in:</span>
                                  <br />
                                  {new Date(booking.checkIn).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="font-medium">Check-out:</span>
                                  <br />
                                  {new Date(booking.checkOut).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="font-medium">Guests:</span>
                                  <br />
                                  {booking.guests} guests
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="text-sm text-muted-foreground">
                                  Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                                </div>
                                {booking.canReview && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      // Navigate to destination to leave review
                                      onNavigate('listings');
                                    }}
                                  >
                                    <Star className="w-4 h-4 mr-2" />
                                    Leave Review
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No trips yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Book your first adventure and start creating memories
                    </p>
                    <Button onClick={() => onNavigate('listings')}>
                      Plan Your Trip
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>My Reviews</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Share your travel experiences to help other adventurers
                  </p>
                  <Button onClick={() => onNavigate('listings')}>
                    Browse Destinations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}