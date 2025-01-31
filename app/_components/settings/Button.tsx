interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary';
}

export function Button({ 
  children, 
  className = '', 
  variant = 'primary',
  ...props 
}: ButtonProps) {
  const baseStyle = 'px-4 py-2 rounded-lg font-medium transition-all duration-200';
  
  const variants = {
    primary: 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 