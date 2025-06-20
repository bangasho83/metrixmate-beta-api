const MetaApiService = require('./metaApiService');
const logger = require('../utils/logger');

class InstagramService extends MetaApiService {
  constructor() {
    super(process.env.META_PAGE_ACCESS_TOKEN);
    this.accountId = process.env.META_ACCOUNT_ID;
  }

  // Get Instagram business account info
  async getBusinessAccountInfo(accountId = this.accountId) {
    try {
      return await this.get(`/${accountId}`, {
        fields: 'id,username,name,profile_picture_url,biography,followers_count,follows_count,media_count,website,verification_status'
      });
    } catch (error) {
      logger.error('Failed to get Instagram business account info:', error.message);
      throw error;
    }
  }

  // Get Instagram media (posts)
  async getMedia(accountId = this.accountId, limit = 25) {
    try {
      return await this.get(`/${accountId}/media`, {
        fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,owner,children{media_url,media_type}',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get Instagram media:', error.message);
      throw error;
    }
  }

  // Get Instagram stories
  async getStories(accountId = this.accountId) {
    try {
      return await this.get(`/${accountId}/stories`, {
        fields: 'id,media_type,media_url,permalink,timestamp,insights.metric(impressions,reach,exits,replies)'
      });
    } catch (error) {
      logger.error('Failed to get Instagram stories:', error.message);
      throw error;
    }
  }

  // Get Instagram insights
  async getInsights(accountId = this.accountId, metric = 'impressions', period = 'day', since = null, until = null) {
    try {
      const params = {
        metric: metric,
        period: period
      };

      if (since) params.since = since;
      if (until) params.until = until;

      return await this.get(`/${accountId}/insights`, params);
    } catch (error) {
      logger.error('Failed to get Instagram insights:', error.message);
      throw error;
    }
  }

  // Get media insights
  async getMediaInsights(mediaId, metric = 'impressions,reach,engagement,saved') {
    try {
      return await this.get(`/${mediaId}/insights`, {
        metric: metric
      });
    } catch (error) {
      logger.error('Failed to get media insights:', error.message);
      throw error;
    }
  }

  // Get Instagram comments
  async getComments(mediaId, limit = 25) {
    try {
      return await this.get(`/${mediaId}/comments`, {
        fields: 'id,text,timestamp,username,like_count',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get Instagram comments:', error.message);
      throw error;
    }
  }

  // Get Instagram mentions
  async getMentions(accountId = this.accountId, limit = 25) {
    try {
      return await this.get(`/${accountId}/tags`, {
        fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get Instagram mentions:', error.message);
      throw error;
    }
  }

  // Get Instagram hashtags
  async getHashtagInfo(hashtag) {
    try {
      return await this.get(`/ig_hashtag_search`, {
        user_id: this.accountId,
        q: hashtag
      });
    } catch (error) {
      logger.error('Failed to get Instagram hashtag info:', error.message);
      throw error;
    }
  }

  // Get top media for hashtag
  async getTopMediaForHashtag(hashtagId, limit = 25) {
    try {
      return await this.get(`/${hashtagId}/top_media`, {
        user_id: this.accountId,
        fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get top media for hashtag:', error.message);
      throw error;
    }
  }

  // Get recent media for hashtag
  async getRecentMediaForHashtag(hashtagId, limit = 25) {
    try {
      return await this.get(`/${hashtagId}/recent_media`, {
        user_id: this.accountId,
        fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get recent media for hashtag:', error.message);
      throw error;
    }
  }

  // Get Instagram live media
  async getLiveMedia(accountId = this.accountId) {
    try {
      return await this.get(`/${accountId}/media`, {
        fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count,insights.metric(impressions,reach,engagement,saved)',
        media_type: 'LIVE'
      });
    } catch (error) {
      logger.error('Failed to get Instagram live media:', error.message);
      throw error;
    }
  }

  // Get Instagram reels
  async getReels(accountId = this.accountId, limit = 25) {
    try {
      return await this.get(`/${accountId}/media`, {
        fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,insights.metric(impressions,reach,engagement,saved)',
        media_type: 'REELS',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get Instagram reels:', error.message);
      throw error;
    }
  }

  // Get Instagram carousel albums
  async getCarouselAlbums(accountId = this.accountId, limit = 25) {
    try {
      return await this.get(`/${accountId}/media`, {
        fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count,children{media_url,media_type}',
        media_type: 'CAROUSEL_ALBUM',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get Instagram carousel albums:', error.message);
      throw error;
    }
  }

  // Get Instagram followers
  async getFollowers(accountId = this.accountId, limit = 100) {
    try {
      return await this.get(`/${accountId}/followers`, {
        fields: 'id,username,profile_picture_url',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get Instagram followers:', error.message);
      throw error;
    }
  }

  // Get Instagram following
  async getFollowing(accountId = this.accountId, limit = 100) {
    try {
      return await this.get(`/${accountId}/follows`, {
        fields: 'id,username,profile_picture_url',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get Instagram following:', error.message);
      throw error;
    }
  }
}

module.exports = InstagramService; 