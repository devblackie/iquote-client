'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { useAuthStore } from '@/app/lib/authStore';
import api from '@/app/lib/api';
import { AxiosError } from 'axios';
import CoverTypeCard from '@/app/components/CoverTypeCard';

interface CoverType {
  _id: string;
  name: string;
  insurers: { _id: string; name: string }[];
  limits: string[];
}

interface ErrorResponse {
  message: string;
  details?: string;
}

export default function Products() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [coverTypes, setCoverTypes] = useState<CoverType[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    if (!token || !user) {
      router.push('/auth/login');
      return;
    }

    const fetchCoverTypes = async () => {
      try {
        const response = await api.get('/products/cover-types');
        setCoverTypes(response.data);
        setError('');
      } catch (err) {
        const axiosError = err as AxiosError<ErrorResponse>;
        if (!isOnline) {
          const cachedResponse = await caches.match(`${process.env.NEXT_PUBLIC_API_URL}/api/products/cover-types`);
          if (cachedResponse) {
            const data = await cachedResponse.json();
            setCoverTypes(data);
            setError('Offline: Showing cached data.');
          } else {
            setError('Offline: No cached data available.');
          }
        } else {
          setError(axiosError.response?.data?.message || 'Failed to load cover types.');
        }
      }
    };

    fetchCoverTypes();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user, token, router]);

  const handleRequestInfo = async (coverType: string, coverLimit?: string) => {
    if (!isOnline) {
      setError('You are offline. Please connect to request information.');
      return;
    }

    if (coverLimit === undefined) {
      const cover = coverTypes.find((c) => c.name === coverType);
      if (!cover) {
        setError(`Cover type ${coverType} not found.`);
        return;
      }
      if (cover.limits.length > 0) {
        setError(`Please select a cover limit for ${coverType}.`);
        return;
      }
    }

    setLoading(true);
    setError('');
    try {
      await api.post(
        '/products/request-info',
        { coverType, coverLimit: coverLimit || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Information for ${coverType} sent to your email!`);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.message || 'Failed to request information. Please check your email settings.');
    } finally {
      setLoading(false);
    }
  };

  const containerMotion: MotionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <motion.div {...containerMotion} className="container mx-auto py-10 px-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-cyan-600 dark:text-cyan-400 text-center">
        Select Insurance Products
      </h2>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 dark:text-red-400 text-sm font-medium text-center bg-red-100 dark:bg-red-900/50 rounded-md py-2 px-4 mb-6"
            aria-live="polite"
          >
            {error}
          </motion.p>
        )}
        {!isOnline && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-yellow-500 dark:text-yellow-400 text-sm font-medium text-center bg-yellow-100 dark:bg-yellow-900/50 rounded-md py-2 px-4 mb-6"
            aria-live="polite"
          >
            You are offline. Some features may be limited.
          </motion.p>
        )}
      </AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {coverTypes.map((cover) => (
          <CoverTypeCard
            key={cover._id}
            cover={cover}
            onRequestInfo={(coverLimit?: string) => handleRequestInfo(cover.name, coverLimit)}
            disabled={loading || !isOnline}
          />
        ))}
      </div>
    </motion.div>
  );
}