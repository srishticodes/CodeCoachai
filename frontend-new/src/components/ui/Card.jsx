import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Card = forwardRef(({ 
  children, 
  className = '', 
  hover = true, 
  animate = true, 
  delay = 0,
  onClick,
  ...props 
}, ref) => {
  const baseClasses = "glass-card p-6";
  const hoverClasses = hover ? "hover:shadow-large hover:-translate-y-1" : "";
  const clickClasses = onClick ? "cursor-pointer" : "";
  
  const cardClasses = `${baseClasses} ${hoverClasses} ${clickClasses} ${className}`;

  const MotionComponent = animate ? motion.div : 'div';

  return (
    <MotionComponent
      ref={ref}
      className={cardClasses}
      initial={animate ? { opacity: 0, y: 20 } : {}}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      whileHover={hover && animate ? { scale: 1.02 } : {}}
      onClick={onClick}
      {...props}
    >
      {children}
    </MotionComponent>
  );
});

Card.displayName = 'Card';

export default Card;

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-slate-600 dark:text-slate-400 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 ${className}`}>
      {children}
    </div>
  );
}

export function CardGrid({ children, className = '', cols = 3 }) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-6 ${gridCols[cols]} ${className}`}>
      {children}
    </div>
  );
} 