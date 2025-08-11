'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/authStore';
import { motion } from 'framer-motion';
import { AxiosError } from 'axios';
import AuthForm from '@/app/components/ui/forms/AuthForm';

interface Insurer {
  _id: string;
  name: string;
}

interface ErrorResponse {
  message: string;
  details?: string;
}

export default function AdminInsurers() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [insurers, setInsurers] = useState<Insurer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user || user.role !== 'admin') {
      router.push('/auth/login');
      return;
    }

    const fetchInsurers = async () => {
      try {
        const response = await api.get('/api/admin/insurers');
        setInsurers(response.data);
        setError(null);
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || 'Failed to fetch insurers');
      }
    };

    fetchInsurers();
  }, [user, token, router]);

  const handleSubmit = async (formData: Record<string, string>) => {
    try {
      const response = await api.post('/api/admin/insurers', {
        name: formData.name,
      });
      setInsurers([...insurers, response.data]);
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.message || 'Failed to add insurer');
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Manage Insurers
        </h1>
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm font-medium text-center bg-red-100 dark:bg-red-900/50 rounded-md py-2 px-4 mb-6">
            {error}
          </p>
        )}
        <AuthForm
          title="Add Insurer"
          fields={[{ name: 'name', label: 'Insurer Name', type: 'text', required: true }]}
          onSubmit={handleSubmit}
          linkText=""
          linkHref=""
          submitButtonText="Add Insurer"
          error={error}
        />
        <div className="mt-6 grid gap-4">
          {insurers.map((insurer) => (
            <div
              key={insurer._id}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md dark:shadow-gray-900/50"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Name:</span> {insurer.name}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}