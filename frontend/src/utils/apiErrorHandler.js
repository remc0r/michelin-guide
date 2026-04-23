/**
 * API Error Handler - Handles network and HTTP errors gracefully
 */

export class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Handle fetch errors with proper error classification
 */
export const handleFetchError = async (response) => {
  if (!response.ok) {
    let errorMessage = 'Une erreur est survenue';

    try {
      const data = await response.json();
      errorMessage = data.error || data.message || errorMessage;
    } catch (e) {
      // If we can't parse JSON, use status text
      errorMessage = response.statusText || `Erreur ${response.status}`;
    }

    throw new APIError(errorMessage, response.status);
  }

  return response;
};

/**
 * Handle network errors (no internet, blocked requests, etc.)
 */
export const handleNetworkError = (error) => {
  console.error('Network error:', error);

  // Certificate authority errors
  if (error.message && error.message.includes('ERR_CERT_AUTHORITY_INVALID')) {
    throw new APIError('Erreur de sécurité du certificat', null);
  }

  // Client blocked errors
  if (error.message && error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
    throw new APIError('La requête a été bloquée par le navigateur', null);
  }

  // Connection errors
  if (error.message && error.message.includes('ERR_CONNECTION')) {
    throw new APIError('Impossible de se connecter au serveur', null);
  }

  // Timeout errors
  if (error.message && error.message.includes('ERR_TIMED_OUT')) {
    throw new APIError('Le serveur ne répond pas (timeout)', null);
  }

  // Generic error
  throw new APIError(
    error.message || 'Erreur de connexion réseau',
    null
  );
};

/**
 * Safe fetch wrapper that handles all error types
 */
export const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      // Add timeout handling
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    return await handleFetchError(response);
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw handleNetworkError(error);
  }
};

/**
 * Timeout signal implementation
 */
AbortSignal.timeout = (ms) => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
};

/**
 * Check if error is recoverable (can retry)
 */
export const isRecoverableError = (error) => {
  if (error instanceof APIError) {
    // Network errors and server errors are usually recoverable
    return error.status >= 500 || error.status === 0;
  }
  return false;
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyErrorMessage = (error) => {
  if (error instanceof APIError) {
    return error.message;
  }

  // Network errors
  if (error.message) {
    if (error.message.includes('NetworkError')) {
      return 'Erreur de connexion internet. Vérifiez votre connexion.';
    }
    if (error.message.includes('Failed to fetch')) {
      return 'Impossible de contacter le serveur. Réessayez ultérieurement.';
    }
    return error.message;
  }

  return 'Une erreur inattendue est survenue.';
};