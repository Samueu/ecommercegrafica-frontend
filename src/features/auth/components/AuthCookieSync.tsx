'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/auth-store';

export function AuthCookieSync() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      document.cookie = 'mock-auth=1; path=/; max-age=86400';
    }
  }, [isAuthenticated]);

  return null;
}
