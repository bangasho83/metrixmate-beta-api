const express = require('express');
const Joi = require('joi');
const AdsService = require('../services/adsService');
const logger = require('../utils/logger');

const router = express.Router();
const adsService = new AdsService();

// Validation schemas
const accountIdSchema = Joi.object({
  accountId: Joi.string().required()
});

const limitSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(25)
});

const insightsSchema = Joi.object({
  level: Joi.string().valid('ad', 'adset', 'campaign', 'account').default('ad'),
  breakdowns: Joi.string().optional(),
  timeRange: Joi.string().optional()
});

const timeRangeSchema = Joi.object({
  since: Joi.string().isoDate(),
  until: Joi.string().isoDate()
});

// Get ad account information
router.get('/account/:accountId?', async (req, res, next) => {
  try {
    const { error, value } = accountIdSchema.validate({ accountId: req.params.accountId });
    if (error) {
      return res.status(400).json({ error: 'Validation error', details: error.details });
    }

    const accountId = value.accountId || process.env.META_ACCOUNT_ID;
    const accountInfo = await adsService.getAdAccountInfo(accountId);
    
    res.json({
      success: true,
      data: accountInfo
    });
  } catch (error) {
    next(error);
  }
});

// Get campaigns
router.get('/account/:accountId/campaigns', async (req, res, next) => {
  try {
    const { error: accountError, value: accountValue } = accountIdSchema.validate({ accountId: req.params.accountId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (accountError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(accountError?.details || []), ...(limitError?.details || [])]
      });
    }

    const campaigns = await adsService.getCampaigns(accountValue.accountId, limitValue.limit);
    
    res.json({
      success: true,
      data: campaigns
    });
  } catch (error) {
    next(error);
  }
});

// Get ad sets
router.get('/account/:accountId/adsets', async (req, res, next) => {
  try {
    const { error: accountError, value: accountValue } = accountIdSchema.validate({ accountId: req.params.accountId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (accountError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(accountError?.details || []), ...(limitError?.details || [])]
      });
    }

    const adSets = await adsService.getAdSets(accountValue.accountId, limitValue.limit);
    
    res.json({
      success: true,
      data: adSets
    });
  } catch (error) {
    next(error);
  }
});

// Get ads
router.get('/account/:accountId/ads', async (req, res, next) => {
  try {
    const { error: accountError, value: accountValue } = accountIdSchema.validate({ accountId: req.params.accountId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (accountError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(accountError?.details || []), ...(limitError?.details || [])]
      });
    }

    const ads = await adsService.getAds(accountValue.accountId, limitValue.limit);
    
    res.json({
      success: true,
      data: ads
    });
  } catch (error) {
    next(error);
  }
});

// Get ad insights
router.get('/account/:accountId/insights', async (req, res, next) => {
  try {
    const { error: accountError, value: accountValue } = accountIdSchema.validate({ accountId: req.params.accountId });
    const { error: insightsError, value: insightsValue } = insightsSchema.validate({
      level: req.query.level,
      breakdowns: req.query.breakdowns,
      timeRange: req.query.timeRange
    });
    
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (accountError || insightsError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(accountError?.details || []), ...(insightsError?.details || []), ...(limitError?.details || [])]
      });
    }

    let timeRange = null;
    if (insightsValue.timeRange) {
      try {
        timeRange = JSON.parse(insightsValue.timeRange);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid timeRange format' });
      }
    }

    const breakdowns = insightsValue.breakdowns ? insightsValue.breakdowns.split(',') : [];

    const insights = await adsService.getAdInsights(
      accountValue.accountId,
      insightsValue.level,
      breakdowns,
      timeRange,
      limitValue.limit
    );
    
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    next(error);
  }
});

// Get campaign insights
router.get('/campaign/:campaignId/insights', async (req, res, next) => {
  try {
    const { error: campaignError, value: campaignValue } = Joi.object({
      campaignId: Joi.string().required()
    }).validate({ campaignId: req.params.campaignId });
    
    const { error: timeRangeError, value: timeRangeValue } = timeRangeSchema.validate({
      since: req.query.since,
      until: req.query.until
    });
    
    if (campaignError || timeRangeError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(campaignError?.details || []), ...(timeRangeError?.details || [])]
      });
    }

    const breakdowns = req.query.breakdowns ? req.query.breakdowns.split(',') : [];
    const timeRange = timeRangeValue.since && timeRangeValue.until ? timeRangeValue : null;

    const insights = await adsService.getCampaignInsights(campaignValue.campaignId, timeRange, breakdowns);
    
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    next(error);
  }
});

// Get ad set insights
router.get('/adset/:adSetId/insights', async (req, res, next) => {
  try {
    const { error: adSetError, value: adSetValue } = Joi.object({
      adSetId: Joi.string().required()
    }).validate({ adSetId: req.params.adSetId });
    
    const { error: timeRangeError, value: timeRangeValue } = timeRangeSchema.validate({
      since: req.query.since,
      until: req.query.until
    });
    
    if (adSetError || timeRangeError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(adSetError?.details || []), ...(timeRangeError?.details || [])]
      });
    }

    const breakdowns = req.query.breakdowns ? req.query.breakdowns.split(',') : [];
    const timeRange = timeRangeValue.since && timeRangeValue.until ? timeRangeValue : null;

    const insights = await adsService.getAdSetInsights(adSetValue.adSetId, timeRange, breakdowns);
    
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    next(error);
  }
});

