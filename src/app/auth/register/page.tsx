'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthForm from '@/app/components/ui/forms/AuthForm';
import api from '@/app/lib/api';
import { AxiosError } from 'axios';
import { calculateAge } from '@/app/lib/calculateAge';
import { useAuthStore } from '@/app/lib/authStore';

interface ErrorResponse {
  message: string;
  details?: string;
}

export default function Register() {
  const router = useRouter();
   const { setAuth } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  const handleSubmit = async (formData: Record<string, string>) => {

    try {
      const response = await api.post('/auth/register', {
        ...formData,
        dob: formData.dob, // Send DOB instead of age
      });
          const { token, user } = response.data;
        setAuth(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          dob: user.dob,
          age: user.age,
          phone: user.phone,
          role: user.role,
        },
        token
      ); // Set user and token in Zustand store
      router.push('/auth/login');
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error('Error during registration:', axiosError.response?.data);
      setError(axiosError.response?.data?.message || 'Registration failed');
    }
  };

  const handleChange = (formData: Record<string, string>) => {
    if (formData.dob) {
      try {
        const age = calculateAge(formData.dob);
        setCalculatedAge(age);
      } catch {
        setCalculatedAge(null);
      }
    } else {
      setCalculatedAge(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <AuthForm
        title="Register"
        fields={[
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
          { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'password', label: 'Password', type: 'password', required: true },
        ]}
        onSubmit={handleSubmit}
        onChange={handleChange}
        linkText="Already have an account?"
        linkHref="/auth/login"
        submitButtonText="Register"
        showRememberMe={false}
        error={error}
        calculatedAge={calculatedAge}
      />

    </div>
  );
}