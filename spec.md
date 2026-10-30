# AI Mystery Room — Master Specification

**Document:** `SPEC.md`  
**Purpose:** Single Source of Truth for Codex  
**Project Type:** Full-stack AI-powered mystery investigation game  
**Status:** Initial specification — MVP  
**Version:** 1.0.0

---

# 1. Project Overview

## 1.1 Product Description

AI Mystery Room is a web application where users become detectives and solve fictional mysteries generated from their own story prompts.

The user provides a short scenario, such as:

> A valuable diamond disappeared from a locked museum room during a private event. Five people were present, and each has a different story about what happened.

The backend uses Google's Gemini API to transform the scenario into a complete investigation containing:

- A fictional crime or mystery.
- A cast of suspects, each with a motive, background, and alibi.
- A chronological timeline of events.
- Evidence such as fictional WhatsApp conversations, CCTV reports, photographs, documents, and witness statements.
- Contradictions, red herrings, and hidden clues.
- One definitive culprit and a logically consistent explanation.
- An interactive investigation interface.
- A final accusation and case resolution.

The player examines the evidence, forms a theory, and selects the person they believe is responsible.

The application evaluates the accusation and reveals the solution with an explanation supported by the evidence.

## 1.2 Product Vision

Create an immersive, replayable detective experience in which the player feels like an investigator assembling a case from scattered digital evidence.

The experience should combine:

- Mystery storytelling.
- AI-generated narratives.
- Interactive evidence exploration.
- Logical deduction.
- Cinematic presentation.
- A satisfying final reveal.

## 1.3 Product Goals

1. Allow users to generate a playable mystery from a natural-language scenario.
2. Generate coherent, interconnected suspects, clues, and evidence using Gemini.
3. Present evidence through realistic-looking but explicitly fictional digital artifacts.
4. Allow players to investigate at their own pace.
5. Require a culprit selection before revealing the solution.
6. Explain why the selected culprit is correct or incorrect.
7. Provide a responsive, visually polished interface.
8. Persist cases and investigation progress for authenticated users.
9. Keep AI generation secure, reliable, and cost-controlled.

## 1.4 Non-Goals for MVP

The initial release will not include:

- Multiplayer investigations.
- Real police or criminal databases.
- Real WhatsApp, camera, or surveillance integrations.
- Real-person criminal accusations.
- Live video surveillance or recording.
- Public user-generated case marketplaces.
- Payments, subscriptions, or virtual currency.
- Voice-based interrogation.
- User-uploaded evidence images as an essential feature.
- AI-generated video files as a mandatory feature.

These features may be considered in future versions without changing the core application architecture.

---

# 2. Technology Stack

Use the following stack as the default implementation baseline. Do not introduce alternative frameworks without a documented reason.

## 2.1 Frontend

- React.js with Vite.
- JavaScript with JSX.
- React Router for navigation.
- Tailwind CSS for styling.
- A consistent component library built with reusable React components.
- Lucide React for icons.
- Axios for HTTP requests.
- React Context or a lightweight state store for global session and investigation state.

Use the current stable, mutually compatible package versions when setting up the project. Commit the package lockfile.

## 2.2 Backend

- Node.js.
- Express.js.
- MongoDB.
- Mongoose.
- Gemini API through the official Google Gen AI SDK for JavaScript.
- Zod for request and generated-data validation.
- JWT authentication using secure HTTP-only cookies.
- bcrypt or bcryptjs for password hashing.
- Helmet for HTTP security headers.
- express-rate-limit for request throttling.
- A maintained logging library for structured server logs.

## 2.3 AI

Provider: Google Gemini.

The backend must call Gemini using a configurable model name.

Environment variable:

`GEMINI_MODEL`

The actual model identifier must be selected from the currently available Gemini models and verified during setup. Never hardcode a deprecated model identifier throughout the application.

Use structured JSON generation where supported, followed by server-side schema validation.

## 2.4 Development Tools

- Git and GitHub.
- npm.
- ESLint.
- Prettier.
- Vitest for unit tests.
- Supertest for backend API tests.
- React Testing Library for frontend tests.

## 2.5 Repository Structure

Use a monorepo with separate frontend and backend applications.

```text
ai-mystery-room/
├── SPEC.md
├── README.md
├── .gitignore
├── package.json
├── client/
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── app/
│       │   ├── App.jsx
│       │   ├── router.jsx
│       │   └── providers.jsx
│       ├── components/
│       │   ├── layout/
│       │   ├── ui/
│       │   ├── mystery/
│       │   └── evidence/
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── CreateCasePage.jsx
│       │   ├── InvestigationPage.jsx
│       │   ├── CaseRevealPage.jsx
│       │   └── NotFoundPage.jsx
│       ├── hooks/
│       ├── services/
│       ├── context/
│       ├── utils/
│       ├── styles/
│       └── main.jsx
├── server/
│   ├── package.json
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   │   ├── gemini.service.js
│   │   │   ├── case-generation.service.js
│   │   │   ├── case-validation.service.js
│   │   │   ├── evidence.service.js
│   │   │   └── scoring.service.js
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── prompts/
│   │   ├── utils/
│   │   └── tests/
│   └── .env.example
└── docs/
    ├── ARCHITECTURE.md
    └── API.md
```

