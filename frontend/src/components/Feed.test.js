import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Feed from './Feed';

// Mock the API
jest.mock('../api/feed', () => ({
  getFeed: jest.fn(),
  getOwnActivities: jest.fn()
}));

import { getFeed, getOwnActivities } from '../api/feed';

describe('Feed Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loading state', () => {
    it('should show loading skeletons', () => {
      getFeed.mockImplementation(() => new Promise(() => {}));

      render(<Feed />);

      expect(screen.getAllByRole('generic')[0]).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show error message', async () => {
      getFeed.mockRejectedValue(new Error('Network error'));

      render(<Feed />);

      await waitFor(() => {
        expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
      });
    });
  });

  describe('empty state', () => {
    it('should show empty message when no activities', async () => {
      getFeed.mockResolvedValue({
        activities: [],
        pagination: { total: 0, totalPages: 0 }
      });

      render(<Feed />);

      await waitFor(() => {
        expect(screen.getByText('Aucune activité pour le moment')).toBeInTheDocument();
      });
    });
  });

  describe('with activities', () => {
    it('should render activity cards', async () => {
      const mockActivities = [
        {
          _id: 'activity1',
          type: 'review',
          userId: 'user123',
          createdAt: new Date().toISOString(),
          data: {
            restaurantSlug: 'test-restaurant',
            rating: 4,
            comment: 'Great experience!'
          },
          user: {
            _id: 'user123',
            username: 'testuser',
            profile: {
              firstName: 'Test',
              lastName: 'User',
              avatar: null
            }
          }
        },
        {
          _id: 'activity2',
          type: 'reservation',
          userId: 'user456',
          createdAt: new Date().toISOString(),
          data: {
            restaurantSlug: 'another-restaurant',
            reservationDate: new Date().toISOString(),
            partySize: 2
          },
          user: {
            _id: 'user456',
            username: 'frienduser',
            profile: {
              firstName: 'Friend',
              lastName: 'User',
              avatar: null
            }
          }
        }
      ];

      getFeed.mockResolvedValue({
        activities: mockActivities,
        pagination: { total: 2, totalPages: 1 }
      });

      render(<Feed />);

      await waitFor(() => {
        expect(screen.getByText("Activité de mes amis")).toBeInTheDocument();
        expect(screen.getByText('Great experience!')).toBeInTheDocument();
      });
    });

    it('should show load more button when more pages available', async () => {
      getFeed.mockResolvedValue({
        activities: [{ _id: 'activity1', type: 'review', userId: 'user123' }],
        pagination: { total: 25, totalPages: 2 }
      });

      render(<Feed />);

      await waitFor(() => {
        expect(screen.getByText('Charger plus d\'activités')).toBeInTheDocument();
      });
    });
  });

  describe('showOwnActivities prop', () => {
    it('should call getOwnActivities when showOwnActivities is true', async () => {
      getOwnActivities.mockResolvedValue({
        activities: [],
        pagination: { total: 0, totalPages: 0 }
      });

      render(<Feed showOwnActivities={true} />);

      await waitFor(() => {
        expect(getOwnActivities).toHaveBeenCalled();
      });
    });

    it('should call getFeed when showOwnActivities is false', async () => {
      getFeed.mockResolvedValue({
        activities: [],
        pagination: { total: 0, totalPages: 0 }
      });

      render(<Feed showOwnActivities={false} />);

      await waitFor(() => {
        expect(getFeed).toHaveBeenCalled();
      });
    });
  });
});