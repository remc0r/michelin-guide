import React, { useState, useEffect } from 'react';
import { getFriends, getPendingRequests, sendFriendRequest, acceptFriendRequest, removeFriend } from '../api/friends';
import FriendList from '../components/FriendList';
import FriendRequests from '../components/FriendRequests';
import AddFriend from '../components/AddFriend';
import { Button } from '../components/ui/button';

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('friends'); // 'friends' | 'requests' | 'add'

  const loadData = async () => {
    try {
      setLoading(true);
      const [friendsData, requestsData] = await Promise.all([
        getFriends(),
        getPendingRequests()
      ]);
      setFriends(friendsData);
      setPendingRequests(requestsData);
    } catch (error) {
      console.error('Failed to load friends:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendRequest = async (username) => {
    try {
      await sendFriendRequest(username);
      alert(`Demande d'ami envoyée à ${username}`);
    } catch (error) {
      alert(error.message || 'Erreur lors de l\'envoi de la demande');
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      await acceptFriendRequest(userId);
      await loadData(); // Reload data
      alert('Demande d\'ami acceptée !');
    } catch (error) {
      alert(error.message || 'Erreur lors de l\'acceptation');
    }
  };

  const handleRemoveFriend = async (userId) => {
    try {
      await removeFriend(userId);
      await loadData(); // Reload data
      alert('Ami supprimé');
    } catch (error) {
      alert(error.message || 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Mes amis</h1>
            <p className="text-gray-600">
              Gérez vos amis et découvrez leurs activités culinaires
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-white p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex-1 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'friends'
                  ? 'bg-[#C91818] text-white shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Mes amis ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'requests'
                  ? 'bg-[#C91818] text-white shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Demandes {pendingRequests.length > 0 && `(${pendingRequests.length})`}
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`flex-1 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'add'
                  ? 'bg-[#C91818] text-white shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Ajouter des amis
            </button>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {activeTab === 'friends' && (
              <FriendList
                friends={friends}
                onRemoveFriend={handleRemoveFriend}
                emptyMessage="Vous n'avez pas encore d'amis. Ajoutez des amis pour voir leurs activités !"
              />
            )}

            {activeTab === 'requests' && (
              <FriendRequests
                requests={pendingRequests}
                onAcceptRequest={handleAcceptRequest}
                emptyMessage="Aucune demande d'ami en attente"
              />
            )}

            {activeTab === 'add' && (
              <AddFriend onSendRequest={handleSendRequest} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;