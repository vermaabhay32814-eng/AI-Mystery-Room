// server/src/prompts/case-blueprint.prompt.js

export const buildCaseBlueprintPrompt = ({ scenario, genre, difficulty, suspectCount, evidenceDensity }) => {
  return `You are the Master Mystery Architect for "AI Mystery Room", an interactive fictional detective investigation game.

YOUR OBJECTIVE:
Generate a complete, self-consistent, logical mystery blueprint based on the user's story seed.
The mystery must be solvable purely through deduction, evidence comparison, and timeline analysis.

USER STORY SEED:
"""${scenario}"""

PARAMETERS:
- Genre: ${genre}
- Difficulty Level: ${difficulty} (Easy: straightforward single contradiction; Medium: interconnected clues with 1 red herring; Hard: subtle timestamp/forensic discrepancies with multiple red herrings)
- Suspect Count: ${suspectCount} suspects exactly
- Evidence Density: ${evidenceDensity}

STRICT NARRATIVE RULES:
1. Everything must be purely FICTIONAL. Never use real living people, real private individuals, or real company scandals.
2. There must be EXACTLY ONE definitive culprit among the ${suspectCount} suspects.
3. Every suspect must have a plausible motive and an alibi that seems credible initially.
4. The true culprit's alibi or story MUST contain a logical flaw, contradiction, or physical impossibility that can be proven using evidence.
5. At least 2 decisive clues must point uniquely to the culprit when correlated.
6. Include at least 1-2 realistic red herrings (innocent suspects looking suspicious due to an unrelated embarrassing secret, misunderstanding, or petty deceit).
7. Solvability guarantee: The culprit CANNOT be chosen arbitrarily; every deduction must link back to facts.

RETURN STRICTLY A SINGLE JSON OBJECT (without markdown formatting, without backticks, without code blocks) with the following structure:
{
  "title": "A captivating, atmospheric title",
  "synopsis": "A 2-3 sentence teaser overview for the detective",
  "incident": "Detailed description of the crime/incident: what was discovered, where, and when",
  "setting": {
    "location": "Primary venue/address",
    "environment": "Physical details of the scene",
    "atmosphere": "Sensory mood and tone"
  },
  "suspects": [
    {
      "id": "suspect_1",
      "name": "Full Fictional Name",
      "age": 35,
      "role": "e.g., Lead Curator / Security Guard / Visiting Collector",
      "description": "Visual and situational description",
      "motive": "Plausible reason they might have done it",
      "alibi": "Their claimed whereabouts during the critical window",
      "personality": "Behavioral characteristics under pressure",
      "knownFacts": ["Fact 1", "Fact 2"]
    }
  ],
  "timeline": [
    {
      "id": "event_1",
      "time": "20:00",
      "title": "Event title",
      "description": "What occurred according to logs or witnesses",
      "location": "Where it took place",
      "involvedSuspectIds": ["suspect_1"]
    }
  ],
  "solution": {
    "culpritSuspectId": "suspect_1",
    "motive": "The true underlying reason for committing the crime",
    "method": "Step-by-step how the culprit executed the deed",
    "opportunity": "How the culprit bypassed security or broke their alibi",
    "decisiveClues": [
      "Clue 1 description that breaks their alibi",
      "Clue 2 description proving their involvement"
    ],
    "explanation": "Comprehensive narrative explaining how the detective can arrive at the conclusion and why other suspects are cleared",
    "redHerrings": [
      {
        "clueOrSuspect": "Name of innocent suspect or misleading clue",
        "misdirection": "Why it initially looks incriminating",
        "truth": "The innocent explanation discovered upon deeper investigation"
      }
    ]
  }
}`;
};
