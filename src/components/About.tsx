import React from 'react';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Award, Users, Globe, Heart, Shield, Compass } from 'lucide-react';

export function About() {
  const values = [
    {
      icon: Heart,
      title: 'Passion for Travel',
      description: 'We love what we do and are dedicated to creating unforgettable experiences for every traveler.'
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Your safety and security are our top priorities. We partner only with vetted, reliable operators.'
    },
    {
      icon: Globe,
      title: 'Sustainable Tourism',
      description: 'We are committed to protecting Australia\'s natural wonders for future generations.'
    },
    {
      icon: Users,
      title: 'Expert Guidance',
      description: 'Our team of local experts ensures you get authentic, insider experiences.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Travelers' },
    { number: '50+', label: 'Destinations' },
    { number: '200+', label: 'Tour Options' },
    { number: '15', label: 'Years Experience' }
  ];

  const team = [
    {
      name: 'Sarah Mitchell',
      role: 'Founder & CEO',
      bio: 'With over 15 years in the travel industry, Sarah founded TravelQuest to share her passion for Australian adventures.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
    },
    {
      name: 'James Chen',
      role: 'Head of Operations',
      bio: 'James ensures every trip runs smoothly with his exceptional attention to detail and problem-solving skills.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
    },
    {
      name: 'Emily Nguyen',
      role: 'Cultural Experience Director',
      bio: 'Emily specializes in creating respectful and meaningful indigenous cultural experiences.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
    },
    {
      name: 'Michael Torres',
      role: 'Adventure Tours Manager',
      bio: 'An experienced guide and adventurer, Michael leads our most thrilling expeditions.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="mb-4">About TravelQuest Adventures</h1>
          <p className="text-lg">
            Your trusted partner in discovering the wonders of Australia. We create extraordinary travel experiences 
            that connect you with the heart and soul of this incredible continent.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="mb-6">Our Story</h2>
          <p className="text-muted-foreground mb-4">
            TravelQuest Adventures was born from a simple idea: that travel should be more than just visiting places—it 
            should be about creating meaningful connections, understanding cultures, and experiencing the extraordinary.
          </p>
          <p className="text-muted-foreground mb-4">
            Founded in 2010, we started with a handful of tours in Queensland and have grown into one of Australia's 
            most trusted travel platforms. Our success comes from our unwavering commitment to quality, authenticity, 
            and sustainability.
          </p>
          <p className="text-muted-foreground">
            Today, we offer hundreds of unique experiences across Australia, each carefully curated to showcase the 
            best of what this amazing country has to offer while respecting local communities and protecting the 
            environment.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="text-center py-8">
                <p className="text-primary mb-2">{stat.number}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index}>
                  <CardContent className="text-center py-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mb-3">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-64">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="py-6">
                  <h3 className="mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-16 text-center">
          <h2 className="mb-8">Certifications & Partnerships</h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-2">
              <Award className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p>Eco Tourism</p>
                <p className="text-sm text-muted-foreground">Certified</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p>Tourism Australia</p>
                <p className="text-sm text-muted-foreground">Partner</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p>Safety Standards</p>
                <p className="text-sm text-muted-foreground">Accredited</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
