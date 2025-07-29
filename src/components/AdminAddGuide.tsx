import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { NewNavigation } from './NewNavigation';
import { Footer } from './Footer';
import { ChevronRight, Upload, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found' | 'blogs' | 'tours' | 'about' | 'contact' | 'tour-details' | 'blog-details';

interface AdminAddGuideProps {
  onNavigate: (page: Page) => void;
  user?: SupabaseUser | null;
  isAdmin?: boolean;
}

interface FormData {
  title: string;
  content: string;
  region: string;
  category: string;
  imageUrl: string;
}

interface FormErrors {
  title?: string;
  content?: string;
  region?: string;
  category?: string;
}

export function AdminAddGuide({ onNavigate, user, isAdmin }: AdminAddGuideProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    region: '',
    category: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.trim().length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }

    if (!formData.region) {
      newErrors.region = 'Region is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUrlChange = (url: string) => {
    handleInputChange('imageUrl', url);
    if (url) {
      setImagePreview(url);
    }
  };

  const handleImageUpload = () => {
    // Simulate image upload with a placeholder
    const placeholderUrl = `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop`;
    handleImageUrlChange(placeholderUrl);
    toast.success('Image uploaded successfully');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Travel guide created successfully!');
      onNavigate('admin-dashboard');
    } catch (error) {
      toast.error('Failed to create travel guide');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title && formData.content && formData.region && formData.category;

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation 
        currentPage="admin-add-guide" 
        onNavigate={onNavigate} 
        user={user || null}
        isAdmin={isAdmin}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={() => onNavigate('admin-dashboard')}
                  className="cursor-pointer text-orange-600 hover:text-orange-700"
                >
                  Admin
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={() => onNavigate('admin-dashboard')}
                  className="cursor-pointer text-orange-600 hover:text-orange-700"
                >
                  Content
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-500">Add New Travel Guide</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Add New Travel Guide</h1>
          <p className="text-gray-600 mt-2">Create engaging travel content for your users</p>
        </div>

        {/* Form Card */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-xl font-bold text-gray-900">Guide Details</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-900">
                  Title *
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g. 'Great Barrier Reef Diving Guide'"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium text-gray-900">
                  Content / Description *
                </Label>
                <Textarea
                  id="content"
                  placeholder="Write your comprehensive travel guide here..."
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className={`min-h-[240px] ${errors.content ? 'border-red-500' : ''}`}
                  rows={8}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{errors.content && <span className="text-red-600">{errors.content}</span>}</span>
                  <span>{formData.content.length} characters</span>
                </div>
              </div>

              {/* Region and Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="region" className="text-sm font-medium text-gray-900">
                    Region *
                  </Label>
                  <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                    <SelectTrigger className={errors.region ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NSW">New South Wales</SelectItem>
                      <SelectItem value="VIC">Victoria</SelectItem>
                      <SelectItem value="QLD">Queensland</SelectItem>
                      <SelectItem value="WA">Western Australia</SelectItem>
                      <SelectItem value="SA">South Australia</SelectItem>
                      <SelectItem value="TAS">Tasmania</SelectItem>
                      <SelectItem value="NT">Northern Territory</SelectItem>
                      <SelectItem value="ACT">Australian Capital Territory</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.region && (
                    <p className="text-sm text-red-600">{errors.region}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium text-gray-900">
                    Category *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Guide">Travel Guide</SelectItem>
                      <SelectItem value="Blog Post">Blog Post</SelectItem>
                      <SelectItem value="Video">Video Content</SelectItem>
                      <SelectItem value="Tour Info">Tour Information</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-600">{errors.category}</p>
                  )}
                </div>
              </div>

              {/* Image Section */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-900">Featured Image</Label>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleImageUpload}
                    className="cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4">
                    <div className="w-full max-w-md mx-auto md:mx-0">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        onError={() => setImagePreview(null)}
                      />
                    </div>
                  </div>
                )}
                
                {!imagePreview && (
                  <div className="w-full max-w-md mx-auto md:mx-0 h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Image preview will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => onNavigate('admin-dashboard')}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? 'Creating...' : 'Save Guide'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
}