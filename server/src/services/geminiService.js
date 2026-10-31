'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { validateMystery, DIFFICULTY_CONFIG } = require('./mysteryValidator');

const MAX_ATTEMPTS = 3;

/**
 * Build the Gemini prompt for generating a mystery.
 *
 * @param {string} premise
 * @param {string} difficulty
 * @returns {string}
 */
function buildPrompt(premise, difficulty) {
  const cfg = DIFFICULTY_CONFIG[difficulty];

  return `You are a creative mystery writer for an interactive detective game. Generate a compelling mystery case based on the following premise.

PREMISE: ${premise}
DIFFICULTY: ${difficulty}

REQUIREMENTS:
- Generate exactly ${cfg.suspects} suspects
- Generate exactly ${cfg.clues} clues
- Generate exactly ${cfg.hints} hints (ordered from least revealing to most revealing)
- The story must be engaging and internally consistent
- The culprit must be one of the suspects
- All clues and hints must be consistent with the solution
- Suspects should have plausible roles and alibis
- At least one clue should directly implicate the culprit
- Innocent suspects should have reasons they could be suspected but ultimately ruled out

EVIDENCE TYPES (use exactly one of these values for each clue's evidenceType):
document | chat_message | witness_statement | photo_description | cctv_transcript | audio_transcript | timeline_record | physical_evidence

Respond with ONLY a valid JSON object — no markdown, no code fences, no commentary — matching this exact structure:

{
  "title": "A catchy mystery title",
  "story": "An engaging story setup (2-4 paragraphs) that sets the scene without revealing the culprit",
  "difficulty": "${difficulty}",
  "suspects": [
    {
      "id": "suspect_1",
      "name": "Full Name",
      "role": "Their role/occupation in the story",
      "profile": "Brief character description and their relationship to the case",
      "alibi": "Their claimed alibi for when the crime occurred"
    }
  ],
  "clues": [
    {
      "id": "clue_1",
      "title": "Short clue title",
      "category": "Category (e.g. Financial, Personal, Communication, Physical)",
      "content": "Full content of the clue — the actual evidence text, transcript, description, etc.",
      "evidenceType": "one_of_the_valid_evidence_types",
      "relevance": "Why this clue matters to the investigation"
    }
  ],
  "hints": [
    "First hint — subtle, points investigation in the right direction",
    "Second hint — more direct"${cfg.hints === 3 ? ',\n    "Third hint — most revealing, nearly gives away the culprit"' : ''}
  ],
  "culpritSuspectId": "suspect_X",
  "solution": {
    "motive": "Clear explanation of why the culprit committed the crime",
    "method": "How the crime was committed",
    "explanation": "Full narrative explanation tying together culprit, motive, method, and clues",
    "clueReasoning": [
      { "clueId": "clue_X", "reason": "How this clue points to or implicates the culprit" }
    ],
    "alternativeSuspectExplanations": [
      { "suspectId": "suspect_X", "reasonRuledOut": "Why this suspect is innocent despite appearing suspicious" }
    ]
  }
}

Generate a mystery now. Return ONLY the JSON object.`;
}

/**
 * Extract JSON from the model response text, stripping any accidental markdown.
 *
 * @param {string} text
 * @returns {object}
 */
function parseJSON(text) {
  let cleaned = text.trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  } else {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/, '')
      .trim();
  }

  return JSON.parse(cleaned);
}

/**
 * Generate a mystery case using the Gemini API.
 * Retries up to MAX_ATTEMPTS times if generation or validation fails.
 *
 * @param {string} premise
 * @param {string} difficulty
 * @returns {Promise<object>} Validated mystery data
 */
async function generateMystery(premise, difficulty) {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL;

  if (!apiKey || !modelName) {
    throw new Error('GEMINI_API_KEY or GEMINI_MODEL env var is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.9,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    },
  });

  const prompt = buildPrompt(premise, difficulty);

  let lastError = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      console.log(`[Gemini] Generation attempt ${attempt}/${MAX_ATTEMPTS}`);

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      let data;
      try {
        data = parseJSON(text);
      } catch (parseErr) {
        throw new Error(`JSON parse failed: ${parseErr.message}`);
      }

      const { valid, errors } = validateMystery(data, difficulty);
      if (!valid) {
        throw new Error(`Validation failed:\n  - ${errors.join('\n  - ')}`);
      }

      console.log(`[Gemini] Mystery generated and validated on attempt ${attempt}`);
      return data;
    } catch (err) {
      lastError = err;
      console.warn(`[Gemini] Attempt ${attempt} failed: ${err.message}`);

      if (attempt < MAX_ATTEMPTS) {
        // Brief back-off before retry
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
  }

  throw new Error(
    `Failed to generate a valid mystery after ${MAX_ATTEMPTS} attempts. Last error: ${lastError?.message}`
  );
}

module.exports = { generateMystery };
