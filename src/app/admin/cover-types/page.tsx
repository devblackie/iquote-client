'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/authStore';
import { motion } from 'framer-motion';
import { AxiosError } from 'axios';
import AuthForm from '@/app/components/ui/forms/AuthForm';

interface CoverType {
  _id: string;
  name: string;
  insurers: { _id: string; name: string }[];
  limits: string[];
}

interface Insurer {
  _id: string;
  name: string;
}

interface ErrorResponse {
  message: string;
  details?: string;
}

export default function AdminCoverTypes() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [coverTypes, setCoverTypes] = useState<CoverType[]>([]);
  const [insurers, setInsurers] = useState<Insurer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoverType, setSelectedCoverType] = useState<CoverType | null>(null);

  useEffect(() => {
    if (!token || !user || user.role !== 'admin') {
      router.push('/auth/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [coverTypesResponse, insurersResponse] = await Promise.all([
          api.get('/products/cover-types'),
          api.get('/admin/insurers'),
        ]);
        setCoverTypes(coverTypesResponse.data);
        setInsurers(insurersResponse.data);
        setError(null);
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || 'Failed to fetch data');
      }
    };

    fetchData();
  }, [user, token, router]);

  const handleSubmit = async (formData: Record<string, string>) => {
    try {
      const response = await api.post('/api/admin/cover-types', {
        name: formData.name,
        insurers: formData.insurers ? formData.insurers.split(',').map((id) => id.trim()) : [],
        limits: formData.limits ? formData.limits.split(',').map((limit) => limit.trim()) : [],
      });
      setCoverTypes([...coverTypes, response.data]);
      setSelectedCoverType(null);
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.message || 'Failed to save cover type');
    }
  };

  const handleEdit = (coverType: CoverType) => {
    setSelectedCoverType(coverType);
  };

  return (
    <div className="container mx-auto py-10 px-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Manage Cover Types
        </h1>
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm font-medium text-center bg-red-100 dark:bg-red-900/50 rounded-md py-2 px-4 mb-6">
            {error}
          </p>
        )}
        {selectedCoverType ? (
          <AuthForm
            title="Edit Cover Type"
            fields={[
              { name: 'name', label: 'Cover Type Name', type: 'text', required: true },
              { name: 'insurers', label: 'Insurer IDs (comma-separated)', type: 'text' },
              { name: 'limits', label: 'Limits (comma-separated)', type: 'text' },
            ]}
            initialValues={{
              name: selectedCoverType.name,
              insurers: selectedCoverType.insurers.map((i) => i._id).join(','),
              limits: selectedCoverType.limits.join(','),
            }}
            onSubmit={handleSubmit}
            linkText=""
            linkHref=""
            submitButtonText="Save Cover Type"
            error={error}
          />
        ) : (
          <>
            <AuthForm
              title="Add Cover Type"
              fields={[
                { name: 'name', label: 'Cover Type Name', type: 'text', required: true },
                { name: 'insurers', label: 'Insurer IDs (comma-separated)', type: 'text' },
                { name: 'limits', label: 'Limits (comma-separated)', type: 'text' },
              ]}
              onSubmit={handleSubmit}
              linkText=""
              linkHref=""
              submitButtonText="Add Cover Type"
              error={error}
            />
            <div className="mt-6 grid gap-4">
              {coverTypes.map((coverType) => (
                <div
                  key={coverType._id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md dark:shadow-gray-900/50"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Name:</span> {coverType.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Insurers:</span>{' '}
                    {coverType.insurers.map((i) => i.name).join(', ')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Limits:</span> {coverType.limits.join(', ')}
                  </p>
                  <button
                    onClick={() => handleEdit(coverType)}
                    className="mt-2 text-cyan-500 dark:text-cyan-400 hover:underline"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}