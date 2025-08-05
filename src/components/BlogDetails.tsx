import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { NewNavigation } from './NewNavigation';
import { Footer } from './Footer';
import { 
  Calendar, 
  Clock, 
  User as UserIcon,
  MessageCircle,
  ArrowRight,
  Share2,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found' | 'blogs' | 'tours' | 'about' | 'contact' | 'tour-details' | 'blog-details';

interface BlogDetailsProps {
  blogId: string;
  onNavigate: (page: Page) => void;
  user: SupabaseUser | null;
  isAdmin?: boolean;
}

interface BlogPost {
  id: string;
  title: string;
  heroImage: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: number;
  tags: string[];
  contentHtml: string;
  relatedPosts: RelatedPost[];
}

interface RelatedPost {
  id: string;
  title: string;
  thumbnail: string;
  readTime: number;
}

interface Comment {
  id: string;
  avatar: string;
  name: string;
  date: string;
  text: string;
}

// Mock blog data
const mockBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'The Ultimate Guide to Sustainable Travel in 2024',
    heroImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=600&fit=crop&auto=format&q=75',
    author: {
      name: 'Sarah Johnson',
      avatar: 'SJ'
    },
    date: '2024-01-25',
    readTime: 8,
    tags: ['Sustainable Travel', 'Eco-Tourism', 'Green Travel', 'Tips'],
    contentHtml: `
      <p class="text-lg text-gray-700 mb-6">Sustainable travel has become more important than ever as we recognize our impact on the planet. Here's how you can explore the world while minimizing your environmental footprint.</p>
      
      <h2 class="text-2xl font-bold mb-4 mt-8">What is Sustainable Travel?</h2>
      <p class="text-gray-700 mb-6">Sustainable travel refers to tourism that takes full account of its current and future economic, social and environmental impacts, addressing the needs of visitors, the industry, the environment and host communities.</p>
      
      <h2 class="text-2xl font-bold mb-4 mt-8">Top Sustainable Travel Tips</h2>
      <ul class="list-disc list-inside space-y-2 text-gray-700 mb-6">
        <li>Choose eco-friendly accommodations with green certifications</li>
        <li>Pack light to reduce fuel consumption during flights</li>
        <li>Support local businesses and buy local products</li>
        <li>Use public transportation or walk whenever possible</li>
        <li>Respect wildlife and natural environments</li>
        <li>Conserve water and energy during your stay</li>
      </ul>
      
      <h2 class="text-2xl font-bold mb-4 mt-8">Best Sustainable Destinations</h2>
      <p class="text-gray-700 mb-6">Some destinations are leading the way in sustainable tourism practices. Costa Rica, New Zealand, and Bhutan are excellent examples of countries that prioritize environmental conservation while offering incredible travel experiences.</p>
      
      <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop&auto=format&q=75" alt="Sustainable travel landscape" class="w-full rounded-lg mb-6" />
      
      <p class="text-gray-700 mb-6">Remember, every small action counts when it comes to sustainable travel. By making conscious choices, we can ensure that future generations will be able to enjoy the same beautiful destinations we explore today.</p>
    `,
    relatedPosts: [
      {
        id: '2',
        title: 'Digital Nomad Essentials: Working While Traveling',
        thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop&auto=format&q=75',
        readTime: 6
      },
      {
        id: '3',
        title: 'Budget Travel Hacks for 2024',
        thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&h=200&fit=crop&auto=format&q=75',
        readTime: 5
      },
      {
        id: '4',
        title: 'Solo Female Travel Safety Guide',
        thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop&auto=format&q=75',
        readTime: 7
      }
    ]
  },
  {
    id: '2',
    title: 'Digital Nomad Essentials: Working While Traveling',
    heroImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop&auto=format&q=75',
    author: {
      name: 'Mike Chen',
      avatar: 'MC'
    },
    date: '2024-01-20',
    readTime: 6,
    tags: ['Digital Nomad', 'Remote Work', 'Travel Tech', 'Productivity'],
    contentHtml: `
      <p class="text-lg text-gray-700 mb-6">The digital nomad lifestyle has revolutionized how we think about work and travel. Here's everything you need to know to work effectively while exploring the world.</p>
      
      <h2 class="text-2xl font-bold mb-4 mt-8">Essential Tech Gear</h2>
      <p class="text-gray-700 mb-6">Having the right technology is crucial for digital nomads. Invest in a reliable laptop, portable chargers, and noise-canceling headphones for productive work sessions.</p>
      
      <h2 class="text-2xl font-bold mb-4 mt-8">Finding Reliable Internet</h2>
      <p class="text-gray-700 mb-6">Research internet speeds and reliability before choosing your destination. Consider backup options like mobile hotspots and coworking spaces.</p>
    `,
    relatedPosts: []
  }
];

