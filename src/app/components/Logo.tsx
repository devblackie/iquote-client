'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { branding } from '../config/branding';

interface LogoProps {
  withIcon?: boolean; // Toggle icon/image display
  className?: string; // Additional Tailwind classes
  size?: 'sm' | 'md' | 'lg'; // Control logo size
}

const Logo: FC<LogoProps> = ({ withIcon = true, className = '', size = 'md' }) => {
  const sizeStyles = {
    sm: 'text-xl w-6 h-6',
    md: 'text-2xl w-8 h-8',
    lg: 'text-3xl w-10 h-10',
  };

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      {withIcon && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={branding.logoIconPath}
            alt={branding.logoAltText}
            width={size === 'sm' ? 24 : size === 'md' ? 32 : 40}
            height={size === 'sm' ? 24 : size === 'md' ? 32 : 40}
            className="object-contain"
          />
        </motion.div>
      )}
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={`font-bold text-gray-900 dark:text-gray-100 ${sizeStyles[size].split(' ')[0]}`}
      >

        {branding.appName}
      </motion.span>
    </Link>
  );
};

export default Logo;