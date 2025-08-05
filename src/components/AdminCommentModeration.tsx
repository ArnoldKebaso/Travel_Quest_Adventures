import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { NewNavigation } from './NewNavigation';
import { Footer } from './Footer';
import { Search, Check, Trash2, MessageCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found' | 'blogs' | 'tours' | 'about' | 'contact' | 'tour-details' | 'blog-details';

interface AdminCommentModerationProps {
  onNavigate: (page: Page) => void;
  user?: SupabaseUser | null;
  isAdmin?: boolean;
}

interface Comment {
  id: string;
  excerpt: string;
  fullContent: string;
  destination: string;
  destinationId: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  date: string;
  status: 'Pending' | 'Approved' | 'Flagged';
}

export function AdminCommentModeration({ onNavigate, user, isAdmin }: AdminCommentModerationProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data for demonstration
  const allComments: Comment[] = [
    {
      id: '1',
      excerpt: 'Amazing experience diving at the Great Barrier Reef! The coral formations were...',
      fullContent: 'Amazing experience diving at the Great Barrier Reef! The coral formations were absolutely breathtaking, and we saw so many different species of fish. The water was crystal clear and the guides were very knowledgeable.',
      destination: 'Great Barrier Reef',
      destinationId: 'gbr-1',
      user: { name: 'Sarah Johnson', email: 'sarah@example.com' },
      date: '2024-01-15',
      status: 'Approved'
    },
    {
      id: '2',
      excerpt: 'This place is overrated and not worth the money. The service was terrible...',
      fullContent: 'This place is overrated and not worth the money. The service was terrible and the staff were rude. I would not recommend this to anyone.',
      destination: 'Sydney Opera House',
      destinationId: 'soh-1',
      user: { name: 'Mike Chen', email: 'mike@example.com' },
      date: '2024-01-14',
      status: 'Flagged'
    },
    {
      id: '3',
      excerpt: 'Perfect spot for sunrise photography! Highly recommend getting there early...',
      fullContent: 'Perfect spot for sunrise photography! Highly recommend getting there early to get the best shots. The colors of Uluru at sunrise are truly spectacular.',
      destination: 'Uluru',
      destinationId: 'uluru-1',
      user: { name: 'Emma Wilson', email: 'emma@example.com' },
      date: '2024-01-13',
      status: 'Pending'
    },
    {
      id: '4',
      excerpt: 'The coffee tour was fantastic! Learned so much about Melbourne\'s coffee culture...',
      fullContent: 'The coffee tour was fantastic! Learned so much about Melbourne\'s coffee culture and got to taste some amazing brews. The guide was very passionate and knowledgeable.',
      destination: 'Melbourne',
      destinationId: 'mel-1',
      user: { name: 'David Brown', email: 'david@example.com' },
      date: '2024-01-12',
      status: 'Approved'
    },
    {
      id: '5',
      excerpt: 'Had an incredible time exploring Tasmania! The wildlife was amazing...',
      fullContent: 'Had an incredible time exploring Tasmania! The wildlife was amazing and we were lucky enough to see Tasmanian devils in their natural habitat. The scenery is breathtaking.',
      destination: 'Tasmania',
      destinationId: 'tas-1',
      user: { name: 'Lisa Anderson', email: 'lisa@example.com' },
      date: '2024-01-11',
      status: 'Pending'
    },
  ];

  const filteredComments = allComments.filter(comment => {
    const matchesSearch = 
      comment.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || comment.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComments = filteredComments.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedComments(paginatedComments.map(comment => comment.id));
    } else {
      setSelectedComments([]);
    }
  };

  const handleSelectComment = (commentId: string, checked: boolean) => {
    if (checked) {
      setSelectedComments(prev => [...prev, commentId]);
    } else {
      setSelectedComments(prev => prev.filter(id => id !== commentId));
    }
  };

  const handleApprove = (commentId: string) => {
    toast.success('Comment approved successfully');
    // Here you would update the comment status in your backend
  };

  const handleDelete = (commentId: string) => {
    toast.success('Comment deleted successfully');
    // Here you would delete the comment from your backend
  };

  const handleBulkDelete = () => {
    if (selectedComments.length === 0) return;
    toast.success(`${selectedComments.length} comments deleted successfully`);
    setSelectedComments([]);
    // Here you would delete the selected comments from your backend
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Flagged':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const flaggedCount = allComments.filter(c => c.status === 'Flagged').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation 
        currentPage="admin-comments" 
        onNavigate={onNavigate} 
        user={user || null}
        isAdmin={isAdmin}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Moderate Comments</h1>
          <p className="text-gray-600">Review and manage user comments and reviews</p>
          {flaggedCount > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">
                <span className="font-medium">{flaggedCount}</span> comments need your attention
              </p>
            </div>
          )}
        </div>

        {/* Main Card */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-xl font-bold text-gray-900">Comments & Reviews</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by destination, user, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Comments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedComments.length > 0 && (
              <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-700">
                    {selectedComments.length} comment{selectedComments.length > 1 ? 's' : ''} selected
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Bulk Delete
                  </Button>
                </div>
              </div>
            )}

            {/* Comments Table */}
            {paginatedComments.length > 0 ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedComments.length === paginatedComments.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="font-medium text-gray-900">Comment</TableHead>
                      <TableHead className="font-medium text-gray-900">Destination</TableHead>
                      <TableHead className="font-medium text-gray-900">User</TableHead>
                      <TableHead className="font-medium text-gray-900">Date</TableHead>
                      <TableHead className="font-medium text-gray-900">Status</TableHead>
                      <TableHead className="font-medium text-gray-900 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedComments.map((comment) => (
                      <TableRow key={comment.id} className="border-gray-200">
                        <TableCell>
                          <Checkbox
                            checked={selectedComments.includes(comment.id)}
                            onCheckedChange={(checked) => handleSelectComment(comment.id, !!checked)}
                          />
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm text-gray-900 truncate" title={comment.fullContent}>
                            {comment.excerpt}
                          </p>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => {
                              // Navigate to destination detail
                              toast.info('Navigate to destination detail');
                            }}
                            className="text-orange-600 hover:text-orange-700 cursor-pointer flex items-center gap-1"
                          >
                            {comment.destination}
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">
                                {comment.user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{comment.user.name}</p>
                              <p className="text-xs text-gray-500">{comment.user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(comment.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getBadgeColor(comment.status)}>
                            {comment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            {comment.status !== 'Approved' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprove(comment.id)}
                                className="cursor-pointer text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(comment.id)}
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
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No comments found</p>
                <p className="text-sm text-gray-400">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'Comments will appear here when users start reviewing destinations'
                  }
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
}