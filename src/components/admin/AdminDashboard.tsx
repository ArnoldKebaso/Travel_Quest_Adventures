import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { destinations, tours, blogs, reviews, bookings } from '../../utils/staticData';
import { MapPin, Compass, FileText, Star, Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDestinations: 0,
    totalTours: 0,
    totalBlogs: 0,
    pendingReviews: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    confirmedBookings: 0
  });

  useEffect(() => {
    const pendingReviews = reviews.filter(r => r.status === 'pending').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const totalRevenue = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.total_price, 0);

    setStats({
      totalDestinations: destinations.length,
      totalTours: tours.length,
      totalBlogs: blogs.length,
      pendingReviews,
      totalBookings: bookings.length,
      pendingBookings,
      totalRevenue,
      confirmedBookings
    });
  }, []);

  const statCards = [
    {
      title: 'Total Destinations',
      value: stats.totalDestinations,
      icon: MapPin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Tours',
      value: stats.totalTours,
      icon: Compass,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Blog Posts',
      value: stats.totalBlogs,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Confirmed Bookings',
      value: stats.confirmedBookings,
      icon: TrendingUp,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Monitor your travel agency's performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest customer bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between pb-3 border-b last:border-0">
                  <div>
                    <p className="text-sm text-gray-900">{booking.customer_name}</p>
                    <p className="text-sm text-gray-500">{booking.tour_title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">${booking.total_price}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Reviews</CardTitle>
            <CardDescription>Reviews awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews.filter(r => r.status === 'pending').slice(0, 5).map((review) => (
                <div key={review.id} className="pb-3 border-b last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-900">{review.user_name}</p>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm ml-1">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                </div>
              ))}
              {reviews.filter(r => r.status === 'pending').length === 0 && (
                <p className="text-sm text-gray-500">No pending reviews</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
