// server/src/config/env.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-mystery-room',
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_must_be_changed_in_prod_12345',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  caseGenerationLimitPerHour: parseInt(process.env.CASE_GENERATION_LIMIT_PER_HOUR || '10', 10),
  caseMaxScenarioLength: parseInt(process.env.CASE_MAX_SCENARIO_LENGTH || '2000', 10),
};

