import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variantClasses = {
  primary:   'bg-primary text-white shadow-soft hover:shadow-elevation hover:bg-primary-700 active:scale-95',
  secondary: 'bg-primary-50 text-primary border border-primary-100 hover:border-primary-200 hover:bg-primary-100 active:scale-95',
  outline:   'border border-border text-foreground hover:border-primary hover:bg-surface-secondary active:scale-95',
  ghost:     'text-foreground hover:bg-surface-secondary active:scale-95',
  danger:    'bg-error text-white shadow-soft hover:shadow-lg hover:bg-red-600 active:scale-95',
  success:   'bg-success text-white shadow-soft hover:shadow-lg hover:bg-green-600 active:scale-95',
  soft:      'bg-primary-50 text-primary hover:bg-primary-100 active:scale-95',
  text:      'text-primary hover:underline active:scale-95',
};

const sizeClasses = {
  xs:    'px-2.5 py-1.5 text-xs font-medium rounded-md',
  sm:    'px-3 py-2 text-xs font-semibold rounded-lg',
  md:    'px-4 py-2.5 text-sm font-semibold rounded-lg',
  lg:    'px-6 py-3 text-base font-semibold rounded-xl',
  xl:    'px-8 py-4 text-lg font-bold rounded-xl',
  icon:  'w-10 h-10 p-0 flex items-center justify-center rounded-lg',
  'icon-lg': 'w-12 h-12 p-0 flex items-center justify-center rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  fullWidth = false,
  icon,
  iconPos = 'left',
  iconOnly = false,
  asChild = false,
  ...props
}) {
  const isDisabled = disabled || loading;
  const isIconOnly = iconOnly || (!children && icon);
  const finalSize = isIconOnly && size === 'md' ? 'icon' : isIconOnly && size === 'lg' ? 'icon-lg' : size;

  const buttonClassName = `
    inline-flex items-center justify-center gap-2.5
    font-semibold transition-all duration-200
    relative
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[finalSize]}
    ${fullWidth ? 'w-full' : ''}
    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  const content = (
    <>
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          {!isIconOnly && <span>Đang xử lý...</span>}
        </>
      ) : (
        <>
          {icon && iconPos === 'left' && <span className="flex items-center">{icon}</span>}
          {!isIconOnly && <span>{children}</span>}
          {icon && iconPos === 'right' && <span className="flex items-center">{icon}</span>}
        </>
      )}
    </>
  );

  if (asChild) {
    return <span className={buttonClassName}>{content}</span>;
  }

  return (
    <motion.button
      whileTap={{ scale: isDisabled ? 1 : 0.95 }}
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      disabled={isDisabled}
      className={buttonClassName}
      {...props}
    >
      {content}
    </motion.button>
  );
}
