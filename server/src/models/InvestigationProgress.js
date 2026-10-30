// server/src/models/InvestigationProgress.js
import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const investigationProgressSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    openedEvidenceIds: [{ type: String }],
    notes: [noteSchema],
    selectedSuspectId: { type: String },
    submittedAt: { type: Date },
    result: {
      isCorrect: { type: Boolean },
      score: { type: Number },
      feedback: { type: String },
      breakdown: {
        culpritScore: { type: Number, default: 0 },
        evidenceScore: { type: Number, default: 0 },
        clueScore: { type: Number, default: 0 }
      }
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
      index: true
    }
  },
  { timestamps: true }
);

// Compound index to ensure 1 active investigation per user per case
investigationProgressSchema.index({ caseId: 1, userId: 1 }, { unique: true });

export const InvestigationProgress = mongoose.model('InvestigationProgress', investigationProgressSchema);
