import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  animate = true,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-glow focus:ring-primary-500 active:scale-95",
    secondary: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 focus:ring-primary-500 active:scale-95",
    ghost: "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-primary-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:scale-95",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 active:scale-95",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500 active:scale-95"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const MotionComponent = animate ? motion.button : 'button';

  const renderIcon = () => {
    if (!icon) return null;
    
    const iconClasses = size === 'sm' ? 'w-4 h-4' : size === 'lg' || size === 'xl' ? 'w-5 h-5' : 'w-4 h-4';
    const iconElement = typeof icon === 'string' ? (
      <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
    ) : icon;

    return (
      <span className={iconPosition === 'right' ? 'ml-2' : 'mr-2'}>
        {iconElement}
      </span>
    );
  };

  return (
    <MotionComponent
      ref={ref}
      className={buttonClasses}
      disabled={disabled || loading}
      whileHover={animate && !disabled && !loading ? { scale: 1.05 } : {}}
      whileTap={animate && !disabled && !loading ? { scale: 0.95 } : {}}
      {...props}
    >
      {loading ? (
        <div className="flex items-center">
          <motion.div
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          Loading...
        </div>
      ) : (
        <>
          {icon && iconPosition === 'left' && renderIcon()}
          {children}
          {icon && iconPosition === 'right' && renderIcon()}
        </>
      )}
    </MotionComponent>
  );
});

Button.displayName = 'Button';

export default Button;

// Icon button variant
export function IconButton({ 
  children, 
  variant = 'ghost', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14'
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`${sizeClasses[size]} p-0 ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}

// Button group component
export function ButtonGroup({ children, className = '' }) {
  return (
    <div className={`inline-flex rounded-xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

// Button group item
export function ButtonGroupItem({ children, className = '', ...props }) {
  return (
    <Button
      variant="secondary"
      className={`rounded-none border-r border-slate-200 dark:border-slate-700 last:border-r-0 ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
} 