Keep `SPEC.md` authoritative. Other documentation must remain consistent with it.

---

# 3. User Roles and Authentication

## 3.1 Guest User

A guest can:

- Visit the landing page.
- Read the game introduction.
- View sample cases.
- Create a temporary demo investigation if the demo mode is enabled.

Guest access must have strict generation and storage limits.

## 3.2 Registered User

A registered user can:

- Register with a name, email, and password.
- Log in and log out.
- Create mystery cases.
- View their own cases.
- Resume an unfinished investigation.
- Review completed cases.
- Delete their own cases.
- View investigation results and scores.

## 3.3 Authentication Rules

- Validate email and password inputs.
- Normalize email addresses.
- Enforce unique email addresses.
- Hash passwords before storage.
- Issue JWTs in HTTP-only, Secure-in-production, SameSite cookies.
- Never store passwords or authentication tokens in localStorage.
- Protect private API routes with authentication middleware.
- Check ownership whenever a user accesses or modifies a case.
- Add login and registration rate limits.
- Provide a safe logout endpoint that clears the authentication cookie.

Password reset and email verification are optional future features.

---

# 4. Core User Journey

The primary experience must follow this flow:

1. User visits the landing page.
2. User clicks **Create a Mystery**.
3. User enters a scenario or story.
4. User optionally selects a genre, difficulty, and case length.
5. User submits the generation form.
6. Backend validates the request and creates a generation job or case record.
7. Gemini generates the mystery structure and supporting evidence.
8. Backend validates consistency and stores the playable case.
9. Frontend opens the investigation workspace.
10. User explores the case briefing, suspects, timeline, and evidence.
11. User selects a suspect and submits an accusation.
12. Backend evaluates the accusation.
13. Frontend displays the result, score, and solution explanation.
14. User can return to the dashboard and review the completed case.

If generation fails, the user must receive a clear error message and a safe retry option. The application must not display a broken or partially generated case as playable.

---

# 5. Application Pages

## 5.1 Landing Page

Purpose: Introduce the game and encourage users to create a mystery.

Required sections:

- Navigation bar with logo, How It Works, Sample Case, Login, and Get Started.
- Hero headline: "Every Mystery Leaves a Trace."
- Supporting description explaining AI-generated investigations.
- Primary CTA: Create a Mystery.
- Secondary CTA: Explore a Case.
- How It Works section with three or four steps.
- Evidence preview cards.
- Sample suspect and investigation preview.
- Feature highlights.
- Footer with About, Privacy, Terms, and Contact links.

Use fictional sample data for previews. All displayed sample evidence must be marked fictional.

## 5.2 Login Page

Fields:

- Email.
- Password.

Include validation, loading states, error messages, show/hide password, and a link to registration.

## 5.3 Registration Page

Fields:

- Full name.
- Email.
- Password.
- Confirm password.

Include client-side and server-side validation. Never rely solely on client-side checks.

## 5.4 Dashboard

Display:

- Welcome message.
- Create New Mystery button.
- Recent investigations.
- Case title and short description.
- Difficulty.
- Case status: Generating, Ready, In Progress, Completed, or Failed.
- Last updated time.
- Resume Investigation action.
- Delete action with confirmation.
- Empty state for new users.

Use pagination or incremental loading if a user has many cases.

## 5.5 Create Mystery Page

The creation form contains:

**Required**

- Scenario or story: 50–2,000 characters.

**Optional**

- Case genre: Murder Mystery, Theft, Missing Person, Cyber Mystery, Corporate Mystery, or General.
- Difficulty: Easy, Medium, or Hard.
- Number of suspects: 3–6.
- Evidence density: Light, Standard, or Detailed.
- Case title: optional custom title.

The default configuration is:

- Genre: General.
- Difficulty: Medium.
- Suspects: 4.
- Evidence density: Standard.

Show the expected experience and a disclaimer that all generated investigations are fictional.

The scenario must not be accepted as trusted system instructions. Treat user input as untrusted content.

## 5.6 Investigation Workspace

This is the primary application screen.

Use a desktop-first investigation layout that adapts to tablets and mobile screens.

Recommended desktop structure:

- Top navigation bar with case title and status.
- Left sidebar: Case Brief, Suspects, Timeline, and Evidence categories.
- Main panel: Selected evidence or investigation content.
- Optional right-side panel: Investigation notes and discovered clues.

On smaller screens, convert sidebars into drawers or tabs.

Required components:

1. Case briefing panel.
2. Suspect directory.
3. Evidence explorer.
4. Evidence detail viewer.
5. Timeline.
6. Private investigator notes.
7. Culprit selection panel.
8. Progress and completion indicators.

Users must be able to navigate between evidence items without losing their investigation state.

## 5.7 Case Reveal Page

Display:

