'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FormEvent, ChangeEvent, useState } from 'react';
import { branding } from '@/app/config/branding';
import CTAButton from '../buttons/CTAButton';

interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}

interface AuthFormProps {
  title: string;
  fields: FormField[];
  initialValues?: Record<string, string>;
  onSubmit: (formData: Record<string, string>) => void;
  onChange?: (formData: Record<string, string>) => void;
  linkText: string;
  linkHref: string;
  submitButtonText: string;
  showRememberMe?: boolean;
  error?: string | null;
  calculatedAge?: number | null;
}

export default function AuthForm({
  title,
  fields,
  initialValues = {},
  onSubmit,
  onChange,
  linkText,
  linkHref,
  submitButtonText,
  showRememberMe = false,
  error,
  calculatedAge,
}: AuthFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(initialValues);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const requiredFields = fields.filter((field) => field.required).map((field) => field.name);
    const missingFields = requiredFields.filter((field) => !formData[field] || formData[field].trim() === '');
    if (missingFields.length > 0) {
      setFormError(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }
    setFormError(null);
    onSubmit({ ...formData, rememberMe: rememberMe ? 'true' : 'false' });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex w-full max-w-md flex-col rounded-xl bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 shadow-md mx-auto"
    >
      {/* Header */}
      <div className="relative mx-4 -mt-6 mb-4 grid h-28 place-items-center overflow-hidden rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 dark:from-cyan-700 dark:to-cyan-500 text-white shadow-lg shadow-cyan-500/40 dark:shadow-cyan-600/40">
        <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
          {title}
        </h3>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
        {(error || formError) && (
          <p className="text-red-500 dark:text-red-400 text-sm font-medium text-center bg-red-100 dark:bg-red-900/50 rounded-md py-2 px-4">
            {error || formError}
          </p>
        )}

        {fields.map((field) => (
          <div key={field.name} className="relative w-full min-w-[200px]">
            {field.name === 'dob' || field.name === 'spouseDob' ? (
              <div className="flex items-center gap-4">
                {/* DOB Input */}
                <div className="relative h-11 flex-1">
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder || ''}
                    value={formData[field.name] || ''}
                    required={field.required}
                    onChange={handleInputChange}
                    className="peer h-full w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-3 text-sm font-normal text-gray-700 dark:text-gray-200 outline-none transition-all placeholder-shown:border-gray-300 dark:placeholder-shown:border-gray-600 focus:border-2 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-700 focus:ring-opacity-50 disabled:border-gray-200 dark:disabled:border-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    aria-label={field.label}
                  />
                  <label
                    htmlFor={field.name}
                    className="absolute left-3 -top-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-1 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-500 dark:peer-focus:text-cyan-400"
                  >
                    {field.label}
                  </label>
                </div>
                {/* Age Input (Non-editable) */}
                {calculatedAge !== null && (
                  <div className="relative h-11 w-24">
                    <input
                      id={`${field.name}-age`}
                      type="text"
                      value={calculatedAge}
                      readOnly
                      className="h-full w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white  dark:bg-gray-900 px-3 py-3 text-sm font-normal text-gray-700 dark:text-gray-200 outline-none opacity-75 cursor-not-allowed"
                      aria-label="Age (read-only)"
                    />
                    <label
                      htmlFor={`${field.name}-age`}
                      className="absolute left-3 -top-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-1"
                    >
                      Age
                    </label>
                  </div>
                )}
              </div>
            ) : field.name === 'password' ? (
              <div className="relative h-11 w-full">
                <input
                  id={field.name}
                  name={field.name}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={field.placeholder || ''}
                  value={formData[field.name] || ''}
                  required={field.required}
                  onChange={handleInputChange}
                  className="peer h-full w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-3 pr-10 text-sm font-normal text-gray-700 dark:text-gray-200 outline-none transition-all placeholder-shown:border-gray-300 dark:placeholder-shown:border-gray-600 focus:border-2 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-700 focus:ring-opacity-50 disabled:border-gray-200 dark:disabled:border-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  aria-label={field.label}
                />
                <label
                  htmlFor={field.name}
                  className="absolute left-3 -top-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-1 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-500 dark:peer-focus:text-cyan-400"
                >
                  {field.label}
                </label>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-700 focus:ring-opacity-50 rounded-full p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            ) : (
              <div className="relative h-11 w-full">
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder || ''}
                  value={formData[field.name] || ''}
                  required={field.required}
                  onChange={handleInputChange}
                  className="peer h-full w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-3 text-sm font-normal text-gray-700 dark:text-gray-200 outline-none transition-all placeholder-shown:border-gray-300 dark:placeholder-shown:border-gray-600 focus:border-2 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-700 focus:ring-opacity-50 disabled:border-gray-200 dark:disabled:border-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  aria-label={field.label}
                />
                <label
                  htmlFor={field.name}
                  className="absolute left-3 -top-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-1 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-500 dark:peer-focus:text-cyan-400"
                >
                  {field.label}
                </label>
              </div>
            )}
          </div>
        ))}

        {/* Remember Me Checkbox (for login only) */}
        {showRememberMe && (
          <div className="flex items-center gap-2 mt-2">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-cyan-500 dark:text-cyan-400 focus:ring-cyan-500 dark:focus:ring-cyan-400"
              aria-label="Remember me"
            />
            <label
              htmlFor="remember-me"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Remember Me
            </label>
          </div>
        )}
      </form>

      {/* Submit Button and Link */}
      <div className="p-6 pt-0">
        <CTAButton
          bgColor="bg-gradient-to-tr from-cyan-600 to-cyan-400 dark:from-cyan-700 dark:to-cyan-500"
          textColor="text-white"
          ariaLabel={`${submitButtonText} to ${branding.appName}`}
          onClick={() => document.querySelector('form')?.requestSubmit()}
        >
          {submitButtonText}
        </CTAButton>
        {linkText && linkHref && (
          <p className="mt-4 flex justify-center text-sm font-medium text-gray-600 dark:text-gray-400">
            {linkText}
            <Link
              href={linkHref}
              className="ml-1 text-cyan-500 dark:text-cyan-400 hover:underline font-semibold"
            >
              {linkText.includes('Sign up') ? 'Sign up' : 'Sign in'}
            </Link>
          </p>
        )}
      </div>
    </motion.div>
  );
}