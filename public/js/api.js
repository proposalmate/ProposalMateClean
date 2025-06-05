/**
 * ProposalMate API Client
 * Centralized API handler for all frontend-backend communication
 */

class API {
  constructor() {
    this.baseUrl = '/api/v1';
    this.token = localStorage.getItem('token');
  }

  /**
   * Set authentication token
   * @param {string} token - JWT token
   */
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  /**
   * Get authentication headers
   * @returns {Object} Headers object with Authorization if token exists
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Handle API response
   * @param {Response} response - Fetch API response
   * @returns {Promise} Promise resolving to JSON response or error
   */
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      const error = data.error || 'Something went wrong';
      throw new Error(error);
    }
    
    return data;
  }

  /**
   * Make API request
   * @param {string} endpoint - API endpoint
   * @param {string} method - HTTP method
   * @param {Object} body - Request body
   * @returns {Promise} Promise resolving to API response
   */
  async request(endpoint, method = 'GET', body = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: this.getHeaders()
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    const data = await this.request('/auth/login', 'POST', { email, password });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async register(name, email, password) {
    const data = await this.request('/auth/register', 'POST', { name, email, password });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async logout() {
    this.clearToken();
    return { success: true };
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  async forgotPassword(email) {
    return await this.request('/auth/forgot-password', 'POST', { email });
  }

  async resetPassword(token, password) {
    return await this.request('/auth/reset-password', 'POST', { token, password });
  }

  // Templates endpoints
  async getTemplates() {
    try {
      return await this.request('/templates');
    } catch (error) {
      console.error('Error fetching templates:', error);
      // Return a structure that matches what the templates-preview.js expects
      return {
        templates: [
          {
            id: 'photography',
            name: 'Photography Proposal',
            description: 'Perfect for wedding and event photographers',
            image: '/images/templates/photography-template.jpg',
            category: 'Photography'
          },
          {
            id: 'venue',
            name: 'Venue Proposal',
            description: 'Ideal for venue and location services',
            image: '/images/templates/venue-template.jpg',
            category: 'Venues'
          },
          {
            id: 'planner',
            name: 'Event Planner Proposal',
            description: 'Comprehensive template for event planners',
            image: '/images/templates/planner-template.jpg',
            category: 'Planning'
          },
          {
            id: 'catering',
            name: 'Catering Proposal',
            description: 'Detailed template for catering services',
            image: '/images/templates/catering-template.jpg',
            category: 'Catering'
          }
        ]
      };
    }
  }

  // Proposal endpoints
  async getProposals() {
    return await this.request('/proposals');
  }

  async getProposal(id) {
    return await this.request(`/proposals/${id}`);
  }

  async createProposal(proposalData) {
    return await this.request('/proposals', 'POST', proposalData);
  }

  async updateProposal(id, proposalData) {
    return await this.request(`/proposals/${id}`, 'PUT', proposalData);
  }

  async deleteProposal(id) {
    return await this.request(`/proposals/${id}`, 'DELETE');
  }

  async generateProposalPDF(id) {
    return await this.request(`/proposals/${id}/pdf`);
  }

  // Client endpoints
  async getClients() {
    return await this.request('/clients');
  }

  async getClient(id) {
    return await this.request(`/clients/${id}`);
  }

  async createClient(clientData) {
    return await this.request('/clients', 'POST', clientData);
  }

  async updateClient(id, clientData) {
    return await this.request(`/clients/${id}`, 'PUT', clientData);
  }

  async deleteClient(id) {
    return await this.request(`/clients/${id}`, 'DELETE');
  }

  // Subscription endpoints
  async getSubscription() {
    return await this.request('/stripe/subscription');
  }

  async getCheckoutSession() {
    return await this.request('/stripe/checkout-session');
  }

  async cancelSubscription() {
    return await this.request('/stripe/subscription', 'DELETE');
  }

  async resumeSubscription() {
    return await this.request('/stripe/subscription/resume', 'POST');
  }

  async updatePaymentMethod() {
    return await this.request('/stripe/update-payment-method', 'POST');
  }
}

// Create and export API instance
const api = new API();

// For compatibility with older code that might use getApiClient()
function getApiClient() {
  return api;
}