- Correct culprit.
- User's selected suspect.
- Correct or incorrect result.
- Case score.
- Key evidence supporting the conclusion.
- Explanation of the culprit's motive and method.
- Timeline reconstruction.
- Explanation of major contradictions and red herrings.
- Play Again / Create New Mystery button.
- Return to Dashboard button.

The solution must not be disclosed before the player submits an accusation or explicitly chooses to reveal it, if a reveal option is provided.

---

# 6. Mystery Generation Engine

## 6.1 Core Requirement

Gemini must generate a complete, self-consistent mystery rather than disconnected pieces of fictional content.

The backend is responsible for orchestration, validation, persistence, and access control. Gemini is responsible for creative generation and reasoning.

Never allow the frontend to determine the correct culprit.

## 6.2 Generation Pipeline

Implement the following pipeline:

### Step 1: Validate Input

Check:

- Scenario length.
- Genre and difficulty.
- Suspect count.
- Evidence density.
- Authenticated user's generation quota.
- Input safety and malformed content.

Reject invalid requests before calling Gemini.

### Step 2: Create Case Record

Create a MongoDB record with status `generating`.

Generate a unique case identifier. Associate the case with its owner when the user is authenticated.

### Step 3: Generate the Case Blueprint

Ask Gemini to generate the canonical mystery structure first:

- Title and synopsis.
- Incident description.
- Setting and key locations.
- Suspect roster.
- Motives and alibis.
- Actual culprit.
- Actual sequence of events.
- Method and opportunity.
- Timeline.
- Evidence plan.
- Decisive clues.
- Red herrings.
- Solution explanation.

This blueprint is the canonical source for subsequent evidence generation.

### Step 4: Generate Evidence

Generate evidence from the blueprint, not from a new, independent interpretation of the original scenario.

The evidence must support the canonical timeline and culprit.

Generate multiple evidence types, including text artifacts and image descriptions or generated images where supported.

### Step 5: Validate Consistency

Run deterministic server-side checks for:

- Required fields.
- Valid suspect references.
- Unique evidence identifiers.
- Valid timestamps.
- Valid culprit references.
- Minimum number of evidence items.
- Presence of decisive clues.
- Presence of a valid solution explanation.
- Absence of internal solution fields in player-facing content.
- Referential integrity across evidence, suspects, and timeline events.

Optionally use a second Gemini call to review narrative consistency. This review is advisory; deterministic checks remain mandatory.

If the generated case is invalid, perform a limited repair attempt. If it still fails, mark generation as failed.

### Step 6: Store the Case

Save the canonical case and its evidence in MongoDB.

Separate secret solution data from player-visible data at the application-service and API-serialization layers.

### Step 7: Return Playable Data

Return only the sanitized case response, with status `ready`.

Never send the culprit identifier, hidden solution, private answer key, or secret generation prompt to the browser before the accusation is submitted.

## 6.3 Generation Statuses

Use:

- `generating`
- `ready`
- `in_progress`
- `completed`
- `failed`

Transitions must be controlled by the backend.

A failed generation must not count as a completed investigation. Retry behavior must avoid accidentally creating duplicate playable cases.

## 6.4 Generation Reliability

- Set explicit timeouts for Gemini requests.
- Retry transient errors a limited number of times with backoff.
- Validate and parse every generated response.
- Handle malformed JSON and incomplete responses.
- Limit output size and generation cost.
- Do not log API keys or full sensitive payloads.
- Provide meaningful error codes to the frontend.
- Use a configurable generation limit per user.

For the MVP, synchronous generation may be used if it reliably fits the request timeout. If generation is likely to exceed HTTP limits, implement a background job queue and polling endpoint. Do not leave requests hanging indefinitely.

---

# 7. Canonical Mystery Data Model

Store a case with two logical sections: player-visible content and private solution data.

The following is the conceptual model. Adapt field names only when needed for implementation consistency.

## 7.1 Case

```js
{
  _id: ObjectId,
  ownerId: ObjectId,
  title: String,
  originalScenario: String,
  genre: String,
  difficulty: String,
  status: String,

  publicCase: {
    synopsis: String,
    incident: String,
    setting: Object,
    suspects: [],
    timeline: [],
    evidence: [],
    evidencePlanSummary: String
  },

  privateSolution: {
    culpritSuspectId: String,
    motive: String,
    method: String,
    opportunity: String,
    canonicalTimeline: [],
    decisiveEvidenceIds: [],
    explanation: String,
    redHerringExplanations: []
  },

  generation: {
    model: String,
    attemptCount: Number,
    generatedAt: Date,
    generationVersion: String
  },

  createdAt: Date,
  updatedAt: Date,
  completedAt: Date
}
```

This is an illustrative structure, not a requirement to store all fields in a single MongoDB document. Use separate schemas or collections if that improves validation, performance, or security.

`ownerId` may be absent for guest cases. Guest cases must use a secure, unguessable identifier and an explicit expiration policy.

## 7.2 Suspect Schema

Every suspect must have:

