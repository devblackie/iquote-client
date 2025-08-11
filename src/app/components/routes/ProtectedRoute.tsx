'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/lib/authStore';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for Zustand to rehydrate the persisted state
    const unsubscribe = useAuthStore.subscribe(() => {
      setIsLoading(false);
    });

    // Set a timeout to ensure we don't wait indefinitely
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust timeout as needed

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/auth/login');
    }
  }, [isLoading, token, router]);

  if (isLoading || !token) {
    return null; // Render nothing while loading or redirecting
  }

  return <>{children}</>;
}