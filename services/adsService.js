const MetaApiService = require('./metaApiService');
const logger = require('../utils/logger');

class AdsService extends MetaApiService {
  constructor() {
    super(process.env.META_ACCESS_TOKEN);
    this.adsAccountId = process.env.META_ACCOUNT_ID;
  }

  // Get ad account information
  async getAdAccountInfo(accountId = this.adsAccountId) {
    try {
      return await this.get(`/act_${accountId}`, {
        fields: 'id,name,account_status,account_id,timezone_name,currency,timezone_offset_hours_utc,business,owner,capabilities,disable_reason,amount_spent,balance,spend_cap,funding_source_details'
      });
    } catch (error) {
      logger.error('Failed to get ad account info:', error.message);
      throw error;
    }
  }

  // Get campaigns
  async getCampaigns(accountId = this.adsAccountId, limit = 25) {
    try {
      return await this.get(`/act_${accountId}/campaigns`, {
        fields: 'id,name,objective,status,created_time,updated_time,start_time,stop_time,special_ad_categories,spend_cap,budget_remaining,insights{impressions,reach,clicks,spend,ctr,cpc,cpm}',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get campaigns:', error.message);
      throw error;
    }
  }

  // Get ad sets
  async getAdSets(accountId = this.adsAccountId, limit = 25) {
    try {
      return await this.get(`/act_${accountId}/adsets`, {
        fields: 'id,name,campaign_id,status,created_time,updated_time,start_time,end_time,targeting,optimization_goal,bid_amount,budget_remaining,insights{impressions,reach,clicks,spend,ctr,cpc,cpm}',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get ad sets:', error.message);
      throw error;
    }
  }

  // Get ads
  async getAds(accountId = this.adsAccountId, limit = 25) {
    try {
      return await this.get(`/act_${accountId}/ads`, {
        fields: 'id,name,adset_id,campaign_id,status,created_time,updated_time,creative{id,title,body,image_url,video_id},insights{impressions,reach,clicks,spend,ctr,cpc,cpm}',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get ads:', error.message);
      throw error;
    }
  }

  // Get ad insights
  async getAdInsights(accountId = this.adsAccountId, level = 'ad', breakdowns = [], timeRange = null, limit = 25) {
    try {
      const params = {
        level: level,
        fields: 'impressions,reach,clicks,spend,ctr,cpc,cpm,frequency,unique_clicks,unique_ctr,unique_link_clicks,unique_link_clicks_ctr,actions,action_values,cost_per_action_type,cost_per_unique_action_type'
      };

      if (breakdowns.length > 0) {
        params.breakdowns = breakdowns.join(',');
      }

      if (timeRange) {
        params.time_range = JSON.stringify(timeRange);
      }

      params.limit = limit;

      return await this.get(`/act_${accountId}/insights`, params);
    } catch (error) {
      logger.error('Failed to get ad insights:', error.message);
      throw error;
    }
  }

  // Get campaign insights
  async getCampaignInsights(campaignId, timeRange = null, breakdowns = []) {
    try {
      const params = {
        fields: 'impressions,reach,clicks,spend,ctr,cpc,cpm,frequency,unique_clicks,unique_ctr,actions,action_values,cost_per_action_type'
      };

      if (breakdowns.length > 0) {
        params.breakdowns = breakdowns.join(',');
      }

      if (timeRange) {
        params.time_range = JSON.stringify(timeRange);
      }

      return await this.get(`/${campaignId}/insights`, params);
    } catch (error) {
      logger.error('Failed to get campaign insights:', error.message);
      throw error;
    }
  }

  // Get ad set insights
  async getAdSetInsights(adSetId, timeRange = null, breakdowns = []) {
    try {
      const params = {
        fields: 'impressions,reach,clicks,spend,ctr,cpc,cpm,frequency,unique_clicks,unique_ctr,actions,action_values,cost_per_action_type'
      };

      if (breakdowns.length > 0) {
        params.breakdowns = breakdowns.join(',');
      }

      if (timeRange) {
        params.time_range = JSON.stringify(timeRange);
      }

      return await this.get(`/${adSetId}/insights`, params);
    } catch (error) {
      logger.error('Failed to get ad set insights:', error.message);
      throw error;
    }
  }

  // Get creatives
  async getCreatives(accountId = this.adsAccountId, limit = 25) {
    try {
      return await this.get(`/act_${accountId}/adcreatives`, {
        fields: 'id,name,title,body,image_url,video_id,object_story_spec,thumbnail_url,url_tags,effective_object_story_type,created_time,updated_time',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get creatives:', error.message);
      throw error;
    }
  }

  // Get audiences
  async getAudiences(accountId = this.adsAccountId, limit = 25) {
    try {
      return await this.get(`/act_${accountId}/customaudiences`, {
        fields: 'id,name,description,subtype,approximate_count,data_source,delivery_status,created_time,updated_time',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get audiences:', error.message);
      throw error;
    }
  }

  // Get pixels
  async getPixels(accountId = this.adsAccountId, limit = 25) {
    try {
      return await this.get(`/act_${accountId}/adaccount_pixels`, {
        fields: 'id,name,code,last_fired_time,created_time,updated_time',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get pixels:', error.message);
      throw error;
    }
  }

  // Get pixel events
  async getPixelEvents(pixelId, limit = 25) {
    try {
      return await this.get(`/${pixelId}/events`, {
        fields: 'id,event_name,event_time,user_data,event_source_url,custom_data',
        limit: limit
      });
    } catch (error) {
      logger.error('Failed to get pixel events:', error.message);
      throw error;
    }
  }

  // Get ad account spend
  async getAccountSpend(accountId = this.adsAccountId, timeRange = null) {
    try {
      const params = {
        fields: 'spend,impressions,reach,clicks,ctr,cpc,cpm'
      };

      if (timeRange) {
        params.time_range = JSON.stringify(timeRange);
      }

      return await this.get(`/act_${accountId}/insights`, params);
    } catch (error) {
      logger.error('Failed to get account spend:', error.message);
      throw error;
    }
  }

  // Get delivery estimates
  async getDeliveryEstimates(accountId = this.adsAccountId, targetingSpec, optimizationGoal, billingEvent, bidAmount) {
    try {
      const data = {
        targeting_spec: targetingSpec,
        optimization_goal: optimizationGoal,
        billing_event: billingEvent,
        bid_amount: bidAmount
      };

      return await this.post(`/act_${accountId}/delivery_estimate`, data);
    } catch (error) {
      logger.error('Failed to get delivery estimates:', error.message);
      throw error;
    }
  }

  // Get reach estimates
  async getReachEstimates(accountId = this.adsAccountId, targetingSpec, optimizationGoal) {
    try {
      const data = {
        targeting_spec: targetingSpec,
        optimization_goal: optimizationGoal
      };

      return await this.post(`/act_${accountId}/reach_estimate`, data);
    } catch (error) {
      logger.error('Failed to get reach estimates:', error.message);
      throw error;
    }
  }

  // Get ad account permissions
  async getAccountPermissions(accountId = this.adsAccountId) {
    try {
      return await this.get(`/act_${accountId}/users`, {
        fields: 'id,name,role,permissions'
      });
    } catch (error) {
      logger.error('Failed to get account permissions:', error.message);
      throw error;
    }
  }

  // Get ad account billing
  async getAccountBilling(accountId = this.adsAccountId) {
    try {
      return await this.get(`/act_${accountId}/billing`, {
        fields: 'id,account_id,amount_spent,balance,currency,payment_method,time_created,time_updated'
      });
    } catch (error) {
      logger.error('Failed to get account billing:', error.message);
      throw error;
    }
  }
}

module.exports = AdsService; 