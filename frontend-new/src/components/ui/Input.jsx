import { motion } from 'framer-motion';
import { forwardRef, useState } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  success,
  leftIcon,
  rightIcon,
  className = '',
  animate = true,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const baseClasses = "w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border rounded-xl shadow-soft text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-white dark:focus:bg-slate-800";
  
  const stateClasses = error 
    ? "border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500" 
    : success 
    ? "border-green-300 dark:border-green-600 focus:border-green-500 focus:ring-green-500"
    : isFocused 
    ? "border-primary-500 focus:border-primary-500 focus:ring-primary-500"
    : "border-slate-200 dark:border-slate-700";

  const inputClasses = `${baseClasses} ${stateClasses} ${leftIcon ? 'pl-12' : ''} ${rightIcon ? 'pr-12' : ''} ${className}`;

  const MotionComponent = animate ? motion.div : 'div';

  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  return (
    <MotionComponent
      initial={animate ? { opacity: 0, y: 10 } : {}}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
            {rightIcon}
          </div>
        )}
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-6 left-0 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.div>
        )}
        
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-6 left-0 text-sm text-green-600 dark:text-green-400"
          >
            {success}
          </motion.div>
        )}
      </div>
    </MotionComponent>
  );
});

Input.displayName = 'Input';

export default Input; 