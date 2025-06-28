import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <motion.div
          className={`${sizeClasses[size]} border-2 border-slate-200 dark:border-slate-700 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            className="absolute inset-0 border-2 border-transparent border-t-primary-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
      {text && (
        <motion.p
          className="text-sm text-slate-600 dark:text-slate-400 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

export function LoadingDots({ text = 'Loading' }) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-slate-600 dark:text-slate-400">{text}</span>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary-600 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function LoadingPulse() {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}

export function LoadingBar({ progress = 0, text = 'Loading...' }) {
  return (
    <div className="w-full max-w-md space-y-3">
      {text && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">{text}</span>
          <span className="text-slate-900 dark:text-slate-100 font-medium">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
} 