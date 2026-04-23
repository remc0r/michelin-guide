import { useState, useEffect, useCallback } from 'react';
import { getFriends, getPendingRequests, sendFriendRequest, acceptFriendRequest, removeFriend } from '../api/friends';

export const useFriends = () => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFriends = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [friendsData, requestsData] = await Promise.all([
        getFriends(),
        getPendingRequests()
      ]);
      setFriends(friendsData);
      setPendingRequests(requestsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSendRequest = useCallback(async (username) => {
    try {
      const result = await sendFriendRequest(username);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const handleAcceptRequest = useCallback(async (userId) => {
    try {
      const result = await acceptFriendRequest(userId);
      await loadFriends(); // Reload data
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [loadFriends]);

  const handleRemoveFriend = useCallback(async (userId) => {
    try {
      const result = await removeFriend(userId);
      await loadFriends(); // Reload data
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [loadFriends]);

  return {
    friends,
    pendingRequests,
    loading,
    error,
    loadFriends,
    sendRequest: handleSendRequest,
    acceptRequest: handleAcceptRequest,
    removeFriend: handleRemoveFriend
  };
};