import { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { NewNavigation } from './NewNavigation';
import { Footer } from './Footer';
import { Compass, Heart, Leaf, Users, Award, Globe } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found' | 'blogs' | 'tours' | 'about' | 'contact';

interface AboutUsProps {
  onNavigate: (page: Page) => void;
  user: User | null;
  isAdmin?: boolean;
}

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

interface Value {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Sarah Mitchell',
    role: 'Founder & CEO',
    avatar: 'SM',
    bio: 'Adventure enthusiast with 15+ years exploring Australia'
  },
  {
    name: 'David Chen',
    role: 'Head of Operations',
    avatar: 'DC',
    bio: 'Expert in sustainable tourism and cultural experiences'
  },
  {
    name: 'Emma Rodriguez',
    role: 'Experience Designer',
    avatar: 'ER',
    bio: 'Creating unforgettable journeys across the continent'
  },
  {
    name: 'James Wilson',
    role: 'Community Manager',
    avatar: 'JW',
    bio: 'Connecting travelers with authentic local experiences'
  }
];

const values: Value[] = [
  {
    title: 'Integrity',
    description: 'We believe in honest, transparent communication and delivering on our promises. Every experience we offer is carefully vetted to ensure authenticity and quality.',
    icon: Heart
  },
  {
    title: 'Community',
    description: 'We foster connections between travelers and local communities, creating meaningful relationships that benefit everyone involved in the journey.',
    icon: Users
  },
  {
    title: 'Sustainability',
    description: 'We are committed to responsible travel that protects Australia\'s natural beauty and supports local communities for future generations.',
    icon: Leaf
  }
];

export function AboutUs({ onNavigate, user, isAdmin }: AboutUsProps) {
  const missionRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const sections = [missionRef, storyRef, teamRef, valuesRef];
    sections.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <NewNavigation 
        currentPage="about" 
        onNavigate={onNavigate} 
        user={user}
        isAdmin={isAdmin}
      />

      {/* Hero Banner */}
      <div className="relative h-40 sm:h-48 lg:h-56 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop&auto=format&q=75"
          alt="Australian sunset landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-center">
            About Us
          </h1>
        </div>
      </div>

      {/* Mission Section */}
      <section ref={missionRef} className="py-16 bg-white opacity-0 transform translate-y-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Compass className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
            To connect travelers with the authentic heart of Australia through carefully curated experiences 
            that celebrate our diverse culture, stunning landscapes, and vibrant communities. We believe every 
            journey should be transformative, sustainable, and deeply meaningful.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section ref={storyRef} className="py-16 bg-gray-50 opacity-0 transform translate-y-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Founded in 2018 by a group of passionate Australian explorers, TravelQuest Adventures 
                  began as a simple idea: to share the hidden gems and authentic experiences that make 
                  Australia truly special.
                </p>
                <p>
                  After years of exploring every corner of our beautiful continent, from the red heart 
                  of the Outback to the pristine coastlines, we realized that the most memorable travel 
                  experiences come from genuine connections with local communities and the natural world.
                </p>
                <p>
                  Today, we work with local guides, indigenous communities, and sustainable tourism 
                  operators to create journeys that not only showcase Australia's beauty but also 
                  contribute to the preservation of our unique heritage and environment.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&auto=format&q=75"
                alt="Team at work planning adventures"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <Award className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="py-16 bg-white opacity-0 transform translate-y-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Passionate explorers dedicated to creating unforgettable Australian adventures
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card 
                key={member.name} 
                className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {member.avatar}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-16 bg-gray-50 opacity-0 transform translate-y-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide every adventure we create and every relationship we build
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card 
                  key={value.title} 
                  className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Globe className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Become part of a community of explorers, adventurers, and culture enthusiasts. 
            Share your stories, discover new destinations, and connect with fellow travelers.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => onNavigate(user ? 'account' : 'auth')}
            className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3"
          >
            {user ? 'Visit Your Account' : 'Join Our Community'}
          </Button>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
