import { motion } from 'framer-motion';

const variants = {
  primary:   'bg-primary text-white hover:bg-secondary',
  secondary: 'border border-primary text-primary hover:bg-accent-soft',
  ghost:     'text-[#374151] hover:bg-[#F5F5F5]',
  danger:    'bg-red-500 text-white hover:bg-red-600',
  success:   'bg-[#10B981] text-white hover:bg-[#059669]',
  outline:   'border border-border text-[#374151] hover:border-primary hover:text-primary',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-lg',
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  xl: 'px-8 py-4 text-lg rounded-2xl',
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
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Đang xử lý...
        </>
      ) : (
        <>
          {icon && iconPos === 'left' && <span>{icon}</span>}
          {children}
          {icon && iconPos === 'right' && <span>{icon}</span>}
        </>
      )}
    </motion.button>
  );
}
