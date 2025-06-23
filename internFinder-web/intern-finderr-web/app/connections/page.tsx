'use client';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/AuthContext';
import { getFirebaseDb } from '@/lib/firebase';
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ConnectionRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  message: string;
  fromUser?: {
    firstName: string;
    lastName: string;
    age: number;
    city: string;
    state: string;
  };
}

interface Friend {
  id: string;
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  ethnicity: string;
  city: string;
  state: string;
}

export default function ConnectionsPage() {
  const { user } = useAuth();
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'requests' | 'friends'>('requests');
  const router = useRouter();

  // Fetch connection requests and friends
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const db = getFirebaseDb();
        if (!db) {
          console.log('Firestore not available');
          setLoading(false);
          return;
        }

        // Fetch pending connection requests sent to current user
        const requestsRef = collection(db, 'connectionRequests');
        const requestsQuery = query(requestsRef, where('toUserId', '==', user.uid), where('status', '==', 'pending'));
        const requestsSnapshot = await getDocs(requestsQuery);
        
        const requests: ConnectionRequest[] = [];
        for (const reqDoc of requestsSnapshot.docs) {
          const data = reqDoc.data();
          let fromUser;
          // Fetch requester's profile
          const userDocRef = doc(db, 'users', data.fromUserId);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const d = userDocSnap.data();
            fromUser = {
              firstName: d.firstName,
              lastName: d.lastName,
              age: d.age,
              city: d.address.city,
              state: d.address.state,
            };
          }
          requests.push({
            id: reqDoc.id,
            fromUserId: data.fromUserId,
            fromUserName: data.fromUserName,
            toUserId: data.toUserId,
            toUserName: data.toUserName,
            status: data.status,
            createdAt: data.createdAt?.toDate() || new Date(),
            message: data.message,
            fromUser,
          });
        }

        setConnectionRequests(requests);

        // Fetch accepted friends
        const acceptedRequestsQuery = query(requestsRef, where('toUserId', '==', user.uid), where('status', '==', 'accepted'));
        const acceptedRequestsSnapshot = await getDocs(acceptedRequestsQuery);
        
        const friendsList: Friend[] = [];
        for (const doc of acceptedRequestsSnapshot.docs) {
          const data = doc.data();
          // Get friend's profile data
          const friendDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', data.fromUserId)));
          if (!friendDoc.empty) {
            const friendData = friendDoc.docs[0].data();
            friendsList.push({
              id: data.fromUserId,
              userId: data.fromUserId,
              userName: data.fromUserName,
              firstName: friendData.firstName || '',
              lastName: friendData.lastName || '',
              age: friendData.age || 0,
              gender: friendData.gender || '',
              ethnicity: friendData.ethnicity || '',
              city: friendData.address?.city || '',
              state: friendData.address?.state || ''
            });
          }
        }

        setFriends(friendsList);
      } catch (error) {
        console.error('Error fetching connections:', error);
        alert('Failed to load connections. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAcceptRequest = async (request: ConnectionRequest) => {
    try {
      const db = getFirebaseDb();
      if (!db) {
        alert('Database not available.');
        return;
      }

      // Update the request status to accepted
      const requestRef = doc(db, 'connectionRequests', request.id);
      await updateDoc(requestRef, { status: 'accepted' });

      // Remove from pending requests and add to friends
      setConnectionRequests(prev => prev.filter(r => r.id !== request.id));
      
      // Add to friends list (you might want to fetch the friend's profile data here)
      const newFriend: Friend = {
        id: request.fromUserId,
        userId: request.fromUserId,
        userName: request.fromUserName,
        firstName: request.fromUserName.split(' ')[0] || '',
        lastName: request.fromUserName.split(' ')[1] || '',
        age: 0,
        gender: '',
        ethnicity: '',
        city: '',
        state: ''
      };
      
      setFriends(prev => [...prev, newFriend]);

      alert(`Connection request from ${request.fromUserName} accepted!`);
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept request. Please try again.');
    }
  };

  const handleRejectRequest = async (request: ConnectionRequest) => {
    try {
      const db = getFirebaseDb();
      if (!db) {
        alert('Database not available.');
        return;
      }

      // Update the request status to rejected
      const requestRef = doc(db, 'connectionRequests', request.id);
      await updateDoc(requestRef, { status: 'rejected' });

      // Remove from pending requests
      setConnectionRequests(prev => prev.filter(r => r.id !== request.id));

      alert(`Connection request from ${request.fromUserName} rejected.`);
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request. Please try again.');
    }
  };

  const handleUnfriend = async (friend: Friend) => {
    if (confirm(`Are you sure you want to unfriend ${friend.firstName} ${friend.lastName}?`)) {
      try {
        const db = getFirebaseDb();
        if (!db) {
          alert('Database not available.');
          return;
        }

        // Find and delete the connection request
        const requestsRef = collection(db, 'connectionRequests');
        const requestsQuery = query(
          requestsRef, 
          where('toUserId', '==', user?.uid), 
          where('fromUserId', '==', friend.userId),
          where('status', '==', 'accepted')
        );
        const requestsSnapshot = await getDocs(requestsQuery);
        
        if (!requestsSnapshot.empty) {
          await deleteDoc(doc(db, 'connectionRequests', requestsSnapshot.docs[0].id));
        }

        // Remove from friends list
        setFriends(prev => prev.filter(f => f.id !== friend.id));

        alert(`${friend.firstName} ${friend.lastName} has been removed from your friends.`);
      } catch (error) {
        console.error('Error unfriending:', error);
        alert('Failed to unfriend. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <ThemedView className="flex-1 p-5">
        <div className="flex-1 flex justify-center items-center">
          <ThemedText type="title">Loading connections...</ThemedText>
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
        <ThemedText className="page-title">Connections</ThemedText>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <button
          className="tab-button"
          data-active={activeTab === 'requests'}
          onClick={() => setActiveTab('requests')}
        >
          Requests ({connectionRequests.length})
        </button>
        <button
          className="tab-button"
          data-active={activeTab === 'friends'}
          onClick={() => setActiveTab('friends')}
        >
          Friends ({friends.length})
        </button>
      </div>

      {/* Connection Requests Tab */}
      {activeTab === 'requests' && (
        <div>
          {connectionRequests.length === 0 ? (
            <div className="text-center" style={{ padding: '2.5rem 0' }}>
              <ThemedText type="subtitle">No pending requests</ThemedText>
              <ThemedText style={{ opacity: 0.7, marginTop: '0.5rem' }}>
                You don&apos;t have any pending connection requests
              </ThemedText>
            </div>
          ) : (
            <div className="space-y-4">
              {connectionRequests.map((request) => (
                <div key={request.id} className="card">
                  <ThemedText style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>
                    {request.fromUser ? `${request.fromUser.firstName} ${request.fromUser.lastName}` : request.fromUserName}
                  </ThemedText>
                  {request.fromUser && (
                    <ThemedText style={{ color: 'var(--text-secondary)', display: 'block', margin: '0.25rem 0 1rem' }}>
                      {request.fromUser.age} &middot; {request.fromUser.city}, {request.fromUser.state}
                    </ThemedText>
                  )}
                  <ThemedText className="mb-4">{request.message}</ThemedText>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleAcceptRequest(request)}
                      className="flex-1"
                    >
                      Accept
                    </Button>
                    <Button 
                      onClick={() => handleRejectRequest(request)}
                      variant="secondary"
                      className="flex-1"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <div>
          {friends.length === 0 ? (
            <div className="text-center py-10">
              <ThemedText className="text-xl font-bold mb-2">No friends yet</ThemedText>
              <ThemedText className="opacity-70">Start connecting with other interns to build your network</ThemedText>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <div key={friend.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ThemedText style={{ fontWeight: 'bold' }}>
                    {friend.firstName} {friend.lastName}
                  </ThemedText>
                  <Button onClick={() => handleUnfriend(friend)} variant="secondary">
                    Unfriend
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ThemedView>
  );
} 