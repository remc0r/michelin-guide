import React from 'react';
import { UserCheck } from 'lucide-react';
import { Button } from './ui/button';

const FriendRequests = ({ requests = [], onAcceptRequest, emptyMessage }) => {
  if (requests.length === 0) {
    return (
      <div className="p-12 text-center">
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Aucune demande
        </h3>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {requests.map((request) => (
        <div
          key={request.friendshipId || request._id}
          className="flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors"
        >
          {/* Avatar */}
          {request.profile?.avatar ? (
            <img
              src={request.profile.avatar}
              alt={request.username}
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xl border-2 border-gray-300">
              {request.profile?.firstName?.[0] || request.username?.[0] || 'U'}
            </div>
          )}

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-black text-lg">
              {request.profile?.firstName || request.username}
              {request.profile?.lastName && (
                <span className="ml-2">{request.profile.lastName}</span>
              )}
            </h3>
            {request.profile?.bio && (
              <p className="text-sm text-gray-600 mt-1 truncate">
                {request.profile.bio}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              @{request.username}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => {
                if (confirm(`Accepter la demande de ${request.profile?.firstName || request.username} ?`)) {
                  onAcceptRequest(request.friendshipId || request._id);
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Accepter
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequests;