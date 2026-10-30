// server/src/prompts/solution-explanation.prompt.js

export const buildSolutionExplanationPrompt = ({ blueprint, selectedSuspectId, isCorrect }) => {
  return `You are the Lead Detective breaking down the mystery in "AI Mystery Room".

THE CASE:
Title: ${blueprint.title}
Actual Culprit: ${blueprint.solution.culpritSuspectId}
Culprit Motive: ${blueprint.solution.motive}
Culprit Method: ${blueprint.solution.method}
Decisive Clues: ${JSON.stringify(blueprint.solution.decisiveClues)}

ACCUSATION DETAILS:
Accused Suspect ID: ${selectedSuspectId}
Was Accusation Correct: ${isCorrect ? 'YES' : 'NO'}

TASK:
Provide a cinematic, immersive detective debriefing evaluating the accusation:
- If correct: Praise their deduction, explain how the decisive clues cracked the case, and summarize the culprit's confession.
- If incorrect: Explain why the accused suspect was actually innocent, reveal who the real culprit was, and highlight the clues the investigator overlooked.

RETURN STRICTLY A SINGLE JSON OBJECT (without markdown formatting, without backticks, without code blocks):
{
  "summary": "Short 1-2 sentence verdict",
  "detailedExplanation": "Full narrative reconstruction of how the case unfolded and how the evidence pieces together.",
  "overlookedClues": ["Clue that exposed the truth"]
}`;
};
