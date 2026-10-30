// client/src/services/case.service.js
import api from './api.js';

export const caseService = {
  createCase: (data) => api.post('/cases', data),
  getCases: (params) => api.get('/cases', { params }),
  getCaseById: (caseId) => api.get(`/cases/${caseId}`),
  getCaseStatus: (caseId) => api.get(`/cases/${caseId}/status`),
  deleteCase: (caseId) => api.delete(`/cases/${caseId}`)
};

