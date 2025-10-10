import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Calendar, Users, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../utils/authContext';

interface BookingFormProps {
  destinationId: string;
  destinationName: string;
  price: string;
  maxGuests?: number;
  onBookingSuccess: () => void;
}

export function BookingForm({ destinationId, destinationName, price, maxGuests = 50, onBookingSuccess }: BookingFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

    if (guestCount > Math.min(maxGuests, 50)) {
      toast.error(`Maximum of ${Math.min(maxGuests, 50)} guests allowed per trip`);
      return false;
    }

    return true;
  };

  const calculateTotalPrice = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return nights * parseFloat(price);
  };

  const handleReserveClick = () => {
    // Check if user is logged in
    if (!user) {
      toast.error('Please login to make a booking');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setIsOpen(true);
  };

  const handleBooking = async () => {
    if (!validateBooking()) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const totalPrice = calculateTotalPrice();
      
      // Show success
      setBookingSuccess(true);
      toast.success('Booking confirmed! Check your email for details.');
      onBookingSuccess();
      
      // Reset form after delay
      setTimeout(() => {
        setIsOpen(false);
        setBookingSuccess(false);
        setFormData({
          checkIn: '',
          checkOut: '',
          guests: '2'
        });
      }, 3000);
      
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to complete booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = calculateTotalPrice();
  const nights = formData.checkIn && formData.checkOut
    ? Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Book Your Stay</span>
            <span className="text-primary">${price}/night</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="checkIn" className="flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Check-in Date
            </Label>
            <Input
              id="checkIn"
              type="date"
              value={formData.checkIn}
              onChange={(e) => handleInputChange('checkIn', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <Label htmlFor="checkOut" className="flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Check-out Date
            </Label>
            <Input
              id="checkOut"
              type="date"
              value={formData.checkOut}
              onChange={(e) => handleInputChange('checkOut', e.target.value)}
              min={formData.checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <Label htmlFor="guests" className="flex items-center mb-2">
              <Users className="h-4 w-4 mr-2" />
              Number of Guests
            </Label>
            <Input
              id="guests"
              type="number"
              min="1"
              max={Math.min(maxGuests, 50)}
              value={formData.guests}
              onChange={(e) => handleInputChange('guests', e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Maximum {Math.min(maxGuests, 50)} guests per booking
            </p>
          </div>

          {totalPrice > 0 && (
            <div className="pt-4 border-t border-border">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">${price} × {nights} nights</span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Total</span>
                <span className="text-primary">${totalPrice}</span>
              </div>
            </div>
          )}

          <Button
            onClick={handleReserveClick}
            disabled={!formData.checkIn || !formData.checkOut || !formData.guests}
            className="w-full cursor-pointer"
          >
            Reserve Now
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            You won't be charged yet
          </p>
        </CardContent>
      </Card>

      {/* Booking Confirmation Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {bookingSuccess ? 'Booking Confirmed!' : 'Confirm Your Booking'}
            </DialogTitle>
            <DialogDescription>
              {bookingSuccess 
                ? 'Your reservation has been successfully confirmed.'
                : 'Review your booking details before confirming.'
              }
            </DialogDescription>
          </DialogHeader>

          {bookingSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="mb-4">Confirmation email sent!</p>
              <p className="text-sm text-muted-foreground">
                Booking reference: TQ-{Date.now().toString().slice(-6)}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-accent/50 p-4 rounded-lg space-y-2">
                <h4>{destinationName}</h4>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>Check-in: {formData.checkIn ? new Date(formData.checkIn).toLocaleDateString() : '-'}</p>
                  <p>Check-out: {formData.checkOut ? new Date(formData.checkOut).toLocaleDateString() : '-'}</p>
                  <p>Guests: {formData.guests}</p>
                  <p>Nights: {nights}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between mb-2">
                  <span>${price} × {nights} nights</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="flex-1 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBooking}
                  disabled={isLoading}
                  className="flex-1 cursor-pointer"
                >
                  {isLoading ? 'Processing...' : 'Confirm Booking'}
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                This is a demo. No actual booking will be made.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
