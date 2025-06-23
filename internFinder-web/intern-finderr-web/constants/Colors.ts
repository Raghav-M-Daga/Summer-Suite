/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#6949FF';
const tintColorDark = '#8970FF';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    textSecondary: '#666666',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: '#E5E5E5',
    card: '#FFFFFF',
    error: '#FF4444',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    textSecondary: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#404040',
    card: '#202425',
    error: '#FF6666',
  },
}; 