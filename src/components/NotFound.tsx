import { Button } from './ui/button';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found';

interface NotFoundProps {
  onNavigate: (page: Page) => void;
}

export function NotFound({ onNavigate }: NotFoundProps) {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80')]"
        aria-hidden="true"
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-white font-bold text-3xl md:text-5xl mb-4">
            404 – Page Not Found
          </h1>
          
          {/* Subtext */}
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-md mx-auto">
            Looks like you're off the beaten path.
          </p>
          
          {/* CTA Button */}
          <Button
            onClick={() => onNavigate('home')}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
