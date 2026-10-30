// client/src/services/investigation.service.js
import api from './api.js';

export const investigationService = {
  getEvidenceList: (caseId) => api.get(`/cases/${caseId}/evidence`),
  getEvidenceItem: (caseId, evidenceId) => api.get(`/cases/${caseId}/evidence/${evidenceId}`),
  getProgress: (caseId) => api.get(`/cases/${caseId}/progress`),
  updateProgress: (caseId, data) => api.patch(`/cases/${caseId}/progress`, data),
  submitAccusation: (caseId, suspectId) => api.post(`/cases/${caseId}/accusation`, { suspectId }),
  getResult: (caseId) => api.get(`/cases/${caseId}/result`)
};

