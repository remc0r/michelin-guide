const authService = require('../../src/services/authService');
const authRepository = require('../../src/repositories/authRepository');

// Mock the authRepository
jest.mock('../../src/repositories/authRepository');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        profile: {
          firstName: 'Test',
          lastName: 'User'
        }
      };

      authRepository.findByEmail.mockResolvedValue(null);
      authRepository.findByUsername.mockResolvedValue(null);
      authRepository.createUser.mockResolvedValue({
        _id: 'user123',
        ...userData,
        passwordHash: 'hashed_password',
        createdAt: new Date()
      });

      const result = await authService.registerUser(userData);

      expect(result.user).toBeDefined();
      expect(result.user.username).toBe('testuser');
      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBeDefined();
      expect(result.user.passwordHash).toBeUndefined(); // Password hash should not be in response
    });

    it('should throw error if user already exists with email', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      authRepository.findByEmail.mockResolvedValue({ _id: 'existing_user' });

      await expect(authService.registerUser(userData))
        .rejects
        .toThrow('User with this email already exists');
    });

    it('should throw error if username already taken', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      authRepository.findByEmail.mockResolvedValue(null);
      authRepository.findByUsername.mockResolvedValue({ _id: 'existing_user' });

      await expect(authService.registerUser(userData))
        .rejects
        .toThrow('Username already taken');
    });
  });

  describe('loginUser', () => {
    it('should login user successfully with correct credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        email: email,
        passwordHash: 'hashed_password',
        profile: {
          firstName: 'Test',
          lastName: 'User'
        }
      };

      authRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await authService.loginUser(email, password);

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(email);
      expect(result.token).toBeDefined();
      expect(result.user.passwordHash).toBeUndefined();
    });

    it('should throw error with incorrect password', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      const mockUser = {
        _id: 'user123',
        email: email,
        passwordHash: 'hashed_password'
      };

      authRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(authService.loginUser(email, password))
        .rejects
        .toThrow('Invalid email or password');
    });

    it('should throw error if user not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      authRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.loginUser(email, password))
        .rejects
        .toThrow('Invalid email or password');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid JWT token', () => {
      const mockToken = 'valid_jwt_token';
      const mockDecoded = { userId: 'user123', iat: Date.now() };

      // Mock jwt.verify
      jest.spyOn(require('jsonwebtoken'), 'verify').mockReturnValue(mockDecoded);

      const result = authService.verifyToken(mockToken);

      expect(result).toEqual(mockDecoded);
    });

    it('should throw error for invalid token', () => {
      const mockToken = 'invalid_token';

      jest.spyOn(require('jsonwebtoken'), 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => authService.verifyToken(mockToken))
        .toThrow('Invalid or expired token');
    });
  });
});