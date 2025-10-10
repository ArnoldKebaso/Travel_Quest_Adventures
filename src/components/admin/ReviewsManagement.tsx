import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { toast } from 'sonner';
import { reviews as initialReviews, type Review, destinations } from '../../utils/staticData';
import { Star, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

export function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const handleApprove = (id: string) => {
    setReviews(reviews.map(r => 
      r.id === id ? { ...r, status: 'approved' as const } : r
    ));
    toast.success('Review approved successfully!');
  };

  const handleReject = (id: string) => {
    setReviews(reviews.map(r => 
      r.id === id ? { ...r, status: 'rejected' as const } : r
    ));
    toast.success('Review rejected successfully!');
  };

  const getDestinationTitle = (destinationId: string) => {
    const destination = destinations.find(d => d.id === destinationId);
    return destination?.title || 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const processedReviews = reviews.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Pending Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Pending Reviews ({pendingReviews.length})
          </CardTitle>
          <CardDescription>Reviews awaiting your approval</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingReviews.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No pending reviews</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>{review.user_name}</TableCell>
                      <TableCell>{getDestinationTitle(review.destination_id)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{review.rating}/5</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="truncate">{review.comment}</p>
                      </TableCell>
                      <TableCell>{review.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(review.id)}
                            className="cursor-pointer text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(review.id)}
                            className="cursor-pointer text-red-600 hover:text-red-700"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews ({reviews.length})</CardTitle>
          <CardDescription>Complete review history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.user_name}</TableCell>
                    <TableCell>{getDestinationTitle(review.destination_id)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{review.rating}/5</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="truncate">{review.comment}</p>
                    </TableCell>
                    <TableCell>{review.date}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(review.status)}>
                        {review.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {review.status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(review.id)}
                            className="cursor-pointer text-green-600"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(review.id)}
                            className="cursor-pointer text-red-600"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : review.status === 'approved' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(review.id)}
                          className="cursor-pointer text-red-600"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(review.id)}
                          className="cursor-pointer text-green-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
