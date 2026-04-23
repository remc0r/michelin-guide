import React, { useState } from 'react';
import Feed from '../components/Feed';

const FeedPage = () => {
  const [showOwnActivities, setShowOwnActivities] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Tab Toggle */}
          <div className="flex gap-2 mb-8 bg-white p-1 rounded-lg border border-gray-200 inline-flex">
            <button
              onClick={() => setShowOwnActivities(false)}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                !showOwnActivities
                  ? 'bg-[#C91818] text-white shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Activité des amis
            </button>
            <button
              onClick={() => setShowOwnActivities(true)}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                showOwnActivities
                  ? 'bg-[#C91818] text-white shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Mon activité
            </button>
          </div>

          {/* Feed */}
          <Feed showOwnActivities={showOwnActivities} />
        </div>
      </div>
    </div>
  );
};

export default FeedPage;