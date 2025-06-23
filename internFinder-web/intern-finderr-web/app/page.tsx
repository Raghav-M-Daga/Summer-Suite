'use client';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/lib/AuthContext';
import SignIn from './sign-in/page'; // Import the sign-in component

export default function LandingPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || user) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText type="title">Loading...</ThemedText>
      </ThemedView>
    );
  }

  return <SignIn />;
}
