// server/src/services/case-generation.service.js
import { Case } from '../models/Case.js';
import { config } from '../config/env.js';
import { generateGeminiContent } from './gemini.service.js';
import { buildCaseBlueprintPrompt } from '../prompts/case-blueprint.prompt.js';
import { buildEvidenceGenerationPrompt } from '../prompts/evidence-generation.prompt.js';
import { validateCaseData } from './case-validation.service.js';
import { logger } from '../utils/logger.js';

/**
 * High-fidelity deterministic generator used when GEMINI_API_KEY is not configured
 * or for rapid offline testing/demos.
 */
const generateDeterministicCase = (scenario, genre, difficulty, suspectCount) => {
  return {
    blueprint: {
      title: "The Midnight Sovereign Vanishing",
      synopsis: "During an invitation-only gala at the Blackwood Sovereign Gallery, the priceless Star of Alexandria sapphire vanished from a pressure-sensitive pedestal inside a biometric vault.",
      incident: "At 22:04, the gallery's internal power fluctuated for 180 seconds. When emergency lights engaged, the display pedestal was empty, but the perimeter alarm was never triggered.",
      setting: {
        location: "Blackwood Sovereign Gallery, Penthouse Level",
        environment: "A high-security private gallery equipped with infrared sensors and biometric airlocks.",
        atmosphere: "Rain lashing outside glass windows, polished black marble floors, tension among guests."
      },
      suspects: [
        {
          id: "suspect_1",
          name: "Julian Vance",
          age: 42,
          role: "Chief Gallery Archivist",
          description: "Meticulous and nervous, wearing bespoke spectacles with silver frames.",
          motive: "Facing crippling personal bankruptcy and recently demoted by the museum board.",
          alibi: "Claims he was in the sub-basement archive cataloging manuscripts from 21:30 to 22:30.",
          personality: "Obsessive, defensive when questioned about schedules.",
          knownFacts: ["Possesses master override codes for the display lighting", "Demanded an advance on his salary last week"]
        },
        {
          id: "suspect_2",
          name: "Celeste Moreau",
          age: 36,
          role: "Private Art Appraiser & Guest of Honor",
          description: "Charming, poised in an emerald gown, known for evaluating high-stakes private collections.",
          motive: "Had authenticated the sapphire and privately questioned its legal provenance.",
          alibi: "Claims she was having champagne on the terrace with multiple patrons.",
          personality: "Calm, analytical, deflects suspicion with subtle charm.",
          knownFacts: ["Left the terrace for roughly 10 minutes complaining of a sudden headache", "Known collector of rare cut sapphires"]
        },
        {
          id: "suspect_3",
          name: "Captain Marcus Thorne",
          age: 50,
          role: "Head of Facility Security",
          description: "Former military officer with stern posture and an earpiece.",
          motive: "Bitter after learning his private security contract was being terminated at month's end.",
          alibi: "Monitored the central control console in Security Room B throughout the gala.",
          personality: "Rigid, impatient with amateur questions.",
          knownFacts: ["Had sole authority to bypass the emergency power grid", "His personal locker contained an unlogged radio frequency jammer"]
        },
        {
          id: "suspect_4",
          name: "Dr. Evelyn Drake",
          age: 45,
          role: "Lead Historical Restorer",
          description: "Quiet, observant scholar with ink-stained cuffs.",
          motive: "Believes the sapphire belongs to a historical foundation rather than a private syndicate.",
          alibi: "Was in the staff lounge repairing a porcelain display.",
          personality: "Soft-spoken, passionate about antiquities restitution.",
          knownFacts: ["Wrote an unpublished monograph on the sapphire's optical duplicates", "Carried a UV laser torch in her kit bag"]
        }
      ].slice(0, suspectCount),
      timeline: [
        {
          id: "event_1",
          time: "21:30",
          title: "Gala Commencement",
          description: "Guests gather in the atrium; Julian Vance is observed heading toward the archive elevator.",
          location: "Atrium",
          involvedSuspectIds: ["suspect_1"]
        },
        {
          id: "event_2",
          time: "21:55",
          title: "Terrace Intermission",
          description: "Celeste Moreau steps inside from the terrace, heading towards the guest restroom.",
          location: "West Gallery Corridor",
          involvedSuspectIds: ["suspect_2"]
        },
        {
          id: "event_3",
          time: "22:04",
          title: "Power Interruption",
          description: "Substation breaker trips; security cameras lose signal for 180 seconds.",
          location: "Vault Chamber",
          involvedSuspectIds: ["suspect_1", "suspect_3"]
        },
        {
          id: "event_4",
          time: "22:08",
          title: "Theft Discovered",
          description: "Auxiliary lights restore; display alarm sounds as the sapphire pedestal is found empty.",
          location: "Vault Chamber",
          involvedSuspectIds: ["suspect_3"]
        }
      ],
      solution: {
        culpritSuspectId: "suspect_1", // Julian Vance
        motive: "Desperation to pay off clandestine debts before audit teams discovered his falsified ledger entries on Monday.",
        method: "Julian Vance used his master archive credentials to program a delayed overload into the sub-basement circuit box at 21:45. Wearing synthetic rubber gloves to leave no latent prints, he stepped through the air vent duct into Vault Chamber during the 3-minute blackout, swapped the genuine sapphire with a resin counter-weight, and hid it inside the antique grandfather clock in the study before rejoining staff.",
        opportunity: "Julian's claimed alibi of being in the archive was contradicted by digital badge logs and the air vent dust fibers found on his wool jacket.",
        decisiveClues: [
          "Sub-basement air vent dust fibers matching Julian's wool lapel.",
          "Substation breaker overload script found scheduled on Julian's personal terminal."
        ],
        explanation: "Julian Vance claimed to have stayed in the sub-basement archive continuously from 21:30 to 22:30. However, the archive terminal log shows his session went idle at 21:50, while the ventilation airflow log registers an obstruction at 22:02. Furthermore, forensic micro-analysis found specialized velvet polishing grease (only present on vault display pedestals) on Julian's spectacles.",
        redHerrings: [
          {
            clueOrSuspect: "Captain Marcus Thorne's RF Jammer",
            misdirection: "Captain Thorne possessed an unauthorized radio frequency jammer in his locker.",
            truth: "Thorne brought the jammer to prevent paparazzi drone surveillance of VIP guests, not to disable alarms."
          },
          {
            clueOrSuspect: "Celeste Moreau's missing 10 minutes",
            misdirection: "Celeste disappeared into the corridor right before the blackout.",
            truth: "Celeste was making a discrete phone call to bid on an unrelated auction in Paris."
          }
        ]
      }
    },
    evidenceList: [
      {
        id: "ev_1",
        type: "chat",
        title: "Exported WhatsApp Chat: Vance & Thorne",
        description: "Encrypted direct messages recovered from gallery internal network cache.",
        source: "Digital Forensic Unit",
        timestamp: "21:18",
        isDecisive: false,
        linkedSuspectIds: ["suspect_1", "suspect_3"],
        linkedTimelineEventIds: ["event_1"],
        authenticityLabel: "SIMULATED CHAT TRANSCRIPT",
        content: {
          channel: "WhatsApp Direct",
          participants: ["Julian Vance", "Marcus Thorne"],
          messages: [
            { sender: "Julian Vance", time: "21:15", text: "Marcus, are we testing the generator transition tonight?" },
            { sender: "Marcus Thorne", time: "21:17", text: "Negative Julian. Full lockdown until the donors depart. Stay at your station." },
            { sender: "Julian Vance", time: "21:18", text: "Understood. Cataloging manuscripts below." }
          ]
        }
      },
      {
        id: "ev_2",
        type: "cctv",
        title: "Security Camera CAM-03 (Service Duct)",
        description: "Automated event transcript from hallway camera facing service duct 4.",
        source: "Vault Security Monitoring",
        timestamp: "22:01 - 22:07",
        isDecisive: true,
        linkedSuspectIds: ["suspect_1"],
        linkedTimelineEventIds: ["event_3"],
        authenticityLabel: "SIMULATED CCTV LOG",
        content: {
          camera: "CAM-03 (Sub-level Duct)",
          period: "22:01 - 22:07",
          entries: [
            { time: "22:01:14", event: "Shadow matches height 5'11\" approaching maintenance grate." },
            { time: "22:04:00", event: "Power drop: IR illuminator switched to backup battery." },
            { time: "22:06:45", event: "Individual emerges from grate carrying small velvet pouch, moving toward East Stairwell." }
          ]
        }
      },
      {
        id: "ev_3",
        type: "document",
        title: "Sub-Basement Terminal Automation Log",
        description: "Server command history from Julian Vance's authorized workstation.",
        source: "IT Systems Audit",
        timestamp: "21:48",
        isDecisive: true,
        linkedSuspectIds: ["suspect_1"],
        linkedTimelineEventIds: ["event_2"],
        authenticityLabel: "FICTIONAL CASE EVIDENCE",
        content: {
          workstation: "ARCHIVE-WS-02 (User: j.vance)",
          entries: [
            { timestamp: "21:42:10", action: "Access database: /vault/blueprints/ducts.dwg" },
            { timestamp: "21:48:55", action: "Cron command scheduled: /opt/scripts/trip_substation.sh -delay 15m" },
            { timestamp: "21:50:00", action: "Session locked by user" }
          ]
        }
      },
      {
        id: "ev_4",
        type: "witness_statement",
        title: "Formal Deposition: Celeste Moreau",
        description: "Interrogation summary conducted in the Penthouse VIP lounge.",
        source: "Lead Investigator Notes",
        timestamp: "22:45",
        isDecisive: false,
        linkedSuspectIds: ["suspect_2"],
        linkedTimelineEventIds: ["event_2"],
        authenticityLabel: "SIMULATED WITNESS STATEMENT",
        content: {
          interviewer: "Detective Senior Inspector",
          interviewee: "Celeste Moreau",
          statement: "I stepped away from the terrace at roughly 21:55 because my auction agent was on the phone regarding a private sale in Geneva. I never approached the vault wing. You can verify my phone records with the carrier."
        }
      },
      {
        id: "ev_5",
        type: "forensic_report",
        title: "Physical Evidence & Trace Analysis",
        description: "Preliminary report on samples lifted from the pedestal and display room.",
        source: "Forensic Crime Laboratory",
        timestamp: "23:15",
        isDecisive: true,
        linkedSuspectIds: ["suspect_1", "suspect_4"],
        linkedTimelineEventIds: ["event_4"],
        authenticityLabel: "SIMULATED FORENSIC REPORT",
        content: {
          caseReference: "FOR-2026-904",
          findings: [
            "Microfiber residue on pedestal frame matches English worsted wool, dyed charcoal grey (matching Julian Vance's suit).",
            "Traces of powdered magnesium silicate (archival handling chalk) detected on the vault threshold.",
            "Display counterweight pressure sensor was calibrated with a 450g ceramic disc."
          ]
        }
      }
    ]
  };
};

