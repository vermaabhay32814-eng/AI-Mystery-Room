// server/src/services/gemini.service.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

let genAI = null;

if (config.geminiApiKey) {
  genAI = new GoogleGenerativeAI(config.geminiApiKey);
} else {
  logger.warn('GEMINI_API_KEY is not set. Gemini service will use high-fidelity deterministic fallback mysteries for local development.');
}

/**
 * Strips markdown code fences from Gemini responses and parses JSON.
 */
export const cleanAndParseJSON = (text) => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return JSON.parse(cleaned.trim());
};

/**
 * Calls Gemini with structured JSON prompt.
 */
export const generateGeminiContent = async (prompt, systemInstruction = '') => {
  if (!config.geminiApiKey || !genAI) {
    logger.info('Using development fallback generator since GEMINI_API_KEY is not configured');
    return null; // Will trigger high-fidelity deterministic generator in case-generation.service.js
  }

  try {
    const model = genAI.getGenerativeModel({
      model: config.geminiModel,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7
      },
      systemInstruction: systemInstruction || undefined
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return cleanAndParseJSON(responseText);
  } catch (err) {
    logger.error('Gemini API call failed:', err);
    throw new Error(`Gemini API error: ${err.message}`);
  }
};
