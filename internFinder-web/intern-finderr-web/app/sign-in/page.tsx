'use client';

import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { useAuth } from '@/lib/AuthContext';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useState } from 'react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!email || !password) {
        setError('Please enter both email and password.');
        setIsLoading(false);
        return;
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // The redirect is handled by the AuthProvider, so no need for router.push here
      // This also simplifies the logic by removing the hasCompletedProfile check
      
    } catch (err: any) {
      let errorMessage = 'Failed to sign in. Please try again.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
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
        <p className="auth-subtitle">Please enter your details</p>
        <h1 className="auth-title">Welcome back</h1>
        
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
        </div>

        <div className="form-options">
          <div className="checkbox-container">
            <input type="checkbox" id="remember" className="checkbox" />
            <label htmlFor="remember">Remember for 30 days</label>
          </div>
          <Link href="/forgot-password" legacyBehavior>
            <a className="auth-link text-sm">Forgot password</a>
          </Link>
        </div>
        
        {error && (
          <p className="error-message">{error}</p>
        )}

        <Button 
          onClick={handleSignIn} 
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link href="/sign-up" legacyBehavior>
            <a className="auth-link">Sign up</a>
          </Link>
        </p>
      </div>
    </div>
  );
} 