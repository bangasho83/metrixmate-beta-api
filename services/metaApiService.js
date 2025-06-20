const axios = require('axios');
const logger = require('../utils/logger');

class MetaApiService {
  constructor() {
    this.baseUrl = 'https://graph.facebook.com/v18.0';
    this.appId = process.env.META_APP_ID;
    this.appSecret = process.env.META_APP_SECRET;
    this.accessToken = process.env.META_ACCESS_TOKEN;
    
    // Create axios instance with default config
    this.api = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        logger.debug(`Making request to: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        logger.debug(`Response received: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error('Response error:', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url
        });
        return Promise.reject(error);
      }
    );
  }

  // Helper method to build URL with access token
  buildUrl(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.set('access_token', this.accessToken);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value);
      }
    });
    
    return url.toString();
  }

  // Generic GET request method
  async get(endpoint, params = {}) {
    try {
      const url = this.buildUrl(endpoint, params);
      const response = await this.api.get(url);
      return response.data;
    } catch (error) {
      logger.error(`GET request failed for ${endpoint}:`, error.message);
      throw error;
    }
  }

  // Generic POST request method
  async post(endpoint, data = {}, params = {}) {
    try {
      const url = this.buildUrl(endpoint, params);
      const response = await this.api.post(url, data);
      return response.data;
    } catch (error) {
      logger.error(`POST request failed for ${endpoint}:`, error.message);
      throw error;
    }
  }

  // Get app info
  async getAppInfo() {
    return this.get(`/${this.appId}`, {
      fields: 'id,name,description,created_time,updated_time'
    });
  }

  // Get user info
  async getUserInfo(userId = 'me') {
    return this.get(`/${userId}`, {
      fields: 'id,name,email,picture,verified'
    });
  }

  // Get user accounts (pages and apps)
  async getUserAccounts(userId = 'me') {
    return this.get(`/${userId}/accounts`, {
      fields: 'id,name,access_token,category,fan_count,verification_status'
    });
  }

  // Validate access token
  async validateToken(token = this.accessToken) {
    return this.get('/debug_token', {
      input_token: token
    });
  }

  // Get long-lived access token
  async getLongLivedToken(shortLivedToken) {
    return this.get('/oauth/access_token', {
      grant_type: 'fb_exchange_token',
      client_id: this.appId,
      client_secret: this.appSecret,
      fb_exchange_token: shortLivedToken
    });
  }
}

module.exports = MetaApiService; 