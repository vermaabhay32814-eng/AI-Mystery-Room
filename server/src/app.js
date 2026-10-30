// server/src/app.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration for client
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
  })
);

// Logging
if (config.env !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers & cookies
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Mount API v1 router
app.use('/api/v1', routes);

// 404 handler for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Endpoint ${req.originalUrl} not found`
    }
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
