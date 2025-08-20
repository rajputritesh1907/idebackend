var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

// Load environment variables
require('dotenv').config();

// Database connection
const connectDB = require('./config/database');

var indexRouter = require('./routes/index');
var communityRouter = require('./routes/community');

var app = express();

// Connect to database (non-blocking start handled in bin/www if needed)
connectDB().catch(err => {
  console.error('[App] Continuing without an active MongoDB connection:', err.message);
});

app.use(logger('dev'));
// Increase payload size limit to 10MB
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    'https://idefrontend.vercel.app/'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use('/', indexRouter);
// Mount community routes (provides /community/post/:id delete and other community endpoints)
app.use('/community', communityRouter);

app.use('/test', (req, res) => {
  res.send('Test route is working');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // Return JSON error for API
  res.status(err.status || 500);
  res.json({
    success: false,
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});
module.exports = app;
