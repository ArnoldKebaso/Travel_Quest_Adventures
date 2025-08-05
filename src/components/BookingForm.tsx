import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Calendar, Users, CheckCircle, Loader2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner';

interface BookingFormProps {
  destinationId: string;
  destinationName: string;
  price: string;
  onBookingSuccess: () => void;
}

export function BookingForm({ destinationId, destinationName, price, onBookingSuccess }: BookingFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateBooking = () => {
    if (!formData.checkIn || !formData.checkOut || !formData.guests) {
      toast.error('Please fill in all fields');
      return false;
    }

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const today = new Date();
    const guestCount = parseInt(formData.guests);
    
    if (checkInDate < today) {
      toast.error('Check-in date cannot be in the past');
      return false;
    }
    
    if (checkOutDate <= checkInDate) {
      toast.error('Check-out date must be after check-in date');
      return false;
    }

    // Calculate trip duration in days
    const tripDuration = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Maximum trip duration: 1 month (30 days)
    if (tripDuration > 30) {
      toast.error('Trip duration cannot exceed 30 days (1 month)');
      return false;
    }

    // Validate guest count
    if (guestCount < 1) {
      toast.error('At least 1 guest is required');
      return false;
    }

    if (guestCount > 50) {
      toast.error('Maximum of 50 guests allowed per trip');
      return false;
    }

    return true;
  };

  const handleBooking = async () => {
    if (!validateBooking()) {
      return;
    }

    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Please sign in to book a trip');
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-838db481/destinations/${destinationId}/book`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: formData.guests
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book trip');
      }

      setBookingSuccess(true);
      toast.success('Trip booked successfully!');
      onBookingSuccess();
      
      // Reset form after success
      setTimeout(() => {
        setIsOpen(false);
        setBookingSuccess(false);
        setFormData({ checkIn: '', checkOut: '', guests: '2' });
      }, 2000);

    } catch (error) {
      console.error('Error booking trip:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to book trip');
    } finally {
      setIsLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxCheckoutDate = () => {
    if (!formData.checkIn) return '';
    const checkInDate = new Date(formData.checkIn);
    const maxDate = new Date(checkInDate);
    maxDate.setDate(maxDate.getDate() + 30); // 30 days max
    return maxDate.toISOString().split('T')[0];
  };

  const tripDuration = formData.checkIn && formData.checkOut 
    ? Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full cursor-pointer">
          <Calendar className="w-4 h-4 mr-2" />
          Book This Trip
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Your Trip to {destinationName}</DialogTitle>
          <DialogDescription>
            Select your travel dates and number of guests to book your adventure.
          </DialogDescription>
        </DialogHeader>

        {bookingSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
            <p className="text-muted-foreground">
              Your trip has been successfully booked. You'll be able to leave a review after your visit.
            </p>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trip Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkIn">Check-in Date</Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={formData.checkIn}
                    min={getTodayDate()}
                    onChange={(e) => handleInputChange('checkIn', e.target.value)}
                    className="cursor-pointer"
                  />
                </div>
                <div>
                  <Label htmlFor="checkOut">Check-out Date</Label>
                  <Input
                    id="checkOut"
                    type="date"
                    value={formData.checkOut}
                    min={formData.checkIn || getTodayDate()}
                    max={getMaxCheckoutDate()}
                    onChange={(e) => handleInputChange('checkOut', e.target.value)}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="guests">Number of Guests (Max 50)</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max="50"
                    value={formData.guests}
                    onChange={(e) => handleInputChange('guests', e.target.value)}
                    className="pl-10 cursor-pointer"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span>Price per night:</span>
                  <span className="font-semibold">{price}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Guests: {formData.guests}</span>
                  {tripDuration > 0 && (
                    <span className={tripDuration > 30 ? 'text-destructive font-medium' : ''}>
                      {tripDuration} {tripDuration === 1 ? 'night' : 'nights'}
                      {tripDuration > 30 && ' (Max: 30)'}
                    </span>
                  )}
                </div>
              </div>

              <Button 
                onClick={handleBooking} 
                disabled={isLoading}
                className="w-full cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                This is a demo booking. No actual payment will be processed.
              </p>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}