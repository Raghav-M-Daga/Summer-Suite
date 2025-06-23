'use client';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert('Sign Out Error: ' + error.message);
      } else {
        alert('An unknown error occurred during sign out.');
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container" style={{ textAlign: 'center' }}>
        <h1 className="auth-title">Welcome to InternFinder!</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Button 
            onClick={() => router.push('/details')}
            variant="primary"
          >
            Edit Profile
          </Button>
          
          <Button 
            onClick={() => router.push('/find-matches')}
            variant="primary"
          >
            Find Matches
          </Button>
          
          <Button 
            onClick={() => router.push('/connections')}
            variant="primary"
          >
            Connection Requests
          </Button>
          
          <div style={{ marginTop: '1.5rem' }}>
            <Button 
              onClick={handleSignOut}
              variant="secondary"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 