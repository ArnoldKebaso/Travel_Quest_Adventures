import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';
import { toast } from 'sonner';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found' | 'blogs' | 'tours' | 'about' | 'contact' | 'tour-details' | 'blog-details';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && /\S+@\S+\.\S+/.test(email)) {
      toast.success('Subscribed! Welcome to our travel community.');
      setEmail('');
    } else {
      toast.error('Please enter a valid email address.');
    }
  };

  // Helper for SPA navigation links
  const navLink = (label: string, page: Page, icon?: React.ReactNode) => (
    <a
      href="#"
      onClick={e => { e.preventDefault(); onNavigate(page); }}
      className={`text-[#E5E5E5] hover:text-[#FFD1C1] transition-all duration-300 text-sm hover:translate-x-1 inline-flex items-center no-underline`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </a>
  );

  return (
    <footer className="bg-[#111] text-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo & Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#FF6B35] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ATE</span>
              </div>
              <div>
                <h3 className="font-bold text-xl text-white">Aussie Travel Explorer</h3>
                <p className="text-sm text-[#E5E5E5]">Explore Australia's wonders</p>
              </div>
            </div>
            <p className="text-[#E5E5E5] text-sm leading-relaxed">
              Discover the breathtaking beauty and rich culture of Australia with our expert guides and unforgettable experiences.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#E5E5E5] hover:text-[#FFD1C1] transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#E5E5E5] hover:text-[#FFD1C1] transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#E5E5E5] hover:text-[#FFD1C1] transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#E5E5E5] hover:text-[#FFD1C1] transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-white">Navigation</h3>
            <ul className="space-y-4">
              <li>{navLink('Home', 'home')}</li>
              <li>{navLink('Destinations', 'listings')}</li>
              <li>{navLink('Tours', 'tours')}</li>
              <li>{navLink('Blogs', 'blogs')}</li>
              <li>{navLink('Favorites', 'saved', <Heart className="w-4 h-4" />)}</li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-white">Resources</h3>
            <ul className="space-y-4">
              <li>{navLink('About Us', 'about')}</li>
              <li>{navLink('Contact', 'contact')}</li>
              <li>
                <a 
                  href="#privacy" 
                  className="text-[#E5E5E5] hover:text-[#FFD1C1] transition-all duration-300 text-sm hover:translate-x-1 inline-block no-underline"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#terms" 
                  className="text-[#E5E5E5] hover:text-[#FFD1C1] transition-all duration-300 text-sm hover:translate-x-1 inline-block no-underline"
                >
                  Terms of Service
                </a>
              </li>
              <li>{navLink('Admin Portal', 'admin-auth')}</li>
            </ul>
          </div>

          {/* Column 4: Newsletter Signup */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-white">Stay Updated</h3>
            <p className="text-[#E5E5E5] text-sm">
              Get travel tips, exclusive offers, and adventure stories delivered to your inbox.
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#333] border-[#555] text-white placeholder-[#999] focus:border-[#FF6B35] focus:ring-[#FF6B35] transition-all duration-300"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full bg-[#FF6B35] hover:bg-[#FF8A5C] text-white font-medium transition-all duration-300 hover:scale-105"
                >
                  Subscribe
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-[#999] text-sm">
            ©2025 Aussie Travel Explorer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
