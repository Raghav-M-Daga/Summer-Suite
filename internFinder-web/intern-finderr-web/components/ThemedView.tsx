import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = {
  lightColor?: string;
  darkColor?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  children,
  className = '',
  ...otherProps 
}: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <div 
      className={className}
      style={{ backgroundColor, ...style }} 
      {...otherProps}
    >
      {children}
    </div>
  );
} 