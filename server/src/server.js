// server/src/server.js
import app from './app.js';
import { config } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    const server = app.listen(config.port, () => {
      logger.info(`AI Mystery Room Server running in [${config.env}] mode on http://localhost:${config.port}`);
      logger.info(`Health check available at http://localhost:${config.port}/api/v1/health`);
    });

    // Graceful shutdown handling
    const shutdown = async (signal) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        logger.info('Server closed successfully.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error('Failed to initialize server:', err);
    process.exit(1);
  }
};

startServer();

