import { api } from "../helper/apiHelper";

// Requests API
export const getAvailableWorkers = () => api.get('/requests/available/workers');
export const sendRequest = (requestData) => api.post('/requests', requestData);
export const acceptRequest = (requestId) => api.put(`/requests/${requestId}/accept`);
export const rejectRequest = (requestId) => api.put(`/requests/${requestId}/reject`);
export const cancelRequest = (requestId) => api.put(`/requests/${requestId}/cancel`);
export const getUserRequests = () => api.get('/requests');