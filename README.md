# AI Mystery Room 🔍🕵️‍♂️

**AI Mystery Room** is a full-stack, AI-powered mystery investigation game. Players provide a short scenario or story prompt, and Google Gemini transforms it into a complete, self-consistent, playable detective case filled with suspects, evidence artifacts (simulated WhatsApp chats, CCTV logs, documents, witness statements, forensic reports), timelines, contradictions, and one definitive culprit.

---

## 🚀 Features

- **Dynamic Case Generation:** Uses Google Gemini to generate structured case blueprints, connected suspects, timelines, and rich digital evidence artifacts.
- **Interactive Investigation Workspace:** Browse case briefings, interrogate suspect dossiers, inspect multiple evidence types, piece together the timeline, and take private detective notes.
- **Accusation & Scoring Engine:** Submit an accusation against your prime suspect. Earn points for identifying the culprit, discovering critical evidence, and connecting decisive clues.
- **Post-Case Reveal:** Comprehensive case breakdown explaining the culprit's motive and method, reconstructing the canonical timeline, and clarifying red herrings.
- **Noir Cinematic UI:** Desktop-first dark-mode interface built with Tailwind CSS, Lucide icons, and responsive layouts.
- **Enterprise-Grade Security:** HTTP-only JWT cookies, bcrypt password hashing, input sanitization, rate limiting, and zero-knowledge client protection (culprit and solution keys are never sent to the browser prior to accusation).

---

## 🛠️ Tech Stack

- **Frontend:** React 18 (Vite), Tailwind CSS, Lucide React, Axios, React Router v6.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Zod, JSON Web Tokens.
- **AI:** Google Gemini API via official SDK (`@google/genai` / `@google/generative-ai`).
- **Testing:** Vitest, Supertest, MongoDB In-Memory Server.

---

## 🏁 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (optional for local dev: the server auto-falls back to an in-memory database if no local MongoDB is detected)
- A [Google Gemini API Key](https://aistudio.google.com/)

### 2. Setup Environment
Copy the example environment file:
```bash
cp server/.env.example server/.env
```
Edit `server/.env` and add your `GEMINI_API_KEY`:
```dotenv
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Servers
Start both the backend server and frontend client concurrently:
```bash
npm run dev
```
- Client runs at: `http://localhost:5173`
- Server API runs at: `http://localhost:5000`

---

## 📂 Project Architecture

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/API.md`](docs/API.md) for detailed architecture diagrams, database models, and API specifications.
