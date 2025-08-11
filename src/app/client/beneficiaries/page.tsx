'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/app/components/ui/forms/AuthForm';
import api from '@/app/lib/api';
import { AxiosError } from 'axios';
import { calculateAge } from '@/app/lib/calculateAge';
import ProtectedRoute from '@/app/components/routes/ProtectedRoute';
import { useAuthStore } from '@/app/lib/authStore';


interface ErrorResponse {
  message: string;
  details?: string;
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

export default function Beneficiaries() {
  const router = useRouter();
  const { token, user} = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [spouseAge, setSpouseAge] = useState<number | null>(null);
const [initialFormData, setInitialFormData] = useState<Record<string, string>>({
    spouseName: '',
    spouseDob: '',
    children: '',
  });

   useEffect(() => {
    if (!token || !user) {
      router.push('/auth/login');
      return;
    }

    const fetchBeneficiary = async () => {
      try {
        const response = await api.get(`/beneficiaries/${user.id}`);
        const beneficiary: Beneficiary = response.data;
        if (beneficiary) {
          setInitialFormData({
            spouseName: beneficiary.spouse?.name || '',
            spouseDob: beneficiary.spouse?.dob ? new Date(beneficiary.spouse.dob).toISOString().split('T')[0] : '',
            children: beneficiary.children.toString(),
          });
          if (beneficiary.spouse?.dob) {
            setSpouseAge(calculateAge(beneficiary.spouse.dob));
          }
        }
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        console.error('Error fetching beneficiary:', axiosError.response?.data);
        setError(axiosError.response?.data?.message || 'Failed to fetch beneficiary');
      }
    };

    fetchBeneficiary();
  }, [user, token, router]);

  const handleSubmit = async (formData: Record<string, string>) => {
     if (!token) {
      setError('Please log in to update beneficiaries');
      router.push('/auth/login');
      return;
    }
    
    try {
   await api.post('/beneficiaries', {
        ...formData,
        spouseDob: formData.spouseDob,
        children: parseInt(formData.children || '0'),
      });
      alert('Beneficiaries updated!');
      setError(null);
      router.push('/client/profile');
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error('Error updating beneficiaries:', axiosError.response?.data);
      setError(axiosError.response?.data?.message || 'Failed to update beneficiaries');
    }
  };

  const handleChange = (formData: Record<string, string>) => {
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
    <ProtectedRoute>
      <div className="container mx-auto py-10">
        <AuthForm
          title="Manage Beneficiaries"
          fields={[
            { name: 'spouseName', label: 'Spouse Name', type: 'text' },
            { name: 'spouseDob', label: 'Spouse Date of Birth', type: 'date' },
            { name: 'children', label: 'Number of Children', type: 'number' },
          ]}
          initialValues={initialFormData}
          onSubmit={handleSubmit}
          onChange={handleChange}
          linkText=""
          linkHref=""
          submitButtonText="Save Beneficiaries"
          showRememberMe={false}
          error={error}
          calculatedAge={spouseAge}
        />
      </div>
    </ProtectedRoute>
  );
}