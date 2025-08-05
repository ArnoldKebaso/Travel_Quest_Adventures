import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { NewNavigation } from './NewNavigation';
import { Footer } from './Footer';
import { Phone, Mail, MapPin, Send, Clock, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found' | 'blogs' | 'tours' | 'about' | 'contact';

interface ContactPageProps {
  onNavigate: (page: Page) => void;
  user: User | null;
  isAdmin?: boolean;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  newsletter: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: '+61 1800 TRAVEL',
    subtext: 'Mon-Fri 9AM-6PM AEST'
  },
  {
    icon: Mail,
    title: 'Email',
    details: 'hello@travelquest.com.au',
    subtext: 'We reply within 24 hours'
  },
  {
    icon: MapPin,
    title: 'Address',
    details: '123 Adventure Street',
    subtext: 'Sydney, NSW 2000'
  }
];

const subjects = [
  'General Inquiry',
  'Booking Support',
  'Technical Issue',
  'Partnership Opportunity',
  'Travel Planning',
  'Feedback',
  'Other'
];

export function ContactPage({ onNavigate, user, isAdmin }: ContactPageProps) {
  const [formData, setFormData] = useState<FormData>({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    subject: '',
    message: '',
    newsletter: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Subject validation
    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      toast.success('Message sent—thanks! We\'ll get back to you soon.');
      
      // Clear form
      setFormData({
        name: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        subject: '',
        message: '',
        newsletter: false
      });
      setErrors({});
      
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation 
        currentPage="contact" 
        onNavigate={onNavigate} 
        user={user}
        isAdmin={isAdmin}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have questions, need help planning your adventure, 
            or want to share feedback, we're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <Card 
                      key={info.title}
                      className="transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                            <p className="text-gray-900 font-medium">{info.details}</p>
                            <p className="text-gray-600 text-sm">{info.subtext}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM AEST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM AEST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={errors.name ? 'border-red-500 focus:ring-red-500' : ''}
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-red-500 focus:ring-red-500' : ''}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                      <SelectTrigger className={errors.subject ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Choose a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subject && (
                      <p className="text-sm text-red-600">{errors.subject}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className={`min-h-[120px] resize-none ${errors.message ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Tell us how we can help you..."
                      maxLength={1000}
                    />
                    <div className="flex justify-between items-center">
                      {errors.message && (
                        <p className="text-sm text-red-600">{errors.message}</p>
                      )}
                      <p className="text-xs text-gray-500 ml-auto">
                        {formData.message.length}/1000 characters
                      </p>
                    </div>
                  </div>

                  {/* Newsletter Checkbox */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={formData.newsletter}
                      onCheckedChange={(checked) => handleInputChange('newsletter', checked as boolean)}
                    />
                    <Label 
                      htmlFor="newsletter" 
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      Subscribe to our newsletter for travel tips and exclusive offers
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Visit Our Office</h2>
          <Card className="overflow-hidden">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Interactive Map</p>
                <p className="text-sm text-gray-500 mt-2">
                  123 Adventure Street, Sydney, NSW 2000
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Map integration available with Google Maps API
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
