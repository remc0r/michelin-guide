import React, { useState } from 'react';
import { getFeed } from '../api/feed';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';

const Feed = ({ showOwnActivities = false }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);

  const loadActivities = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (showOwnActivities) {
        const feedModule = await import('../api/feed');
        data = await feedModule.getOwnActivities(pageNum);
      } else {
        data = await getFeed(pageNum);
      }

      setActivities(data.activities);
      setTotalPages(data.pagination.totalPages);
      setPage(pageNum);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadActivities(1);
  }, [showOwnActivities]);

  const loadMore = () => {
    if (page < totalPages) {
      loadActivities(page + 1);
    }
  };

  if (loading && activities.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => loadActivities(1)}>Reessayer</Button>
        </div>
      </div>
    );
  }

  if (activities.length === 0 && !loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <div className="bg-gray-50 rounded-xl p-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01 2-2M5 11V9a2 2 0 01 2-2m14 0V9a2 2 0 00 2-2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Aucune activite pour le moment
          </h3>
          <p className="text-gray-600">
            {showOwnActivities
              ? "Vous n avez pas encore d activites. Commencez par ajouter des amis et effectuer des reservations !"
              : "Vos amis n ont pas encore partage d activites."}
          </p>
          {!showOwnActivities && (
            <Button variant="outline" asChild>
              <a href="/restaurants">Decouvrir des restaurants</a>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black mb-2">
          {showOwnActivities ? "Mon activite" : "Activite de mes amis"}
        </h1>
        <p className="text-gray-600">
          {showOwnActivities
            ? "Toutes vos reservations et visites de restaurants"
            : "Decouvrez ce que vos amis ont partage"}
        </p>
      </div>

      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sm font-medium text-gray-700">
                    {activity.user?.profile?.firstName || activity.user?.username}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(activity.createdAt).toLocaleString('fr-FR')}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="font-semibold text-gray-800 mb-2">
                    {activity.type === 'review' && 'A laisse un avis'}
                    {activity.type === 'visit' && 'A visite un restaurant'}
                    {activity.type === 'reservation' && 'A reserve une table'}
                  </div>
                  {activity.data?.restaurantSlug && (
                    <div className="text-sm text-gray-600">
                      Restaurant: {activity.data.restaurantSlug}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {page < totalPages && (
        <div className="mt-8 text-center">
          <Button onClick={loadMore} variant="outline" size="lg">
            Voir plus
          </Button>
        </div>
      )}
    </div>
    );
};

export default Feed;