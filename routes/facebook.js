const express = require('express');
const Joi = require('joi');
const FacebookService = require('../services/facebookService');
const logger = require('../utils/logger');

const router = express.Router();
const facebookService = new FacebookService();

// Validation schemas
const pageIdSchema = Joi.object({
  pageId: Joi.string().required()
});

const limitSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(25)
});

const insightsSchema = Joi.object({
  metric: Joi.string().valid('page_impressions', 'page_impressions_unique', 'page_posts_impressions', 'page_fan_adds', 'page_fan_removes', 'page_views_total', 'page_engaged_users', 'page_consumptions', 'page_negative_feedback', 'page_positive_feedback_by_type', 'page_fans_online', 'page_fan_adds_by_paid_non_paid_unique').default('page_impressions'),
  period: Joi.string().valid('day', 'week', 'days_28').default('day'),
  since: Joi.string().isoDate(),
  until: Joi.string().isoDate()
});

// Get page information
router.get('/page/:pageId?', async (req, res, next) => {
  try {
    const { error, value } = pageIdSchema.validate({ pageId: req.params.pageId });
    if (error) {
      return res.status(400).json({ error: 'Validation error', details: error.details });
    }

    const pageId = value.pageId || process.env.META_ACCOUNT_ID;
    const pageInfo = await facebookService.getPageInfo(pageId);
    
    res.json({
      success: true,
      data: pageInfo
    });
  } catch (error) {
    next(error);
  }
});

// Get page posts
router.get('/page/:pageId/posts', async (req, res, next) => {
  try {
    const { error: pageError, value: pageValue } = pageIdSchema.validate({ pageId: req.params.pageId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (pageError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(pageError?.details || []), ...(limitError?.details || [])]
      });
    }

    const posts = await facebookService.getPagePosts(pageValue.pageId, limitValue.limit);
    
    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    next(error);
  }
});

// Get page insights
router.get('/page/:pageId/insights', async (req, res, next) => {
  try {
    const { error: pageError, value: pageValue } = pageIdSchema.validate({ pageId: req.params.pageId });
    const { error: insightsError, value: insightsValue } = insightsSchema.validate({
      metric: req.query.metric,
      period: req.query.period,
      since: req.query.since,
      until: req.query.until
    });
    
    if (pageError || insightsError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(pageError?.details || []), ...(insightsError?.details || [])]
      });
    }

    const insights = await facebookService.getPageInsights(
      pageValue.pageId,
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

// Get page followers
router.get('/page/:pageId/followers', async (req, res, next) => {
  try {
    const { error: pageError, value: pageValue } = pageIdSchema.validate({ pageId: req.params.pageId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (pageError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(pageError?.details || []), ...(limitError?.details || [])]
      });
    }

    const followers = await facebookService.getPageFollowers(pageValue.pageId, limitValue.limit);
    
    res.json({
      success: true,
      data: followers
    });
  } catch (error) {
    next(error);
  }
});

// Get page events
router.get('/page/:pageId/events', async (req, res, next) => {
  try {
    const { error: pageError, value: pageValue } = pageIdSchema.validate({ pageId: req.params.pageId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (pageError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(pageError?.details || []), ...(limitError?.details || [])]
      });
    }

    const events = await facebookService.getPageEvents(pageValue.pageId, limitValue.limit);
    
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    next(error);
  }
});

// Get page photos
router.get('/page/:pageId/photos', async (req, res, next) => {
  try {
    const { error: pageError, value: pageValue } = pageIdSchema.validate({ pageId: req.params.pageId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (pageError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(pageError?.details || []), ...(limitError?.details || [])]
      });
    }

    const photos = await facebookService.getPagePhotos(pageValue.pageId, limitValue.limit);
    
    res.json({
      success: true,
      data: photos
    });
  } catch (error) {
    next(error);
  }
});

// Get page videos
router.get('/page/:pageId/videos', async (req, res, next) => {
  try {
    const { error: pageError, value: pageValue } = pageIdSchema.validate({ pageId: req.params.pageId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (pageError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(pageError?.details || []), ...(limitError?.details || [])]
      });
    }

    const videos = await facebookService.getPageVideos(pageValue.pageId, limitValue.limit);
    
    res.json({
      success: true,
      data: videos
    });
  } catch (error) {
    next(error);
  }
});

// Get page reviews
router.get('/page/:pageId/reviews', async (req, res, next) => {
  try {
    const { error: pageError, value: pageValue } = pageIdSchema.validate({ pageId: req.params.pageId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (pageError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(pageError?.details || []), ...(limitError?.details || [])]
      });
    }

    const reviews = await facebookService.getPageReviews(pageValue.pageId, limitValue.limit);
    
    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
});

// Get page conversations
router.get('/page/:pageId/conversations', async (req, res, next) => {
  try {
    const { error: pageError, value: pageValue } = pageIdSchema.validate({ pageId: req.params.pageId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (pageError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(pageError?.details || []), ...(limitError?.details || [])]
      });
    }

    const conversations = await facebookService.getPageConversations(pageValue.pageId, limitValue.limit);
    
    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
});

// Get page leads
router.get('/page/:pageId/leads', async (req, res, next) => {
  try {
    const { error: pageError, value: pageValue } = pageIdSchema.validate({ pageId: req.params.pageId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (pageError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(pageError?.details || []), ...(limitError?.details || [])]
      });
    }

    const leads = await facebookService.getPageLeads(pageValue.pageId, limitValue.limit);
    
    res.json({
      success: true,
      data: leads
    });
  } catch (error) {
    next(error);
  }
});

// Get page tabs
router.get('/page/:pageId/tabs', async (req, res, next) => {
  try {
    const { error, value } = pageIdSchema.validate({ pageId: req.params.pageId });
    if (error) {
      return res.status(400).json({ error: 'Validation error', details: error.details });
    }

    const tabs = await facebookService.getPageTabs(value.pageId);
    
    res.json({
      success: true,
      data: tabs
    });
  } catch (error) {
    next(error);
  }
});

// Get page roles
router.get('/page/:pageId/roles', async (req, res, next) => {
  try {
    const { error, value } = pageIdSchema.validate({ pageId: req.params.pageId });
    if (error) {
      return res.status(400).json({ error: 'Validation error', details: error.details });
    }

    const roles = await facebookService.getPageRoles(value.pageId);
    
    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 