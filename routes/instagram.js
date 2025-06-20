const express = require('express');
const Joi = require('joi');
const InstagramService = require('../services/instagramService');
const logger = require('../utils/logger');

const router = express.Router();
const instagramService = new InstagramService();

// Validation schemas
const accountIdSchema = Joi.object({
  accountId: Joi.string().required()
});

const limitSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(25)
});

const insightsSchema = Joi.object({
  metric: Joi.string().valid('impressions', 'reach', 'profile_views', 'follower_count', 'email_contacts', 'get_directions_clicks', 'phone_call_clicks', 'text_message_clicks', 'website_clicks').default('impressions'),
  period: Joi.string().valid('day', 'week', 'month', 'year', 'lifetime').default('day'),
  since: Joi.string().isoDate(),
  until: Joi.string().isoDate()
});

const mediaInsightsSchema = Joi.object({
  metric: Joi.string().valid('impressions', 'reach', 'engagement', 'saved', 'video_views', 'exits', 'replies').default('impressions,reach,engagement,saved')
});

// Get Instagram business account info
router.get('/account/:accountId?', async (req, res, next) => {
  try {
    const { error, value } = accountIdSchema.validate({ accountId: req.params.accountId });
    if (error) {
      return res.status(400).json({ error: 'Validation error', details: error.details });
    }

    const accountId = value.accountId || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
    const accountInfo = await instagramService.getBusinessAccountInfo(accountId);
    
    res.json({
      success: true,
      data: accountInfo
    });
  } catch (error) {
    next(error);
  }
});

// Get Instagram media (posts)
router.get('/account/:accountId/media', async (req, res, next) => {
  try {
    const { error: accountError, value: accountValue } = accountIdSchema.validate({ accountId: req.params.accountId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (accountError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(accountError?.details || []), ...(limitError?.details || [])]
      });
    }

    const media = await instagramService.getMedia(accountValue.accountId, limitValue.limit);
    
    res.json({
      success: true,
      data: media
    });
  } catch (error) {
    next(error);
  }
});

// Get Instagram stories
router.get('/account/:accountId/stories', async (req, res, next) => {
  try {
    const { error, value } = accountIdSchema.validate({ accountId: req.params.accountId });
    if (error) {
      return res.status(400).json({ error: 'Validation error', details: error.details });
    }

    const stories = await instagramService.getStories(value.accountId);
    
    res.json({
      success: true,
      data: stories
    });
  } catch (error) {
    next(error);
  }
});

// Get Instagram insights
router.get('/account/:accountId/insights', async (req, res, next) => {
  try {
    const { error: accountError, value: accountValue } = accountIdSchema.validate({ accountId: req.params.accountId });
    const { error: insightsError, value: insightsValue } = insightsSchema.validate({
      metric: req.query.metric,
      period: req.query.period,
      since: req.query.since,
      until: req.query.until
    });
    
    if (accountError || insightsError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(accountError?.details || []), ...(insightsError?.details || [])]
      });
    }

    const insights = await instagramService.getInsights(
      accountValue.accountId,
      insightsValue.metric,
      insightsValue.period,
      insightsValue.since,
      insightsValue.until
    );
    
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    next(error);
  }
});

// Get media insights
router.get('/media/:mediaId/insights', async (req, res, next) => {
  try {
    const { error: mediaError, value: mediaValue } = Joi.object({
      mediaId: Joi.string().required()
    }).validate({ mediaId: req.params.mediaId });
    
    const { error: insightsError, value: insightsValue } = mediaInsightsSchema.validate({
      metric: req.query.metric
    });
    
    if (mediaError || insightsError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(mediaError?.details || []), ...(insightsError?.details || [])]
      });
    }

    const insights = await instagramService.getMediaInsights(mediaValue.mediaId, insightsValue.metric);
    
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    next(error);
  }
});

// Get Instagram comments
router.get('/media/:mediaId/comments', async (req, res, next) => {
  try {
    const { error: mediaError, value: mediaValue } = Joi.object({
      mediaId: Joi.string().required()
    }).validate({ mediaId: req.params.mediaId });
    
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (mediaError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(mediaError?.details || []), ...(limitError?.details || [])]
      });
    }

    const comments = await instagramService.getComments(mediaValue.mediaId, limitValue.limit);
    
    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    next(error);
  }
});

