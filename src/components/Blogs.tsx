import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Search, Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { blogs } from '../utils/staticData';

const categories = ['All', 'Nature', 'City', 'Cultural', 'Food & Wine', 'Sustainability'];

export function Blogs() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlog, setSelectedBlog] = useState<typeof blogs[0] | null>(null);

  const filteredBlogs = blogs.filter(blog => {
    const categoryMatch = selectedCategory === 'All' || blog.category === selectedCategory;
    const searchMatch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  if (selectedBlog) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => setSelectedBlog(null)}
            className="mb-6 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Button>

          <article>
            <div className="mb-6">
              <Badge className="mb-4">{selectedBlog.category}</Badge>
              <h1 className="mb-4">{selectedBlog.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{selectedBlog.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(selectedBlog.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{selectedBlog.read_time}</span>
                </div>
              </div>
            </div>

            <div className="relative h-96 rounded-lg overflow-hidden mb-8">
              <ImageWithFallback
                src={selectedBlog.image_url}
                alt={selectedBlog.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-lg max-w-none">
              {selectedBlog.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return <h2 key={index}>{paragraph.replace('## ', '')}</h2>;
                } else if (paragraph.startsWith('### ')) {
                  return <h3 key={index}>{paragraph.replace('### ', '')}</h3>;
                } else if (paragraph.trim().startsWith('- ')) {
                  return <li key={index}>{paragraph.replace('- ', '')}</li>;
                } else if (paragraph.trim()) {
                  return <p key={index}>{paragraph}</p>;
                }
                return null;
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                  {selectedBlog.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p>{selectedBlog.author}</p>
                  <p className="text-sm text-muted-foreground">Travel Writer & Photographer</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="mb-4">Travel Blog</h1>
          <p className="max-w-2xl mx-auto">
            Inspiring stories, helpful guides, and insider tips for your Australian adventure.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="border-b border-border bg-background/95 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
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
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map(blog => (
            <Card 
              key={blog.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedBlog(blog)}
            >
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={blog.image_url}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 right-4">{blog.category}</Badge>
              </div>
              <CardHeader>
                <h3 className="mb-2">{blog.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{blog.read_time}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{blog.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {new Date(blog.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <Button variant="ghost" size="sm" className="cursor-pointer">
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blog posts found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
