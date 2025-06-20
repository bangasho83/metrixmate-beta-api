const app = require('../app');

// Add error handling for serverless environment
app.use((err, req, res, next) => {
  console.error('Serverless function error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

module.exports = app; 