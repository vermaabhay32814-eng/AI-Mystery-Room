# 🔍 AI Mystery Room

An AI-powered detective mystery game. Enter a short fictional premise, choose a difficulty, and Google Gemini generates a complete solvable mystery — suspects, evidence, clues and a hidden culprit. Investigate, discover clues, request hints, and make your accusation.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| AI | Google Gemini API |

---

## Prerequisites

- **Node.js** v18 or later
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI
- **Google Gemini API key** — get one at [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## Local Setup

### 1. Clone and enter the project

```bash
git clone <your-repo-url>
cd "AI Mystery Room"
```

### 2. Configure the backend

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/ai_mystery_room
GEMINI_API_KEY=your_real_api_key_here
GEMINI_MODEL=gemini-1.5-flash
CLIENT_ORIGIN=http://localhost:5173
```

Install backend dependencies:

```bash
npm install
```

### 3. Configure the frontend

```bash
cd ../client
cp .env.example .env
```

`client/.env` default is fine for local dev:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Install frontend dependencies:

```bash
npm install
```

---

## Running Locally

Open two terminals:

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
# App opens on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## API Endpoints

### Case Investigation
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Service health check |
| `POST` | `/api/cases` | Generate a new mystery (supports optional auth) |
| `GET` | `/api/cases/:id` | Get active case (public fields only) |
| `POST` | `/api/cases/:id/clues/:clueId/discover` | Discover a clue |
| `POST` | `/api/cases/:id/hints` | Request the next hint |
| `POST` | `/api/cases/:id/accuse` | Submit accusation & record stats |
| `GET` | `/api/cases/:id/result` | Get result (completed cases only) |

### Detective Authentication & History
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Enlist new detective (username, email, password) |
| `POST` | `/api/auth/login` | Sign in with email or username |
| `GET` | `/api/auth/me` | Fetch authenticated user profile & career stats |
| `GET` | `/api/auth/my-cases` | Fetch all historical cases created by the detective |
| `POST` | `/api/cases/:id/accuse` | Submit accusation |
| `GET` | `/api/cases/:id/result` | Get result (completed cases only) |

### Request/Response examples

**Create case:**
```bash
curl -X POST http://localhost:5000/api/cases \
  -H "Content-Type: application/json" \
  -d '{"premise": "A priceless painting vanished from a locked gallery during a private event.", "difficulty": "medium"}'
```

**Health check:**
```bash
curl http://localhost:5000/api/health
```

---

## Difficulty Settings

| Difficulty | Suspects | Clues | Hints | Base Score |
|---|---|---|---|---|
| Easy | 3 | 5 | 2 | 100 pts |
| Medium | 4 | 7 | 3 | 150 pts |
| Hard | 5 | 9 | 3 | 200 pts |

## Scoring Formula

```
basePoints  = correctAccusation ? difficultyBase : 0
cluePoints  = discoveredClues × 5
hintPenalty = hintsUsed × 10
finalScore  = max(0, basePoints + cluePoints − hintPenalty)
```

---

## Building for Production

**Build frontend:**

```bash
cd client
npm run build
# Output: client/dist/
```

**Start backend in production mode:**

```bash
cd server
NODE_ENV=production npm start
```

---

## Production Deployment

1. Host `client/dist/` on any static hosting (Vercel, Netlify, Cloudflare Pages, etc.)
2. Deploy the `server/` directory to any Node.js host (Railway, Render, Fly.io, etc.)
3. Set all environment variables as secrets on your hosting platform — **never commit `.env`**
4. Set `CLIENT_ORIGIN` on the backend to your frontend's production URL
5. Set `VITE_API_BASE_URL` in the frontend build to your backend's production URL
6. Use HTTPS for all production traffic
7. Ensure your MongoDB is reachable from the backend (Atlas recommended for production)

---

## Security Notes

- The Gemini API key is **server-side only** — never prefixed with `VITE_`, never sent to the browser
- The culprit identity and solution are **never included** in pre-accusation API responses
- Locked clue contents are **never sent** until the player discovers them
- All scoring and verdict logic runs **on the server** — the client cannot influence the score
- Rate limiting is applied: 5 mystery generations per 15 min per IP, 20 hint requests per 15 min per IP
- Helmet security headers and CORS restrictions are active

---

## Project Structure

```
AI Mystery Room/
├── client/                  # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── components/      # Navbar, Button, SuspectCard, ClueCard, HintPanel, ProgressBar
│   │   ├── pages/           # Home, CreateMystery, InvestigationRoom, Accusation, Results
│   │   ├── services/        # caseApi.js — all API calls
│   │   ├── hooks/           # useCase.js
│   │   └── utils/           # helpers.js
│   └── .env.example
│
├── server/                  # Node.js + Express backend
│   └── src/
│       ├── config/          # db.js — MongoDB connection
│       ├── controllers/     # caseController.js — route handlers + serializers
│       ├── middleware/       # errorHandler, notFound, rateLimiter
│       ├── models/          # Case.js — Mongoose schema
│       ├── routes/          # caseRoutes.js
│       ├── services/        # geminiService, mysteryValidator, scoringService
│       └── validators/      # caseValidators.js — express-validator rules
│
├── SPEC.md                  # Full project specification
└── README.md
```

---

## License

MIT

