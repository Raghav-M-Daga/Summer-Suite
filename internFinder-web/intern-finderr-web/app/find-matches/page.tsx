'use client';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/AuthContext';
import { getFirebaseDb } from '@/lib/firebase';
import { collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  ethnicity: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export default function FindMatchPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<User | null>(null);
  const { user } = useAuth();
  const [matches, setMatches] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [proximity, setProximity] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const db = getFirebaseDb();
        if (!db) {
          console.log('Firestore not available');
          setLoading(false);
          return;
        }

        // 1. Get IDs of all friends
        const friendsQuery1 = query(
          collection(db, 'connectionRequests'),
          where('toUserId', '==', user.uid),
          where('status', '==', 'accepted')
        );
        const friendsQuery2 = query(
          collection(db, 'connectionRequests'),
          where('fromUserId', '==', user.uid),
          where('status', '==', 'accepted')
        );

        const [friendsSnapshot1, friendsSnapshot2] = await Promise.all([
          getDocs(friendsQuery1),
          getDocs(friendsQuery2),
        ]);

        const friendIds = new Set<string>();
        friendsSnapshot1.forEach((doc) => friendIds.add(doc.data().fromUserId));
        friendsSnapshot2.forEach((doc) => friendIds.add(doc.data().toUserId));
        
        // 2. Fetch all users and filter out self and friends
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        
        const users: User[] = [];
        querySnapshot.forEach((doc) => {
          // Exclude current user and existing friends
          if (doc.id !== user.uid && !friendIds.has(doc.id)) {
            const data = doc.data();
            users.push({
              id: doc.id,
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              age: data.age || 0,
              gender: data.gender || '',
              ethnicity: data.ethnicity || '',
              street: data.address?.street || '',
              city: data.address?.city || '',
              state: data.address?.state || '',
              zip: data.address?.zip || '',
            });
          }
        });

        setMatches(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const sendConnectionRequest = async (match: User) => {
    if (!user) {
      alert('You must be logged in to send connection requests.');
      return;
    }

    try {
      const db = getFirebaseDb();
      if (!db) {
        alert('Database not available.');
        return;
      }

      // Create connection request
      const requestData = {
        fromUserId: user.uid,
        fromUserName: `${user.email}`,
        toUserId: match.id,
        toUserName: `${match.firstName} ${match.lastName}`,
        status: 'pending',
        createdAt: new Date(),
        message: `Hi ${match.firstName}! I'd like to connect with you.`
      };

      // Save to connection requests collection
      const requestRef = doc(db, 'connectionRequests', `${user.uid}_${match.id}`);
      await setDoc(requestRef, requestData);

      alert(`Your connection request has been sent to ${match.firstName} ${match.lastName}.`);
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert('Failed to send connection request. Please try again.');
    }
  };

  const openModal = (match: User) => {
    setSelectedMatch(match);
    setModalVisible(true);
  };
  
  const closeModal = () => {
    setSelectedMatch(null);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <ThemedView className="flex-1 p-5">
        <div className="flex-1 flex justify-center items-center">
          <ThemedText type="title">Loading matches...</ThemedText>
        </div>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="page-container">
      <div className="page-header">
        <button className="back-button" onClick={() => router.back()} style={{ marginRight: '1rem' }}>
          ←
        </button>
        <ThemedText className="page-title">Find Matches</ThemedText>
      </div>

      <div className="mb-6">
        <ThemedText type="subtitle" style={{ marginBottom: '1rem', display: 'block' }}>
          Available Matches ({matches.length})
        </ThemedText>
        
        {matches.length === 0 ? (
          <div className="text-center" style={{ padding: '2.5rem 0' }}>
            <ThemedText type="subtitle">No matches found</ThemedText>
            <ThemedText style={{ opacity: 0.7, marginTop: '0.5rem' }}>
              Try adjusting your filters or check back later
            </ThemedText>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {matches.map((match) => (
              <div 
                key={match.id} 
                className="card"
                style={{ cursor: 'pointer' }}
                onClick={() => openModal(match)}
              >
                <div className="flex justify-between items-start mb-2">
                  <ThemedText className="font-bold">
                    {match.firstName} {match.lastName}
                  </ThemedText>
                  <ThemedText className="text-sm opacity-70">{match.age} years old</ThemedText>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <ThemedText className="text-sm opacity-70">{match.gender} • {match.ethnicity}</ThemedText>
                  <ThemedText className="text-sm opacity-70">{match.city}, {match.state}</ThemedText>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalVisible && selectedMatch && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ThemedText type="title" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              {selectedMatch.firstName} {selectedMatch.lastName}
            </ThemedText>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <p><strong>Age:</strong> {selectedMatch.age}</p>
              <p><strong>Gender:</strong> {selectedMatch.gender}</p>
              <p><strong>Ethnicity:</strong> {selectedMatch.ethnicity}</p>
              <p><strong>Location:</strong> {selectedMatch.city}, {selectedMatch.state}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button 
                onClick={() => {
                  sendConnectionRequest(selectedMatch);
                  closeModal();
                }}
                variant="primary"
              >
                Connect
              </Button>
              <Button 
                onClick={closeModal}
                variant="secondary"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </ThemedView>
  );
} 