const mockComments: Comment[] = [
  {
    id: '1',
    avatar: 'EM',
    name: 'Emily Martinez',
    date: '2024-01-26',
    text: 'This is such a comprehensive guide! I\'ve been trying to travel more sustainably and these tips are really helpful.'
  },
  {
    id: '2',
    avatar: 'DJ',
    name: 'David Kim',
    date: '2024-01-25',
    text: 'Great article! I especially appreciate the destination recommendations. Costa Rica is definitely on my list now.'
  }
];

export function BlogDetails({ blogId, onNavigate, user, isAdmin }: BlogDetailsProps) {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isPostingComment, setIsPostingComment] = useState(false);

  useEffect(() => {
    // Simulate loading
    const foundBlog = mockBlogs.find(b => b.id === blogId) || mockBlogs[0];
    setBlog(foundBlog);
    
    // Simulate comment loading
    setTimeout(() => {
      setComments(mockComments);
      setIsLoadingComments(false);
    }, 1000);
  }, [blogId]);

  const handlePostComment = async () => {
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    
    if (!newComment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setIsPostingComment(true);
    
    // Simulate posting
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        avatar: user.email?.substring(0, 2).toUpperCase() || 'U',
        name: user.email?.split('@')[0] || 'User',
        date: new Date().toISOString().split('T')[0],
        text: newComment
      };
      
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      setIsPostingComment(false);
      toast.success('Comment added!');
    }, 1000);
  };

  const handleShare = (platform: string) => {
    toast.success(`Shared on ${platform}!`);
  };

  const CommentSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    </div>
  );

  if (!blog) {
    return (
      <div className="min-h-screen bg-white">
        <NewNavigation currentPage="blogs" onNavigate={onNavigate} user={user} isAdmin={isAdmin} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NewNavigation currentPage="blogs" onNavigate={onNavigate} user={user} isAdmin={isAdmin} />

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-[60vh] overflow-hidden"
      >
        <img
          src={blog.heroImage}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              {blog.title}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center justify-center gap-6 text-sm"
            >
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" alt={blog.author.name} />
                  <AvatarFallback className="text-xs">{blog.author.avatar}</AvatarFallback>
                </Avatar>
                <span>{blog.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(blog.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{blog.readTime} min read</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Tags Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-gray-50 py-4"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
              >
                <Badge variant="secondary">{tag}</Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Article - 3/4 */}
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="prose prose-lg max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
                className="space-y-6"
              />
            </div>

            {/* Share Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-center gap-4 mt-12 pt-8 border-t"
            >
              <span className="font-semibold">Share this article:</span>
              <button 
                onClick={() => handleShare('Facebook')}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleShare('Twitter')}
                className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleShare('LinkedIn')}
                className="p-2 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.article>

          {/* Sidebar - 1/4 */}
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8 space-y-8">
              {/* Related Posts */}
              {blog.relatedPosts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Related Posts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {blog.relatedPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                        className="group cursor-pointer"
                        onClick={() => onNavigate('blog-details')}
                      >
                        <div className="flex gap-3">
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{post.readTime} min read</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.aside>
        </div>

        {/* Comments Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="max-w-4xl mt-16 pt-8 border-t"
        >
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Comments
          </h2>

          {/* Comment Form */}
          {user ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-start gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="" alt="Your avatar" />
                  <AvatarFallback>
                    {user.email?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {newComment.length}/500 characters
                    </span>
                    <Button 
                      onClick={handlePostComment}
                      disabled={isPostingComment || !newComment.trim()}
                    >
                      {isPostingComment ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mb-8"
            >
              <Card>
                <CardContent className="text-center py-8">
                  <UserIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-semibold mb-2">Join the conversation</h3>
                  <p className="text-gray-600 mb-4">
                    Sign in to share your thoughts and connect with other travelers.
                  </p>
                  <Button onClick={() => onNavigate('auth')}>
                    Login to Comment
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Comments List */}
          {isLoadingComments ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <CommentSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment, index) => (
                <motion.div 
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1, duration: 0.4 }}
                  className="flex items-start gap-4"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" alt={comment.name} />
                    <AvatarFallback>{comment.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{comment.name}</h4>
                      <span className="text-gray-500 text-sm">
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