// Get creatives
router.get('/account/:accountId/creatives', async (req, res, next) => {
  try {
    const { error: accountError, value: accountValue } = accountIdSchema.validate({ accountId: req.params.accountId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (accountError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(accountError?.details || []), ...(limitError?.details || [])]
      });
    }

    const creatives = await adsService.getCreatives(accountValue.accountId, limitValue.limit);
    
    res.json({
      success: true,
      data: creatives
    });
  } catch (error) {
    next(error);
  }
});

// Get audiences
router.get('/account/:accountId/audiences', async (req, res, next) => {
  try {
    const { error: accountError, value: accountValue } = accountIdSchema.validate({ accountId: req.params.accountId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (accountError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(accountError?.details || []), ...(limitError?.details || [])]
      });
    }

    const audiences = await adsService.getAudiences(accountValue.accountId, limitValue.limit);
    
    res.json({
      success: true,
      data: audiences
    });
  } catch (error) {
    next(error);
  }
});

// Get pixels
router.get('/account/:accountId/pixels', async (req, res, next) => {
  try {
    const { error: accountError, value: accountValue } = accountIdSchema.validate({ accountId: req.params.accountId });
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (accountError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(accountError?.details || []), ...(limitError?.details || [])]
      });
    }

    const pixels = await adsService.getPixels(accountValue.accountId, limitValue.limit);
    
    res.json({
      success: true,
      data: pixels
    });
  } catch (error) {
    next(error);
  }
});

// Get pixel events
router.get('/pixel/:pixelId/events', async (req, res, next) => {
  try {
    const { error: pixelError, value: pixelValue } = Joi.object({
      pixelId: Joi.string().required()
    }).validate({ pixelId: req.params.pixelId });
    
    const { error: limitError, value: limitValue } = limitSchema.validate({ limit: req.query.limit });
    
    if (pixelError || limitError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(pixelError?.details || []), ...(limitError?.details || [])]
      });
    }

    const events = await adsService.getPixelEvents(pixelValue.pixelId, limitValue.limit);
    
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    next(error);
  }
});

// Get account spend
router.get('/account/:accountId/spend', async (req, res, next) => {
  try {
    const { error: accountError, value: accountValue } = accountIdSchema.validate({ accountId: req.params.accountId });
    const { error: timeRangeError, value: timeRangeValue } = timeRangeSchema.validate({
      since: req.query.since,
      until: req.query.until
    });
    
    if (accountError || timeRangeError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(accountError?.details || []), ...(timeRangeError?.details || [])]
      });
    }

    const timeRange = timeRangeValue.since && timeRangeValue.until ? timeRangeValue : null;
    const spend = await adsService.getAccountSpend(accountValue.accountId, timeRange);
    
    res.json({
      success: true,
      data: spend
    });
  } catch (error) {
    next(error);
  }
});

// Get delivery estimates
router.post('/account/:accountId/delivery-estimate', async (req, res, next) => {
  try {
    const { error: accountError, value: accountValue } = accountIdSchema.validate({ accountId: req.params.accountId });
    
    const { error: bodyError, value: bodyValue } = Joi.object({
      targeting_spec: Joi.object().required(),
      optimization_goal: Joi.string().required(),
      billing_event: Joi.string().required(),
      bid_amount: Joi.number().required()
    }).validate(req.body);
    
    if (accountError || bodyError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(accountError?.details || []), ...(bodyError?.details || [])]
      });
    }

    const estimates = await adsService.getDeliveryEstimates(
      accountValue.accountId,
      bodyValue.targeting_spec,
      bodyValue.optimization_goal,
      bodyValue.billing_event,
      bodyValue.bid_amount
    );
    
    res.json({
      success: true,
      data: estimates
    });
  } catch (error) {
    next(error);
  }
});

// Get reach estimates
router.post('/account/:accountId/reach-estimate', async (req, res, next) => {
  try {
    const { error: accountError, value: accountValue } = accountIdSchema.validate({ accountId: req.params.accountId });
    
    const { error: bodyError, value: bodyValue } = Joi.object({
      targeting_spec: Joi.object().required(),
      optimization_goal: Joi.string().required()
    }).validate(req.body);
    
    if (accountError || bodyError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: [...(accountError?.details || []), ...(bodyError?.details || [])]
      });
    }

    const estimates = await adsService.getReachEstimates(
      accountValue.accountId,
      bodyValue.targeting_spec,
      bodyValue.optimization_goal
    );
    
    res.json({
      success: true,
      data: estimates
    });
  } catch (error) {
    next(error);
  }
});

// Get account permissions
router.get('/account/:accountId/permissions', async (req, res, next) => {
  try {
    const { error, value } = accountIdSchema.validate({ accountId: req.params.accountId });
    if (error) {
      return res.status(400).json({ error: 'Validation error', details: error.details });
    }

    const permissions = await adsService.getAccountPermissions(value.accountId);
    
    res.json({
      success: true,
      data: permissions
    });
  } catch (error) {
    next(error);
  }
});

// Get account billing
router.get('/account/:accountId/billing', async (req, res, next) => {
  try {
    const { error, value } = accountIdSchema.validate({ accountId: req.params.accountId });
    if (error) {
      return res.status(400).json({ error: 'Validation error', details: error.details });
    }

    const billing = await adsService.getAccountBilling(value.accountId);
    
    res.json({
      success: true,
      data: billing
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 