'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/app/lib/authStore';
import { branding } from '@/app/config/branding';
import Logo from './Logo';
import DarkModeToggle from './DarkToggle';
import CTAButton from './ui/buttons/CTAButton';
import { LogoutIcon } from './ui/icons/Icons';

// Define interface for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Navbar() {
  const { user, token, clearAuth } = useAuthStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isInstallPromptAvailable, setIsInstallPromptAvailable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setIsInstallPromptAvailable(true);
      // Store the event in window for later use
      (window as { deferredPrompt?: BeforeInstallPromptEvent }).deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = () => {
    const promptEvent = (window as { deferredPrompt?: BeforeInstallPromptEvent }).deferredPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      promptEvent.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User installed the app');
        }
        setIsInstallPromptAvailable(false);
        // Clear the stored event
        (window as { deferredPrompt?: BeforeInstallPromptEvent }).deferredPrompt = undefined;
      });
    }
  };

  const handleLogout = () => {
    clearAuth();
    setIsOpen(false);
    router.push('/auth/login');
  };

  const navLinks = user && token ? (
    <>
      <Link
        href={user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard'}
        className="text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        aria-label={user.role === 'admin' ? 'Admin Dashboard' : 'Client Dashboard'}
        onClick={() => setIsOpen(false)}
      >
        Dashboard
      </Link>
      <Link
        href="/client/profile"
        className="text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        aria-label="User Profile"
        onClick={() => setIsOpen(false)}
      >
        Profile
      </Link>
     
      <Link
        href="/client/products"
        className="text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        aria-label="Products"
        onClick={() => setIsOpen(false)}
      >
        Products
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400"
      >
        <LogoutIcon className="size-5 mr-1" />
      </button>
    </>
  ) : (
    <>
      <Link
        href="/auth/login"
        className="text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        aria-label="Login"
        onClick={() => setIsOpen(false)}
      >
        Login
      </Link>
      <Link
        href="/auth/register"
        className="text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        aria-label="Register"
        onClick={() => setIsOpen(false)}
      >
        Register
      </Link>
    </>
  );

  return (
    <nav className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 p-4 sticky top-0 z-50 shadow-md dark:shadow-gray-900/50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" aria-label="MediHub Home">
          <Logo size="sm" />
        </Link>
        <div className="hidden md:flex space-x-4 items-center">
          {navLinks}
          <DarkModeToggle />
        </div>
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col space-y-2 p-4">
              {navLinks}
              {isInstallPromptAvailable && (
                <CTAButton
                  onClick={handleInstallClick}
                  ariaLabel={`Install ${branding.appName} App`}
                  className="mt-4 bg-gradient-to-r from-cyan-600 to-cyan-400 dark:from-cyan-700 dark:to-cyan-500 text-white"
                >
                  Install {branding.appName} App
                </CTAButton>
              )}
              <DarkModeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}