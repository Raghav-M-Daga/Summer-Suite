'use client';

import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FirebaseError } from 'firebase/app';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/details');
    } catch (err: unknown) {
      let errorMessage = 'Failed to create account. Please try again.';
      if (err instanceof FirebaseError) {
        if (err.code === 'auth/email-already-in-use') {
          errorMessage = 'An account with this email already exists.';
        } else if (err.code === 'auth/invalid-email') {
          errorMessage = 'Please enter a valid email address.';
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
        <p className="auth-subtitle">Start your journey</p>
        <h1 className="auth-title">Create an account</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextInput
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </div>

        <div style={{ height: '1.5rem' }} />

        {error && (
          <p className="error-message">{error}</p>
        )}

        <Button 
          onClick={handleSignUp} 
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </Button>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link href="/sign-in" legacyBehavior>
            <a className="auth-link">Sign In</a>
          </Link>
        </p>
      </div>
    </div>
  );
} 