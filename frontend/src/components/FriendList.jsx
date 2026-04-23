import React from 'react';
import { Link } from 'react-router-dom';
import { UserMinus, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';

const FriendList = ({ friends = [], onRemoveFriend, emptyMessage }) => {
  if (friends.length === 0) {
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Aucun ami
        </h3>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {friends.map((friend) => (
        <div
          key={friend._id}
          className="flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors"
        >
          {/* Avatar */}
          <Link to={`/profile/${friend._id}`}>
            {friend.profile?.avatar ? (
              <img
                src={friend.profile.avatar}
                alt={friend.username}
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 hover:border-[#C91818] transition-colors"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xl border-2 border-gray-300">
                {friend.profile?.firstName?.[0] || friend.username?.[0] || 'U'}
              </div>
            )}
          </Link>

          {/* Friend Info */}
          <div className="flex-1 min-w-0">
            <Link
              to={`/profile/${friend._id}`}
              className="font-semibold text-black text-lg hover:text-[#C91818] transition-colors"
            >
              {friend.profile?.firstName || friend.username}
            </Link>
            {friend.profile?.lastName && (
              <span className="ml-2 text-gray-600">
                {friend.profile.lastName}
              </span>
            )}
            {friend.profile?.bio && (
              <p className="text-sm text-gray-600 mt-1 truncate">
                {friend.profile.bio}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {friend.username}
            </p>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  if (confirm(`Êtes-vous sûr de vouloir supprimer ${friend.profile?.firstName || friend.username} de vos amis ?`)) {
                    onRemoveFriend(friend._id);
                  }
                }}
                className="text-red-600"
              >
                <UserMinus className="w-4 h-4 mr-2" />
                Supprimer des amis
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
};

export default FriendList;