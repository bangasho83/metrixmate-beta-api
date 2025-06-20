# Meta API Integration

A comprehensive Node.js/Express API for retrieving data from Meta Ads, Facebook Pages, and Instagram Business Accounts using the Meta Graph API.

## Features

- **Facebook Pages**: Get page information, posts, insights, followers, events, photos, videos, reviews, conversations, leads, tabs, and roles
- **Instagram Business**: Get account info, media, stories, insights, comments, mentions, hashtags, live media, reels, carousels, followers, and following
- **Meta Ads**: Get campaigns, ad sets, ads, insights, creatives, audiences, pixels, billing, permissions, and delivery/reach estimates
- **Security**: Rate limiting, input validation, error handling, and logging
- **Production Ready**: Environment configuration, logging, and error handling

## Prerequisites

- Node.js 16+ 
- Meta Developer Account
- Facebook App with appropriate permissions
- Instagram Business Account
- Meta Ads Account

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meta-api-integration
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Fill in your Meta API credentials in the `.env` file:
   ```env
   # Meta API Configuration
   META_APP_ID=your_meta_app_id
   META_APP_SECRET=your_meta_app_secret
   META_ACCESS_TOKEN=your_meta_access_token

   # Facebook Page Configuration
   FACEBOOK_PAGE_ID=your_facebook_page_id
   FACEBOOK_PAGE_ACCESS_TOKEN=your_facebook_page_access_token

   # Instagram Business Account Configuration
   INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id
   INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token

   # Meta Ads Configuration
   META_ADS_ACCOUNT_ID=your_meta_ads_account_id
   META_ADS_ACCESS_TOKEN=your_meta_ads_access_token

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Create logs directory**
   ```bash
   mkdir logs
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Facebook Pages

#### Page Information
- `GET /api/facebook/page/:pageId?` - Get page information
- `GET /api/facebook/page/:pageId/posts?limit=25` - Get page posts
- `GET /api/facebook/page/:pageId/insights?metric=page_impressions&period=day` - Get page insights
- `GET /api/facebook/page/:pageId/followers?limit=100` - Get page followers
- `GET /api/facebook/page/:pageId/events?limit=25` - Get page events
- `GET /api/facebook/page/:pageId/photos?limit=25` - Get page photos
- `GET /api/facebook/page/:pageId/videos?limit=25` - Get page videos
- `GET /api/facebook/page/:pageId/reviews?limit=25` - Get page reviews
- `GET /api/facebook/page/:pageId/conversations?limit=25` - Get page conversations
- `GET /api/facebook/page/:pageId/leads?limit=25` - Get page leads
- `GET /api/facebook/page/:pageId/tabs` - Get page tabs
- `GET /api/facebook/page/:pageId/roles` - Get page roles

### Instagram Business

#### Account Information
- `GET /api/instagram/account/:accountId?` - Get account information
- `GET /api/instagram/account/:accountId/media?limit=25` - Get account media
- `GET /api/instagram/account/:accountId/stories` - Get account stories
- `GET /api/instagram/account/:accountId/insights?metric=impressions&period=day` - Get account insights
- `GET /api/instagram/account/:accountId/mentions?limit=25` - Get account mentions
- `GET /api/instagram/account/:accountId/live-media` - Get live media
- `GET /api/instagram/account/:accountId/reels?limit=25` - Get reels
- `GET /api/instagram/account/:accountId/carousels?limit=25` - Get carousel albums
- `GET /api/instagram/account/:accountId/followers?limit=100` - Get followers
- `GET /api/instagram/account/:accountId/following?limit=100` - Get following

#### Media & Content
- `GET /api/instagram/media/:mediaId/insights?metric=impressions,reach,engagement` - Get media insights
- `GET /api/instagram/media/:mediaId/comments?limit=25` - Get media comments

#### Hashtags
- `GET /api/instagram/hashtag/search?hashtag=example` - Search hashtags
- `GET /api/instagram/hashtag/:hashtagId/top-media?limit=25` - Get top media for hashtag
- `GET /api/instagram/hashtag/:hashtagId/recent-media?limit=25` - Get recent media for hashtag

### Meta Ads

#### Account Information
- `GET /api/ads/account/:accountId?` - Get ad account information
- `GET /api/ads/account/:accountId/campaigns?limit=25` - Get campaigns
- `GET /api/ads/account/:accountId/adsets?limit=25` - Get ad sets
- `GET /api/ads/account/:accountId/ads?limit=25` - Get ads
- `GET /api/ads/account/:accountId/creatives?limit=25` - Get creatives
- `GET /api/ads/account/:accountId/audiences?limit=25` - Get audiences
- `GET /api/ads/account/:accountId/pixels?limit=25` - Get pixels
- `GET /api/ads/account/:accountId/permissions` - Get account permissions
- `GET /api/ads/account/:accountId/billing` - Get account billing

