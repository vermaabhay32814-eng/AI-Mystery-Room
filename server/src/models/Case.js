// server/src/models/Case.js
import mongoose from 'mongoose';
import { isDbConnected } from '../config/db.js';
import { inMemoryStore } from '../config/in-memory-db.js';

const suspectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number },
    role: { type: String, required: true },
    description: { type: String, required: true },
    motive: { type: String, required: true },
    alibi: { type: String, required: true },
    personality: { type: String },
    knownFacts: [{ type: String }],
    portraitAsset: { type: String }
  },
  { _id: false }
);

const timelineEventSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    time: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String },
    involvedSuspectIds: [{ type: String }]
  },
  { _id: false }
);

const evidenceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['chat', 'image', 'cctv', 'document', 'witness_statement', 'forensic_report']
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    source: { type: String, required: true },
    timestamp: { type: String },
    linkedSuspectIds: [{ type: String }],
    linkedTimelineEventIds: [{ type: String }],
    assetUrl: { type: String },
    authenticityLabel: { type: String, default: 'FICTIONAL CASE EVIDENCE' }
  },
  { _id: false }
);

const caseSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    title: { type: String, required: true },
    originalScenario: { type: String, required: true },
    genre: {
      type: String,
      required: true,
      enum: ['theft', 'murder', 'missing_person', 'cyber', 'corporate', 'general'],
      default: 'general'
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    status: {
      type: String,
      required: true,
      enum: ['generating', 'ready', 'in_progress', 'completed', 'failed'],
      default: 'generating',
      index: true
    },
    errorMessage: { type: String },

    publicCase: {
      synopsis: { type: String },
      incident: { type: String },
      setting: {
        location: { type: String },
        environment: { type: String },
        atmosphere: { type: String }
      },
      suspects: [suspectSchema],
      timeline: [timelineEventSchema],
      evidence: [evidenceSchema],
      evidencePlanSummary: { type: String }
    },

    privateSolution: {
      culpritSuspectId: { type: String, required: true },
      motive: { type: String, required: true },
      method: { type: String, required: true },
      opportunity: { type: String, required: true },
      canonicalTimeline: [{ type: mongoose.Schema.Types.Mixed }],
      decisiveEvidenceIds: [{ type: String }],
      explanation: { type: String, required: true },
      redHerringExplanations: [
        {
          clueOrSuspect: { type: String },
          misdirection: { type: String },
          truth: { type: String }
        }
      ]
    },

    generation: {
      model: { type: String },
      attemptCount: { type: Number, default: 1 },
      generatedAt: { type: Date, default: Date.now },
      generationVersion: { type: String, default: '1.0.0' }
    },

    completedAt: { type: Date }
  },
  { timestamps: true }
);

caseSchema.methods.toPublicJSON = function () {
  const caseObj = this.toObject();
  delete caseObj.privateSolution;
  return caseObj;
};

const MongooseCase = mongoose.model('Case', caseSchema);

export class Case {
  constructor(data) {
    if (isDbConnected()) {
      return new MongooseCase(data);
    }
    return inMemoryStore.cases.create(data);
  }

  static find(filter) {
    return isDbConnected() ? MongooseCase.find(filter) : inMemoryStore.cases.find(filter);
  }

  static findById(id) {
    return isDbConnected() ? MongooseCase.findById(id) : inMemoryStore.cases.findById(id);
  }

  static countDocuments(filter) {
    return isDbConnected() ? MongooseCase.countDocuments(filter) : inMemoryStore.cases.countDocuments(filter);
  }

  static findByIdAndDelete(id) {
    return isDbConnected() ? MongooseCase.findByIdAndDelete(id) : inMemoryStore.cases.findByIdAndDelete(id);
  }
}
