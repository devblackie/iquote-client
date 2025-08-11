// 'use client';

// import { useState } from 'react';
// import { motion, AnimatePresence, MotionProps } from 'framer-motion';
// import CTAButton from './ui/buttons/CTAButton';

// interface CoverType {
//   _id: string;
//   name: string;
//   insurers: { _id: string; name: string }[];
//   limits: string[];
// }

// interface CoverTypeCardProps {
//   cover: CoverType;
//   onRequestInfo: (coverLimit?: string) => void;
//   disabled: boolean;
// }

// export default function CoverTypeCard({ cover, onRequestInfo, disabled }: CoverTypeCardProps) {
//   const [showLimitSelect, setShowLimitSelect] = useState(false);
//   const [selectedLimit, setSelectedLimit] = useState('');
//   const [limitError, setLimitError] = useState('');

//   const cardMotion: MotionProps = {
//     initial: { opacity: 0, y: 20 },
//     animate: { opacity: 1, y: 0 },
//     transition: { duration: 0.5 },
//   };

//   const handleShowLimitSelect = () => {
//     setShowLimitSelect(true);
//     setLimitError('');
//   };

//   const handleRequestInfo = () => {
//     if (cover.limits.length > 0 && !selectedLimit) {
//       setLimitError(`Please select a cover limit for ${cover.name}.`);
//       return;
//     }
//     setLimitError('');
//     onRequestInfo(cover.limits.length > 0 ? selectedLimit : undefined);
//   };

//   return (
//     <motion.div
//       {...cardMotion}
//       className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md dark:shadow-gray-900/50"
//     >
//       <h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-2">{cover.name}</h3>
//       <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
//         <span className="font-semibold">Insurers:</span>{' '}
//         {cover.insurers.map((i) => i.name).join(', ') || 'None'}
//       </p>
//       <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
//         <span className="font-semibold">Limits:</span> {cover.limits.join(', ') || 'None'}
//       </p>
//       <AnimatePresence>
//         {limitError && (
//           <motion.p
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="text-red-500 dark:text-red-400 text-sm font-medium text-center bg-red-100 dark:bg-red-900/50 rounded-md py-2 px-4 mb-4"
//             aria-live="polite"
//           >
//             {limitError}
//           </motion.p>
//         )}
//         {showLimitSelect && cover.limits.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.3 }}
//             className="mb-4"
//           >
//             <select
//               className="w-full p-2 border rounded focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
//               value={selectedLimit}
//               onChange={(e) => {
//                 setSelectedLimit(e.target.value);
//                 setLimitError('');
//               }}
//               aria-label={`Select cover limit for ${cover.name}`}
//             >
//               <option value="">Select Cover Limit</option>
//               {cover.limits.map((limit) => (
//                 <option key={limit} value={limit}>
//                   {limit}
//                 </option>
//               ))}
//             </select>
//             <CTAButton
//               onClick={() => {
//                 setShowLimitSelect(false);
//                 setSelectedLimit('');
//                 setLimitError('');
//               }}
//               disabled={disabled}
//               ariaLabel={`Cancel limit selection for ${cover.name}`}
//               className="w-full p-2 bg-gray-500 text-white rounded mt-2"
//             >
//               Cancel
//             </CTAButton>
//           </motion.div>
//         )}
//       </AnimatePresence>
//       {cover.limits.length > 0 && !showLimitSelect && (
//         <CTAButton
//           onClick={handleShowLimitSelect}
//           disabled={disabled}
//           ariaLabel={`Select limit for ${cover.name}`}
//         >
//           Select Limit
//         </CTAButton>
//       )}
//       {(cover.limits.length === 0 || (cover.limits.length > 0 && selectedLimit)) && (
//         <CTAButton
//           onClick={handleRequestInfo}
//           disabled={disabled}
//           ariaLabel={`Request information for ${cover.name}`}
//           className="w-full p-2 bg-gradient-to-r from-cyan-600 to-cyan-400 dark:from-cyan-700 dark:to-cyan-500 text-white rounded mt-2"
//         >
//           Request Info
//         </CTAButton>
//       )}
//     </motion.div>
//   );
// }

'use client';

import { useState } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import CTAButton from './ui/buttons/CTAButton';
import { LoadingIcon } from './ui/icons/Icons';

interface CoverType {
  _id: string;
  name: string;
  insurers: { _id: string; name: string }[];
  limits: string[];
}

interface CoverTypeCardProps {
  cover: CoverType;
  onRequestInfo: (coverLimit?: string) => void;
  disabled: boolean;
}

