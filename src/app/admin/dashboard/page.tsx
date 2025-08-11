'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/authStore';
import { motion } from 'framer-motion';
import { AxiosError } from 'axios';

interface Request {
  _id: string;
  userId: { name: string; email: string };
  coverType: string;
  insurers: { name: string }[];
  createdAt: string;
}

interface ErrorResponse {
  message: string;
  details?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user || user.role !== 'admin') {
      router.push('/auth/login');
      return;
    }

    const fetchRequests = async () => {
      try {
        const response = await api.get('/admin/requests');
        setRequests(response.data);
        setError(null);
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || 'Failed to fetch requests');
      }
    };

    fetchRequests();
  }, [user, token, router]);

  return (
    <div className="container mx-auto py-10 px-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Admin Dashboard
        </h1>
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm font-medium text-center bg-red-100 dark:bg-red-900/50 rounded-md py-2 px-4 mb-6">
            {error}
          </p>
        )}
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Recent Requests</h2>
        {requests.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No requests found.</p>
        ) : (
          <div className="grid gap-4">
            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md dark:shadow-gray-900/50"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">User:</span> {request.userId.name} ({request.userId.email})
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Cover Type:</span> {request.coverType}
                </p>
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