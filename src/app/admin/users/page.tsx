'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/authStore';
import { motion } from 'framer-motion';
import { AxiosError } from 'axios';
import { calculateAge } from '@/app/lib/calculateAge';
import AuthForm from '@/app/components/ui/forms/AuthForm';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  age: number;
  role: string;
}

interface Beneficiary {
  userId: string;
  spouse?: {
    name: string;
    dob: string;
    age: number;
  };
  children: number;
}

interface ErrorResponse {
  message: string;
  details?: string;
}

export default function AdminUsers() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [spouseAge, setSpouseAge] = useState<number | null>(null);

  useEffect(() => {
    if (!token || !user || user.role !== 'admin') {
      router.push('/auth/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/admin/users');
        setUsers(response.data);
        setError(null);
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || 'Failed to fetch users');
      }
    };

    fetchUsers();
  }, [user, token, router]);

  const handleEditBeneficiaries = async (userId: string) => {
    setSelectedUserId(userId);
    try {
      const response = await api.get(`/api/beneficiaries/${userId}`);
      const data: Beneficiary = response.data;
      setBeneficiary(data);
      setSpouseAge(data.spouse?.dob ? calculateAge(data.spouse.dob) : null);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.message || 'Failed to fetch beneficiary');
    }
  };

  const handleBeneficiarySubmit = async (formData: Record<string, string>) => {
    if (!selectedUserId) return;

    try {
      await api.put(`/api/admin/beneficiaries/${selectedUserId}`, {
        ...formData,
        children: parseInt(formData.children || '0'),
      });
      setError(null);
      setSelectedUserId(null);
      setBeneficiary(null);
      const response = await api.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.message || 'Failed to update beneficiary');
    }
  };

  const handleBeneficiaryChange = (formData: Record<string, string>) => {
    if (formData.spouseDob) {
      try {
        setSpouseAge(calculateAge(formData.spouseDob));
      } catch {
        setSpouseAge(null);
      }
    } else {
      setSpouseAge(null);
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
          Manage Users
        </h1>
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm font-medium text-center bg-red-100 dark:bg-red-900/50 rounded-md py-2 px-4 mb-6">
            {error}
          </p>
        )}
        {selectedUserId ? (
          <AuthForm
            title="Edit Beneficiaries"
            fields={[
              { name: 'spouseName', label: 'Spouse Name', type: 'text' },
              { name: 'spouseDob', label: 'Spouse Date of Birth', type: 'date' },
              { name: 'children', label: 'Number of Children', type: 'number', required: true },
            ]}
            initialValues={{
              spouseName: beneficiary?.spouse?.name || '',
              spouseDob: beneficiary?.spouse?.dob ? new Date(beneficiary.spouse.dob).toISOString().split('T')[0] : '',
              children: beneficiary?.children.toString() || '',
            }}
            onSubmit={handleBeneficiarySubmit}
            onChange={handleBeneficiaryChange}
            linkText=""
            linkHref=""
            submitButtonText="Save Beneficiaries"
            error={error}
            calculatedAge={spouseAge}
          />
        ) : (
          <div className="grid gap-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md dark:shadow-gray-900/50"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Name:</span> {user.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Phone:</span> {user.phone}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">DOB:</span>{' '}
                  {new Date(user.dob).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Age:</span> {user.age}
                </p>
                <button
                  onClick={() => handleEditBeneficiaries(user._id)}
                  className="mt-2 text-cyan-500 dark:text-cyan-400 hover:underline"
                >
                  Edit Beneficiaries
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}