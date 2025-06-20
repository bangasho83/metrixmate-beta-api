const MetaApiService = require('./metaApiService');
const logger = require('../utils/logger');

class FacebookService extends MetaApiService {
  constructor() {
    super();
    this.pageId = process.env.META_ACCOUNT_ID;
  }

  // Get page information
  async getPageInfo(pageId = this.pageId) {
    try {
      return await this.get(`/${pageId}`, {
        fields: 'id,name,username,fan_count,followers_count,verification_status,category,category_list,phone,website,location,hours,price_range,rating_count,overall_star_rating,cover,picture'
      });
    } catch (error) {
      logger.error('Failed to get page info:', error.message);
      throw error;
    }
  }

  // Get page posts
  async getPagePosts(pageId = this.pageId, limit = 25) {
    try {
      return await this.get(`/${pageId}/posts`, {
        fields: 'id,message,created_time,updated_time,type,permalink_url,full_picture,picture,source,status_type,shares,comments.summary(true),reactions.summary(true)',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get page posts:', error.message);
      throw error;
    }
  }

  // Get page insights
  async getPageInsights(pageId = this.pageId, metric = 'page_impressions', period = 'day', since = null, until = null) {
    try {
      const params = {
        metric: metric,
        period: period
      };

      if (since) params.since = since;
      if (until) params.until = until;

      return await this.get(`/${pageId}/insights`, params);
    } catch (error) {
      logger.error('Failed to get page insights:', error.message);
      throw error;
    }
  }

  // Get page followers
  async getPageFollowers(pageId = this.pageId, limit = 100) {
    try {
      return await this.get(`/${pageId}/followers`, {
        fields: 'id,name,picture',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get page followers:', error.message);
      throw error;
    }
  }

  // Get page events
  async getPageEvents(pageId = this.pageId, limit = 25) {
    try {
      return await this.get(`/${pageId}/events`, {
        fields: 'id,name,description,start_time,end_time,place,cover,attending_count,interested_count,declined_count,maybe_count',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get page events:', error.message);
      throw error;
    }
  }

  // Get page photos
  async getPagePhotos(pageId = this.pageId, limit = 25) {
    try {
      return await this.get(`/${pageId}/photos`, {
        fields: 'id,images,name,created_time,comments.summary(true),reactions.summary(true)',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get page photos:', error.message);
      throw error;
    }
  }

  // Get page videos
  async getPageVideos(pageId = this.pageId, limit = 25) {
    try {
      return await this.get(`/${pageId}/videos`, {
        fields: 'id,title,description,created_time,updated_time,length,source,views,comments.summary(true),reactions.summary(true)',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get page videos:', error.message);
      throw error;
    }
  }

  // Get page reviews
  async getPageReviews(pageId = this.pageId, limit = 25) {
    try {
      return await this.get(`/${pageId}/ratings`, {
        fields: 'id,reviewer,rating,review_text,created_time',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get page reviews:', error.message);
      throw error;
    }
  }

  // Get page conversations (messages)
  async getPageConversations(pageId = this.pageId, limit = 25) {
    try {
      return await this.get(`/${pageId}/conversations`, {
        fields: 'id,participants,updated_time,message_count,unread_count',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get page conversations:', error.message);
      throw error;
    }
  }

  // Get page leads
  async getPageLeads(pageId = this.pageId, limit = 25) {
    try {
      return await this.get(`/${pageId}/leads`, {
        fields: 'id,created_time,field_data',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get page leads:', error.message);
      throw error;
    }
  }

  // Get page tabs
  async getPageTabs(pageId = this.pageId) {
    try {
      return await this.get(`/${pageId}/tabs`, {
        fields: 'id,name,link,application'
      });
    } catch (error) {
      logger.error('Failed to get page tabs:', error.message);
      throw error;
    }
  }

  // Get page roles
  async getPageRoles(pageId = this.pageId) {
    try {
      return await this.get(`/${pageId}/roles`, {
        fields: 'id,name,email,role'
      });
    } catch (error) {
      logger.error('Failed to get page roles:', error.message);
      throw error;
    }
  }

  // Get public page posts (basic fields only)
  async getPublicPagePosts(pageId = this.pageId, limit = 25) {
    try {
      return await this.get(`/${pageId}/posts`, {
        fields: 'id,message,created_time,type,permalink_url',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get public page posts:', error.message);
      throw error;
    }
  }
}

module.exports = FacebookService; 