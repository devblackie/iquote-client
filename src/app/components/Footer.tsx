import { branding } from '../config/branding';

export default function Footer() {
  return (
   <footer className="bg-white dark:bg-gray-800 py-4 shadow-inner dark:shadow-gray-900/50">
      <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">&copy; {new Date().getFullYear()} {branding.appName}. All rights reserved.</p>
      </div>
    </footer>
  );
}