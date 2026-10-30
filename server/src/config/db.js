// server/src/config/db.js
import mongoose from 'mongoose';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    logger.info(`Connected to MongoDB at ${config.mongodbUri}`);
  } catch (err) {
    isConnected = false;
    logger.warn(`Could not connect to MongoDB at ${config.mongodbUri}: ${err.message}`);
    if (config.env === 'production') {
      throw err;
    }
  }

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB runtime connection error:', err);
    isConnected = false;
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
    isConnected = false;
  });
};

export const disconnectDB = async () => {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  logger.info('Disconnected from MongoDB');
};

export const isDbConnected = () => isConnected && mongoose.connection.readyState === 1;
