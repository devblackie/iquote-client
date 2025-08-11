'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/authStore';
import { calculateAge } from '@/app/lib/calculateAge';
import { AxiosError } from 'axios';
import AuthForm from '@/app/components/ui/forms/AuthForm';

interface ErrorResponse {
  message: string;
  details?: string;
}

export default function EditProfile() {
  const router = useRouter();
  const { user, token, setAuth } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  useEffect(() => {
    if (!token || !user) {
      router.push('/auth/login');
    } else {
      setCalculatedAge(calculateAge(user.dob));
    }
  }, [user, token, router]);

  const handleSubmit = async (formData: Record<string, string>) => {
    try {
      const response = await api.put('/auth/profile', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
      });
      setAuth({ ...user, ...response.data.user }, token!);
      router.push('/client/profile');
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleChange = (formData: Record<string, string>) => {
    if (formData.dob) {
      try {
        setCalculatedAge(calculateAge(formData.dob));
      } catch {
        setCalculatedAge(null);
      }
    } else {
      setCalculatedAge(null);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <AuthForm
        title="Edit Profile"
        fields={[
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
          { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
        ]}
        initialValues={{
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        }}
        onSubmit={handleSubmit}
        onChange={handleChange}
        linkText=""
        linkHref=""
        submitButtonText="Save Profile"
        error={error}
        calculatedAge={calculatedAge}
      />
    </div>
  );
}