- `id`: stable identifier within the case.
- `name`: fictional name.
- `age`: optional, where appropriate.
- `role`: relationship to the incident.
- `description`: short introduction.
- `motive`: player-visible motive or possible reason for involvement.
- `alibi`: claimed whereabouts.
- `personality`: concise behavioral description.
- `knownFacts`: facts the player can learn.
- `portraitAsset`: optional generated portrait reference.

The private solution may contain additional information about guilt, deception, and hidden motives.

Do not expose the correct culprit merely by using suspicious wording in the suspect introduction.

## 7.3 Evidence Schema

Every evidence item must have:

- `id`: stable identifier.
- `type`: one of the supported evidence types.
- `title`: concise title.
- `description`: short player-facing summary.
- `content`: type-specific content.
- `source`: fictional source or origin.
- `timestamp`: optional event time.
- `discovered`: whether the player has opened or discovered the item.
- `importance`: internal classification.
- `linkedSuspectIds`: suspects related to the evidence.
- `linkedTimelineEventIds`: associated events.
- `assetUrl`: optional generated image or media reference.
- `authenticityLabel`: fictional-content indicator.

Importance values may include `supporting`, `decisive`, and `red_herring`. These classifications must remain private until the solution is revealed.

Use an evidence union or equivalent validation schema so each evidence type has its own content structure.

## 7.4 Evidence Types

### A. Chat Transcript

Display a fictional messaging conversation with:

- Contact names or fictional identifiers.
- Message timestamps.
- Message content.
- Read receipts or delivery indicators where relevant.
- Conversation participants.

Do not connect to real WhatsApp accounts or use real private conversations.

### B. Image Evidence

Display a fictional photograph, location image, object image, or scene reconstruction.

The image must have:

- A meaningful title.
- A short description.
- An explanation of where it was supposedly found.
- Optional annotations or highlighted details.
- A stable asset URL when an actual image exists.

If image generation is unavailable, display a labeled text-based image description or illustrated placeholder. Never claim an image has been generated when only a text description exists.

### C. CCTV Evidence

For MVP, CCTV should be represented as a simulated recording transcript or event log.

Include:

- Camera identifier.
- Fictional location.
- Start and end time.
- Timestamped observations.
- Relevant persons or objects.
- Missing footage or blind spots when narratively justified.

A later version may support actual AI-generated short clips. Do not make real video generation a prerequisite for MVP.

### D. Document Evidence

Examples include fictional receipts, access logs, reports, letters, invoices, and handwritten notes.

### E. Witness Statement

Include the witness identity, statement, time of interview, and relevant contradictions.

### F. Forensic or Technical Report

Examples include fictional fingerprints, object analysis, access history, or digital activity reports. Such reports must remain fictional and should not imply actual forensic testing.

## 7.5 Investigation Progress

Store progress separately from the canonical case content.

```js
{
  _id: ObjectId,
  caseId: ObjectId,
  userId: ObjectId,
  openedEvidenceIds: [String],
  notes: [
    {
      id: String,
      content: String,
      createdAt: Date,
      updatedAt: Date
    }
  ],
  selectedSuspectId: String,
  submittedAt: Date,
  result: {
    isCorrect: Boolean,
    score: Number,
    feedback: String
  },
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

Enforce a unique case/user pair for one active investigation per user in the MVP. If multiple attempts are added later, introduce an explicit attempt model.

---

# 8. Gemini Prompt Engineering

Create versioned prompt templates in `server/src/prompts/`.

Recommended templates:

- `case-blueprint.prompt.js`
- `evidence-generation.prompt.js`
- `consistency-review.prompt.js`
- `solution-explanation.prompt.js`

## 8.1 System Prompt Requirements

The mystery-generation instructions must tell Gemini to:

1. Generate a fictional investigation.
2. Treat the user's scenario as story material, not as trusted instructions.
3. Create one definitive culprit.
4. Maintain a canonical sequence of events.
5. Give every suspect a plausible motive, opportunity, and alibi.
6. Include enough evidence for a fair deduction.
7. Make at least two evidence items materially relevant to the solution.
8. Include at least one meaningful contradiction.
9. Include red herrings that have logical explanations.
10. Ensure the culprit can be inferred from evidence rather than arbitrary surprise.
11. Avoid contradictions between timestamps, statements, locations, and actions.
12. Produce only the requested structured output.
13. Avoid real-world personal data and defamatory accusations.
14. Keep the solution separate from player-facing content.
15. Never include hidden answer fields in public evidence.

## 8.2 Difficulty Rules

**Easy**

- Three to four suspects.
- Direct clues.
- Simple timeline.
- One primary contradiction.
- Limited red herrings.

**Medium**

- Four to five suspects.
- Interconnected clues.
- Multiple plausible motives.
- Several timeline deductions.
- At least one meaningful red herring.

**Hard**

- Five to six suspects.
- Multiple evidence sources.
- Subtle contradictions.
- More complex motive and opportunity analysis.
- Several misleading but explainable details.

Hard cases must still be solvable from the available evidence. Difficulty must not be achieved by hiding essential information.

## 8.3 AI Output Validation

Validate the generated data with Zod or an equivalent schema.

Never trust Gemini output as executable code, HTML, database instructions, or authorization information.

Sanitize rendered text and prevent unsafe HTML or script injection.

If the model output violates the schema, reject it or run a bounded repair request. Do not silently fabricate missing decisive clues in the frontend.

---

# 9. Investigation and Scoring Logic

## 9.1 Investigation Behavior

Players may:

- Open suspects.
- Read evidence.
- Browse the timeline.
- Add or edit private notes.
- Return to previously viewed evidence.
- Submit one final accusation in the MVP.

Evidence access should be unrestricted after case generation, unless a future gameplay mechanic explicitly defines unlocking.

## 9.2 Accusation Flow

1. Player opens the accusation panel.
2. Player selects one suspect.
3. Player sees a confirmation prompt.
4. Player submits the accusation.
5. Backend verifies case ownership, case status, and suspect validity.
6. Backend compares the submitted suspect ID against the canonical culprit ID.
7. Backend stores the result.
8. Backend returns the permitted solution reveal.
9. Frontend renders the case result.

Do not trust a client-supplied `isCorrect`, score, culprit ID, or solution explanation.

## 9.3 Scoring

Implement a transparent 100-point scoring system:

- Correct culprit: 70 points.
- Evidence investigation: up to 20 points.
- Correct explanation or selection of decisive evidence, if implemented: up to 10 points.

For the MVP, the simplest implementation may award the investigation and explanation portions based on whether all decisive evidence items were opened and whether the player selected the correct decisive clues.

If evidence-selection gameplay is not implemented, omit the explanation points rather than inventing a score.

A wrong accusation receives zero culprit points, but may still receive investigation points.

Store the final score server-side and document the formula in a dedicated scoring service.

---

# 10. API Specification

Prefix all endpoints with `/api/v1`.

Return JSON consistently.

Standard success response:

```json
{
  "success": true,
  "data": {},
  "message": "Request completed"
}
```

Standard error response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check your input"
  }
}
```

