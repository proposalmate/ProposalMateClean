// API utility functions for ProposalMate
// This file provides consistent token handling for all API requests

// Base API URL - can be configured for different environments
const API_BASE_URL = '/api/v1';

// Get authentication token from localStorage
function getAuthToken() {
  return localStorage.getItem('token');
}

// Check if user is authenticated
function isAuthenticated() {
  return !!getAuthToken();
}

// Redirect to login if not authenticated
function requireAuth() {
  if (!isAuthenticated()) {
    console.log('Authentication required, redirecting to login');
    window.location.href = '/pages/login.html';
    return false;
  }
  return true;
}

// Standard headers for API requests
function getHeaders(includeAuth = true) {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
}

// Generic API request function with proper error handling
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default to including auth headers unless explicitly disabled
  const includeAuth = options.includeAuth !== false;
  
  const fetchOptions = {
    method: options.method || 'GET',
    headers: getHeaders(includeAuth),
    ...options
  };
  
  // If body is provided and is an object, stringify it
  if (options.body && typeof options.body === 'object') {
    fetchOptions.body = JSON.stringify(options.body);
  }
  
  try {
    const response = await fetch(url, fetchOptions);
    
    // Handle authentication errors
    if (response.status === 401) {
      console.error('Authentication error:', url);
      
      // If token expired or invalid, redirect to login
      if (includeAuth && isAuthenticated()) {
        localStorage.removeItem('token');
        window.location.href = '/pages/login.html?error=session_expired';
        return null;
      }
    }
    
    // Handle other error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }
    
    // Parse and return JSON response
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Convenience methods for common API operations
const api = {
  // Auth endpoints
  auth: {
    login: (email, password) => 
      apiRequest('/auth/login', { 
        method: 'POST', 
        body: { email, password },
        includeAuth: false 
      }),
    
    register: (userData) => 
      apiRequest('/auth/register', { 
        method: 'POST', 
        body: userData,
        includeAuth: false 
      }),
    
    getCurrentUser: () => 
      apiRequest('/auth/me'),
    
    updateProfile: (userData) => 
      apiRequest('/auth/updatedetails', { 
        method: 'PUT', 
        body: userData 
      }),
    
    updatePassword: (currentPassword, newPassword) => 
      apiRequest('/auth/updatepassword', { 
        method: 'PUT', 
        body: { currentPassword, newPassword } 
      }),
    
    forgotPassword: (email) => 
      apiRequest('/auth/forgotpassword', { 
        method: 'POST', 
        body: { email },
        includeAuth: false 
      }),
    
    resetPassword: (token, password) => 
      apiRequest(`/auth/resetpassword/${token}`, { 
        method: 'PUT', 
        body: { password },
        includeAuth: false 
      })
  },
  
  // Proposal endpoints
  proposals: {
    getAll: () => 
      apiRequest('/proposals'),
    
    getById: (id) => 
      apiRequest(`/proposals/${id}`),
    
    create: (proposalData) => 
      apiRequest('/proposals', { 
        method: 'POST', 
        body: proposalData 
      }),
    
    update: (id, proposalData) => 
      apiRequest(`/proposals/${id}`, { 
        method: 'PUT', 
        body: proposalData 
      }),
    
    delete: (id) => 
      apiRequest(`/proposals/${id}`, { 
        method: 'DELETE' 
      })
  }
};

// Export the API utility
window.ProposalMateAPI = api;
window.requireAuth = requireAuth;
