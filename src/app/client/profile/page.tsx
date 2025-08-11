'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/authStore';
import { AxiosError } from 'axios';
import { calculateAge } from '@/app/lib/calculateAge';
import ProtectedRoute from '@/app/components/routes/ProtectedRoute';
import { AddIcon, EditIcon } from '@/app/components/ui/icons/Icons';

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

export default function Profile() {
  const router = useRouter();
  const { user, token, clearAuth, isHydrated } = useAuthStore();
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Auth state:', { isHydrated, user, token });
    if (isHydrated) {
      setIsLoading(false);
    } else {
      const unsubscribe = useAuthStore.subscribe((state) => {
        if (state.isHydrated) {
          console.log('Zustand rehydrated');
          setIsLoading(false);
        }
      });
      return () => unsubscribe();
    }
  }, [isHydrated]);

  useEffect(() => {
    if (!isLoading && (!token || !user)) {
      console.log('No user or token, redirecting to /auth/login');
      router.push('/auth/login');
      return;
    }

    if (!isLoading && user) {
      console.log('Fetching beneficiary for user:', user.id);
      const fetchBeneficiary = async () => {
        try {
          const response = await api.get(`/beneficiaries/${user.id}`);
          setBeneficiary(response.data);
          setError(null);
        } catch (error) {
          const axiosError = error as AxiosError<ErrorResponse>;
          console.error('Error fetching beneficiary:', axiosError.response?.data);
          setError(axiosError.response?.data?.message || 'Failed to fetch beneficiary details');
        }
      };
      fetchBeneficiary();
    }
  }, [isLoading, user, token, router]);

  // Format date to handle timezone (EAT)
  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    console.log('Raw date:', dateString, 'Parsed:', date);
    return date.toLocaleDateString('en-US', { timeZone: 'Africa/Nairobi' });
  };

  if (isLoading || !user) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-10 px-4 bg-gray-100 dark:bg-gray-900 min-h-screen min-w-screen">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-cyan-600 dark:text-cyan-400">
              Profile
            </h1>

          </div>
          {/* <AnimatePresence>
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
          </AnimatePresence> */}
          <div className="space-y-4">

            <div className="container border-t-2 shadow-lg dark:shadow-gray-200 dark:shadow-md dark:border-gray-700 rounded-lg px-4 mx-auto">
              <div className="mx-auto p-6 ">
                <div className="flex flex-wrap items-center justify-between mb-1 -m-2">
                  <div className="w-auto p-2">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">User Details</h2>
                  </div>
                  <div className="w-auto p-2">
                    <button
                      onClick={() => router.push('/client/profile/edit')}
                      className=" text-sm font-semibold flex items-center text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400"
                      aria-label="Edit profile"
                    >
                      <EditIcon className="size-4 md:size-5 mr-1" />
                      Edit
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap">
                  <div className="w-full border-b ">
                    <div className="flex flex-wrap items-center justify-between py-4 -m-2">
                      <div className="w-auto p-2">
                        <div className="flex flex-wrap items-center -m-2">
                          <div className="w-auto p-2">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              <span className="font-semibold ">Name:</span> {user.name}
                            </p>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              <span className="font-semibold">Email:</span> {user.email}
                            </p>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              <span className="font-semibold">Phone:</span> {user.phone}
                            </p>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              <span className="font-semibold">Date of Birth:</span>{' '}
                              {formatDate(user.dob)}
                            </p>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              <span className="font-semibold">Age:</span> {calculateAge(user.dob)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container border-t-2 shadow-lg dark:shadow-gray-200 dark:shadow-md dark:border-gray-700 rounded-lg px-4 mx-auto">

              <div className="mx-auto p-6 ">

                <div className="flex flex-wrap items-center justify-between mb-1 -m-2">
                  <div className="w-auto p-2">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Beneficiaries </h2>
                  </div>
                  <div className="w-auto p-2">
                    <button
                      onClick={() => router.push('/client/beneficiaries')}

                      className=" text-sm font-semibold flex items-center text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400"
                      aria-label={beneficiary ? 'Edit beneficiary details' : 'Add beneficiary details'}
                    >
                      {beneficiary ? (
                        <>
                          <EditIcon className="size-4 md:size-5 mr-1" />
                          Edit
                        </>
                      ) : (
                        <>
                          <AddIcon className="size-4 md:size-5 mr-1" />
                          Add Beneficiary
                        </>
                      )}
                    </button>
                  </div>
                </div>
                {beneficiary ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Spouse Name:</span> {beneficiary.spouse?.name || 'Not set'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Spouse DOB:</span>{' '}
                      {beneficiary.spouse?.dob ? formatDate(beneficiary.spouse.dob) : 'Not set'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Spouse Age:</span>{' '}
                      {beneficiary.spouse?.dob ? calculateAge(beneficiary.spouse.dob) : 'Not set'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Children:</span> {beneficiary.children}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No beneficiary details available.</p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}