const friendsService = require('../../src/services/friendsService');
const friendsRepository = require('../../src/repositories/friendsRepository');
const authRepository = require('../../src/repositories/authRepository');

// Mock repositories
jest.mock('../../src/repositories/friendsRepository');
jest.mock('../../src/repositories/authRepository');

describe('friendsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendFriendRequest', () => {
    it('should send friend request successfully', async () => {
      const userId = 'user123';
      const friendUsername = 'friend456';

      const mockFriendUser = {
        _id: 'friend456',
        username: friendUsername,
        email: 'friend@example.com'
      };

      authRepository.findByUsername.mockResolvedValue(mockFriendUser);
      friendsRepository.findFriendship.mockResolvedValue(null);
      friendsRepository.createFriendship.mockResolvedValue({
        _id: 'friendship123',
        requesterId: userId,
        receiverId: mockFriendUser._id,
        status: 'pending'
      });

      const result = await friendsService.sendFriendRequest(userId, friendUsername);

      expect(result.status).toBe('pending');
      expect(result.requesterId).toBe(userId);
      expect(result.receiverId).toBe(mockFriendUser._id);
    });

    it('should throw error if user not found', async () => {
      const userId = 'user123';
      const friendUsername = 'nonexistent';

      authRepository.findByUsername.mockResolvedValue(null);

      await expect(friendsService.sendFriendRequest(userId, friendUsername))
        .rejects
        .toThrow('User not found');
    });

    it('should throw error if trying to add yourself', async () => {
      const userId = 'user123';
      const friendUsername = 'myself';

      const mockSelf = {
        _id: 'user123',
        username: friendUsername
      };

      authRepository.findByUsername.mockResolvedValue(mockSelf);

      await expect(friendsService.sendFriendRequest(userId, friendUsername))
        .rejects
        .toThrow('Cannot add yourself as a friend');
    });

    it('should throw error if already friends', async () => {
      const userId = 'user123';
      const friendUsername = 'existingfriend';

      const mockFriendUser = {
        _id: 'friend456',
        username: friendUsername
      };

      authRepository.findByUsername.mockResolvedValue(mockFriendUser);
      friendsRepository.findFriendship.mockResolvedValue({
        _id: 'existing123',
        status: 'accepted'
      });

      await expect(friendsService.sendFriendRequest(userId, friendUsername))
        .rejects
        .toThrow('Already friends with this user');
    });
  });

  describe('acceptFriendRequest', () => {
    it('should accept friend request successfully', async () => {
      const userId = 'user123';
      const friendUserId = 'friend456';

      const mockFriendship = {
        _id: 'friendship123',
        requesterId: friendUserId,
        receiverId: userId,
        status: 'pending'
      };

      friendsRepository.findFriendship.mockResolvedValue(mockFriendship);
      friendsRepository.updateFriendshipStatus.mockResolvedValue({
        ...mockFriendship,
        status: 'accepted',
        updatedAt: new Date()
      });

      const result = await friendsService.acceptFriendRequest(userId, friendUserId);

      expect(result.status).toBe('accepted');
    });

    it('should throw error if not the receiver', async () => {
      const userId = 'user123';
      const friendUserId = 'friend456';

      const mockFriendship = {
        _id: 'friendship123',
        requesterId: userId, // User is the requester, not receiver
        receiverId: 'someone_else',
        status: 'pending'
      };

      friendsRepository.findFriendship.mockResolvedValue(mockFriendship);

      await expect(friendsService.acceptFriendRequest(userId, friendUserId))
        .rejects
        .toThrow('Not authorized to accept this request');
    });
  });

  describe('getFriends', () => {
    it('should get friends list successfully', async () => {
      const userId = 'user123';

      const mockFriendships = [
        {
          _id: 'friendship1',
          requesterId: userId,
          receiverId: 'friend456',
          status: 'accepted'
        },
        {
          _id: 'friendship2',
          requesterId: 'friend789',
          receiverId: userId,
          status: 'accepted'
        }
      ];

      const mockFriends = [
        {
          _id: 'friend456',
          username: 'friend1',
          email: 'friend1@example.com',
          passwordHash: 'hash1'
        },
        {
          _id: 'friend789',
          username: 'friend2',
          email: 'friend2@example.com',
          passwordHash: 'hash2'
        }
      ];

      friendsRepository.findAcceptedFriendships.mockResolvedValue(mockFriendships);
      friendsRepository.getUsersByIds.mockResolvedValue(mockFriends);

      const result = await friendsService.getFriends(userId);

      expect(result).toHaveLength(2);
      expect(result[0].passwordHash).toBeUndefined();
      expect(result[1].passwordHash).toBeUndefined();
    });

    it('should return empty array if no friends', async () => {
      const userId = 'user123';

      friendsRepository.findAcceptedFriendships.mockResolvedValue([]);

      const result = await friendsService.getFriends(userId);

      expect(result).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });
  });
});