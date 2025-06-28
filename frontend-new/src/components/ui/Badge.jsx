import { motion } from 'framer-motion';

export default function Badge({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  animate = true,
  ...props 
}) {
  const baseClasses = "inline-flex items-center font-semibold rounded-full transition-all duration-200";
  
  const variants = {
    primary: "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200",
    secondary: "bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    outline: "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300",
    ghost: "text-slate-600 dark:text-slate-400"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base"
  };

  const badgeClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const MotionComponent = animate ? motion.span : 'span';

  return (
    <MotionComponent
      className={badgeClasses}
      initial={animate ? { scale: 0.8, opacity: 0 } : {}}
      animate={animate ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

// Status badge with dot indicator
export function StatusBadge({ 
  status = 'active', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const statusConfig = {
    active: {
      color: 'bg-green-500',
      text: 'Active',
      variant: 'success'
    },
    inactive: {
      color: 'bg-slate-400',
      text: 'Inactive',
      variant: 'outline'
    },
    pending: {
      color: 'bg-yellow-500',
      text: 'Pending',
      variant: 'warning'
    },
    error: {
      color: 'bg-red-500',
      text: 'Error',
      variant: 'danger'
    }
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <Badge variant={config.variant} size={size} className={className} {...props}>
      <div className={`w-2 h-2 rounded-full ${config.color} mr-2`} />
      {config.text}
    </Badge>
  );
}

// Notification badge
export function NotificationBadge({ 
  count = 0, 
  max = 99, 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const displayCount = count > max ? `${max}+` : count;
  const sizeClasses = {
    sm: 'w-5 h-5 text-xs',
    md: 'w-6 h-6 text-sm',
    lg: 'w-8 h-8 text-base'
  };

  if (count === 0) return null;

  return (
    <motion.div
      className={`${sizeClasses[size]} bg-red-500 text-white rounded-full flex items-center justify-center font-bold ${className}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      {...props}
    >
      {displayCount}
    </motion.div>
  );
}

// Skill badge
export function SkillBadge({ 
  skill, 
  level = 'beginner', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const levelConfig = {
    beginner: { color: 'bg-green-500', text: 'Beginner' },
    intermediate: { color: 'bg-yellow-500', text: 'Intermediate' },
    advanced: { color: 'bg-blue-500', text: 'Advanced' },
    expert: { color: 'bg-purple-500', text: 'Expert' }
  };

  const config = levelConfig[level] || levelConfig.beginner;

  return (
    <Badge variant="outline" size={size} className={className} {...props}>
      <div className={`w-2 h-2 rounded-full ${config.color} mr-2`} />
      {skill} • {config.text}
    </Badge>
  );
} 