// React value not needed with the new JSX transform
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/authContext';
import { Home } from './components/Home';
import { TravelListings } from './components/TravelListings';
import { Tours } from './components/Tours';
import { Blogs } from './components/Blogs';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { DestinationDetail } from './components/DestinationDetail';
import { Profile } from './components/Profile';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { AdminPanel } from './components/AdminPanel';
import { Toaster } from './components/ui/sonner';

// Protected Route for Profile
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}

// Admin Route
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function AppContent() {
  const { logout, user } = useAuth();
  
  return (
    <Routes>
      {/* Admin Routes */}
      <Route 
        path="/admin/*" 
        element={
          <AdminRoute>
            <AdminPanel onLogout={logout} username={user?.username || 'Admin'} />
          </AdminRoute>
        } 
      />
      
      {/* Routes with Navigation and Footer */}
      <Route path="/*" element={
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/destinations" element={<TravelListings />} />
              <Route path="/destinations/:id" element={<DestinationDetail />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </Router>
  );
}
