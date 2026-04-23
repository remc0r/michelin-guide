import {
  register,
  login,
  getCurrentUser,
  logout
} from './auth';

// Mock fetch
global.fetch = jest.fn();

describe('auth API', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      };

      const mockResponse = {
        ok: true,
        json: async () => ({
          user: {
            _id: 'user123',
            ...userData,
            profile: userData
          },
          token: 'mock_jwt_token'
        })
      };

      fetch.mockResolvedValue(mockResponse);

      const result = await register(userData);

      expect(result.user).toBeDefined();
      expect(result.user.username).toBe('newuser');
      expect(result.token).toBe('mock_jwt_token');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/register'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(userData)
        })
      );
    });

    it('should throw error on registration failure', async () => {
      const userData = {
        username: 'newuser',
        email: 'existing@example.com',
        password: 'password123'
      };

      const mockResponse = {
        ok: false,
        json: async () => ({
          error: 'User with this email already exists'
        })
      };

      fetch.mockResolvedValue(mockResponse);

      await expect(register(userData)).rejects.toThrow('User with this email already exists');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResponse = {
        ok: true,
        json: async () => ({
          user: {
            _id: 'user123',
            username: 'testuser',
            email: credentials.email,
            profile: {
              firstName: 'Test',
              lastName: 'User'
            }
          },
          token: 'mock_jwt_token'
        })
      };

      fetch.mockResolvedValue(mockResponse);

      const result = await login(credentials.email, credentials.password);

      expect(result.user).toBeDefined();
      expect(result.token).toBe('mock_jwt_token');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(credentials)
        })
      );
    });

    it('should throw error on invalid credentials', async () => {
      const credentials = {
        email: 'wrong@example.com',
        password: 'wrongpassword'
      };

      const mockResponse = {
        ok: false,
        json: async () => ({
          error: 'Invalid email or password'
        })
      };

      fetch.mockResolvedValue(mockResponse);

      await expect(login(credentials.email, credentials.password))
        .rejects.toThrow('Invalid email or password');
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user with valid token', async () => {
      const token = 'valid_token';

      const mockResponse = {
        ok: true,
        json: async () => ({
          _id: 'user123',
          username: 'testuser',
          email: 'test@example.com'
        })
      };

      fetch.mockResolvedValue(mockResponse);

      const result = await getCurrentUser(token);

      expect(result.username).toBe('testuser');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/me'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${token}`
          })
        })
      );
    });

    it('should throw error without token', async () => {
      await expect(getCurrentUser(null)).rejects.toThrow('Failed to get user info');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const result = await logout();

      expect(result).toEqual({
        message: 'Logged out successfully'
      });
    });
  });
});