'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { AxiosError } from 'axios';

interface Request {
  _id: string;
  coverType: string;
  coverLimit?: string;
  insurers: { name: string }[];
  createdAt: string;
}

interface User {
  name: string;
  email: string;
}

interface DashboardData {
  user: User;
  recentRequests: Request[];
}

interface ErrorResponse {
  message: string;
  details?: string;
}

export default function ClientDashboard() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user) {
      router.push('/auth/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard/client');
        setDashboardData(response.data);
        setError(null);
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || 'Failed to fetch dashboard data');
      }
    };

    fetchDashboard();
  }, [user, token, router]);

  return (
    <div className="container mx-auto py-10 px-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-6">
          Welcome, {dashboardData?.user.name || 'User'}
        </h1>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 dark:text-red-400 text-sm font-medium text-center bg-red-100 dark:bg-red-900/50 rounded-md py-2 px-4 mb-6"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Recent Requests
        </h2>
        {dashboardData?.recentRequests.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No recent requests.</p>
        ) : (
          <div className="grid gap-4">
            {dashboardData?.recentRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md dark:shadow-gray-900/50"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Cover Type:</span> {request.coverType}
                </p>
                {request.coverLimit && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Cover Limit:</span> {request.coverLimit}
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Insurers:</span>{' '}
                  {request.insurers.map((i) => i.name).join(', ')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Requested At:</span>{' '}
                  {new Date(request.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}