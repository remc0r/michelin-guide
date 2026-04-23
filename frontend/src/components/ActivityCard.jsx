import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Calendar, MessageSquare, Utensils } from 'lucide-react';

const ActivityCard = ({ activity }) => {
  const getActivityType = (type) => {
    switch (type) {
      case 'review':
        return {
          icon: Star,
          title: 'A laissé un avis',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50'
        };
      case 'visit':
        return {
          icon: Utensils,
          title: 'A visité un restaurant',
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      case 'reservation':
        return {
          icon: Calendar,
          title: 'A réservé une table',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };
      default:
        return {
          icon: MessageSquare,
          title: 'Activité',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const typeConfig = getActivityType(activity.type);
  const Icon = typeConfig.icon;

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderActivityContent = () => {
    switch (activity.type) {
      case 'review':
        return (
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < activity.data.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-gray-800">
                {activity.data.rating}/5
              </span>
            </div>
            {activity.data.comment && (
              <p className="text-gray-700 text-sm italic">
                "{activity.data.comment}"
              </p>
            )}
          </div>
        );

      case 'visit':
        return (
          <div className="mt-4">
            <p className="text-green-700 font-medium">
              ✨ A visité {activity.data.restaurantSlug}
            </p>
          </div>
        );

      case 'reservation':
        return (
          <div className="mt-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(activity.data.reservationDate)}</span>
              </div>
              {activity.data.partySize && (
                <div className="flex items-center gap-1">
                  <Utensils className="w-4 h-4" />
                  <span>{activity.data.partySize} personnes</span>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {activity.user?.profile?.avatar ? (
            <img
              src={activity.user.profile.avatar}
              alt={activity.user.username}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 border-2 border-gray-300">
              {activity.user?.profile?.firstName?.[0] ||
               activity.user?.username?.[0] || 'U'}
            </div>
          )}
        </div>

        {/* Activity Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/profile/${activity.user?._id}`}
              className="font-semibold text-black hover:text-[#C91818] transition-colors"
            >
              {activity.user?.profile?.firstName || activity.user?.username}
            </Link>
            <span className="text-gray-400">·</span>
            <span className="text-sm text-gray-500">
              {formatDate(activity.createdAt)}
            </span>
          </div>

          {/* Activity Type */}
          <div className="flex items-center gap-2 mt-2">
            <div className={`p-1.5 rounded-lg ${typeConfig.bgColor}`}>
              <Icon className={`w-4 h-4 ${typeConfig.color}`} />
            </div>
            <span className="font-medium text-gray-700">
              {typeConfig.title}
            </span>
          </div>

          {/* Activity-specific content */}
          {renderActivityContent()}

          {/* Restaurant Link */}
          {activity.data?.restaurantSlug && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <Link
                to={`/restaurants/${activity.data.restaurantSlug}`}
                className="text-[#C91818] font-medium hover:underline"
              >
                {activity.data.restaurantSlug}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;