Do not expose stack traces, database internals, Gemini prompts, API keys, or secret solution data in errors.

## 10.1 Authentication

| Method | Endpoint         | Purpose              |
| ------ | ---------------- | -------------------- |
| POST   | `/auth/register` | Register a user      |
| POST   | `/auth/login`    | Authenticate a user  |
| POST   | `/auth/logout`   | Clear authentication |
| GET    | `/auth/me`       | Return current user  |

## 10.2 Cases

| Method | Endpoint                | Purpose                         |
| ------ | ----------------------- | ------------------------------- |
| POST   | `/cases`                | Create a mystery generation job |
| GET    | `/cases`                | List the current user's cases   |
| GET    | `/cases/:caseId`        | Get sanitized case details      |
| GET    | `/cases/:caseId/status` | Check generation status         |
| DELETE | `/cases/:caseId`        | Delete an owned case            |

## 10.3 Investigation

| Method | Endpoint                              | Purpose                               |
| ------ | ------------------------------------- | ------------------------------------- |
| GET    | `/cases/:caseId/evidence`             | List public evidence                  |
| GET    | `/cases/:caseId/evidence/:evidenceId` | Get one evidence item                 |
| GET    | `/cases/:caseId/progress`             | Retrieve investigation progress       |
| PATCH  | `/cases/:caseId/progress`             | Update notes and discovered evidence  |
| POST   | `/cases/:caseId/accusation`           | Submit final suspect selection        |
| GET    | `/cases/:caseId/result`               | Retrieve a permitted completed result |

## 10.4 API Rules

- Validate route parameters and request bodies.
- Require authentication for private cases.
- Enforce case ownership on every protected operation.
- Return appropriate HTTP status codes.
- Paginate the case list.
- Prevent repeated final submissions unless an explicit retry mechanic is implemented.
- Make progress updates safe to retry.
- Keep public and private data serialization separate.
- Never expose the complete database document directly.

## 10.5 Case Creation Request

Example:

```json
{
  "scenario": "A diamond vanished during a museum event.",
  "genre": "theft",
  "difficulty": "medium",
  "suspectCount": 4,
  "evidenceDensity": "standard"
}
```

The response may initially return a case ID and `generating` status, followed by status polling until the case becomes ready or failed.

---

# 11. UI/UX and Visual Design System

## 11.1 Design Direction

Create a premium, cinematic detective investigation interface.

The product should feel like a modern digital investigation room, not a generic admin dashboard or a childish game.

Use:

- Deep charcoal and midnight backgrounds.
- Warm off-white primary text.
- Muted gray secondary text.
- Emerald or teal accents for interactive states.
- Amber accents for clues and warnings.
- Restrained red for danger or failed accusations.
- Subtle borders, soft shadows, and layered panels.

Avoid excessive neon, oversized gradients, excessive glassmorphism, and unnecessary animations.

## 11.2 Typography

Use a highly readable sans-serif typeface for the interface.

A restrained monospace font may be used for:

- Evidence IDs.
- Timestamps.
- Camera logs.
- Case references.
- Technical reports.

Maintain consistent typography hierarchy and sufficient contrast.

## 11.3 Reusable Components

Implement reusable components such as:

