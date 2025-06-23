import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  leftIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function Button({ 
  children, 
  leftIcon, 
  style, 
  className = '',
  variant = 'primary', 
  onClick,
  disabled = false,
  ...props 
}: Props) {
  const content =
    typeof children === 'string' ? (
      <span className="text-base font-semibold">
        {children}
      </span>
    ) : (
      children
    );

  const buttonClasses = [
    'btn',
    variant === 'primary' ? 'btn-primary' : '',
    variant === 'secondary' ? 'btn-secondary' : '',
    variant === 'ghost' ? 'btn-ghost' : '',
    disabled ? 'opacity-50' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      style={style}
      onClick={onClick}
      disabled={disabled}
      {...props}>
      {leftIcon ? (
        <div className="flex items-center gap-2">
          {leftIcon}
          {content}
        </div>
      ) : (
        content
      )}
    </button>
  );
} 