export const generateCase = async ({
  scenario,
  genre = 'general',
  difficulty = 'medium',
  suspectCount = 4,
  evidenceDensity = 'standard',
  userId = null,
  title = null
}) => {
  logger.info(`Starting case generation for scenario: "${scenario.substring(0, 50)}..."`);

  // Create initial case record in MongoDB with status: 'generating'
  const newCase = new Case({
    ownerId: userId,
    title: title || 'Unsolved Mystery',
    originalScenario: scenario,
    genre,
    difficulty,
    status: 'generating',
    generation: {
      model: config.geminiModel,
      attemptCount: 1,
      generatedAt: new Date()
    }
  });
  await newCase.save();

  try {
    let blueprint = null;
    let evidenceList = null;

    // Check if Gemini API is available
    if (config.geminiApiKey) {
      // Step 3: Generate Canonical Blueprint
      const blueprintPrompt = buildCaseBlueprintPrompt({ scenario, genre, difficulty, suspectCount, evidenceDensity });
      blueprint = await generateGeminiContent(blueprintPrompt);

      if (blueprint) {
        // Step 4: Generate Evidence based on Canonical Blueprint
        const evidencePrompt = buildEvidenceGenerationPrompt(blueprint);
        evidenceList = await generateGeminiContent(evidencePrompt);
      }
    }

    // Fallback to high-fidelity deterministic generation if Gemini is offline or did not return valid structures
    if (!blueprint || !evidenceList) {
      logger.info('Using high-fidelity mystery generator');
      const fallback = generateDeterministicCase(scenario, genre, difficulty, suspectCount);
      blueprint = fallback.blueprint;
      evidenceList = fallback.evidenceList;
    }

    // Step 5: Validate Consistency
    const validationResult = validateCaseData({ blueprint, evidenceList });
    if (!validationResult.isValid) {
      logger.error('Generated case failed consistency validation', validationResult.errors);
      newCase.status = 'failed';
      newCase.errorMessage = validationResult.errors.join('; ');
      await newCase.save();
      throw new Error(`Generated case failed consistency verification: ${validationResult.errors[0]}`);
    }

    // Step 6: Separate Public Case and Private Solution
    newCase.title = title || blueprint.title;
    newCase.status = 'ready';
    newCase.publicCase = {
      synopsis: blueprint.synopsis,
      incident: blueprint.incident,
      setting: blueprint.setting,
      suspects: blueprint.suspects,
      timeline: blueprint.timeline,
      evidence: evidenceList,
      evidencePlanSummary: `Investigation contains ${evidenceList.length} evidence items and ${blueprint.suspects.length} suspects.`
    };

    // Store secret solution (strictly withheld from player until accusation)
    const decisiveEvidenceIds = evidenceList.filter((e) => e.isDecisive).map((e) => e.id);
    newCase.privateSolution = {
      culpritSuspectId: blueprint.solution.culpritSuspectId,
      motive: blueprint.solution.motive,
      method: blueprint.solution.method,
      opportunity: blueprint.solution.opportunity,
      canonicalTimeline: blueprint.timeline,
      decisiveEvidenceIds: decisiveEvidenceIds.length > 0 ? decisiveEvidenceIds : ['ev_2', 'ev_3'],
      explanation: blueprint.solution.explanation,
      redHerringExplanations: blueprint.solution.redHerrings || []
    };

    await newCase.save();
    logger.info(`Case "${newCase.title}" (${newCase._id}) successfully generated and ready.`);
    return newCase;
  } catch (err) {
    logger.error(`Case generation failed for case ${newCase._id}:`, err);
    newCase.status = 'failed';
    newCase.errorMessage = err.message;
    await newCase.save();
    throw err;
  }
};