- `AppLayout`
- `Navbar`
- `Sidebar`
- `CaseCard`
- `CaseStatusBadge`
- `SuspectCard`
- `SuspectProfile`
- `EvidenceCard`
- `EvidenceViewer`
- `ChatTranscript`
- `CCTVLogViewer`
- `DocumentViewer`
- `Timeline`
- `CaseBriefing`
- `InvestigatorNotes`
- `AccusationModal`
- `CaseResult`
- `LoadingSkeleton`
- `EmptyState`
- `ErrorState`
- `ConfirmDialog`
- `Toast`

Use consistent spacing, radii, borders, focus states, and component variants.

## 11.4 Interactions

- Cards have clear hover and focus states.
- Evidence opens in a detail panel or modal.
- Important clues may be bookmarked.
- Timeline events can navigate to linked evidence.
- Suspect cards display relevant information without revealing the answer.
- Confirmation dialogs prevent accidental case deletion or accusation.
- Loading indicators communicate long-running AI generation.
- Animations are brief and purposeful.
- All essential interactions must work on keyboard and touch devices.

## 11.5 Responsive Design

Desktop: multi-panel investigation workspace.

Tablet: collapsible sidebar and flexible evidence panel.

Mobile: single-column interface with tabbed navigation and full-screen evidence views.

Avoid horizontal overflow, clipped controls, and unreadable evidence text.

## 11.6 Accessibility

- Semantic HTML.
- Keyboard navigation.
- Visible focus indicators.
- Accessible form labels.
- Appropriate ARIA attributes.
- Sufficient text contrast.
- Reduced-motion support.
- Meaningful image alternative text.
- Error messages associated with the relevant fields.

---

# 12. AI-Generated Media and Fictional Evidence

The MVP must support realistic-looking evidence without requiring every artifact to be a generated image or video.

## 12.1 Media Strategy

**Text artifacts:** Generate through Gemini.

**Image artifacts:** Generate through an image-generation provider or service, with the provider and model configurable independently of the Gemini text-generation model.

**CCTV:** Use simulated timestamped event logs in the MVP.

**Video:** Optional future enhancement.

The Gemini API must not be assumed to provide every required image or video-generation capability. Verify provider support and use an appropriate separate service when necessary.

## 12.2 Asset Management

- Store asset metadata and stable asset references in MongoDB.
- Store larger media files in object storage when available.
- Do not store large image binaries directly in case documents.
- Restrict private case assets to authorized users where appropriate.
- Validate asset types and file sizes.
- Use generated or licensed assets only.
- Provide graceful fallbacks if a media provider is unavailable.

## 12.3 Fictional Content Labeling

Every generated case and artifact must clearly communicate that it is fictional.

Examples:

- "FICTIONAL CASE"
- "SIMULATED CHAT TRANSCRIPT"
- "AI-GENERATED IMAGE"
- "SIMULATED CCTV LOG"

Do not present generated material as genuine evidence, actual private messages, real surveillance footage, or official forensic reports.

Use fictional identities and fictional contact details. Avoid impersonating real people or organizations.

---

# 13. Security and Privacy

Implement the following requirements from the beginning:

1. Keep Gemini API credentials exclusively on the server.
2. Use environment variables for all secrets.
3. Configure CORS to allow only the intended frontend origins.
4. Use secure authentication cookies.
5. Hash passwords using a suitable password-hashing algorithm.
6. Validate and sanitize all external input.
7. Protect against NoSQL injection and cross-site scripting.
8. Add request throttling to authentication and AI-generation routes.
9. Enforce ownership checks at the service layer.
10. Prevent unauthorized access to case assets.
11. Avoid logging passwords, tokens, secrets, and unnecessary private user data.
12. Add request and output size limits.
13. Apply Helmet and appropriate HTTP security headers.
14. Set appropriate timeouts for database and AI requests.
15. Handle MongoDB connection failures safely.
16. Avoid returning internal solution data before accusation submission.
17. Never trust generated JSON until validated.
18. Set data retention and guest-case expiration rules.
19. Provide a privacy notice describing AI-generated content and relevant data processing.
20. Do not send user data to external AI providers beyond what is needed for the requested generation.

The system must not use generated evidence to accuse real people of crimes. When user input identifies real individuals in a criminal allegation, steer the generation toward fictionalized characters and settings.

---

# 14. Environment Configuration

Create `server/.env.example` containing placeholders only.

```dotenv
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

MONGODB_URI=mongodb://127.0.0.1:27017/ai-mystery-room

JWT_SECRET=replace_with_a_strong_random_secret
JWT_EXPIRES_IN=1d

GEMINI_API_KEY=replace_with_your_gemini_api_key
GEMINI_MODEL=replace_with_a_supported_model_id

CASE_GENERATION_LIMIT_PER_HOUR=5
CASE_MAX_SCENARIO_LENGTH=2000

IMAGE_PROVIDER_API_KEY=
IMAGE_PROVIDER_MODEL=
ASSET_STORAGE_PROVIDER=
ASSET_STORAGE_BUCKET=
```

