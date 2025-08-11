'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthForm from '@/app/components/ui/forms/AuthForm';
import api from '@/app/lib/api';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/app/lib/authStore';
import { calculateAge } from '@/app/lib/calculateAge';

interface ErrorResponse {
  message: string;
  details?: string;
}

export default function Login() {
  const router = useRouter();
    const { setAuth } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
 const [isLoading, setIsLoading] = useState(false);

  // const handleSubmit = async (formData: { email: string; password: string }) => {
   const handleSubmit = async (formData: Record<string, string>) => {

    setIsLoading(true);
    setError(null);
    try {
 const response = await api.post('/auth/login', formData);
     const { user, token } = response.data;
      console.log('Login response:', { user, token });
      setAuth(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          dob: user.dob,
          age: calculateAge(user.dob),
          phone: user.phone,
          role: user.role,
        },
        token
      ); // Set user and token in Zustand store
    router.push(user.role === 'admin' ? '/admin/dashboard' : '/client/products');
     } catch (error) {
         const axiosError = error as AxiosError<ErrorResponse>;
         console.error('Login error:', axiosError.response?.data);
         setError(axiosError.response?.data?.message || 'Registration failed');
       }finally {
      setIsLoading(false);
    }
     };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <AuthForm
        title="Login"
        fields={[
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'password', label: 'Password', type: 'password', required: true },
        ]}
        onSubmit={handleSubmit}
        linkText="Don't have an account?"
        linkHref="/auth/register"
        submitButtonText="Login"
        showRememberMe={true}
        error={error}
      />
    </div>
  );
}