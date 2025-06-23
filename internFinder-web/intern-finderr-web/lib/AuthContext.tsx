"use client";

import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, getFirebaseDb } from './firebase';

interface UserProfile {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  ethnicity: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phoneNumber?: string;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  updateUserProfile: (profile: UserProfile) => Promise<void>;
  hasCompletedProfile: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const hasCompletedProfile = !!userProfile && 
    !!userProfile.firstName && 
    !!userProfile.lastName && 
    !!userProfile.age && 
    !!userProfile.gender && 
    !!userProfile.ethnicity && 
    !!userProfile.address.street && 
    !!userProfile.address.city && 
    !!userProfile.address.state && 
    !!userProfile.address.zip;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed. User:', user ? user.uid : 'null');
      setUser(user);
      
      if (user) {
        try {
          const db = getFirebaseDb();
          if (db) {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              setUserProfile(userDoc.data() as UserProfile);
            } else {
              setUserProfile(null);
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isAuthPage = pathname === '/' || pathname === '/sign-in' || pathname === '/sign-up';

    if (user) {
      if (hasCompletedProfile) {
        if (isAuthPage) {
          router.push('/home');
        }
      } else {
        if (pathname !== '/details') {
          router.push('/details');
        }
      }
    } else {
      if (!isAuthPage && pathname !== '/forgot-password') {
        router.push('/');
      }
    }
  }, [user, hasCompletedProfile, isLoading, pathname, router]);

  const signOut = async () => {
    try {
      await auth.signOut();
      setUserProfile(null);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUserProfile = async (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const value = {
    user,
    userProfile,
    isLoading,
    signOut,
    updateUserProfile,
    hasCompletedProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 