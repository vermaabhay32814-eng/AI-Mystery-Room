// server/src/services/evidence.service.js

/**
 * Sanitizes evidence items so that secret fields like `isDecisive` or internal importance classifications
 * are never sent to the browser during the investigation.
 */
export const sanitizeEvidenceForPlayer = (evidenceList = []) => {
  return evidenceList.map((item) => {
    const raw = typeof item.toObject === 'function' ? item.toObject() : { ...item };
    delete raw.isDecisive;
    delete raw.importance;
    return raw;
  });
};

/**
 * Validates that an evidence item has appropriate fictional labeling.
 */
export const ensureFictionalLabel = (item) => {
  if (!item.authenticityLabel) {
    switch (item.type) {
      case 'chat':
        item.authenticityLabel = 'SIMULATED CHAT TRANSCRIPT';
        break;
      case 'cctv':
        item.authenticityLabel = 'SIMULATED CCTV LOG';
        break;
      case 'image':
        item.authenticityLabel = 'AI-GENERATED IMAGE';
        break;
      default:
        item.authenticityLabel = 'FICTIONAL CASE EVIDENCE';
    }
  }
  return item;
};

