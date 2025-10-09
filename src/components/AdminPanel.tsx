import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { LogOut, LayoutDashboard, MapPin, Compass, FileText, Star, Calendar } from 'lucide-react';
import { AdminDashboard } from './admin/AdminDashboard';
import { DestinationsManagement } from './admin/DestinationsManagement';
import { ToursManagement } from './admin/ToursManagement';
import { BlogsManagement } from './admin/BlogsManagement';
import { ReviewsManagement } from './admin/ReviewsManagement';
import { BookingsManagement } from './admin/BookingsManagement';

interface AdminPanelProps {
  onLogout: () => void;
  username: string;
}

export function AdminPanel({ onLogout, username }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl text-gray-900">TravelQuest Admin</h1>
              <p className="text-sm text-gray-600">Welcome back, {username}</p>
            </div>
            <Button onClick={onLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="dashboard" className="cursor-pointer">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="destinations" className="cursor-pointer">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Destinations</span>
            </TabsTrigger>
            <TabsTrigger value="tours" className="cursor-pointer">
              <Compass className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Tours</span>
            </TabsTrigger>
            <TabsTrigger value="blogs" className="cursor-pointer">
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Blogs</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="cursor-pointer">
              <Star className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="cursor-pointer">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Bookings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="destinations">
            <DestinationsManagement />
          </TabsContent>

          <TabsContent value="tours">
            <ToursManagement />
          </TabsContent>

          <TabsContent value="blogs">
            <BlogsManagement />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsManagement />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