export default function CoverTypeCard({ cover, onRequestInfo, disabled }: CoverTypeCardProps) {
  const [showLimitSelect, setShowLimitSelect] = useState(false);
  const [selectedLimit, setSelectedLimit] = useState('');
  const [limitError, setLimitError] = useState('');

  // Map cover type to background image
  const getBackgroundImage = (name: string) => {
    switch (name.toLowerCase()) {
      case 'inpatient':
        return '/inpatient.webp';
      case 'outpatient':
        return '/outpatient.webp';
      case 'maternity':
        return '/maternity.webp';
         case 'optical':
        return '/optical.webp';
         case 'dental':
        return '/dental.webp';
         case 'last expense':
        return '/last-expense.webp';
      default:
        return '/images/default.webp'; // Fallback image
    }
  };

  const cardMotion: MotionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
    whileHover: { scale: disabled ? 1 : 1.02, boxShadow: disabled ? 'none' : '0 8px 20px rgba(0, 0, 0, 0.1)' },
  };

  const handleShowLimitSelect = () => {
    setShowLimitSelect(true);
    setLimitError('');
  };

  const handleRequestInfo = () => {
    if (cover.limits.length > 0 && !selectedLimit) {
      setLimitError(`Please select a cover limit for ${cover.name}.`);
      return;
    }
    setLimitError('');
    onRequestInfo(cover.limits.length > 0 ? selectedLimit : undefined);
  };

  return (
    <motion.div
      {...cardMotion}
      className="relative bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl shadow-lg dark:shadow-gray-900/50 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
      style={{
        backgroundImage: `url(${getBackgroundImage(cover.name)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/70 rounded-2xl pointer-events-none" />
      {/* Gradient accent border */}
      <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-cyan-900/20 to-cyan-600/20 rounded-2xl pointer-events-none" />
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white dark:text-white mb-3 tracking-tight">
          {cover.name}
        </h3>
        <p className="text-sm font-medium text-gray-100 dark:text-gray-100 mb-2">
          <span className="font-semibold">Insurers:</span>{' '}
          {cover.insurers.map((i) => i.name).join(', ') || 'None'}
        </p>
        <p className="text-sm font-medium text-gray-100 dark:text-gray-100 mb-4">
          <span className="font-semibold">Limits:</span> {cover.limits.join(', ') || 'None'}
        </p>
        <AnimatePresence>
          {limitError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-400 dark:text-red-300 text-sm font-medium text-center bg-red-900/50 dark:bg-red-900/50 rounded-lg py-2 px-4 mb-4 border border-red-700 dark:border-red-700"
              aria-live="polite"
            >
              {limitError}
            </motion.p>
          )}
          {showLimitSelect && cover.limits.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <select
                className="w-full p-2.5 pl-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-700 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 cursor-pointer transition-all duration-200"
                value={selectedLimit}
                onChange={(e) => {
                  setSelectedLimit(e.target.value);
                  setLimitError('');
                }}
                aria-label={`Select cover limit for ${cover.name}`}
              >
                <option value="">Select Cover Limit</option>
                {cover.limits.map((limit) => (
                  <option key={limit} value={limit}>
                    {limit}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2 mt-2 flex-col sm:flex-row">
                <button
                  onClick={() => {
                    setShowLimitSelect(false);
                    setSelectedLimit('');
                    setLimitError('');
                  }}
                  disabled={disabled}
                  // ariaLabel={`Cancel limit selection for ${cover.name}`}
                  className="p-2 bg-gray-600/80 dark:bg-gray-700/80 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  Cancel
                </button>
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <button
                    onClick={handleRequestInfo}
                    disabled={disabled}
                    // ariaLabel={`Request information for ${cover.name}`}
                    className="p-2 bg-gradient-to-r from-cyan-600 to-cyan-400 dark:from-cyan-700 dark:to-cyan-500 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-500 hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                  >
                    {disabled ? (
                 <LoadingIcon />
                    ) : (
                      'Request Info'
                    )}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {cover.limits.length > 0 && !showLimitSelect && (
          <div className="flex justify-start gap-2 flex-col sm:flex-row">
            <button
              onClick={handleShowLimitSelect}
              disabled={disabled}
              ariaLabel={`Select limit for ${cover.name}`}
              className="p-2 bg-gradient-to-r from-cyan-600 to-cyan-400 dark:from-cyan-700 dark:to-cyan-500 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-500 transition-all duration-200"
            >
              Select Limit
            </button>
            {(cover.limits.length === 0 || (cover.limits.length > 0 && selectedLimit)) && (
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <button
                  onClick={handleRequestInfo}
                  disabled={disabled}
                  ariaLabel={`Request information for ${cover.name}`}
                  className="p-2 bg-gradient-to-r from-cyan-600 to-cyan-400 dark:from-cyan-700 dark:to-cyan-500 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-500 hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                >
                  {disabled ? (
            <LoadingIcon />
                  ) : (
                    'Request Info'
                  )}
                </button>
              </motion.div>
            )}
          </div>
        )}
        {cover.limits.length === 0 && (
          <div className="flex justify-end gap-2 flex-col sm:flex-row">
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <button
                onClick={handleRequestInfo}
                disabled={disabled}
                ariaLabel={`Request information for ${cover.name}`}
                className="p-2 bg-gradient-to-r from-cyan-600 to-cyan-400 dark:from-cyan-700 dark:to-cyan-500 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-500 hover:shadow-lg transition-all duration-200 flex items-center justify-center"
              >
                {disabled ? (
           <LoadingIcon />
                ) : (
                  'Request Info'
                )}
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}