#### Insights & Analytics
- `GET /api/ads/account/:accountId/insights?level=ad&breakdowns=age,gender&limit=25` - Get ad insights
- `GET /api/ads/campaign/:campaignId/insights?since=2024-01-01&until=2024-01-31` - Get campaign insights
- `GET /api/ads/adset/:adSetId/insights?since=2024-01-01&until=2024-01-31` - Get ad set insights
- `GET /api/ads/account/:accountId/spend?since=2024-01-01&until=2024-01-31` - Get account spend

#### Pixel Events
- `GET /api/ads/pixel/:pixelId/events?limit=25` - Get pixel events

#### Estimates
- `POST /api/ads/account/:accountId/delivery-estimate` - Get delivery estimates
- `POST /api/ads/account/:accountId/reach-estimate` - Get reach estimates

## Usage Examples

### Get Facebook Page Posts
```bash
curl "http://localhost:3000/api/facebook/page/123456789/posts?limit=10"
```

### Get Instagram Account Insights
```bash
curl "http://localhost:3000/api/instagram/account/987654321/insights?metric=impressions&period=week"
```

### Get Meta Ads Campaigns
```bash
curl "http://localhost:3000/api/ads/account/act_123456789/campaigns?limit=50"
```

### Get Ad Insights with Breakdowns
```bash
curl "http://localhost:3000/api/ads/account/act_123456789/insights?level=ad&breakdowns=age,gender&limit=25"
```

### Get Delivery Estimates
```bash
curl -X POST "http://localhost:3000/api/ads/account/act_123456789/delivery-estimate" \
  -H "Content-Type: application/json" \
  -d '{
    "targeting_spec": {
      "geo_locations": {
        "countries": ["US"]
      },
      "age_min": 18,
      "age_max": 65
    },
    "optimization_goal": "REACH",
    "billing_event": "IMPRESSIONS",
    "bid_amount": 1000
  }'
```

## Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {
    // Response data from Meta API
  }
}
```

Error responses:
```json
{
  "error": "Error type",
  "message": "Error description",
  "details": [
    // Validation error details (if applicable)
  ]
}
```

## Error Handling

The API includes comprehensive error handling for:
- Meta API errors (rate limits, permissions, etc.)
- Validation errors
- Network errors
- Server errors

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per 15 minutes per IP address
- Configurable via environment variables

## Logging

The application uses Winston for logging:
- Console logging in development
- File logging in production
- Error logs stored in `logs/error.log`
- Combined logs stored in `logs/combined.log`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `META_APP_ID` | Meta App ID | Yes |
| `META_APP_SECRET` | Meta App Secret | Yes |
| `META_ACCOUNT_ID` | Unified Account ID for Facebook, Instagram, and Ads | Yes |
| `META_ACCESS_TOKEN` | Unified Access Token with permissions for all services | Yes |
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment | No (default: development) |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | No (default: 900000) |
| `RATE_LIMIT_MAX_REQUESTS` | Rate limit max requests | No (default: 100) |

## Meta API Permissions Required

### Facebook Pages
- `pages_read_engagement`
- `pages_show_list`
- `pages_read_user_content`
- `pages_manage_metadata`
- `pages_read_insights`

### Instagram Business
- `instagram_basic`
- `instagram_manage_insights`
- `pages_show_list`
- `pages_read_engagement`

### Meta Ads
- `ads_read`
- `ads_management`
- `business_management`

## Development

### Running Tests
```bash
npm test
```

### Code Structure
```
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── env.example           # Environment variables template
├── middleware/           # Express middleware
│   └── errorHandler.js   # Error handling middleware
├── routes/               # API routes
│   ├── facebook.js       # Facebook page routes
│   ├── instagram.js      # Instagram routes
│   └── ads.js           # Meta Ads routes
├── services/             # Business logic
│   ├── metaApiService.js # Base Meta API service
│   ├── facebookService.js # Facebook-specific service
│   ├── instagramService.js # Instagram-specific service
│   └── adsService.js     # Meta Ads service
└── utils/                # Utilities
    └── logger.js         # Winston logger configuration
```

## Security Considerations

- Store sensitive credentials in environment variables
- Use HTTPS in production
- Implement proper authentication/authorization
- Validate all input parameters
- Rate limit API requests
- Log security events

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the Meta Graph API documentation
2. Review the error logs
3. Verify your API permissions
4. Ensure your access tokens are valid and have the required scopes 