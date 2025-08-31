// API Client for Vercel Backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-7ol8cklrk-dessouky13s-projects-6724b6bc.vercel.app';

// Types
export interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

export interface AdmissionForm {
  id?: number;
  application_id: string;
  student_name: string;
  student_email: string;
  student_phone?: string;
  student_dob?: string;
  student_gender?: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  address?: string;
  city?: string;
  country?: string;
  nationality?: string;
  previous_school?: string;
  grade_level: string;
  academic_year: string;
  documents?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  payment_status?: 'pending' | 'paid' | 'failed';
  payment_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminDashboard {
  total_applications: number;
  pending_applications: number;
  approved_applications: number;
  rejected_applications: number;
  waitlisted_applications: number;
  total_payments: number;
  pending_payments: number;
  completed_payments: number;
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    this.token = response.token;
    localStorage.setItem('auth_token', response.token);
    return response;
  }

  async register(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    this.token = response.token;
    localStorage.setItem('auth_token', response.token);
    return response;
  }

  async getProfile(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/api/auth/profile');
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem('auth_token');
    await this.request('/api/auth/logout', { method: 'POST' });
  }

  // Admissions
  async submitAdmission(form: AdmissionForm): Promise<{ message: string; application: AdmissionForm }> {
    return this.request<{ message: string; application: AdmissionForm }>('/api/admissions/submit', {
      method: 'POST',
      body: JSON.stringify(form),
    });
  }

  async getMyApplications(): Promise<AdmissionForm[]> {
    return this.request<AdmissionForm[]>('/api/admissions/my-applications');
  }

  async getApplication(applicationId: string): Promise<AdmissionForm> {
    return this.request<AdmissionForm>(`/api/admissions/${applicationId}`);
  }

  async updateApplication(applicationId: string, updates: Partial<AdmissionForm>): Promise<{ message: string; application: AdmissionForm }> {
    return this.request<{ message: string; application: AdmissionForm }>(`/api/admissions/${applicationId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteApplication(applicationId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/admissions/${applicationId}`, {
      method: 'DELETE',
    });
  }

  async getApplicationStatus(applicationId: string): Promise<{ status: string; payment_status: string }> {
    return this.request<{ status: string; payment_status: string }>(`/api/admissions/${applicationId}/status`);
  }

  // Admin Functions
  async getAdminDashboard(): Promise<AdminDashboard> {
    return this.request<AdminDashboard>('/api/admin/dashboard');
  }

  async getAllApplications(
    page: number = 1,
    limit: number = 10,
    filters: Record<string, any> = {}
  ): Promise<{
    applications: AdmissionForm[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    
    return this.request<{
      applications: AdmissionForm[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/api/admin/applications?${queryParams}`);
  }

  async updateApplicationStatus(
    applicationId: string,
    status: string,
    notes?: string
  ): Promise<{ message: string; application: AdmissionForm }> {
    return this.request<{ message: string; application: AdmissionForm }>(`/api/admin/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  async exportApplications(format: 'json' | 'csv' = 'json'): Promise<any> {
    return this.request(`/api/admin/export?format=${format}`);
  }

  async getAdminLogs(): Promise<any[]> {
    return this.request<any[]>('/api/admin/logs');
  }

  // File Uploads
  async uploadFile(file: File, type: string = 'documents'): Promise<{ message: string; file: any }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const url = `${this.baseURL}/api/uploads/single`;
    const headers: HeadersInit = {};
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed! status: ${response.status}`);
    }

    return await response.json();
  }

  async uploadMultipleFiles(files: File[], type: string = 'documents'): Promise<{ message: string; files: any[] }> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('type', type);

    const url = `${this.baseURL}/api/uploads/multiple`;
    const headers: HeadersInit = {};
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed! status: ${response.status}`);
    }

    return await response.json();
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string; environment: string }> {
    return this.request<{ status: string; timestamp: string; environment: string }>('/api/health');
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export the class for testing or custom instances
export { ApiClient };
