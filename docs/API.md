# AI Mystery Room — API Documentation

All API endpoints are prefixed with `/api/v1`.

## Standard Response Format

### Success
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Descriptive message"
  }
}
```

---

## 1. Authentication Endpoints

### `POST /auth/register`
- **Body:** `{ "name": "Detective Holmes", "email": "holmes@bakerst.com", "password": "securePassword123" }`
- **Response:** Sets HTTP-only cookie `token` and returns user profile.

### `POST /auth/login`
- **Body:** `{ "email": "holmes@bakerst.com", "password": "securePassword123" }`
- **Response:** Sets HTTP-only cookie `token` and returns user profile.

### `POST /auth/logout`
- **Response:** Clears the authentication cookie.

### `GET /auth/me`
- **Response:** Current authenticated user or 401 if unauthenticated.

---

## 2. Cases Endpoints

### `POST /cases`
- **Headers:** Authentication required
- **Body:**
  ```json
  {
    "scenario": "A rare museum artifact went missing during midnight hours.",
    "genre": "theft",
    "difficulty": "medium",
    "suspectCount": 4,
    "evidenceDensity": "standard"
  }
  ```
- **Response:** Returns created case metadata with `status: "generating"` or `"ready"`.

### `GET /cases`
- **Query Params:** `page` (default 1), `limit` (default 10)
- **Response:** Paginated list of owned cases.

### `GET /cases/:caseId`
- **Response:** Sanitized public case details (briefing, suspects, timeline, public evidence).

### `GET /cases/:caseId/status`
- **Response:** `{ "status": "ready" | "generating" | "failed" }`

### `DELETE /cases/:caseId`
- **Response:** Deletes case and associated progress.

---

## 3. Investigation Endpoints

### `GET /cases/:caseId/evidence`
- **Response:** Array of public evidence items.

### `GET /cases/:caseId/evidence/:evidenceId`
- **Response:** Detailed evidence item.

### `GET /cases/:caseId/progress`
- **Response:** Current user's investigation progress (opened evidence, detective notes, score).

### `PATCH /cases/:caseId/progress`
- **Body:** `{ "openedEvidenceId": "ev_1", "notes": [...] }`
- **Response:** Updated investigation progress.

### `POST /cases/:caseId/accusation`
- **Body:** `{ "suspectId": "suspect_2" }`
- **Response:** Culprit evaluation, score breakdown, and unlocked solution reveal.

### `GET /cases/:caseId/result`
- **Response:** Canonical solution, reconstruction timeline, and explanation (only available after accusation).

---

## 4. System Health

### `GET /health`
- **Response:** Status of server, uptime, and database connection state.
