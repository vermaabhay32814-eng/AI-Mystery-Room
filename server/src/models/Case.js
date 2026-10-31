'use strict';

const mongoose = require('mongoose');

// ── Nested schemas ──────────────────────────────────────────────────────────

const SuspectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    profile: { type: String, required: true },
    alibi: { type: String, required: true },
  },
  { _id: false }
);

const ClueSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: String, required: true },
    evidenceType: {
      type: String,
      required: true,
      enum: [
        'document',
        'chat_message',
        'witness_statement',
        'photo_description',
        'cctv_transcript',
        'audio_transcript',
        'timeline_record',
        'physical_evidence',
      ],
    },
    relevance: { type: String, required: true },
  },
  { _id: false }
);

const ClueReasoningSchema = new mongoose.Schema(
  {
    clueId: { type: String, required: true },
    reason: { type: String, required: true },
  },
  { _id: false }
);

const AltSuspectExplanationSchema = new mongoose.Schema(
  {
    suspectId: { type: String, required: true },
    reasonRuledOut: { type: String, required: true },
  },
  { _id: false }
);

const SolutionSchema = new mongoose.Schema(
  {
    culpritSuspectId: { type: String, required: true },
    motive: { type: String, required: true },
    method: { type: String, required: true },
    explanation: { type: String, required: true },
    clueReasoning: [ClueReasoningSchema],
    alternativeSuspectExplanations: [AltSuspectExplanationSchema],
  },
  { _id: false }
);

const ProgressSchema = new mongoose.Schema(
  {
    discoveredClueIds: { type: [String], default: [] },
    hintsUsed: { type: Number, default: 0 },
  },
  { _id: false }
);

const AccusationSchema = new mongoose.Schema(
  {
    suspectId: { type: String },
    isCorrect: { type: Boolean },
    submittedAt: { type: Date },
  },
  { _id: false }
);

const ScoreSchema = new mongoose.Schema(
  {
    basePoints: { type: Number, default: 0 },
    cluePoints: { type: Number, default: 0 },
    hintPenalty: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { _id: false }
);

// ── Main Case schema ─────────────────────────────────────────────────────────

const CaseSchema = new mongoose.Schema(
  {
    premise: { type: String, required: true },
    title: { type: String, required: true },
    story: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    suspects: { type: [SuspectSchema], required: true },
    clues: { type: [ClueSchema], required: true },
    hints: { type: [String], required: true },
    solution: { type: SolutionSchema, required: true },
    progress: { type: ProgressSchema, default: () => ({}) },
    accusation: { type: AccusationSchema, default: () => ({}) },
    score: { type: ScoreSchema, default: () => ({}) },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Case', CaseSchema);
