'use client';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { useAuth } from '@/lib/AuthContext';
import { getFirebaseDb } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FirebaseError } from 'firebase/app';

export default function DetailsPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [duration, setDuration] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, updateUserProfile, userProfile } = useAuth();
  const router = useRouter();

  // Load existing user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // First check if we have profile data in context
        if (userProfile) {
          setFirstName(userProfile.firstName || '');
          setLastName(userProfile.lastName || '');
          setAge(userProfile.age ? userProfile.age.toString() : '');
          setGender(userProfile.gender || '');
          setEthnicity(userProfile.ethnicity || '');
          setStreet(userProfile.address?.street || '');
          setCity(userProfile.address?.city || '');
          setState(userProfile.address?.state || '');
          setZip(userProfile.address?.zip || '');
          setPhoneNumber(userProfile.phoneNumber || '');
          setDuration(userProfile.duration ? userProfile.duration.toString() : '');
        } else {
          // Fallback: fetch from Firestore
          const db = getFirebaseDb();
          if (db) {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              const profileData = userDoc.data();
              setFirstName(profileData.firstName || '');
              setLastName(profileData.lastName || '');
              setAge(profileData.age ? profileData.age.toString() : '');
              setGender(profileData.gender || '');
              setEthnicity(profileData.ethnicity || '');
              setStreet(profileData.address?.street || '');
              setCity(profileData.address?.city || '');
              setState(profileData.address?.state || '');
              setZip(profileData.address?.zip || '');
              setPhoneNumber(profileData.phoneNumber || '');
              setDuration(profileData.duration ? profileData.duration.toString() : '');
            }
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [user, userProfile]);

  const updateUserDocument = async () => {
    if (!user) {
      alert('User not authenticated.');
      return;
    }

    // Validate required fields
    if (!firstName || !lastName || !age || !gender || !ethnicity || !street || !city || !state || !zip) {
      alert('Please fill in all required fields.');
      return;
    }

    // Validate age
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 16 || ageNum > 100) {
      alert('Please enter a valid age between 16 and 100.');
      return;
    }

    // Validate zip code
    if (zip.length !== 5 || isNaN(parseInt(zip))) {
      alert('Please enter a valid 5-digit zip code.');
      return;
    }

    setSaving(true);
    try {
      const userProfileData = {
        firstName,
        lastName,
        age: ageNum,
        gender,
        ethnicity,
        address: {
          street,
          city,
          state,
          zip
        },
        phoneNumber,
        duration: duration ? parseInt(duration) : undefined,
        createdAt: userProfile?.createdAt || new Date(),
        updatedAt: new Date()
      };

      // Remove undefined fields (including nested address)
      function removeUndefined(obj: unknown): unknown {
        if (Array.isArray(obj)) {
          return obj.map(removeUndefined);
        } else if (obj && typeof obj === 'object') {
          const newObj: Record<string, unknown> = {};
          for (const key in obj as Record<string, unknown>) {
            if ((obj as Record<string, unknown>)[key] !== undefined) {
              newObj[key] = removeUndefined((obj as Record<string, unknown>)[key]);
            }
          }
          return newObj;
        }
        return obj;
      }
      const cleanedProfileData = removeUndefined(userProfileData) as typeof userProfileData;

      // Save to Firestore using the db instance
      const db = getFirebaseDb();
      if (db) {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, cleanedProfileData, { merge: true });
        console.log('User profile saved to Firestore:', cleanedProfileData);
      } else {
        console.log('Firestore not available, using mock save');
        // Mock save for testing
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Update the user's profile status in the context
      await updateUserProfile(cleanedProfileData);
      
      alert('Your profile has been saved successfully.');
      router.push('/home');
    } catch (error: unknown) {
      console.error('Error saving user details:', error);
      
      let errorMessage = 'Failed to save user details. Please try again.';
      
      if (error instanceof FirebaseError) {
        if (error.code === 'permission-denied') {
          errorMessage = 'Permission denied. Please check your Firebase security rules.';
        } else if (error.code === 'unavailable') {
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ThemedView className="flex-1 flex justify-center items-center">
        <ThemedText type="title">Loading Profile...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="page-container" style={{ maxWidth: '768px' }}>
      <div className="page-header" style={{ marginBottom: '0.5rem' }}>
        <ThemedText className="page-title">
          {userProfile ? 'Edit Profile' : 'Complete Your Profile'}
        </ThemedText>
      </div>
      <ThemedText style={{ color: 'var(--text-secondary)', marginBottom: '2rem', display: 'block' }}>
        {userProfile ? 'Update your information below.' : 'Help us find the perfect internship match for you.'}
      </ThemedText>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">First Name *</label>
            <TextInput value={firstName} onChangeText={setFirstName} />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name *</label>
            <TextInput value={lastName} onChangeText={setLastName} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Age *</label>
            <TextInput value={age} onChangeText={setAge} keyboardType="numeric" />
          </div>
          <div className="form-group">
            <label className="form-label">Gender *</label>
            <select className="form-input" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Ethnicity *</label>
             <select className="form-input" value={ethnicity} onChange={(e) => setEthnicity(e.target.value)}>
              <option value="">Select</option>
              <option value="Asian">Asian</option>
              <option value="Black">Black</option>
              <option value="Hispanic">Hispanic</option>
              <option value="White">White</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Internship Address *</label>
          <TextInput value={street} onChangeText={setStreet} placeholder="Street Address" style={{ marginBottom: '1rem' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
            <TextInput value={city} onChangeText={setCity} placeholder="City" />
            <TextInput value={state} onChangeText={setState} placeholder="State" />
            <TextInput value={zip} onChangeText={setZip} placeholder="Zip Code" keyboardType="numeric" />
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <Button onClick={updateUserDocument} variant="primary" disabled={saving}>
            {saving ? 'Saving...' : (userProfile ? 'Update Profile' : 'Save Profile')}
          </Button>
          <Button onClick={() => router.back()} variant="secondary">
            {userProfile ? 'Cancel' : 'Skip for Now'}
          </Button>
        </div>
      </div>
    </ThemedView>
  );
} 