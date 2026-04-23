import { useState, useCallback } from 'react';
import { getFeed, getOwnActivities } from '../api/feed';

export const useFeed = (showOwnActivities = false) => {
  const [activities, setActivities] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFeed = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      const fetchFunction = showOwnActivities ? getOwnActivities : getFeed;
      const data = await fetchFunction(pageNum);

      setActivities(data.activities);
      setTotalPages(data.pagination.totalPages);
      setPage(pageNum);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [showOwnActivities]);

  const loadMore = useCallback(async () => {
    if (page < totalPages && !loading) {
      try {
        setError(null);
        const fetchFunction = showOwnActivities ? getOwnActivities : getFeed;
        const data = await fetchFunction(page + 1);

        setActivities(prev => [...prev, ...data.activities]);
        setPage(page + 1);
      } catch (err) {
        setError(err.message);
      }
    }
  }, [page, totalPages, loading, showOwnActivities]);

  const refresh = useCallback(async () => {
    await loadFeed(1);
  }, [loadFeed]);

  return {
    activities,
    page,
    totalPages,
    loading,
    error,
    loadFeed,
    loadMore,
    refresh,
    hasMore: page < totalPages
  };
};