// server/src/prompts/evidence-generation.prompt.js

export const buildEvidenceGenerationPrompt = (blueprint) => {
  return `You are the Lead Digital Forensic Analyst for "AI Mystery Room".

YOUR OBJECTIVE:
Generate an interconnected suite of realistic fictional digital evidence artifacts strictly based on the following canonical mystery blueprint:

CANONICAL BLUEPRINT:
Title: ${blueprint.title}
Incident: ${blueprint.incident}
Suspects: ${JSON.stringify(blueprint.suspects.map(s => ({ id: s.id, name: s.name, role: s.role, alibi: s.alibi })))}
Canonical Culprit: ${blueprint.solution.culpritSuspectId}
Decisive Clues Needed: ${JSON.stringify(blueprint.solution.decisiveClues)}
Red Herrings: ${JSON.stringify(blueprint.solution.redHerrings)}

REQUIRED EVIDENCE SUITE:
Generate between 5 and 8 evidence items with diverse types:
1. "chat": Simulated WhatsApp / instant messaging conversation between suspects or contacts.
2. "cctv": Simulated security camera log / timestamped observational transcript with camera IDs.
3. "document": Fictional receipts, digital badge swipes, email transcripts, flight boarding passes, or encrypted notes.
4. "witness_statement": Formal interview transcript conducted by the lead detective.
5. "forensic_report": Technical analysis, e.g. biometric door log, WiFi router DHCP leases, audio recording decibel logs, or dust residue.
6. "image": Fictional photograph or floor plan (provide title, description, finding location, visual inspection notes).

CRITICAL REQUIREMENTS:
- At least 2 evidence items must have "isDecisive": true, containing the decisive clues that break the culprit's alibi or reveal their method.
- At least 1-2 evidence items must have misdirection supporting the red herrings.
- Keep timestamps and locations meticulously consistent with the blueprint timeline.
- Mark all items with authenticityLabel: "FICTIONAL CASE EVIDENCE".

RETURN STRICTLY A SINGLE JSON ARRAY (without markdown formatting, without backticks, without code blocks) of evidence objects:
[
  {
    "id": "ev_1",
    "type": "chat",
    "title": "Leaked WhatsApp Transcript between Curator & Security",
    "description": "Exported message log extracted from backup archive.",
    "source": "Fictional Cloud Backup Extractor",
    "timestamp": "21:15",
    "isDecisive": false,
    "linkedSuspectIds": ["suspect_1", "suspect_2"],
    "linkedTimelineEventIds": ["event_1"],
    "authenticityLabel": "SIMULATED CHAT TRANSCRIPT",
    "content": {
      "channel": "Direct Messages",
      "participants": ["Arthur Vance", "Elena Rostova"],
      "messages": [
        { "sender": "Arthur Vance", "time": "21:14", "text": "Are the display case sensors active tonight?" },
        { "sender": "Elena Rostova", "time": "21:15", "text": "Standard protocol. Why are you asking?" }
      ]
    }
  },
  {
    "id": "ev_2",
    "type": "cctv",
    "title": "East Wing Corridor Camera Log",
    "description": "Automated motion tracking log from camera CAM-04.",
    "source": "Museum Security Subsystem 4",
    "timestamp": "21:40 - 22:10",
    "isDecisive": true,
    "linkedSuspectIds": ["suspect_1"],
    "linkedTimelineEventIds": ["event_2"],
    "authenticityLabel": "SIMULATED CCTV LOG",
    "content": {
      "camera": "CAM-04 (East Gallery)",
      "period": "21:40 - 22:10",
      "entries": [
        { "time": "21:42", "event": "Motion detected. Person in dark overcoat enters service doorway." },
        { "time": "21:55", "event": "Camera power fluctuation, 90 seconds of signal dropout." },
        { "time": "21:58", "event": "Motion detected. Person exits carrying small briefcase." }
      ]
    }
  }
]`;
};
