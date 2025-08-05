import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Edit, Trash2, Plus, Search, FileText, Video, BookOpen } from 'lucide-react';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users';

interface AdminDashboardProps {
  onNavigate: (page: Page) => void;
}

interface ContentItem {
  id: string;
  title: string;
  type: 'Guide' | 'Blog' | 'Video';
  region: string;
  lastUpdated: string;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');

  // Mock data for demonstration
  const stats = [
    { label: 'Total Posts', value: 10, icon: FileText },
    { label: 'Guides', value: 7, icon: BookOpen },
    { label: 'Videos', value: 3, icon: Video },
  ];

  const contentItems: ContentItem[] = [
    { id: '1', title: 'Great Barrier Reef Diving Guide', type: 'Guide', region: 'QLD', lastUpdated: '2024-01-15' },
    { id: '2', title: 'Sydney Harbour Bridge Climb Experience', type: 'Blog', region: 'NSW', lastUpdated: '2024-01-12' },
    { id: '3', title: 'Melbourne Coffee Culture Tour', type: 'Video', region: 'VIC', lastUpdated: '2024-01-10' },
    { id: '4', title: 'Uluru Sunrise Photography Tips', type: 'Guide', region: 'NT', lastUpdated: '2024-01-08' },
    { id: '5', title: 'Tasmania Devil Island Adventure', type: 'Guide', region: 'TAS', lastUpdated: '2024-01-05' },
    { id: '6', title: 'Perth Beach Hopping Guide', type: 'Blog', region: 'WA', lastUpdated: '2024-01-03' },
  ];

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesRegion = regionFilter === 'all' || item.region === regionFilter;
    return matchesSearch && matchesType && matchesRegion;
  });

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'Guide':
        return 'default';
      case 'Blog':
        return 'secondary';
      case 'Video':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Guide':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Blog':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Video':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard – Manage Travel Content</h1>
          <p className="text-gray-600">Manage your travel guides, blogs, and video content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white shadow-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Management */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-xl font-bold text-gray-900">Travel Content</CardTitle>
              <Button 
                onClick={() => onNavigate('admin-add-guide')}
                className="bg-orange-500 hover:bg-orange-600 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Travel Guide
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="NSW">NSW</SelectItem>
                  <SelectItem value="VIC">VIC</SelectItem>
                  <SelectItem value="QLD">QLD</SelectItem>
                  <SelectItem value="WA">WA</SelectItem>
                  <SelectItem value="SA">SA</SelectItem>
                  <SelectItem value="TAS">TAS</SelectItem>
                  <SelectItem value="NT">NT</SelectItem>
                  <SelectItem value="ACT">ACT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Content Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-medium text-gray-900">Title</TableHead>
                    <TableHead className="font-medium text-gray-900">Type</TableHead>
                    <TableHead className="font-medium text-gray-900">Region</TableHead>
                    <TableHead className="font-medium text-gray-900">Last Updated</TableHead>
                    <TableHead className="font-medium text-gray-900 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContent.map((item) => (
                    <TableRow key={item.id} className="border-gray-200">
                      <TableCell className="font-medium text-gray-900">{item.title}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={getBadgeVariant(item.type)}
                          className={getBadgeColor(item.type)}
                        >
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{item.region}</TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(item.lastUpdated).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="cursor-pointer text-destructive hover:text-destructive-foreground hover:bg-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredContent.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No content found matching your filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}