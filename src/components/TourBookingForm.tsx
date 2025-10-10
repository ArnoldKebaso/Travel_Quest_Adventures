import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Calendar, Users, CheckCircle, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../utils/authContext';
import { addBooking, generateBookingId, generateBookingReference, type TourBooking } from '../utils/bookingStorage';

interface TourBookingFormProps {
  tourId: string;
  tourTitle: string;
  price: number;
  maxGroupSize: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TourBookingForm({ 
  tourId, 
  tourTitle, 
  price, 
  maxGroupSize,
  open,
  onOpenChange 
}: TourBookingFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [formData, setFormData] = useState({
    startDate: '',
    guests: '2',
    phone: '',
    specialRequests: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateBooking = () => {
    if (!formData.startDate || !formData.guests || !formData.phone) {
      toast.error('Please fill in all required fields');
      return false;
    }

    const startDate = new Date(formData.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const guestCount = parseInt(formData.guests);
    
    if (startDate < today) {
      toast.error('Tour date cannot be in the past');
      return false;
    }

    // Validate guest count
    if (guestCount < 1) {
      toast.error('At least 1 guest is required');
      return false;
    }

    if (guestCount > maxGroupSize) {
      toast.error(`Maximum of ${maxGroupSize} guests allowed per booking`);
      return false;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const calculateTotalPrice = () => {
  const basePrice = parseFloat(String(price));
    const guests = parseInt(formData.guests) || 0;
    return basePrice * guests;
  };

  const handleBooking = async () => {
    if (!validateBooking()) {
      return;
    }

    if (!user) {
      toast.error('Please login to complete booking');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const totalPrice = calculateTotalPrice();
      const reference = generateBookingReference();
      
      // Create booking object
      const newBooking: TourBooking = {
        id: generateBookingId('tour'),
        type: 'tour',
        tour_id: tourId,
        tour_title: tourTitle,
        customer_name: user.username,
        customer_email: `${user.username}@email.com`, 
        customer_phone: formData.phone,
        start_date: formData.startDate,
        guests: parseInt(formData.guests),
        total_price: totalPrice,
        special_requests: formData.specialRequests,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      // Save booking
      addBooking(newBooking);
      
      // Show success
      setBookingReference(reference);
      setBookingSuccess(true);
      toast.success('Tour booking confirmed! Check your email for details.');
      
      // Reset form after delay
      setTimeout(() => {
        onOpenChange(false);
        setBookingSuccess(false);
        setBookingReference('');
        setFormData({
          startDate: '',
          guests: '2',
          phone: '',
          specialRequests: ''
        });
      }, 3000);
      
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to complete booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = () => {
    // Check if user is logged in when opening
    if (!user) {
      toast.error('Please login to book a tour');
      navigate('/login', { state: { from: location.pathname } });
      onOpenChange(false);
      return;
    }
  };

  React.useEffect(() => {
    if (open) {
      handleOpenDialog();
    }
  }, [open]);

  const totalPrice = calculateTotalPrice();

  return (
    <Dialog open={open && !!user} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {bookingSuccess ? 'Booking Confirmed!' : 'Book Your Tour'}
          </DialogTitle>
          <DialogDescription>
            {bookingSuccess 
              ? 'Your tour reservation has been successfully confirmed.'
              : `Complete your booking for ${tourTitle}`
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
              Booking reference: {bookingReference}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Status: <span className="text-yellow-600">Pending confirmation</span>
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Our team will contact you within 24 hours to confirm your tour details.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="mb-2">{tourTitle}</h4>
              <p className="text-sm text-muted-foreground">
                ${price} per person
              </p>
            </div>

            <div>
              <Label htmlFor="startDate" className="flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                Tour Start Date *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <Label htmlFor="guests" className="flex items-center mb-2">
                <Users className="h-4 w-4 mr-2" />
                Number of Guests *
              </Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max={maxGroupSize}
                value={formData.guests}
                onChange={(e) => handleInputChange('guests', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum {maxGroupSize} guests per booking
              </p>
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center mb-2">
                <Phone className="h-4 w-4 mr-2" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+61 412 345 678"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center mb-2">
                <Mail className="h-4 w-4 mr-2" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={`${user?.username}@email.com`}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Confirmation will be sent to this email
              </p>
            </div>

            <div>
              <Label htmlFor="specialRequests">
                Special Requests (Optional)
              </Label>
              <Textarea
                id="specialRequests"
                placeholder="Dietary requirements, accessibility needs, etc."
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                rows={3}
                className="mt-2"
              />
            </div>

            {totalPrice > 0 && (
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">${price} × {formData.guests} guests</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="flex-1 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBooking}
                disabled={isLoading || !formData.startDate || !formData.guests || !formData.phone}
                className="flex-1 cursor-pointer"
              >
                {isLoading ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Book your tour, Travel with us
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