// Get Instagram mentions
router.get('/account/:accountId/mentions', async (req, res, next) => {
  try {
    const { error: accountError, value: accountValue } = accountIdSchema.validate({ accountId: req.params.accountId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (accountError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(accountError?.details || []), ...(limitError?.details || [])]
      });
    }

    const mentions = await instagramService.getMentions(accountValue.accountId, limitValue.limit);
    
    res.json({
      success: true,
      data: mentions
    });
  } catch (error) {
    next(error);
  }
});

// Get Instagram hashtag info
router.get('/hashtag/search', async (req, res, next) => {
  try {
    const { error, value } = Joi.object({
      hashtag: Joi.string().required().min(1)
    }).validate({ hashtag: req.query.hashtag });
    
    if (error) {
      return res.status(400).json({ error: 'Validation error', details: error.details });
    }

    const hashtagInfo = await instagramService.getHashtagInfo(value.hashtag);
    
    res.json({
      success: true,
      data: hashtagInfo
    });
  } catch (error) {
    next(error);
  }
});

// Get top media for hashtag
router.get('/hashtag/:hashtagId/top-media', async (req, res, next) => {
  try {
    const { error: hashtagError, value: hashtagValue } = Joi.object({
      hashtagId: Joi.string().required()
    }).validate({ hashtagId: req.params.hashtagId });
    
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (hashtagError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(hashtagError?.details || []), ...(limitError?.details || [])]
      });
    }

    const topMedia = await instagramService.getTopMediaForHashtag(hashtagValue.hashtagId, limitValue.limit);
    
    res.json({
      success: true,
      data: topMedia
    });
  } catch (error) {
    next(error);
  }
});

// Get recent media for hashtag
router.get('/hashtag/:hashtagId/recent-media', async (req, res, next) => {
  try {
    const { error: hashtagError, value: hashtagValue } = Joi.object({
      hashtagId: Joi.string().required()
    }).validate({ hashtagId: req.params.hashtagId });
    
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (hashtagError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(hashtagError?.details || []), ...(limitError?.details || [])]
      });
    }

    const recentMedia = await instagramService.getRecentMediaForHashtag(hashtagValue.hashtagId, limitValue.limit);
    
    res.json({
      success: true,
      data: recentMedia
    });
  } catch (error) {
    next(error);
  }
});

// Get Instagram live media
router.get('/account/:accountId/live-media', async (req, res, next) => {
  try {
    const { error, value } = accountIdSchema.validate({ accountId: req.params.accountId });
    if (error) {
      return res.status(400).json({ error: 'Validation error', details: error.details });
    }

    const liveMedia = await instagramService.getLiveMedia(value.accountId);
    
    res.json({
      success: true,
      data: liveMedia
    });
  } catch (error) {
    next(error);
  }
});

// Get Instagram reels
router.get('/account/:accountId/reels', async (req, res, next) => {
  try {
    const { error: accountError, value: accountValue } = accountIdSchema.validate({ accountId: req.params.accountId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (accountError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(accountError?.details || []), ...(limitError?.details || [])]
      });
    }

    const reels = await instagramService.getReels(accountValue.accountId, limitValue.limit);
    
    res.json({
      success: true,
      data: reels
    });
  } catch (error) {
    next(error);
  }
});

// Get Instagram carousel albums
router.get('/account/:accountId/carousels', async (req, res, next) => {
  try {
    const { error: accountError, value: accountValue } = accountIdSchema.validate({ accountId: req.params.accountId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (accountError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(accountError?.details || []), ...(limitError?.details || [])]
      });
    }

    const carousels = await instagramService.getCarouselAlbums(accountValue.accountId, limitValue.limit);
    
    res.json({
      success: true,
      data: carousels
    });
  } catch (error) {
    next(error);
  }
});

// Get Instagram followers
router.get('/account/:accountId/followers', async (req, res, next) => {
  try {
    const { error: accountError, value: accountValue } = accountIdSchema.validate({ accountId: req.params.accountId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (accountError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(accountError?.details || []), ...(limitError?.details || [])]
      });
    }

    const followers = await instagramService.getFollowers(accountValue.accountId, limitValue.limit);
    
    res.json({
      success: true,
      data: followers
    });
  } catch (error) {
    next(error);
  }
});

// Get Instagram following
router.get('/account/:accountId/following', async (req, res, next) => {
  try {
    const { error: accountError, value: accountValue } = accountIdSchema.validate({ accountId: req.params.accountId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (accountError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(accountError?.details || []), ...(limitError?.details || [])]
      });
    }

    const following = await instagramService.getFollowing(accountValue.accountId, limitValue.limit);
    
    res.json({
      success: true,
      data: following
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 