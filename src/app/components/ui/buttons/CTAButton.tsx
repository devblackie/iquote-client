'use client';

import { branding } from '@/app/config/branding';
import { motion } from 'framer-motion';
import { ReactNode, MouseEvent } from 'react';

interface CTAButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
  showIcon?: boolean;
  iconClassName?: string;
  bgColor?: string; // Tailwind background color (e.g., 'bg-primary')
  textColor?: string; // Tailwind text color (e.g., 'text-white')
}

export default function CTAButton({
  children,
  onClick,
  className = '',
  ariaLabel = `Call to action for ${branding.appName}`,
  disabled = false,
  showIcon = true,
  iconClassName = '',
  bgColor = 'bg-gray-50 dark:bg-gray-700',
  textColor = 'text-gray-800 dark:text-gray-100',
}: CTAButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        flex justify-center items-center gap-2 mx-auto px-4 py-2 
       border-t  rounded-full 
        shadow-xl backdrop-blur-md lg:font-semibold 
        ${bgColor} ${textColor} 
         dark:hover:text-gray-100 
        relative overflow-hidden group 
        transition-all duration-300 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
        ${className}
      `}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span className="relative z-10">{children}</span>
      {showIcon && (
        <motion.svg
          className={`
            w-8 h-8 p-2 rounded-full border border-gray-700 dark:border-gray-600 
            group-hover:border-none group-hover:bg-gray-50 dark:group-hover:bg-gray-800 
            group-hover:rotate-90 transition-all duration-300 rotate-45 
            ${iconClassName}
          `}
          viewBox="0 0 16 19"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
            className="fill-gray-800 group-hover:fill-gray-800 dark:fill-gray-100 dark:group-hover:fill-gray-100"
          />
        </motion.svg>
      )}
      {/* Background animation layer */}
      <motion.div
        className="absolute inset-0 bg-emerald-500 dark:bg-emerald-600 -left-full rounded-full aspect-square z-0"
        initial={{ x: '-100%' }}
        whileHover={{ x: disabled ? '-100%' : '0%', scale: disabled ? 1 : 1.5 }}
        transition={{ duration: 0.7 }}
      />
    </motion.button>
  );
}