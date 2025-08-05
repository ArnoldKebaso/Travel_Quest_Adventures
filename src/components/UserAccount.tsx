import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { NewNavigation } from './NewNavigation';
import { Footer } from './Footer';
import { SavedDestinations } from './SavedDestinations';
import { Edit2, Trash2, Check, X, Star } from 'lucide-react';
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
                  onDestinationSelect={() => onNavigate('destination')}
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
