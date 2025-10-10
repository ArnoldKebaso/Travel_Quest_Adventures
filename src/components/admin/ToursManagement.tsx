import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { toast } from 'sonner';
import { tours as initialTours, type Tour } from '../../utils/staticData';
import { Plus, Pencil, Trash2, Compass } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function ToursManagement() {
  const [tours, setTours] = useState<Tour[]>(initialTours);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [formData, setFormData] = useState<Partial<Tour>>({
    title: '',
    location: '',
    description: '',
    image_url: '',
    duration: '',
    price: 0,
    max_group_size: 10,
    difficulty: 'Easy',
    category: 'Adventure',
    highlights: []
  });
  const [highlightsText, setHighlightsText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const highlights = highlightsText.split('\n').filter(h => h.trim());
    
    if (editingTour) {
      // Update existing
      setTours(tours.map(t => 
        t.id === editingTour.id 
          ? { ...editingTour, ...formData, highlights } 
          : t
      ));
      toast.success('Tour updated successfully!');
    } else {
      // Create new
      const newTour: Tour = {
        id: `tour-${Date.now()}`,
        title: formData.title || '',
        location: formData.location || '',
        description: formData.description || '',
        image_url: formData.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        duration: formData.duration || '',
        price: formData.price || 0,
        max_group_size: formData.max_group_size || 10,
        difficulty: formData.difficulty || 'Easy',
        category: formData.category || 'Adventure',
        highlights
      };
      setTours([newTour, ...tours]);
      toast.success('Tour created successfully!');
    }
    
    handleCloseDialog();
  };

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour);
    setFormData({
      title: tour.title,
      location: tour.location,
      description: tour.description,
      image_url: tour.image_url,
      duration: tour.duration,
      price: tour.price,
      max_group_size: tour.max_group_size,
      difficulty: tour.difficulty,
      category: tour.category,
      highlights: tour.highlights
    });
    setHighlightsText(tour.highlights.join('\n'));
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this tour?')) {
      setTours(tours.filter(t => t.id !== id));
      toast.success('Tour deleted successfully!');
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTour(null);
    setFormData({
      title: '',
      location: '',
      description: '',
      image_url: '',
      duration: '',
      price: 0,
      max_group_size: 10,
      difficulty: 'Easy',
      category: 'Adventure',
      highlights: []
    });
    setHighlightsText('');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Compass className="w-5 h-5" />
              Tours Management
            </CardTitle>
            <CardDescription>Create and manage tour packages</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Add Tour
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTour ? 'Edit Tour' : 'Create New Tour'}
                </DialogTitle>
                <DialogDescription>
                  {editingTour ? 'Update tour details' : 'Add a new tour package'}
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
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 3 Days"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max_group">Max Group Size</Label>
                    <Input
                      id="max_group"
                      type="number"
                      value={formData.max_group_size}
                      onChange={(e) => setFormData({ ...formData, max_group_size: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select 
                      value={formData.difficulty} 
                      onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Challenging">Challenging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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
                      <SelectItem value="Adventure">Adventure</SelectItem>
                      <SelectItem value="Cultural">Cultural</SelectItem>
                      <SelectItem value="Wildlife">Wildlife</SelectItem>
                      <SelectItem value="Food & Wine">Food & Wine</SelectItem>
                      <SelectItem value="Nature">Nature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="highlights">Highlights (one per line)</Label>
                  <Textarea
                    id="highlights"
                    value={highlightsText}
                    onChange={(e) => setHighlightsText(e.target.value)}
                    rows={4}
                    placeholder="Professional diving instruction&#10;Visit 5+ diving sites&#10;Marine biologist guide"
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
                    {editingTour ? 'Update' : 'Create'} Tour
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
                <TableHead>Duration</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tours.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell>{tour.title}</TableCell>
                  <TableCell>{tour.location}</TableCell>
                  <TableCell>{tour.duration}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      tour.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      tour.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {tour.difficulty}
                    </span>
                  </TableCell>
                  <TableCell>${tour.price}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(tour)}
                        className="cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(tour.id)}
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
