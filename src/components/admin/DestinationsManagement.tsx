import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { toast } from 'sonner';
import { destinations as initialDestinations, type Destination } from '../../utils/staticData';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function DestinationsManagement() {
  const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [formData, setFormData] = useState<Partial<Destination>>({
    title: '',
    location: '',
    description: '',
    image_url: '',
    category: 'Nature',
    region: '',
    best_time_to_visit: '',
    price_per_night: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDestination) {
      // Update existing
      setDestinations(destinations.map(d => 
        d.id === editingDestination.id 
          ? { ...editingDestination, ...formData, gallery_urls: editingDestination.gallery_urls } 
          : d
      ));
      toast.success('Destination updated successfully!');
    } else {
      // Create new
      const newDestination: Destination = {
        id: `dest-${Date.now()}`,
        title: formData.title || '',
        location: formData.location || '',
        description: formData.description || '',
        image_url: formData.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        gallery_urls: [],
        category: formData.category || 'Nature',
        region: formData.region || '',
        best_time_to_visit: formData.best_time_to_visit || '',
        price_per_night: formData.price_per_night || 0,
        created_at: new Date().toISOString()
      };
      setDestinations([newDestination, ...destinations]);
      toast.success('Destination created successfully!');
    }
    
    handleCloseDialog();
  };

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination);
    setFormData({
      title: destination.title,
      location: destination.location,
      description: destination.description,
      image_url: destination.image_url,
      category: destination.category,
      region: destination.region,
      best_time_to_visit: destination.best_time_to_visit,
      price_per_night: destination.price_per_night
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this destination?')) {
      setDestinations(destinations.filter(d => d.id !== id));
      toast.success('Destination deleted successfully!');
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingDestination(null);
    setFormData({
      title: '',
      location: '',
      description: '',
      image_url: '',
      category: 'Nature',
      region: '',
      best_time_to_visit: '',
      price_per_night: 0
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Destinations Management
            </CardTitle>
            <CardDescription>Create and manage travel destinations</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Add Destination
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingDestination ? 'Edit Destination' : 'Create New Destination'}
                </DialogTitle>
                <DialogDescription>
                  {editingDestination ? 'Update destination details' : 'Add a new travel destination'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nature">Nature</SelectItem>
                        <SelectItem value="City">City</SelectItem>
                        <SelectItem value="Beach">Beach</SelectItem>
                        <SelectItem value="Cultural">Cultural</SelectItem>
                        <SelectItem value="Adventure">Adventure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      placeholder="e.g., QLD, NSW"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="best_time">Best Time to Visit</Label>
                  <Input
                    id="best_time"
                    value={formData.best_time_to_visit}
                    onChange={(e) => setFormData({ ...formData, best_time_to_visit: e.target.value })}
                    placeholder="e.g., June to October"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price Per Night ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price_per_night}
                    onChange={(e) => setFormData({ ...formData, price_per_night: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleCloseDialog} className="cursor-pointer">
                    Cancel
                  </Button>
                  <Button type="submit" className="cursor-pointer">
                    {editingDestination ? 'Update' : 'Create'} Destination
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Price/Night</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {destinations.map((destination) => (
                <TableRow key={destination.id}>
                  <TableCell>{destination.title}</TableCell>
                  <TableCell>{destination.location}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                      {destination.category}
                    </span>
                  </TableCell>
                  <TableCell>{destination.region}</TableCell>
                  <TableCell>${destination.price_per_night}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(destination)}
                        className="cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(destination.id)}
                        className="cursor-pointer text-red-600 hover:text-red-700"
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
      </CardContent>
    </Card>
  );
}
