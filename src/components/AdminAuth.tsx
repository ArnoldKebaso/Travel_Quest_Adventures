import React from 'react';
import { Auth } from './Auth';

interface AdminAuthProps {
  onAuthSuccess?: () => void;
}

export function AdminAuth({ onAuthSuccess }: AdminAuthProps) {
  return <Auth isAdminAuth={true} onAuthSuccess={onAuthSuccess} />;
}