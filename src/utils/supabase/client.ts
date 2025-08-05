import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xemsqtdtqwiizsobykts.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlbXNxdGR0cXdpaXpzb2J5a3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MTA2NDcsImV4cCI6MjA2OTA4NjY0N30.HJ5SqCn0XasatZwBNocckw__fPIb5BJ6ipiI9CExuEQ';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);