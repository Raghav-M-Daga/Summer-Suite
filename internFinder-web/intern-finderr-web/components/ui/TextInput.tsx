import { useThemeColor } from '@/hooks/useThemeColor';

interface Props {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  style?: React.CSSProperties;
  className?: string;
}

export function TextInput({ 
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  autoCapitalize = 'sentences',
  keyboardType = 'default',
  style,
  className = '',
  ...props 
}: Props) {
  const getInputType = () => {
    if (secureTextEntry) return 'password';
    if (keyboardType === 'email-address') return 'email';
    if (keyboardType === 'numeric') return 'number';
    if (keyboardType === 'phone-pad') return 'tel';
    return 'text';
  };

  const getAutoCapitalize = () => {
    if (autoCapitalize === 'none') return 'off';
    if (autoCapitalize === 'sentences') return 'sentences';
    if (autoCapitalize === 'words') return 'words';
    if (autoCapitalize === 'characters') return 'characters';
    return 'on';
  };

  return (
    <input
      type={getInputType()}
      value={value}
      onChange={(e) => onChangeText?.(e.target.value)}
      placeholder={placeholder}
      autoCapitalize={getAutoCapitalize()}
      className={`form-input ${className}`}
      style={style}
      {...props}
    />
  );
} 