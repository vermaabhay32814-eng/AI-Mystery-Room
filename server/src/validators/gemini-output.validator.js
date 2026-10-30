// server/src/validators/gemini-output.validator.js
import { z } from 'zod';

export const blueprintSchema = z.object({
  title: z.string().min(3),
  synopsis: z.string().min(20),
  incident: z.string().min(30),
  setting: z.object({
    location: z.string(),
    environment: z.string(),
    atmosphere: z.string()
  }),
  suspects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      age: z.number().optional(),
      role: z.string(),
      description: z.string(),
      motive: z.string(),
      alibi: z.string(),
      personality: z.string().optional(),
      knownFacts: z.array(z.string()).default([])
    })
  ).min(3),
  timeline: z.array(
    z.object({
      id: z.string(),
      time: z.string(),
      title: z.string(),
      description: z.string(),
      location: z.string().optional(),
      involvedSuspectIds: z.array(z.string()).default([])
    })
  ).min(3),
  solution: z.object({
    culpritSuspectId: z.string(),
    motive: z.string(),
    method: z.string(),
    opportunity: z.string(),
    decisiveClues: z.array(z.string()).min(2),
    explanation: z.string().min(50),
    redHerrings: z.array(
      z.object({
        clueOrSuspect: z.string(),
        misdirection: z.string(),
        truth: z.string()
      })
    ).default([])
  })
});

export const evidenceListSchema = z.array(
  z.object({
    id: z.string(),
    type: z.enum(['chat', 'image', 'cctv', 'document', 'witness_statement', 'forensic_report']),
    title: z.string(),
    description: z.string(),
    source: z.string(),
    timestamp: z.string().optional(),
    isDecisive: z.boolean().default(false),
    content: z.record(z.any()),
    linkedSuspectIds: z.array(z.string()).default([]),
    linkedTimelineEventIds: z.array(z.string()).default([]),
    authenticityLabel: z.string().default('FICTIONAL CASE EVIDENCE')
  })
).min(4);
