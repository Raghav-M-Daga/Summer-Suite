'use client';

import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FirebaseError } from 'firebase/app';

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
    } catch (err: unknown) {
      console.error('Password reset error:', err);
      let errorMessage = 'Failed to send reset email';
      
      if (err instanceof FirebaseError) {
        if (err.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email address';
        } else if (err.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address';
        } else if (err.code === 'auth/too-many-requests') {
          errorMessage = 'Too many requests. Please try again later';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">InternFinder</div>
      <div className="auth-container">
        <h1 className="auth-title" style={{ marginBottom: '1rem' }}>Reset Password</h1>
        <p className="auth-subtitle" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextInput
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </div>

        <div style={{ height: '1.5rem' }} />
        
        {error && (
          <p className="error-message">{error}</p>
        )}

        {success && (
          <p className="success-message">{success}</p>
        )}

        <Button 
          onClick={handleResetPassword} 
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Reset Email'}
        </Button>

        <p className="auth-footer">
          Remember your password?{' '}
          <Link href="/sign-in" className="auth-link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
} 