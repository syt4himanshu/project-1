import type { ClassificationSummary, SupportPlan, PaginatedResponse } from '../types/classification';

const getAuthHeaders = () => {
  let token = '';
  try {
    const sessionStr = localStorage.getItem('kys.auth.session');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      token = session.accessToken || '';
    }
  } catch (e) {
    // Ignore
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Use environment variable or relative path if proxied
const API_BASE = import.meta.env.VITE_API_URL || '';

export const classificationApi = {
  getSummary: async (): Promise<ClassificationSummary> => {
    const res = await fetch(`${API_BASE}/api/admin/classifications/summary`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch classification summary');
    return res.json();
  },

  getStudents: async (filters: Record<string, string | number>): Promise<PaginatedResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
    
    const res = await fetch(`${API_BASE}/api/admin/classifications?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },

  addSupportPlan: async (data: Partial<SupportPlan>): Promise<SupportPlan> => {
    const res = await fetch(`${API_BASE}/api/admin/classifications/support-plan`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add support plan');
    return res.json();
  },

  getSupportPlans: async (studentId: string | number): Promise<SupportPlan[]> => {
    const res = await fetch(`${API_BASE}/api/admin/classifications/support-plans/${studentId}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch support plans');
    return res.json();
  },

  updateSupportPlan: async ({ planId, data }: { planId: string, data: Partial<SupportPlan> }): Promise<SupportPlan> => {
    const res = await fetch(`${API_BASE}/api/admin/classifications/support-plans/${planId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update support plan');
    return res.json();
  }
};