The application must fail fast with a clear configuration error if required production secrets are missing.

Never commit a real `.env` file.

Document the required Google AI API setup and how to obtain the selected Gemini model identifier.

---

# 15. Error Handling and Edge Cases

Handle at least the following scenarios:

- Empty scenario.
- Scenario below minimum length.
- Scenario exceeding the maximum length.
- Invalid genre or difficulty.
- Too many generation requests.
- User not authenticated.
- Expired or invalid session.
- Duplicate email registration.
- Incorrect login credentials.
- MongoDB unavailable.
- Gemini rate limit exceeded.
- Gemini request timeout.
- Gemini returns malformed output.
- Generated case fails consistency validation.
- Image provider unavailable.
- Case not found.
- User attempts to access another user's case.
- Evidence ID does not belong to the requested case.
- Invalid suspect selected.
- Accusation submitted twice.
- User refreshes during generation.
- User closes the browser during an investigation.
- User deletes a case with an active investigation.
- Case generation partially succeeds but persistence fails.

Each error must have a clear server-side handling strategy and a useful user-facing message.

Do not expose internal stack traces to end users.

---

# 16. Testing Requirements

## 16.1 Unit Tests

Test:

- Request validation.
- Generated-case schema validation.
- Case consistency checks.
- Culprit evaluation.
- Score calculation.
- Public/private response serialization.
- Ownership authorization helpers.

## 16.2 API Integration Tests

Test:

- Registration and login.
- Protected endpoints.
- Case creation.
- Generation failure handling.
- Case listing.
- Case deletion.
- Evidence access.
- Progress persistence.
- Correct and incorrect accusations.
- Unauthorized case access.
- Duplicate submissions.

Mock Gemini and media-provider requests during automated tests. Tests must not require paid API calls.

## 16.3 Frontend Tests

Test:

- Login and registration forms.
- Scenario submission.
- Generation loading and failure states.
- Case dashboard rendering.
- Evidence navigation.
- Suspect selection.
- Accusation confirmation.
- Case reveal.
- Responsive navigation behavior where practical.

## 16.4 End-to-End Acceptance Test

A complete smoke test must prove that a user can:

1. Register.
2. Log in.
3. Submit a scenario.
4. Generate a valid mystery using Gemini or a deterministic test fixture.
5. View at least three suspects.
6. Open several evidence items.
7. Save and reload investigation progress.
8. Submit a culprit selection.
9. View the result and explanation.
10. Return to the dashboard and find the completed case.

The test must also verify that secret solution data was not exposed before the accusation.

---

# 17. Performance and Operational Requirements

- Use database indexes for user email, case owner, case status, and investigation lookup.
- Avoid unnecessary repeated Gemini calls.
- Reuse generated case content rather than regenerating it on every page visit.
- Paginate large case lists.
- Lazy-load evidence images.
- Use loading skeletons for longer operations.
- Configure timeouts and bounded retries.
- Keep server logs structured and useful for debugging.
- Provide a health endpoint, `GET /api/v1/health`, that reports application health without exposing secrets.
- Support graceful server shutdown.
- Do not report the service as fully healthy when its essential database dependency is unavailable.

Generation quotas, maximum output sizes, and retry limits must be configurable.

---

# 18. Deployment Requirements

## Frontend

Deploy the Vite application to a suitable static hosting platform.

Configure the production API base URL and ensure client-side routing works after page refresh.

## Backend

Deploy Express to a Node.js-compatible hosting platform.

Configure environment variables, secure cookies, allowed CORS origins, request limits, and health checks.

## Database

Use MongoDB Atlas or another compatible MongoDB deployment.

Configure database credentials with least-privilege access and keep backups enabled where supported.

## AI Provider

Configure Gemini credentials and a supported model on the server.

If image generation is enabled, configure the media provider independently.

## Production Checklist

- [ ] Frontend deployed.
- [ ] Backend deployed.
- [ ] MongoDB connected.
- [ ] Gemini integration verified.
- [ ] Authentication cookies configured.
- [ ] CORS configured.
- [ ] Secrets stored securely.
- [ ] Health checks passing.
- [ ] Error states verified.
- [ ] Case ownership verified.
- [ ] Secret solution exposure tests passing.
- [ ] Fictional evidence labels visible.
- [ ] Production build and smoke tests passing.

---

# 19. Implementation Phases for Codex

Codex must implement the project incrementally while maintaining a working application.

## Phase 1: Repository and Foundation

- Create the monorepo.
- Set up React, Vite, Express, and MongoDB.
- Configure linting, formatting, environment files, and scripts.
- Add the health endpoint.
- Verify frontend-to-backend communication.

**Exit criteria:** Both applications start successfully and the API health check works.

## Phase 2: UI Design System

- Implement the global theme.
- Create layout components.
- Build the landing page.
- Build login, registration, dashboard, and creation pages.
- Add responsive layouts and shared components.

**Exit criteria:** All primary pages render consistently with working navigation.

## Phase 3: Authentication and Persistence

- Implement the user model.
- Add registration, login, logout, and current-user endpoints.
- Implement protected frontend routes.
- Add case and investigation-progress schemas.

