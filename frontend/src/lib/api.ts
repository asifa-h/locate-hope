import type { AuthUser } from '../context/AuthContext';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  'http://localhost:5000';

export type ApiError = {
  message: string;
};

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...rest } = options;

  const finalHeaders: Record<string, string> = {};

  if (!(rest.body instanceof FormData)) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...rest, headers: finalHeaders });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      typeof data === 'string'
        ? data
        : (data as ApiError)?.message || 'Request failed';
    throw new Error(message);
  }

  return data as T;
}

export function loginApi(payload: {
  email: string;
  password: string;
}): Promise<{ token: string; user: AuthUser }> {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function registerApi(payload: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'user' | 'admin' | 'ngo';
}): Promise<{ token: string; user: AuthUser }> {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getUserDashboard(token: string) {
  return request<{
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
      role: string;
      trust_score: number;
      total_reports: number;
      verified_reports: number;
    };
    rewards: Array<{
      id: number;
      title: string;
      description: string | null;
      coupon_code: string | null;
      sponsor: string | null;
      expires_at: string | null;
      note: string | null;
      created_at: string;
    }>;
  }>('/api/user/me', { token });
}

export function getUserReports(token: string) {
  return request<{ reports: any[] }>('/api/reports', { token });
}

export function getNearbyOrganizations(
  token: string,
  latitude: number,
  longitude: number,
  options?: { category?: string; radiusKm?: number },
) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
  });
  if (options?.category) params.set('category', options.category);
  if (options?.radiusKm) params.set('radius_km', String(options.radiusKm));

  return request<{
    organizations: Array<{
      id: number;
      name: string;
      category: string;
      phone: string | null;
      capacity_total: number | null;
      capacity_available: number | null;
      latitude: number;
      longitude: number;
      distance_m: number;
    }>;
  }>(`/api/organizations/nearby?${params.toString()}`, { token });
}

export function submitReport(
  token: string,
  formData: FormData,
): Promise<{ report: any }> {
  return request('/api/reports', {
    method: 'POST',
    body: formData,
    token,
  });
}

export function getAdminReports(token: string) {
  return request<{ reports: any[] }>('/api/admin/reports', { token });
}

export function getAdminStats(token: string) {
  return request<{
    reportsByStatus: Array<{ status: string; count: number }>;
    reportsByUrgency: Array<{ urgency: string; count: number }>;
    dailyReports: Array<{ date: string; count: number }>;
    totalUsers: number;
    totalNgos: number;
  }>('/api/admin/stats', { token });
}

export function getAdminOrganizations(token: string) {
  return request<{ organizations: any[] }>('/api/admin/organizations', {
    token,
  });
}

export function createOrganization(token: string, payload: any) {
  return request<{ organization: any }>('/api/admin/organizations', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}

export function createReward(token: string, payload: any) {
  return request<{ reward: any }>('/api/admin/rewards', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}

export function sendReward(
  token: string,
  rewardId: number,
  payload: { userId: number; note?: string },
) {
  return request<{ message: string }>(`/api/admin/rewards/${rewardId}/send`, {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}

export function verifyReport(
  token: string,
  id: number,
  payload: { verified: boolean; assignedNgoId?: number; rejectionReason?: string },
) {
  return request<{ message: string }>(`/api/admin/reports/${id}/verify`, {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}

export function getNgoReports(token: string, status: string) {
  const params = new URLSearchParams({ status });
  return request<{ reports: any[] }>(`/api/ngo/reports?${params.toString()}`, {
    token,
  });
}

export function updateNgoReportStatus(
  token: string,
  id: number,
  status: string,
) {
  return request<{ message: string }>(`/api/ngo/reports/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
    token,
  });
}

