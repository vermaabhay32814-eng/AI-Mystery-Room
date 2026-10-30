// server/src/tests/validation.test.js
import { describe, it, expect } from 'vitest';
import { validateCaseData } from '../services/case-validation.service.js';

describe('Case Validation Service (SPEC.md Section 6.2 Step 5)', () => {
  const validBlueprint = {
    title: 'The Stolen Chronometer',
    synopsis: 'A rare pocket watch vanished from the captain\'s quarters during rough seas.',
    incident: 'At 23:00, the ship\'s chronometer was missing from the locked mahogany cabinet.',
    setting: {
      location: 'The HMS Sovereign',
      environment: 'Mid-Atlantic gale',
      atmosphere: 'Creaking timber and whistling wind'
    },
    suspects: [
      { id: 'suspect_1', name: 'First Mate Evans', role: 'First Mate', description: 'Stern', motive: 'Debts', alibi: 'On deck' },
      { id: 'suspect_2', name: 'Cook Pierre', role: 'Head Cook', description: 'Jovial', motive: 'Greed', alibi: 'In galley' },
      { id: 'suspect_3', name: 'Quartermaster Lee', role: 'Quartermaster', description: 'Silent', motive: 'Revenge', alibi: 'In store' }
    ],
    timeline: [
      { id: 'ev_t1', time: '22:00', title: 'Inspection', description: 'Watch verified intact' },
      { id: 'ev_t2', time: '22:45', title: 'Light failure', description: 'Lantern extinguished' },
      { id: 'ev_t3', time: '23:00', title: 'Theft discovered', description: 'Empty cabinet' }
    ],
    solution: {
      culpritSuspectId: 'suspect_1',
      motive: 'Gambling debts in port',
      method: 'Used duplicate cabinet key',
      opportunity: 'Was relieved from watch 15 minutes early',
      decisiveClues: ['Brass key shavings on Evans\'s coat', 'Galley lantern unlit'],
      explanation: 'Evans claimed he was on deck, but the deck log shows he left 15 minutes before 23:00.',
      redHerrings: []
    }
  };

  const validEvidence = [
    {
      id: 'ev_1',
      type: 'chat',
      title: 'Signal Log',
      description: 'Morse message transcript',
      source: 'Radio room',
      isDecisive: false,
      content: { text: 'All calm' },
      linkedSuspectIds: ['suspect_1']
    },
    {
      id: 'ev_2',
      type: 'document',
      title: 'Watch Roster',
      description: 'Deck watch log',
      source: 'Bridge',
      isDecisive: true,
      content: { entry: 'Evans relieved early at 22:40' },
      linkedSuspectIds: ['suspect_1']
    },
    {
      id: 'ev_3',
      type: 'forensic_report',
      title: 'Metal Shavings',
      description: 'Fibers on Evans coat',
      source: 'Ship doctor',
      isDecisive: true,
      content: { finding: 'Brass shavings match master key' },
      linkedSuspectIds: ['suspect_1']
    },
    {
      id: 'ev_4',
      type: 'witness_statement',
      title: 'Pierre Deposition',
      description: 'Cook account',
      source: 'Galley',
      isDecisive: false,
      content: { statement: 'I was baking hardtack' },
      linkedSuspectIds: ['suspect_2']
    }
  ];

  it('passes validation when blueprint and evidence satisfy all criteria', () => {
    const result = validateCaseData({
      blueprint: validBlueprint,
      evidenceList: validEvidence
    });

    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('fails validation when culpritSuspectId does not exist in suspect roster', () => {
    const invalidBlueprint = {
      ...validBlueprint,
      solution: { ...validBlueprint.solution, culpritSuspectId: 'suspect_ghost' }
    };

    const result = validateCaseData({
      blueprint: invalidBlueprint,
      evidenceList: validEvidence
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('does not match any suspect'))).toBe(true);
  });

  it('fails validation when fewer than 2 decisive clues are present', () => {
    const nonDecisiveEvidence = validEvidence.map((e) => ({ ...e, isDecisive: false }));

    const result = validateCaseData({
      blueprint: validBlueprint,
      evidenceList: nonDecisiveEvidence
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('requires at least 2 decisive'))).toBe(true);
  });
});
