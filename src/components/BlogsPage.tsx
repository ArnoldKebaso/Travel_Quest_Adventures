import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { NewNavigation } from './NewNavigation';
import { Footer } from './Footer';
import { Search, Calendar, ExternalLink, PenTool, ChevronLeft, ChevronRight } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found' | 'blogs' | 'tours' | 'about' | 'contact' | 'tour-details' | 'blog-details';

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
  onBlogSelect: (blogId: string) => void;
  user: User | null;
  isAdmin?: boolean;
}

// Mock blog posts data
const generateMockPosts = (): BlogPost[] => {
  const regions = ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Darwin', 'Cairns', 'Gold Coast'];
  const tags = ['Adventure', 'Culture', 'Food', 'Nature', 'Photography', 'Solo Travel', 'Family', 'Budget'];
  const authors = [
    { name: 'Sarah Mitchell', avatar: 'SM' },
    { name: 'David Chen', avatar: 'DC' },
    { name: 'Emma Rodriguez', avatar: 'ER' },
    { name: 'James Wilson', avatar: 'JW' },
    { name: 'Lisa Thompson', avatar: 'LT' },
    { name: 'Michael Brown', avatar: 'MB' },
    { name: 'Anna Davis', avatar: 'AD' },
    { name: 'Robert Johnson', avatar: 'RJ' },
    { name: 'Maria Garcia', avatar: 'MG' },
    { name: 'Thomas Lee', avatar: 'TL' },
    { name: 'Jennifer White', avatar: 'JW' },
    { name: 'Christopher Martin', avatar: 'CM' },
    { name: 'Amanda Taylor', avatar: 'AT' },
    { name: 'Daniel Anderson', avatar: 'DA' },
    { name: 'Rachel Moore', avatar: 'RM' },
    { name: 'Kevin Jackson', avatar: 'KJ' },
    { name: 'Stephanie Clark', avatar: 'SC' },
    { name: 'Andrew Lewis', avatar: 'AL' },
    { name: 'Nicole Hall', avatar: 'NH' },
    { name: 'Ryan Young', avatar: 'RY' },
    { name: 'Michelle King', avatar: 'MK' },
    { name: 'Jonathan Wright', avatar: 'JW' },
    { name: 'Laura Green', avatar: 'LG' },
    { name: 'Steven Baker', avatar: 'SB' },
    { name: 'Melissa Adams', avatar: 'MA' },
    { name: 'Brian Nelson', avatar: 'BN' },
    { name: 'Heather Carter', avatar: 'HC' },
    { name: 'Jason Mitchell', avatar: 'JM' },
    { name: 'Rebecca Perez', avatar: 'RP' }
  ];

  // Curated Unsplash travel blog images
  const travelImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format&q=75', // Sydney Opera House
    'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400&h=300&fit=crop&auto=format&q=75', // Melbourne laneway
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&auto=format&q=75', // Great Barrier Reef
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&auto=format&q=75', // Uluru
    'https://images.unsplash.com/photo-1601467034225-609c87b8e678?w=400&h=300&fit=crop&auto=format&q=75', // Blue Mountains
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&auto=format&q=75', // Gold Coast
    'https://images.unsplash.com/photo-1548625361-3c8b9d1c67d3?w=400&h=300&fit=crop&auto=format&q=75', // Bondi Beach
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format&q=75', // Perth skyline
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format&q=75', // Adelaide
    'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=300&fit=crop&auto=format&q=75', // Cairns rainforest
    'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=400&h=300&fit=crop&auto=format&q=75', // Darwin sunset
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&auto=format&q=75', // Nature landscape
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&auto=format&q=75', // Team collaboration
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&auto=format&q=75', // Tropical beach
    'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400&h=300&fit=crop&auto=format&q=75', // Mountain hiking
    'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?w=400&h=300&fit=crop&auto=format&q=75', // City architecture
    'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=300&fit=crop&auto=format&q=75', // Forest landscape
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format&q=75', // Iconic landmarks
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&auto=format&q=75', // Wildlife
    'https://images.unsplash.com/photo-1464822759844-d150baec013a?w=400&h=300&fit=crop&auto=format&q=75', // Desert landscape
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop&auto=format&q=75', // Sunset views
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format&q=75', // Coastal views
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop&auto=format&q=75', // Adventure activities
    'https://images.unsplash.com/photo-1502780402662-acc01917115e?w=400&h=300&fit=crop&auto=format&q=75', // Cultural experiences
    'https://images.unsplash.com/photo-1543166112-5ba6b2e20fce?w=400&h=300&fit=crop&auto=format&q=75', // Food experiences
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&auto=format&q=75', // Photography spots
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format&q=75', // Family travel
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&auto=format&q=75', // Solo travel
    'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=300&fit=crop&auto=format&q=75', // Nature exploration
    'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=400&h=300&fit=crop&auto=format&q=75'  // Budget travel
  ];

  return Array.from({ length: 30 }, (_, i) => {
    const postId = i + 1;
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
      image: travelImages[(postId - 1) % travelImages.length],
      readTime: Math.floor(Math.random() * 8) + 3
    };
  });
};

export function BlogsPage({ onNavigate, onBlogSelect, user, isAdmin }: BlogsPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Initialize posts
  useEffect(() => {
    const loadInitialPosts = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
      setPosts(generateMockPosts());
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRegion, selectedTag]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of posts grid
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

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

        {/* Results count */}
        {!isLoading && filteredPosts.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} of {filteredPosts.length} posts
            </p>
          </div>
        )}

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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.map((post, index) => (
                <Card 
                  key={post.id} 
                  className="group overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                  tabIndex={0}
                  role="article"
                  aria-label={`Blog post: ${post.title}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => onBlogSelect(post.id)}
                >
                  {/* Featured Image */}
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={`Featured image for ${post.title}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Title Overlay on Hover */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
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
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:opacity-0 transition-opacity duration-500">
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
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        aria-label={`Read more about ${post.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onBlogSelect(post.id);
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-12">
                <div className="flex items-center space-x-2">
                  {/* Previous button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Button>

                  {/* Page numbers */}
                  <div className="flex items-center space-x-1">
                    {getPageNumbers().map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-10 h-10"
                      >
                        {pageNum}
                      </Button>
                    ))}
                  </div>

                  {/* Next button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center space-x-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
