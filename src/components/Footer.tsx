import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground">TQ</span>
              </div>
              <span>TravelQuest</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted partner in discovering the wonders of Australia. Creating extraordinary travel experiences since 2010.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-background rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-background rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-background rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-background rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary cursor-pointer">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary cursor-pointer">Destinations</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary cursor-pointer">Tours</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary cursor-pointer">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary cursor-pointer">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary cursor-pointer">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary cursor-pointer">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary cursor-pointer">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary cursor-pointer">Cancellation Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary cursor-pointer">FAQs</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-primary" />
                <a href="mailto:info@travelquest.com.au" className="text-muted-foreground hover:text-primary cursor-pointer">
                  info@travelquest.com.au
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-primary" />
                <a href="tel:+61298765432" className="text-muted-foreground hover:text-primary cursor-pointer">
                  +61 2 9876 5432
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span className="text-muted-foreground">
                  123 George Street<br />
                  Sydney NSW 2000<br />
                  Australia
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} TravelQuest Adventures. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
