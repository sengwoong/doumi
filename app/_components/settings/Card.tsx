interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div 
      className={`
        bg-gray-800 rounded-xl 
        border border-gray-700
        shadow-sm hover:shadow-lg
        hover:border-gray-600
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
}