**Exit criteria:** Users can authenticate and access only their own private data.

## Phase 4: Gemini Integration

- Configure the official Gemini SDK.
- Implement blueprint generation.
- Implement evidence generation.
- Add schema validation and consistency checks.
- Add bounded retry and failure handling.

**Exit criteria:** A valid fictional case can be generated and stored using the real Gemini integration.

## Phase 5: Investigation Experience

- Implement the case workspace.
- Render suspects, evidence, and timeline.
- Add evidence navigation.
- Implement investigator notes and progress persistence.
- Ensure progress survives page refresh.

**Exit criteria:** A player can investigate a generated case without losing progress.

## Phase 6: Accusation and Reveal

- Implement suspect selection.
- Add the accusation endpoint.
- Implement backend scoring.
- Reveal the canonical solution after submission.
- Display supporting evidence and the reconstructed timeline.

**Exit criteria:** Correct and incorrect accusations produce valid results without exposing the answer prematurely.

## Phase 7: AI Media and Polish

- Add simulated chat and CCTV viewers.
- Integrate image generation where configured.
- Add fictional-content labels.
- Refine empty, loading, and error states.
- Improve accessibility and mobile responsiveness.

**Exit criteria:** Evidence types are presented consistently, with functional fallbacks for unavailable media providers.

## Phase 8: Testing and Deployment

- Complete unit and integration tests.
- Run the end-to-end smoke test.
- Fix security and ownership issues.
- Write setup and deployment documentation.
- Verify production environment configuration.

**Exit criteria:** The application is deployable, documented, tested, and ready for an MVP release.

---

# 20. Definition of Done

The MVP is complete only when all mandatory criteria below are met.

- [ ] A polished landing page exists.
- [ ] Registration and login work.
- [ ] Protected routes and API endpoints work.
- [ ] Users can submit their own mystery scenarios.
- [ ] The backend generates a case using Gemini.
- [ ] Each case has a coherent incident, suspects, timeline, and evidence.
- [ ] Each case has exactly one canonical culprit.
- [ ] Evidence includes multiple artifact types, including chat transcripts and simulated CCTV logs.
- [ ] Image evidence works with actual generated assets or an explicitly labeled fallback.
- [ ] Public and private solution data are separated.
- [ ] Users can navigate evidence and save progress.
- [ ] Users can submit a culprit accusation.
- [ ] The backend evaluates the accusation.
- [ ] The solution is revealed after submission.
- [ ] Scoring follows the documented rules.
- [ ] Case ownership is enforced.
- [ ] Errors and AI failures are handled gracefully.
- [ ] Automated tests cover critical paths.
- [ ] The application works on desktop and mobile.
- [ ] Setup, environment variables, and deployment are documented.
- [ ] All generated evidence is clearly identified as fictional.

---

# 21. Rules Codex Must Follow

These rules apply throughout development.

1. **Read `SPEC.md` first.** Treat it as the authoritative product and technical specification.
2. Do not build a frontend-only demo when the requirement calls for a functional full-stack application.
3. Do not replace Gemini integration with hardcoded responses in production. Mock responses are permitted for tests and development fallback demonstrations only when clearly identified.
4. Do not invent unavailable API credentials or pretend an external integration works without verification.
5. Do not expose the culprit or private solution to the frontend before accusation submission.
6. Do not trust client-side ownership, scoring, or authorization checks.
7. Do not create fake image or video URLs and claim they are real assets.
8. Do not skip error handling, loading states, or request validation.
9. Reuse shared components and follow the repository structure.
10. Keep business logic in services rather than placing it entirely in route handlers or React components.
11. Keep environment secrets out of source control.
12. Use consistent naming, formatting, and error-response conventions.
13. Add or update tests whenever important behavior changes.
14. Run relevant tests and production builds after meaningful implementation milestones.
15. Keep `README.md`, `docs/API.md`, and `docs/ARCHITECTURE.md` aligned with the actual implementation.
16. If a requirement cannot be implemented as written, explain the limitation and propose the smallest compatible change.
17. If a new feature conflicts with this specification, follow the existing specification unless the project owner explicitly approves the change.
18. Do not silently remove a required feature to simplify implementation.
19. Prefer simple, maintainable architecture over unnecessary microservices or premature abstractions.
20. After each phase, report completed functionality, files changed, tests run, and remaining work.

# 22. Final Instruction

Build AI Mystery Room as a complete, maintainable, secure, AI-powered investigation platform.

Start by inspecting the repository and reading this specification. If the repository is empty, establish the project structure and complete Phase 1. If existing code is present, inspect it before changing anything.

Implement the project in the defined phases, keeping the application runnable throughout development.

Do not stop after creating the UI. Continue through authentication, database persistence, real Gemini integration, case validation, evidence exploration, investigation progress, accusation evaluation, result reveal, testing, and deployment documentation.

The final result must be a functional MVP in which a user can create a fictional mystery from a story, investigate AI-generated evidence, identify the culprit, and see a logically supported explanation of the solution.
