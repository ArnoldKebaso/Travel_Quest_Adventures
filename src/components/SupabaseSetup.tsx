import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { ExternalLink, Database, Shield, Settings } from 'lucide-react';
import { supabase_connect } from '../utils/supabase/connect';

export function SupabaseSetup() {
  const handleConnectSupabase = () => {
    supabase_connect();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Connect Your Supabase Project</CardTitle>
          <p className="text-gray-600">
            TravelQuest Adventures uses Supabase for authentication and data storage
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Currently using demo authentication. Connect your Supabase project for full functionality.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">What you'll get with Supabase:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                Real user authentication with Google OAuth
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                Persistent data storage for destinations and bookings
              </li>
              <li className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-orange-600" />
                Admin role management and user permissions
              </li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Quick Setup Instructions:</h4>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Create a new project at <a href="https://supabase.com" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">supabase.com</a></li>
              <li>Enable Google OAuth in Authentication &gt; Providers</li>
              <li>Copy your project URL and anon key</li>
              <li>Click the button below to connect</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleConnectSupabase}
              className="flex-1 bg-orange-500 hover:bg-orange-600 cursor-pointer"
            >
              <Database className="w-4 h-4 mr-2" />
              Connect Supabase Project
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open('https://supabase.com/docs/guides/auth/social-login/auth-google', '_blank')}
              className="cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Setup Guide
            </Button>
          </div>

          <div className="text-center text-xs text-gray-500">
            You can continue using the app with demo authentication, but some features may be limited.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}