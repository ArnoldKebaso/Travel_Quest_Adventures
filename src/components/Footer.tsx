import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found' | 'blogs' | 'tours' | 'about' | 'contact';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && /\S+@\S+\.\S+/.test(email)) {
      console.log('Footer email signup:', email);
      setEmail('');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8">
          {/* Column 1: Logo & Description */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">ATE</span>
              </div>
              <span className="font-bold text-lg">Aussie Travel Explorer</span>
            </div>
            <p className="text-gray-400 mb-4">
              Explore Australia's wonders with expert guides and unforgettable experiences.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('listings')} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Destinations
                </button>
              </li>
              <li>
                <a 
                  href="#tours" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Tours
                </a>
              </li>
              <li>
                <a 
                  href="#blogs" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blogs
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#about" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a 
                  href="#privacy" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#terms" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Contact</h3>
            
            {/* Email form */}
            <form onSubmit={handleEmailSubmit} className="mb-6">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-primary"
                  required
                />
                <Button type="submit" size="sm" className="px-3">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {/* Social icons */}
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-400">
            ©2025 Aussie Travel Explorer. All rights reserved.
            <a 
              href="#privacy" 
              className="ml-4 hover:text-white transition-colors"
            >
              Privacy
            </a>
            <span className="mx-2">•</span>
            <a 
              href="#terms" 
              className="hover:text-white transition-colors"
            >
              Terms
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
