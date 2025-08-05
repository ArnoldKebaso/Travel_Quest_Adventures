const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/dev';

// Helper function to make API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('id_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
}

// Authentication API
export const auth = {
  async signUp(email: string, password: string, name: string) {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },
};

// Destinations API
export const destinations = {
  async getAll() {
    const data = await apiRequest('/destinations');
    return data.destinations || [];
  },

  async getById(id: string) {
    const data = await apiRequest(`/destinations/${id}`);
    return data.destination;
  },

  async getComments(destinationId: string) {
    const data = await apiRequest(`/destinations/${destinationId}/comments`);
    return data.comments || [];
  },

  async addComment(destinationId: string, comment: string, rating?: number) {
    const data = await apiRequest(`/destinations/${destinationId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment, rating }),
    });
    return data.comment;
  },

  async book(destinationId: string, details: { checkIn: string; checkOut: string; guests: string }) {
    return apiRequest(`/destinations/${destinationId}/book`, {
      method: 'POST',
      body: JSON.stringify(details),
    });
  },
};

// User API
export const user = {
  async getProfile() {
    const data = await apiRequest('/user/profile');
    return data.profile;
  },

  async getSavedDestinations() {
    const data = await apiRequest('/user/saved');
    return data.saved || [];
  },

  async saveDestination(destinationId: string) {
    const data = await apiRequest(`/user/saved/${destinationId}`, {
      method: 'POST',
    });
    return data.saved || [];
  },

  async unsaveDestination(destinationId: string) {
    const data = await apiRequest(`/user/saved/${destinationId}`, {
      method: 'DELETE',
    });
    return data.saved || [];
  },
};

// Initialize sample data (for demo purposes)
export const initializeData = async () => {
  return apiRequest('/init-data', { method: 'POST' });
};