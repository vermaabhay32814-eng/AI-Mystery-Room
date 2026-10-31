'use strict';

const API_BASE = 'http://localhost:5000/api';
const CLIENT_BASE = 'http://localhost:5173';

const results = [];

function pass(name, details = '') {
  console.log(`  ✅ PASS: ${name}${details ? ` (${details})` : ''}`);
  results.push({ name, status: 'PASS', details });
}

function fail(name, error) {
  console.error(`  ❌ FAIL: ${name}: ${error}`);
  results.push({ name, status: 'FAIL', error });
}

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  let data = null;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = text;
  }
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('\n======================================================');
  console.log('   🔍 RUNNING FULL SYSTEM TEST SUITE: AI MYSTERY ROOM');
  console.log('======================================================\n');

  // 1. Frontend Connectivity
  console.log('--- 1. Frontend Web Server ---');
  try {
    const res = await fetch(CLIENT_BASE);
    if (res.ok && (await res.text()).includes('AI Mystery Room')) {
      pass('Frontend Vite dev server reachable and serving HTML');
    } else {
      fail('Frontend Vite dev server check', `HTTP ${res.status}`);
    }
  } catch (err) {
    fail('Frontend Vite dev server check', err.message);
  }

  // 2. Health check
  console.log('\n--- 2. Backend Health Check ---');
  try {
    const res = await request('/health');
    if (res.status === 200 && res.data.status === 'ok') {
      pass('Health check endpoint /api/health returned 200 OK');
    } else {
      fail('Health check endpoint', `Status ${res.status}`);
    }
  } catch (err) {
    fail('Health check endpoint', err.message);
  }

  // 3. User Authentication
  console.log('\n--- 3. Authentication & Authorization ---');
  const testUser = {
    username: `test_det_${Date.now()}`,
    email: `detective_${Date.now()}@scotlandyard.co.uk`,
    password: 'securePass123!',
  };
  let authToken = null;

  try {
    // 3a. Register
    const regRes = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(testUser),
    });
    if (regRes.status === 201 && regRes.data.token && regRes.data.user.username === testUser.username) {
      pass('User Registration /api/auth/register', `Registered ${testUser.username}`);
      authToken = regRes.data.token;
    } else {
      fail('User Registration', JSON.stringify(regRes.data));
    }

    // 3b. Duplicate email rejection
    const dupRes = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(testUser),
    });
    if (dupRes.status === 409) {
      pass('Duplicate Registration rejected with 409 Conflict');
    } else {
      fail('Duplicate Registration', `Expected 409, got ${dupRes.status}`);
    }

    // 3c. Login
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrUsername: testUser.username, password: testUser.password }),
    });
    if (loginRes.status === 200 && loginRes.data.token) {
      pass('User Login /api/auth/login with username');
    } else {
      fail('User Login', JSON.stringify(loginRes.data));
    }

    // 3d. Bad credentials
    const badLoginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrUsername: testUser.username, password: 'wrongpassword' }),
    });
    if (badLoginRes.status === 401) {
      pass('Invalid credentials rejected with 401 Unauthorized');
    } else {
      fail('Invalid credentials check', `Expected 401, got ${badLoginRes.status}`);
    }

    // 3e. Get current user profile
    const meRes = await request('/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (meRes.status === 200 && meRes.data.user.email === testUser.email) {
      pass('Authenticated /api/auth/me profile retrieval');
    } else {
      fail('Auth /me retrieval', JSON.stringify(meRes.data));
    }
  } catch (err) {
    fail('Auth suite error', err.message);
  }

  // 4. Input Validation on Case Creation
  console.log('\n--- 4. Premise & Difficulty Validation ---');
  try {
    // Too short (< 20 chars)
    const shortRes = await request('/cases', {
      method: 'POST',
      body: JSON.stringify({ premise: 'Too short', difficulty: 'easy' }),
    });
    if (shortRes.status === 400 && shortRes.data.error?.code === 'VALIDATION_ERROR') {
      pass('Premise under 20 chars correctly rejected with 400');
    } else {
      fail('Short premise validation', `Expected 400, got ${shortRes.status}`);
    }

    // Invalid difficulty
    const diffRes = await request('/cases', {
      method: 'POST',
      body: JSON.stringify({ premise: 'A valid mystery premise that has more than twenty characters.', difficulty: 'super_hard' }),
    });
    if (diffRes.status === 400) {
      pass('Invalid difficulty value correctly rejected with 400');
    } else {
      fail('Difficulty validation', `Expected 400, got ${diffRes.status}`);
    }
  } catch (err) {
    fail('Case validation suite', err.message);
  }

  // 5. Mystery Generation with Gemini (Live AI Generation)
  console.log('\n--- 5. AI Mystery Generation (Calling Gemini API) ---');
  let caseData = null;
  const testPremise = 'A sapphire necklace vanishes from a locked Victorian safe during an intimate midnight soirée.';
  
  try {
    console.log('  ⏳ Requesting Gemini to generate an Easy case (this may take 5-15s)...');
    const genRes = await request('/cases', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({
        premise: testPremise,
        difficulty: 'easy',
      }),
    });

    if (genRes.status === 201 && genRes.data.id) {
      caseData = genRes.data;
      pass('AI Mystery Generation /api/cases', `Title: "${caseData.title}"`);
    } else {
      fail('AI Mystery Generation', JSON.stringify(genRes.data));
      console.error('\nStopping tests due to generation failure.');
      return;
    }

    // Check exact counts according to SPEC
    // Easy: 3 suspects, 5 clues, 2 hints
    if (caseData.suspects.length === 3) {
      pass('Difficulty contract: exactly 3 suspects for Easy');
    } else {
      fail('Suspects count for Easy', `Expected 3, got ${caseData.suspects.length}`);
    }

    if (caseData.clues.length === 5) {
      pass('Difficulty contract: exactly 5 clues for Easy');
    } else {
      fail('Clues count for Easy', `Expected 5, got ${caseData.clues.length}`);
    }

    if (caseData.hintsRemaining === 2) {
      pass('Difficulty contract: exactly 2 hints for Easy');
    } else {
      fail('Hints count for Easy', `Expected 2, got ${caseData.hintsRemaining}`);
    }

    // Security Privacy checks (No Solution Leakage)
    if (caseData.culpritSuspectId === undefined && caseData.solution === undefined) {
      pass('SECURITY: Culprit and Solution are NOT exposed in public response');
    } else {
      fail('SECURITY: Culprit or solution leaked in public case!', JSON.stringify(caseData));
    }

    const lockedCluesHaveContent = caseData.clues.some((c) => c.status === 'locked' && c.content);
    if (!lockedCluesHaveContent) {
      pass('SECURITY: Locked clues do NOT leak their content text');
    } else {
      fail('SECURITY: Locked clues leaked content text!');
    }
  } catch (err) {
    fail('AI Mystery Generation error', err.message);
    return;
  }

  // 6. Active Case Retrieval
  console.log('\n--- 6. Active Case Retrieval ---');
  try {
    const getRes = await request(`/cases/${caseData.id}`);
    if (getRes.status === 200 && getRes.data.id === caseData.id) {
      pass('GET /api/cases/:id retrieves active case');
    } else {
      fail('GET /api/cases/:id', `Expected 200, got ${getRes.status}`);
    }
  } catch (err) {
    fail('Active Case Retrieval', err.message);
  }

  // 7. Clue Discovery
  console.log('\n--- 7. Clue Discovery Mechanism ---');
  const clueToDiscover = caseData.clues[0];
  try {
    const discRes = await request(`/cases/${caseData.id}/clues/${clueToDiscover.id}/discover`, {
      method: 'POST',
    });
    if (discRes.status === 200 && discRes.data.clues) {
      const updatedClue = discRes.data.clues.find((c) => c.id === clueToDiscover.id);
      if (updatedClue && updatedClue.status === 'discovered' && updatedClue.content) {
        pass('Clue Discovery unlocks content and marks status discovered');
      } else {
        fail('Clue Discovery content check', JSON.stringify(updatedClue));
      }
    } else {
      fail('Clue Discovery endpoint', JSON.stringify(discRes.data));
    }

    // Repeat discovery should not duplicate or error
    const repeatDiscRes = await request(`/cases/${caseData.id}/clues/${clueToDiscover.id}/discover`, {
      method: 'POST',
    });
    if (repeatDiscRes.status === 200) {
      pass('Re-discovering already discovered clue is safe (idempotent)');
    } else {
      fail('Repeat Clue Discovery', `Expected 200, got ${repeatDiscRes.status}`);
    }
  } catch (err) {
    fail('Clue Discovery suite', err.message);
  }

  // 8. Hint Requests & Limits
  console.log('\n--- 8. Progressive Hint Requests & Limits ---');
  try {
    // Hint 1
    const h1Res = await request(`/cases/${caseData.id}/hints`, { method: 'POST' });
    if (h1Res.status === 200 && h1Res.data.hintsUsed === 1 && h1Res.data.hintsRemaining === 1) {
      pass('Hint 1 successfully requested (hintsRemaining: 1)');
    } else {
      fail('Hint 1 request', JSON.stringify(h1Res.data));
    }

    // Hint 2
    const h2Res = await request(`/cases/${caseData.id}/hints`, { method: 'POST' });
    if (h2Res.status === 200 && h2Res.data.hintsUsed === 2 && h2Res.data.hintsRemaining === 0) {
      pass('Hint 2 successfully requested (hintsRemaining: 0)');
    } else {
      fail('Hint 2 request', JSON.stringify(h2Res.data));
    }

    // Hint 3 (Exhausted limit)
    const h3Res = await request(`/cases/${caseData.id}/hints`, { method: 'POST' });
    if (h3Res.status === 409 && h3Res.data.error?.code === 'NO_HINTS_REMAINING') {
      pass('Exhausted hints correctly rejected with 409 NO_HINTS_REMAINING');
    } else {
      fail('Exhausted hint request check', `Expected 409, got ${h3Res.status}`);
    }
  } catch (err) {
    fail('Hint requests suite', err.message);
  }

  // 9. Premature Result Check
  console.log('\n--- 9. Solution Privacy (Pre-Accusation) ---');
  try {
    const earlyRes = await request(`/cases/${caseData.id}/result`);
    if (earlyRes.status === 409 && earlyRes.data.error?.code === 'CASE_NOT_COMPLETED') {
      pass('SECURITY: GET /api/cases/:id/result returns 409 before accusation is submitted');
    } else {
      fail('SECURITY: Early result access not blocked!', `Expected 409, got ${earlyRes.status}`);
    }
  } catch (err) {
    fail('Pre-accusation check', err.message);
  }

  // 10. Accusation & Scoring Verification
  console.log('\n--- 10. Accusation & Scoring Verification ---');
  let finalResult = null;
  try {
    // Invalid suspect
    const badAccuseRes = await request(`/cases/${caseData.id}/accuse`, {
      method: 'POST',
      body: JSON.stringify({ suspectId: 'non_existent_suspect_id' }),
    });
    if (badAccuseRes.status === 400 && badAccuseRes.data.error?.code === 'INVALID_SUSPECT') {
      pass('Accusing non-existent suspect correctly rejected with 400');
    } else {
      fail('Invalid suspect accusation check', `Expected 400, got ${badAccuseRes.status}`);
    }

    // Valid accusation: accuse suspect 1
    const chosenSuspect = caseData.suspects[0];
    const accuseRes = await request(`/cases/${caseData.id}/accuse`, {
      method: 'POST',
      body: JSON.stringify({ suspectId: chosenSuspect.id }),
    });

    if (accuseRes.status === 200 && accuseRes.data.status === 'completed') {
      finalResult = accuseRes.data;
      pass('Accusation submitted successfully and case status is completed');
    } else {
      fail('Accusation submission', JSON.stringify(accuseRes.data));
      return;
    }

    // Verify Scoring Formula:
    // Easy base: 100 if correct, 0 if wrong
    // Discovered clues: 1 discovered * 5 = 5 pts
    // Hints used: 2 used * 10 = 20 pts penalty
    // Total = max(0, basePoints + 5 - 20)
    const isCorrect = finalResult.isCorrect ?? finalResult.accusation?.isCorrect;
    const expectedBase = isCorrect ? 100 : 0;
    const expectedCluePts = 1 * 5;
    const expectedHintPen = 2 * 10;
    const expectedTotal = Math.max(0, expectedBase + expectedCluePts - expectedHintPen);

    if (
      finalResult.score.basePoints === expectedBase &&
      finalResult.score.cluePoints === expectedCluePts &&
      finalResult.score.hintPenalty === expectedHintPen &&
      finalResult.score.total === expectedTotal
    ) {
      pass(
        'Scoring Formula strictly verified',
        `Base: ${expectedBase}, Clues: +${expectedCluePts}, Hints: -${expectedHintPen} => Total: ${expectedTotal} pts`
      );
    } else {
      fail('Scoring formula mismatch', JSON.stringify(finalResult.score));
    }

    // Verify Solution and Culprit are revealed AFTER accusation
    if (finalResult.solution && finalResult.solution.culpritSuspectId && finalResult.solution.motive) {
      pass('Culprit and narrative solution revealed after accusation');
    } else {
      fail('Post-accusation solution reveal', 'Missing solution data');
    }
  } catch (err) {
    fail('Accusation suite error', err.message);
  }

  // 11. Immutability of Completed Cases
  console.log('\n--- 11. Completed Case State Immutability ---');
  try {
    // Cannot accuse again
    const secondAccuse = await request(`/cases/${caseData.id}/accuse`, {
      method: 'POST',
      body: JSON.stringify({ suspectId: caseData.suspects[1].id }),
    });
    if (secondAccuse.status === 409 && secondAccuse.data.error?.code === 'CASE_ALREADY_COMPLETED') {
      pass('Second accusation strictly rejected with 409 CASE_ALREADY_COMPLETED');
    } else {
      fail('Repeat accusation check', `Expected 409, got ${secondAccuse.status}`);
    }

    // Cannot discover clues after completion
    const postClue = await request(`/cases/${caseData.id}/clues/${caseData.clues[1].id}/discover`, {
      method: 'POST',
    });
    if (postClue.status === 409) {
      pass('Discovering clues after case completion rejected with 409');
    } else {
      fail('Post-completion clue discovery', `Expected 409, got ${postClue.status}`);
    }

    // Cannot request hints after completion
    const postHint = await request(`/cases/${caseData.id}/hints`, { method: 'POST' });
    if (postHint.status === 409) {
      pass('Requesting hints after case completion rejected with 409');
    } else {
      fail('Post-completion hint request', `Expected 409, got ${postHint.status}`);
    }

    // Result endpoint returns persisted results stably
    const resultGet = await request(`/cases/${caseData.id}/result`);
    if (resultGet.status === 200 && resultGet.data.score.total === finalResult.score.total) {
      pass('GET /api/cases/:id/result returns identical persisted results upon refresh');
    } else {
      fail('Persistent result retrieval check', JSON.stringify(resultGet.data));
    }
  } catch (err) {
    fail('Immutability suite error', err.message);
  }

  // 12. User Stats & Dossier History
  console.log('\n--- 12. Detective Dossier & Career Statistics ---');
  try {
    const dossierRes = await request('/auth/my-cases', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (dossierRes.status === 200 && dossierRes.data.cases.some((c) => c.id === caseData.id)) {
      pass('Case appears in user dossier history /api/auth/my-cases');
    } else {
      fail('Dossier history verification', JSON.stringify(dossierRes.data));
    }

    const updatedProfile = await request('/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (updatedProfile.status === 200 && updatedProfile.data.user.stats.casesPlayed >= 1) {
      pass(
        'User career stats updated automatically',
        `Played: ${updatedProfile.data.user.stats.casesPlayed}, Solved: ${updatedProfile.data.user.stats.casesSolved}, Total Score: ${updatedProfile.data.user.stats.totalScore}`
      );
    } else {
      fail('User stats update check', JSON.stringify(updatedProfile.data));
    }
  } catch (err) {
    fail('User stats suite error', err.message);
  }

  // Summary
  console.log('\n======================================================');
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log(`   TOTAL TESTS: ${results.length}`);
  console.log(`   PASSED:      ${passed}`);
  console.log(`   FAILED:      ${failed}`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

