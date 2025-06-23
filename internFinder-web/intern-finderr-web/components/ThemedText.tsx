import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  children,
  className = '',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const getTextClasses = () => {
    switch (type) {
      case 'default':
        return 'text-base leading-6';
      case 'title':
        return 'text-3xl font-bold leading-8';
      case 'defaultSemiBold':
        return 'text-base leading-6 font-semibold';
      case 'subtitle':
        return 'text-xl font-bold';
      case 'link':
        return 'leading-8 text-base text-purple-600';
      default:
        return 'text-base leading-6';
    }
  };

  return (
    <span
      className={`${getTextClasses()} ${className}`}
      style={{ color, ...style }}
      {...rest}
    >
      {children}
    </span>
  );
} 