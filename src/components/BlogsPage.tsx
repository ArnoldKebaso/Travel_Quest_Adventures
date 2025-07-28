import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { NewNavigation } from './NewNavigation';
import { Footer } from './Footer';
import { Search, Calendar, User, ExternalLink, PenTool } from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found' | 'blogs' | 'tours' | 'about' | 'contact';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  region: string;
  tags: string[];
  image: string;
  readTime: number;
}

interface BlogsPageProps {
  onNavigate: (page: Page) => void;
  user: User | null;
  isAdmin?: boolean;
}

// Mock blog posts data
const generateMockPosts = (page: number = 1): BlogPost[] => {
  const regions = ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Darwin', 'Cairns', 'Gold Coast'];
  const tags = ['Adventure', 'Culture', 'Food', 'Nature', 'Photography', 'Solo Travel', 'Family', 'Budget'];
  const authors = [
    { name: 'Sarah Mitchell', avatar: 'SM' },
    { name: 'David Chen', avatar: 'DC' },
    { name: 'Emma Rodriguez', avatar: 'ER' },
    { name: 'James Wilson', avatar: 'JW' },
    { name: 'Lisa Thompson', avatar: 'LT' },
    { name: 'Michael Brown', avatar: 'MB' }
  ];

  return Array.from({ length: 6 }, (_, i) => {
    const postId = (page - 1) * 6 + i + 1;
    const author = authors[Math.floor(Math.random() * authors.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const postTags = tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
    
    return {
      id: `post-${postId}`,
      title: `Exploring the Hidden Gems of ${region}: A Traveler's Tale ${postId}`,
      excerpt: `Discover the breathtaking beauty and rich culture that ${region} has to offer. From stunning landscapes to local cuisine, this journey will leave you with unforgettable memories and a deeper appreciation for Australian culture.`,
      author,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
      region,
      tags: postTags,
      image: `https://images.unsplash.com/photo-${1500000000 + postId * 12345678}?w=400&h=300&fit=crop&auto=format&q=75`,
      readTime: Math.floor(Math.random() * 8) + 3
    };
  });
};

export function BlogsPage({ onNavigate, user, isAdmin }: BlogsPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  // Initialize posts
  useEffect(() => {
    const loadInitialPosts = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
      setPosts(generateMockPosts(1));
      setIsLoading(false);
    };

    loadInitialPosts();
  }, []);

  // Filter posts based on search and filters
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || post.region === selectedRegion;
    const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesRegion && matchesTag;
  });

  // Load more posts (infinite scroll)
  const loadMorePosts = useCallback(async () => {
    if (isLoadingMore || !hasMorePosts) return;

    setIsLoadingMore(true);
    toast.info('Loading more posts...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const nextPage = currentPage + 1;
    const newPosts = generateMockPosts(nextPage);
    
    setPosts(prev => [...prev, ...newPosts]);
    setCurrentPage(nextPage);
    
    // Simulate end of posts after 5 pages
    if (nextPage >= 5) {
      setHasMorePosts(false);
      toast.info('No more posts to load');
    }
    
    setIsLoadingMore(false);
  }, [currentPage, isLoadingMore, hasMorePosts]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMorePosts]);

  const regions = ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Darwin', 'Cairns', 'Gold Coast'];
  const tags = ['Adventure', 'Culture', 'Food', 'Nature', 'Photography', 'Solo Travel', 'Family', 'Budget'];

  // Skeleton loading component
  const PostSkeleton = () => (
    <Card className="overflow-hidden">
      <div className="animate-pulse">
        <div className="aspect-video bg-gray-200" />
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="flex items-center gap-2 pt-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="h-3 bg-gray-200 rounded w-20" />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation 
        currentPage="blogs" 
        onNavigate={onNavigate} 
        user={user}
        isAdmin={isAdmin}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Travel Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from Aussie explorers sharing their adventures, tips, and discoveries
          </p>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 py-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Region Filter */}
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Tag Filter */}
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {tags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <PenTool className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No blog posts found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedRegion !== 'all' || selectedTag !== 'all' 
                  ? 'Try adjusting your filters to see more posts.'
                  : 'Be the first to share your travel story!'
                }
              </p>
              <Button onClick={() => onNavigate('account')} className="inline-flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                Write a Blog
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <Card 
                key={post.id} 
                className="group overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                tabIndex={0}
                role="article"
                aria-label={`Blog post: ${post.title}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Featured Image */}
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={`Featured image for ${post.title}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Title Overlay on Hover */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-semibold text-sm line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Title (visible when not hovering) */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:opacity-0 transition-opacity duration-300">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Author & Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="" alt={post.author.name} />
                        <AvatarFallback className="text-xs">
                          {post.author.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {post.author.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime} min read</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-label={`Read more about ${post.title}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Loading More Indicator */}
        {isLoadingMore && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <PostSkeleton key={`loading-${index}`} />
            ))}
          </div>
        )}
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
