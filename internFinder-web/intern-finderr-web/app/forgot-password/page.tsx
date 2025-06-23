'use client';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      console.error('Password reset error:', err);
      let errorMessage = 'Failed to send reset email';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView className="flex-1 p-5">
      <div className="flex-1 flex flex-col justify-center pt-10 pb-10">
        <div className="mb-5">
          <button className="back-button" onClick={() => router.back()}>
            ← Back
          </button>
        </div>

        <ThemedText type="title" className="text-center mb-10 text-3xl">Reset Password</ThemedText>

        <div className="flex flex-col gap-4 mb-10">
          <ThemedText className="text-center opacity-70 mb-4">
            Enter your email address and we'll send you a link to reset your password.
          </ThemedText>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            leftIcon="mail"
          />
          
          {error && (
            <div className="error-message text-center">{error}</div>
          )}

          {success && (
            <div className="success-message text-center">{success}</div>
          )}

          <Button 
            onClick={handleResetPassword} 
            className="mt-2"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Email'}
          </Button>
        </div>

        <div className="flex justify-center">
          <ThemedText>
            Remember your password?{' '}
            <Link href="/sign-in" className="link-bold">
              Sign In
            </Link>
          </ThemedText>
        </div>
      </div>
    </ThemedView>
  );
} 