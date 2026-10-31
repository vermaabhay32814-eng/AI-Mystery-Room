# AI Mystery Room --- Project Specification

**Document:** `SPEC.md`\
**Version:** 1.0\
**Status:** Implementation blueprint\
**Project type:** Full-stack, AI-powered mystery investigation game

------------------------------------------------------------------------

## 1. Project Overview

### 1.1 Summary

AI Mystery Room is a web application in which a player turns a short
premise into an interactive fictional investigation. The player supplies
a scenario (for example, "A priceless painting disappears from a locked
gallery during a private event") and chooses a difficulty level.

The backend asks Google Gemini to create a complete, internally
consistent mystery. The generated case contains a story, suspects,
evidence items and progressive hints. Evidence may be presented as
fictional chat messages, witness statements, documents, photographs or
CCTV descriptions. The player investigates the case, discovers evidence,
optionally requests hints, and finally accuses one suspect.

The application evaluates the accusation on the server and reveals the
culprit, the reasoning, and the player's score.

**Important product rule:** All cases and evidence are fictional. The
first release presents generated media as text descriptions or
structured fictional artefacts. It does not need to generate actual
image or video files.

### 1.2 Problem Statement

Many story-generation experiences are passive: a user reads content but
does not meaningfully investigate or make decisions. AI Mystery Room
turns a user-provided premise into a structured game with evidence
discovery, deduction, hints and a scored final decision.

The main engineering challenge is to generate engaging mysteries while
preserving logical consistency and preventing the solution from leaking
to the browser before the player submits an accusation.

### 1.3 Goals

-   Let a player create a mystery from a short premise.
-   Offer Easy, Medium and Hard difficulty settings.
-   Generate a solvable case with a fixed number of suspects, clues and
    hints for each difficulty.
-   Allow evidence to be discovered progressively.
-   Provide hints without exposing the full solution.
-   Accept one final accusation per case.
-   Calculate score and reveal the explanation on the backend.
-   Provide a responsive, accessible interface.

### 1.4 Non-goals for the First Release

-   Real user-to-user multiplayer or live collaboration.
-   Real-world crime investigation or factual claims about real people.
-   Actual surveillance footage, WhatsApp integration or access to
    private accounts.
-   AI-generated image/video production. Evidence can be represented by
    text, metadata and optional placeholder illustrations.
-   Payments, subscriptions, leaderboards and social feeds.
-   A general-purpose chat interface with unrestricted conversation.

### 1.5 Target Users

-   Students and casual players who enjoy puzzles, detective stories and
    interactive fiction.
-   Users who want to turn their own story idea into a playable mystery.
-   Demonstration and portfolio reviewers evaluating a full-stack
    application with an AI integration.

### 1.6 Expected User Experience

The experience should feel like entering a detective workspace. The
player should understand the case premise, see who is involved, discover
evidence deliberately, track progress and make a reasoned accusation.
The interface should not reveal the culprit through labels, API
responses, HTML attributes, client state or network payloads before the
accusation is submitted.

------------------------------------------------------------------------

## 2. Scope and Feature Priorities

### 2.1 Core Features (Must Have)

1.  Home page with project introduction and primary call to action.
2.  Mystery creation form with premise and difficulty.
3.  Server-side Gemini mystery generation.
4.  Strict validation of generated mystery data.
5.  Investigation room with story, suspect cards, evidence and progress.
6.  Explicit clue-discovery action.
7.  Hint request with a limited hint count.
8.  Accusation form with one suspect selection.
9.  Server-side verdict and score calculation.
10. Results page with culprit, explanation, score and score breakdown.
11. Start-another-mystery action.
12. Loading, empty, validation, API and network error states.
13. Responsive layouts for mobile, tablet and desktop.

### 2.2 Optional Enhancements (After Core Acceptance)

-   Save and resume cases across devices using authenticated accounts.
-   Case history and player statistics.
-   Daily challenge and curated example premises.
-   Sound effects, subtle animations and investigation ambience.
-   Text-to-speech narration.
-   AI-generated illustrative images, clearly marked as fictional.
-   Shareable result summaries that do not expose an active case's
    solution.
-   Leaderboards, achievements and badges.
-   Admin dashboard for reviewing generation failures and usage.
-   Rate limits and usage quotas per account or IP.

Optional features must not delay the core acceptance criteria.

------------------------------------------------------------------------

## 3. Technology Stack and Architecture

### 3.1 Required Stack

  -----------------------------------------------------------------------
  Layer                   Technology              Responsibility
  ----------------------- ----------------------- -----------------------
  Frontend                React                   UI components and
                                                  client-side state

  Build tooling           Vite                    Development server and
                                                  production build

  Styling                 Tailwind CSS            Responsive design and
                                                  visual system

  Backend                 Node.js                 Server runtime

  API framework           Express                 REST endpoints and
                                                  middleware

  Database                MongoDB                 Persist cases and
                                                  player progress

  ODM                     Mongoose                Schemas, validation and
                                                  database access

  AI                      Google Gemini API       Generate mystery
                                                  content

  HTTP client             Fetch or Axios          Frontend-to-backend
                                                  requests

  Deployment              Any compatible frontend Production hosting
                          and Node hosting        
                          provider                
  -----------------------------------------------------------------------

Use JavaScript or TypeScript consistently throughout the project.
TypeScript is recommended, but not mandatory.

### 3.2 High-Level Architecture

``` text
React + Vite + Tailwind
        |
        | HTTPS / JSON REST API
        v
Node.js + Express
        |
        +---- Case Service
        |       +---- Gemini Service
        |       +---- Mystery Validator
        |       +---- Scoring Service
        |
        +---- Mongoose Models
        |
        v
     MongoDB

Gemini API is called only by the backend.
```

### 3.3 Suggested Repository Structure

``` text
ai-mystery-room/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── SuspectCard.jsx
│   │   │   ├── ClueCard.jsx
│   │   │   ├── HintPanel.jsx
│   │   │   └── ProgressBar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── CreateMystery.jsx
│   │   │   ├── InvestigationRoom.jsx
│   │   │   ├── Accusation.jsx
│   │   │   └── Results.jsx
│   │   ├── services/
│   │   │   └── caseApi.js
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   └── caseController.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   ├── notFound.js
│   │   │   └── rateLimiter.js
│   │   ├── models/
│   │   │   └── Case.js
│   │   ├── routes/
│   │   │   └── caseRoutes.js
│   │   ├── services/
│   │   │   ├── geminiService.js
│   │   │   ├── mysteryValidator.js
│   │   │   └── scoringService.js
│   │   ├── validators/
│   │   │   └── caseValidators.js
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── SPEC.md
├── README.md
└── .gitignore
```

The exact file structure may change, but responsibilities should remain
separated. Routes should not contain Gemini prompts or scoring logic
directly.

### 3.4 Environment Variables

Backend `.env`:

``` env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/ai_mystery_room
GEMINI_API_KEY=replace_with_real_key
GEMINI_MODEL=replace_with_supported_model_name
CLIENT_ORIGIN=http://localhost:5173
```

Frontend `.env`:

``` env
VITE_API_BASE_URL=http://localhost:5000/api
```

Rules:

-   Never prefix a secret with `VITE_`.
-   Never expose `GEMINI_API_KEY` to the browser.
-   Commit `.env.example`, never commit real `.env` files.
-   Validate required environment variables at server startup.
-   Use HTTPS and hosting-provider secret management in production.

------------------------------------------------------------------------

## 4. User Flow

### 4.1 Primary Journey

1.  **Open website:** The player lands on Home and sees what the game
    does.
2.  **Start:** The player selects "Create Mystery".
3.  **Enter premise:** The player enters a short fictional scenario.
4.  **Choose difficulty:** Easy, Medium or Hard.
5.  **Generate:** The frontend sends the premise and difficulty to
    `POST /api/cases`.
6.  **AI generation:** The backend calls Gemini, parses the response and
    validates its structure and logic.
7.  **Save:** A valid case is stored in MongoDB. The backend returns
    only player-visible case data.
8.  **Investigate:** The player reads the story, reviews suspects and
    discovers clues.
9.  **Request hints:** The player may request the next available hint,
    subject to the difficulty limit.
10. **Accuse:** The player selects one suspect and submits the
    accusation.
11. **Evaluate:** The backend compares the selected suspect with the
    hidden culprit and calculates the score.
12. **Reveal:** The Results page displays the verdict, culprit,
    explanation and score breakdown.
13. **Play again:** The player returns to Create Mystery and starts a
    new case.

### 4.2 Navigation and State Rules

-   Home → Create Mystery → Investigation Room → Accusation → Results.
-   The player may navigate between the investigation and accusation
    screens while the case is active.
-   Refreshing an active case should restore its visible progress by
    fetching it from the API.
-   A completed case must not accept more clue discoveries, hints or
    accusations.
-   The first release may use a case ID without user accounts. Treat the
    ID as an identifier, not as authorization. Add ownership/session
    authorization and rate limiting before public production deployment.
-   Do not put the culprit, solution, hidden rationale or answer key in
    URL parameters, local storage, client-side source code or initial
    API responses.

------------------------------------------------------------------------

## 5. UI and Page Specifications

### 5.1 Shared Design Requirements

-   Use a clean, modern detective/investigation-room visual style.
-   Maintain readable contrast and clear hierarchy.
-   Use consistent buttons, cards, badges, spacing and typography.
-   Make all controls keyboard accessible and provide visible focus
    states.
-   Use semantic headings, labels and buttons.
-   Do not rely on color alone to communicate status.
-   Support mobile, tablet and desktop breakpoints.
-   Use a consistent navigation header and clear back/continue actions.
-   Avoid showing hidden solution data in DOM attributes, client logs or
    debugging output.

### 5.2 Home Page (`/`)

**Purpose:** Explain the concept and encourage the player to start.

Essential elements: - Product name and short tagline. - Brief
explanation of how the game works. - Primary "Create Mystery" button. -
Three-step overview: Create → Investigate → Solve. - Difficulty
overview. - Optional sample case preview. - Footer with project
information.

Interactions: - Create Mystery navigates to `/create`. - Sample content
is illustrative and must not expose the answer to an active case.

States: - Normal landing state. - If a previous active case is
supported, optionally show "Resume Case".

### 5.3 Create Mystery Page (`/create`)

**Purpose:** Collect the premise and difficulty.

Essential elements: - Page title and short instructions. - Premise
textarea. - Character counter. - Difficulty selector: Easy, Medium,
Hard. - Difficulty descriptions and required content counts. - Generate
Mystery button. - Back to Home link.

Validation: - Trim whitespace. - Premise is required. - Minimum length:
20 characters. - Maximum length: 500 characters. - Reject empty or
whitespace-only input. - Do not accept unsupported difficulty values. -
Display field-level validation messages.

States: - Idle. - Invalid form. - Generating (disable duplicate
submission and show progress feedback). - Generation failed (show a
friendly error and retry action). - Successful generation (navigate to
the new investigation room).

### 5.4 Investigation Room (`/case/:id`)

**Purpose:** Let the player inspect the case without revealing its
solution.

Essential elements: - Case title, premise and narrative. - Difficulty
label. - Investigation progress indicator. - Suspect cards with public
profiles, relationships and alibis. - Clue/evidence list with locked and
discovered states. - "Discover clue" action for each undiscovered
clue. - Hint panel and "Request hint" action. - "Make an accusation"
action. - Optional event timeline or evidence categories.

Clue presentation: - A locked clue may show a neutral title/category but
not its undiscovered contents. - On discovery, show the full evidence
content and evidence type. - Each clue can be discovered only once. -
Progress is based on unique discovered clues, not clicks.

Hint presentation: - Show hints sequentially. - Do not reveal future
hints before they are requested. - Show remaining hint count. - A hint
should guide reasoning rather than directly state the culprit.

States: - Initial loading skeleton. - Active investigation. - Clue
discovery pending. - Hint request pending. - No remaining hints. - Case
not found or unavailable. - Case already completed. - Network/server
error with retry.

### 5.5 Accusation Page (`/case/:id/accuse`)

**Purpose:** Capture the player's final suspect choice.

Essential elements: - Short instruction to review evidence before
deciding. - Selectable suspect cards or radio options. - Confirmation
text explaining that the accusation is final. - Submit accusation
button. - Return to investigation action before submission.

Rules: - Exactly one suspect must be selected. - The suspect ID must
belong to this case. - The backend accepts only one final accusation. -
After submission, the case becomes completed and the player is sent to
Results. - Prevent accidental duplicate submissions in the UI and
enforce idempotent/one-time behavior on the server.

States: - No suspect selected. - Suspect selected. - Submission
pending. - Submission error. - Already submitted/completed.

### 5.6 Results Page (`/case/:id/results`)

**Purpose:** Reveal the outcome after accusation.

Essential elements: - Correct/incorrect verdict. - Player's selected
suspect. - Actual culprit. - Explanation of the culprit's motive and
method. - Evidence-based reasoning connecting clues to the solution. -
Score total. - Score breakdown: base points, discovered-clue points and
hint penalties. - "Play Again" button.

Rules: - Results are available only after a valid accusation. - The
result endpoint must not return a result for an active case. - Explain
why the correct suspect is responsible and why major alternatives are
ruled out. - Never alter a completed score if the player reloads the
results page.

States: - Loading. - Results displayed. - Case not found. - Case not yet
completed. - Network/server error.

### 5.7 Responsive Behavior

-   **Mobile:** Single-column layout; stack suspect and clue cards; use
    full-width primary actions; keep navigation compact.
-   **Tablet:** Two-column layout where useful; prevent cards from
    becoming too narrow.
-   **Desktop:** Use a wider investigation workspace with separate
    suspect and evidence areas.
-   All pages must work at 320px viewport width and above without
    horizontal page overflow.
-   Buttons and interactive targets should be comfortably tappable.
-   Long stories and evidence should wrap without clipping.

------------------------------------------------------------------------

## 6. Mystery Content and Data Contract

### 6.1 Difficulty Configuration

The generated case must contain exactly the following counts:

  Difficulty     Suspects   Clues   Hints   Correct base score
  ------------ ---------- ------- ------- --------------------
  Easy                  3       5       2                  100
  Medium                4       7       3                  150
  Hard                  5       9       3                  200

Clue and hint counts refer to the complete case generated and stored by
the backend.

### 6.2 Public and Private Case Data

The database may store both public and private fields, but the API must
use an explicit response DTO/serializer. Never return a raw Mongoose
document.

**Public fields:** - Case ID, title, story and difficulty. - Suspect
IDs, names, roles, public profiles and alibis. - Clue IDs, neutral
titles, categories and discovery status. - Discovered clue content
only. - Hints already requested by the player. - Player progress and
case status.

**Private fields (server only until accusation):** -
`culpritSuspectId`. - Full solution and explanation. - Internal solution
rationale. - Any hidden clue content not yet discovered. - Any internal
AI validation notes.

After accusation, the Results API may return the culprit and
explanation. Do not expose private fields through error messages or logs
returned to the browser.

### 6.3 Expected Gemini Output Format

Ask Gemini to return strict JSON only. Do not trust the model's response
merely because the prompt requests JSON. Parse and validate it on the
server.

Example internal generation contract:

``` json
{
  "title": "The Last Gallery Light",
  "story": "A painting vanished during a private gallery event...",
  "difficulty": "easy",
  "suspects": [
    {
      "id": "suspect_1",
      "name": "Mira Sen",
      "role": "Gallery curator",
      "profile": "Managed the exhibition schedule.",
      "alibi": "Claims to have been in the archive."
    }
  ],
  "clues": [
    {
      "id": "clue_1",
      "title": "A strange timestamp",
      "category": "Digital record",
      "content": "The gallery access log records a door opening...",
      "evidenceType": "document",
      "relevance": "The timestamp conflicts with one suspect's alibi."
    }
  ],
  "hints": [
    "Compare the access log with the timeline.",
    "One alibi depends on an incorrect assumption about the gallery doors."
  ],
  "culpritSuspectId": "suspect_1",
  "solution": {
    "motive": "The culprit wanted to conceal...",
    "method": "The culprit used...",
    "explanation": "The access log and witness statement establish...",
    "clueReasoning": [
      {
        "clueId": "clue_1",
        "reason": "This evidence contradicts the culprit's stated timeline."
      }
    ],
    "alternativeSuspectExplanations": [
      {
        "suspectId": "suspect_2",
        "reasonRuledOut": "The independent timestamp confirms this suspect's alibi."
      }
    ]
  }
}
```

This is a schema illustration, not a complete valid case. The final
validator must check all required fields, references and counts. IDs
must be unique within their respective collections.

### 6.4 Evidence Types

Use a controlled set such as: - `chat_message` - `document` -
`witness_statement` - `photo_description` - `cctv_transcript` -
`audio_transcript` - `timeline_record` - `physical_evidence`

All evidence must be fictional. A "CCTV recording" in the first release
is a textual transcript or description, not a claim that the app has
accessed a real camera.

### 6.5 Mystery Logic Requirements

Every generated case must satisfy all of these: - Exactly one culprit
exists. - The culprit ID matches one generated suspect. - Every clue ID
and suspect reference is valid. - The evidence supports the culprit's
identity, motive or method. - The solution does not depend on facts that
are never revealed to the player. - The case has enough evidence to
distinguish the culprit from innocent suspects. - Suspect statements and
timeline details do not contradict the intended solution unless the
contradiction is an intentional, explainable deception. - Hints guide
the player toward relevant evidence without directly naming the
culprit. - The story, evidence and solution do not contain real private
personal data.

If validation fails, retry generation a limited number of times. If all
attempts fail, return a controlled generation error and do not save an
invalid case.

------------------------------------------------------------------------

## 7. Backend API Specification

### 7.1 API Conventions

Base path: `/api`

-   Use JSON request and response bodies.
-   Use standard HTTP status codes.
-   Use a consistent error format.
-   Validate all request bodies and route parameters.
-   Enforce case state transitions on the server.
-   Never trust client-submitted score, discovered clue count, hint
    count, culprit ID or result.
-   Set request size limits and rate limits, especially on AI generation
    and hint endpoints.

Standard error response:

``` json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please enter a valid mystery premise.",
    "details": [
      {
        "field": "premise",
        "message": "Premise must be at least 20 characters."
      }
    ]
  }
}
```

### 7.2 `POST /api/cases` --- Generate a Mystery

Request:

``` json
{
  "premise": "A priceless painting disappears during a locked-room gallery event.",
  "difficulty": "medium"
}
```

Success response (`201 Created`):

``` json
{
  "case": {
    "id": "case_id",
    "title": "The Silent Gallery",
    "story": "The gallery was locked when the painting disappeared...",
    "difficulty": "medium",
    "suspects": [
      {
        "id": "suspect_1",
        "name": "Mira Sen",
        "role": "Curator",
        "profile": "Organized the event.",
        "alibi": "Claims to have been in the archive."
      }
    ],
    "clues": [
      {
        "id": "clue_1",
        "title": "The access record",
        "category": "Digital record",
        "evidenceType": "document",
        "status": "locked"
      }
    ],
    "hintsRemaining": 3,
    "discoveredClueIds": [],
    "status": "active"
  }
}
```

The example is abbreviated. The actual response must contain the exact
required suspect and clue counts. It must not include clue content for
locked clues or any solution field.

Validation: - `premise`: string, trimmed length 20--500. - `difficulty`:
one of `easy`, `medium`, `hard`. - Reject unknown properties where
practical. - Apply generation rate limits.

Errors: - `400 VALIDATION_ERROR` - `429 RATE_LIMITED` -
`502 AI_GENERATION_FAILED` - `503 AI_SERVICE_UNAVAILABLE` -
`500 INTERNAL_SERVER_ERROR`

### 7.3 `GET /api/cases/:id` --- Retrieve Active Case

Success (`200 OK`) returns the same safe public case representation as
case creation, updated with current player progress. Discovered clues
include their content; locked clues do not.

Errors: - `400 INVALID_CASE_ID` - `404 CASE_NOT_FOUND` -
`500 INTERNAL_SERVER_ERROR`

If the case is complete, return a safe completed-case summary or direct
the client to the result endpoint. Do not reveal the result in this
endpoint unless the API contract explicitly permits it.

### 7.4 `POST /api/cases/:id/clues/:clueId/discover` --- Discover a Clue

Request:

``` json
{}
```

Success (`200 OK`):

``` json
{
  "clue": {
    "id": "clue_1",
    "title": "The access record",
    "category": "Digital record",
    "evidenceType": "document",
    "content": "The access log shows the east door opened at 9:14 PM."
  },
  "progress": {
    "discoveredClueCount": 1,
    "totalClueCount": 7
  }
}
```

Rules: - Case must exist and be active. - Clue must belong to the
case. - A clue can be discovered only once. - Repeated requests must not
award duplicate points. The server may return the already-discovered
clue with `200 OK`. - Discovery state is recorded by the server. - Score
is calculated later from persisted progress.

Errors: - `404 CASE_OR_CLUE_NOT_FOUND` - `409 CASE_ALREADY_COMPLETED` -
`400 INVALID_REQUEST`

### 7.5 `POST /api/cases/:id/hints` --- Request a Hint

Request:

``` json
{}
```

Success (`200 OK`):

``` json
{
  "hint": {
    "index": 1,
    "text": "Compare the door access time with each suspect's alibi."
  },
  "hintsUsed": 1,
  "hintsRemaining": 2
}
```

Rules: - Return the next stored hint in sequence; do not generate an
unbounded new hint on every request. - Increment the hint count exactly
once per successful new hint. - Do not reveal the culprit or full
solution. - Do not allow hints after case completion. - Repeated
requests must be treated as separate hint requests only when a new hint
is available. Prevent accidental duplicate network submissions in the
client.

Errors: - `404 CASE_NOT_FOUND` - `409 CASE_ALREADY_COMPLETED` -
`409 NO_HINTS_REMAINING` - `500 INTERNAL_SERVER_ERROR`

### 7.6 `POST /api/cases/:id/accuse` --- Submit an Accusation

Request:

``` json
{
  "suspectId": "suspect_2"
}
```

Success (`200 OK`):

``` json
{
  "result": {
    "isCorrect": false,
    "selectedSuspectId": "suspect_2",
    "score": 0,
    "scoreBreakdown": {
      "basePoints": 0,
      "cluePoints": 35,
      "hintPenalty": 10,
      "total": 25
    },
    "status": "completed"
  }
}
```

The example values above are illustrative; the actual total must follow
the scoring formula. A wrong accusation receives zero base points but
may retain earned clue points after hint penalties.

Rules: - `suspectId` is required and must belong to the case. - Only an
active case can be accused. - The backend compares the submitted ID with
the private culprit ID. - The backend computes and persists the result
atomically. - The first valid accusation completes the case. Further
accusations return `409 CASE_ALREADY_COMPLETED` and must not change the
result. - Do not accept any score or correctness value from the client.

Errors: - `400 VALIDATION_ERROR` - `404 CASE_OR_SUSPECT_NOT_FOUND` -
`409 CASE_ALREADY_COMPLETED` - `500 INTERNAL_SERVER_ERROR`

### 7.7 `GET /api/cases/:id/result` --- Retrieve Completed Result

Success (`200 OK`):

``` json
{
  "result": {
    "isCorrect": true,
    "selectedSuspectId": "suspect_1",
    "culprit": {
      "id": "suspect_1",
      "name": "Mira Sen"
    },
    "solution": {
      "motive": "The culprit wanted to conceal...",
      "method": "The culprit used...",
      "explanation": "The access log and witness statement establish...",
      "clueReasoning": []
    },
    "score": 155,
    "scoreBreakdown": {
      "basePoints": 150,
      "cluePoints": 35,
      "hintPenalty": 30,
      "total": 155
    }
  }
}
```

Rules: - Only completed cases may return solution data. - Active cases
return `409 CASE_NOT_COMPLETED`. - Repeated reads return the same
persisted result.

Errors: - `404 CASE_NOT_FOUND` - `409 CASE_NOT_COMPLETED` -
`500 INTERNAL_SERVER_ERROR`

### 7.8 Health Check

Recommended: `GET /api/health`

Returns service status without exposing secrets or database credentials.

------------------------------------------------------------------------

## 8. Database Design

### 8.1 `Case` Mongoose Model

Suggested document shape:

``` js
{
  premise: String,
  title: String,
  story: String,
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"]
  },

  suspects: [{
    id: String,
    name: String,
    role: String,
    profile: String,
    alibi: String
  }],

  clues: [{
    id: String,
    title: String,
    category: String,
    content: String,
    evidenceType: String,
    relevance: String
  }],

  hints: [String],

  solution: {
    culpritSuspectId: String,
    motive: String,
    method: String,
    explanation: String,
    clueReasoning: [{
      clueId: String,
      reason: String
    }],
    alternativeSuspectExplanations: [{
      suspectId: String,
      reasonRuledOut: String
    }]
  },

  progress: {
    discoveredClueIds: [String],
    hintsUsed: Number
  },

  accusation: {
    suspectId: String,
    isCorrect: Boolean,
    submittedAt: Date
  },

  score: {
    basePoints: Number,
    cluePoints: Number,
    hintPenalty: Number,
    total: Number
  },

  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active"
  },

  createdAt: Date,
  updatedAt: Date
}
```

### 8.2 Schema and Persistence Rules

-   Use Mongoose timestamps.
-   Require all fields needed by the game.
-   Enforce difficulty enum and status enum.
-   Ensure suspect, clue and hint IDs are unique within a case.
-   Validate that `solution.culpritSuspectId` references a suspect in
    the same case.
-   Validate clue reasoning references existing clue IDs.
-   Validate all alternative suspect references.
-   Store progress using unique clue IDs; do not store a client-provided
    count as authoritative.
-   Persist the completed accusation and score so results remain stable
    after refresh.
-   Consider indexes on `status`, `createdAt` and an ownership/session
    field if added.
-   Add automatic expiry (TTL) for anonymous cases if the product
    requires temporary retention.

### 8.3 Ownership and Anonymous Sessions

For a student/demo MVP, cases may be anonymous, but a case ID alone must
not be treated as a secure access credential. Before public deployment,
implement one of: - User authentication and case ownership, or - A
server-issued, high-entropy session token stored in a secure, HttpOnly
cookie and associated with the case.

Do not put private session tokens in URLs. Apply authorization checks to
every case endpoint.

------------------------------------------------------------------------

## 9. AI Behavior and Generation Pipeline

### 9.1 Gemini Responsibilities

Gemini generates: - Case title and narrative. - Suspects and public
profiles. - Evidence clues. - Ordered hints. - Hidden culprit and
complete solution. - Evidence-based explanation and alternative-suspect
reasoning.

Gemini does **not**: - Calculate player score. - Decide whether a
submitted accusation is correct after the case is saved. - Control case
status or player progress. - Authorize API requests. - Return data
directly to the frontend.

### 9.2 Generation Prompt Requirements

The backend prompt must instruct Gemini to: 1. Treat the user premise as
fictional. 2. Return only JSON matching the defined schema. 3. Generate
exactly the required number of suspects, clues and hints for the
selected difficulty. 4. Assign stable, unique IDs. 5. Choose exactly one
culprit from the suspect list. 6. Create a coherent timeline, motive and
method. 7. Ensure discoverable evidence supports the intended solution.
8. Ensure innocent suspects have plausible but explainable suspicious
details. 9. Make the case solvable using the provided story and clues.
10. Make hints progressive and non-spoiling. 11. Avoid graphic, hateful,
defamatory or sexually explicit content. 12. Avoid real personal data
and claims about real individuals.

### 9.3 Validation Pipeline

After Gemini responds:

1.  Check provider response and token/finish status.
2.  Extract the intended JSON safely; do not execute model output.
3.  Parse JSON.
4.  Validate schema and required types.
5.  Validate exact counts for difficulty.
6.  Validate unique IDs and all cross-references.
7.  Validate culprit ID belongs to suspects.
8.  Validate clue reasoning references valid clues.
9.  Validate alternative-suspect references.
10. Run a consistency check, which may include a second model review or
    deterministic checks.
11. Save only if all required checks pass.
12. Serialize and return public fields only.

A model-based consistency review is advisory, not a substitute for
deterministic validation. If a case fails validation, regenerate up to
two additional times (three total attempts). Apply a timeout to each
attempt. If all attempts fail, return `502 AI_GENERATION_FAILED` and do
not persist the invalid case.

### 9.4 AI Failure Handling

Handle: - Missing or invalid API key. - Provider rate limit. - Provider
timeout. - Malformed JSON. - Incomplete output due to token limits. -
Safety refusal. - Invalid counts or references. - Logically inconsistent
output.

Return a safe, user-friendly message. Do not return raw provider errors,
prompts, hidden solution data or secrets to the client. Log a
correlation ID and sanitized technical details server-side.

------------------------------------------------------------------------

## 10. Scoring Rules

### 10.1 Points

  Difficulty     Correct accusation base points
  ------------ --------------------------------
  Easy                                      100
  Medium                                    150
  Hard                                      200

Additional scoring: - Each uniquely discovered clue: `+5`. - Each hint
used: `−10`. - Minimum final score: `0`. - Incorrect accusation: `0`
base points. - Clue points are still awarded for discovered clues, even
if the accusation is incorrect, unless the product owner explicitly
changes this rule.

### 10.2 Formula

``` text
basePoints =
  correctAccusation ? difficultyBasePoints : 0

cluePoints =
  uniqueDiscoveredClueCount * 5

hintPenalty =
  hintsUsed * 10

finalScore =
  max(0, basePoints + cluePoints - hintPenalty)
```

The score is calculated only by the backend using persisted case state.

### 10.3 Example

A Medium case has: - Correct accusation: 150 base points. - 5 discovered
clues: 25 clue points. - 2 hints used: 20 penalty points.

Final score = `max(0, 150 + 25 - 20) = 155`.

### 10.4 Scoring Integrity

-   Never accept a score from the frontend.
-   Count unique discovered clue IDs from the database.
-   Count successful hint requests from the database.
-   Calculate score once at accusation time.
-   Persist the breakdown and final score.
-   Return the persisted score on subsequent result requests.
-   Protect accusation processing against duplicate requests and race
    conditions.

------------------------------------------------------------------------

## 11. Security, Privacy and Reliability

Minimum requirements:

-   Keep Gemini API credentials on the server.
-   Keep culprit and solution fields server-side until accusation.
-   Use explicit public response serializers; never return raw database
    documents.
-   Validate and sanitize all user input.
-   Use parameterized database operations through Mongoose; do not
    construct unsafe queries from raw user input.
-   Configure CORS for the deployed frontend origin.
-   Use HTTPS in production.
-   Apply rate limits to case generation and hint endpoints.
-   Set request body size limits.
-   Add secure headers with Helmet or equivalent.
-   Avoid logging API keys, session tokens, full private prompts or
    unnecessary personal data.
-   Use a secure session/ownership mechanism before exposing anonymous
    cases publicly.
-   Use safe error messages and centralized error handling.
-   Add request timeouts and bounded retries for Gemini.
-   Ensure case completion and score persistence are atomic.
-   Do not render model-generated HTML. Render generated content as
    escaped text.
-   Clearly label all AI-generated stories and evidence as fictional.

Authentication is not required for the initial MVP unless persistence
across devices is needed. If accounts are added, use a standard secure
authentication approach; never store plaintext passwords.

------------------------------------------------------------------------

## 12. Frontend State and API Integration

Recommended client state: - `case`: safe public case payload. -
`loading`: current request state. - `error`: display-safe error
message. - `selectedSuspectId`: accusation form selection. - `result`:
result payload returned after completion.

Rules: - The frontend is a presentation layer, not the authority for
progress or scoring. - Fetch the case after route load and refresh. -
Update the visible clue list only after a successful discover
response. - Update hint count only after a successful hint response. -
Disable controls while their corresponding request is pending. - Do not
optimistically mark clues or hints as completed unless rollback is
implemented. - Do not store solution data in local storage, session
storage or global client state before accusation. - Handle expired,
invalid or inaccessible case sessions gracefully.

------------------------------------------------------------------------

## 13. Testing Requirements

### 13.1 Backend Unit Tests

Test: - Difficulty configuration counts. - Premise and difficulty
validation. - Gemini response parsing. - Exact suspect/clue/hint count
validation. - Unique ID validation. - Culprit and cross-reference
validation. - Scoring formula for correct and incorrect accusations. -
Minimum score of zero. - Duplicate clue discovery behavior. - Hint limit
behavior. - Case state transition rules.

### 13.2 Backend Integration Tests

Test: - Create case successfully using a mocked Gemini response. -
Reject invalid request bodies. - Return a safe public case response
without hidden fields. - Discover a clue and retrieve its content. -
Prevent duplicate clue points. - Request hints until exhausted. - Reject
hints after completion. - Submit valid and invalid suspect IDs. - Reject
a second accusation. - Prevent result access before accusation. - Return
stable results after completion. - Handle database and Gemini failures.

### 13.3 Frontend Tests

Test: - Form validation and difficulty selection. - Loading and error
states. - Navigation between pages. - Suspect selection. - Clue
discovery updates. - Hint count updates. - Accusation submission. -
Results rendering. - Responsive layout and keyboard navigation.

### 13.4 End-to-End Smoke Test

1.  Open Home.
2.  Create a case with a valid premise at Easy difficulty.
3.  Verify 3 suspects, 5 clues and 2 hints.
4.  Discover at least one clue.
5.  Request a hint.
6.  Submit an accusation.
7.  Verify verdict, culprit, explanation and score.
8.  Refresh Results and verify the same persisted result.
9.  Start another case at Medium and Hard to verify their required
    counts.

Use mocked Gemini responses in automated tests so tests are
deterministic and do not require paid/live AI requests.

------------------------------------------------------------------------

## 14. Error Handling and User Messages

  -----------------------------------------------------------------------
  Situation                           Expected user-facing behavior
  ----------------------------------- -----------------------------------
  Empty premise                       "Please enter a mystery premise."

  Premise too short/long              Show the allowed character range.

  Unsupported difficulty              Ask the user to select a valid
                                      difficulty.

  Gemini unavailable                  "Mystery generation is temporarily
                                      unavailable. Please try again."

  Invalid AI output                   Retry generation on the server;
                                      show a safe failure if retries are
                                      exhausted.

  Case not found                      Show "This mystery could not be
                                      found." and a link to create a new
                                      one.

  Clue already discovered             Show its existing content; do not
                                      award points again.

  No hints left                       Show "You have used all available
                                      hints."

  Invalid suspect                     Ask the user to select a suspect
                                      from this case.

  Case already completed              Navigate to Results or show the
                                      saved result.

  Network error                       Explain that the request failed and
                                      provide a retry action.

  Unexpected server error             Show a generic message and
                                      correlation ID if available.
  -----------------------------------------------------------------------

Do not display stack traces, database errors, provider payloads or
secret configuration values in the UI.

------------------------------------------------------------------------

## 15. Deployment and Configuration

Production deployment must include: - Frontend built with
`npm run build` and hosted on a static hosting platform or compatible
service. - Express backend hosted on a Node.js-compatible service. -
MongoDB database reachable from the backend. - Gemini API key configured
as a backend secret. - Correct production `CLIENT_ORIGIN` and frontend
API base URL. - HTTPS for public traffic. - CORS restricted to the
intended frontend origin. - Health-check endpoint. - Production logging
without secrets. - Database backup/retention policy appropriate to the
deployment.

Document local setup, scripts, environment variables and deployment
steps in `README.md`.

------------------------------------------------------------------------

## 16. Project Limitations and Assumptions

-   Gemini output is probabilistic; schema and consistency validation
    reduce but cannot completely eliminate weak stories.
-   The first version uses fictional text-based evidence. Actual
    generated images or videos are future enhancements.
-   The first version does not integrate with WhatsApp, cameras, CCTV
    systems or real messaging platforms.
-   Anonymous case IDs do not provide robust ownership security by
    themselves.
-   AI generation may take several seconds and may fail due to provider
    quotas, network issues or model availability.
-   No guarantee is made that every generated mystery will be equally
    difficult for every player.
-   The app is an entertainment and educational puzzle experience, not a
    real investigation tool.
-   Cost controls, quotas and rate limits are required before broad
    public use.

------------------------------------------------------------------------

## 17. Final Deliverables

The completed project must include:

1.  React + Vite + Tailwind frontend.
2.  Node.js + Express backend.
3.  MongoDB database integration using Mongoose.
4.  Gemini API integration on the backend.
5.  Home, Create Mystery, Investigation Room, Accusation and Results
    pages.
6.  All required REST API endpoints.
7.  Mystery schema validation and solution privacy.
8.  Backend scoring and progress persistence.
9.  Error handling and responsive UI.
10. Unit, integration and end-to-end smoke tests.
11. `.env.example` files with placeholders only.
12. `README.md` with setup, run, test and deployment instructions.
13. This `SPEC.md`.
14. A deployed working application and source repository.

------------------------------------------------------------------------

## 18. Acceptance Criteria

The project is complete only when all mandatory criteria below pass.

### Functional

-   [ ] A user can open the Home page and start creating a mystery.
-   [ ] A user can submit a valid premise and choose Easy, Medium or
    Hard.
-   [ ] Gemini generates a case and the backend validates it before
    saving.
-   [ ] Easy cases contain exactly 3 suspects, 5 clues and 2 hints.
-   [ ] Medium cases contain exactly 4 suspects, 7 clues and 3 hints.
-   [ ] Hard cases contain exactly 5 suspects, 9 clues and 3 hints.
-   [ ] A player can retrieve and investigate an active case.
-   [ ] A player can discover clues and see their contents.
-   [ ] A clue cannot award points more than once.
-   [ ] A player can request hints up to the configured limit.
-   [ ] A player can submit one accusation from the case's suspect list.
-   [ ] A player can start another mystery after completion.

### Privacy and Integrity

-   [ ] The culprit ID and solution are absent from all pre-accusation
    API responses.
-   [ ] Locked clue contents are absent from pre-discovery API
    responses.
-   [ ] The Gemini API key is never sent to the frontend.
-   [ ] The backend, not the client, determines correctness and score.
-   [ ] Invalid suspect IDs and invalid state transitions are rejected.
-   [ ] A completed case cannot be accused again.
-   [ ] Result data is unavailable before accusation.
-   [ ] Reloading Results returns the same persisted verdict and score.

### Scoring

-   [ ] Correct base points are 100 Easy, 150 Medium and 200 Hard.
-   [ ] Each unique discovered clue adds 5 points.
-   [ ] Each used hint subtracts 10 points.
-   [ ] Final score never falls below zero.
-   [ ] Wrong accusations receive zero base points.
-   [ ] Score breakdown matches the persisted player progress.

### Quality and Delivery

-   [ ] All five required pages are implemented.
-   [ ] Loading, validation, empty and error states are handled.
-   [ ] Layout works on mobile, tablet and desktop.
-   [ ] Backend tests cover validation, privacy, scoring and state
    transitions.
-   [ ] The application runs using documented setup instructions.
-   [ ] Production deployment uses environment secrets and HTTPS.
-   [ ] The deployed website can complete the full
    create-investigate-accuse-results journey.

------------------------------------------------------------------------

## 19. Recommended Implementation Sequence

Implement in this order to reduce rework:

1.  Initialize repository, frontend and backend.
2.  Configure Tailwind, Express, MongoDB and environment validation.
3.  Define the Mongoose Case model and difficulty configuration.
4.  Implement deterministic validation and scoring services.
5.  Implement Gemini generation service with a mocked response for
    development.
6.  Implement generation, retrieval and public serialization endpoints.
7.  Implement clue discovery and hint endpoints.
8.  Implement accusation and result endpoints with atomic completion.
9.  Build shared frontend components and page layouts.
10. Connect frontend pages to the API.
11. Add loading, error and responsive states.
12. Add unit, integration and end-to-end tests.
13. Review solution-leakage security cases.
14. Deploy frontend, backend and database.
15. Run the full production smoke test and complete the acceptance
    checklist.

**Implementation rule for AI coding tools:** Read this specification
before making changes. Implement one sequence step at a time, preserve
the API and data contracts, do not invent undocumented features, and
update tests and documentation whenever a contract changes. Never weaken
the solution-privacy or backend-scoring requirements to make a feature
easier to implement.
