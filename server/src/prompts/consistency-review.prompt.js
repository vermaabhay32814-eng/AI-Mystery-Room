// server/src/prompts/consistency-review.prompt.js

export const buildConsistencyReviewPrompt = ({ blueprint, evidenceList }) => {
  return `You are the Lead Quality Auditor for "AI Mystery Room".
Review the generated case blueprint and evidence suite for logical consistency.

BLUEPRINT:
${JSON.stringify(blueprint)}

EVIDENCE SUITE:
${JSON.stringify(evidenceList)}

CHECKLIST:
1. Is the culprit uniquely identifiable from the evidence without guesswork?
2. Are all timestamps consistent between the timeline, CCTV logs, chat transcripts, and statements?
3. Does the innocent suspects' evidence support their alibis or explain red herrings?
4. Are there any plot holes or unsolvable paradoxes?

RETURN STRICTLY A SINGLE JSON OBJECT (without markdown formatting, without backticks, without code blocks):
{
  "isValid": true,
  "confidenceScore": 95,
  "issues": [],
  "refinementNotes": "The timeline and decisive clues correlate cleanly to identify the culprit."
}`;
};
