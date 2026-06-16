import type { Prompt, PromptPayload, Stats } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

type ListParams = {
  search?: string;
  category?: string;
  favorite?: boolean | null;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? 'Request failed');
  }

  return response.json();
}

export async function listPrompts(params: ListParams = {}): Promise<Prompt[]> {
  const query = new URLSearchParams();

  if (params.search) query.set('search', params.search);
  if (params.category && params.category !== 'All') query.set('category', params.category);
  if (params.favorite !== null && params.favorite !== undefined) {
    query.set('favorite', String(params.favorite));
  }

  const suffix = query.toString() ? `?${query.toString()}` : '';
  return request<Prompt[]>(`/api/prompts${suffix}`);
}

export async function createPrompt(payload: PromptPayload): Promise<Prompt> {
  return request<Prompt>('/api/prompts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updatePrompt(id: number, payload: Partial<PromptPayload>): Promise<Prompt> {
  return request<Prompt>(`/api/prompts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deletePrompt(id: number): Promise<void> {
  await request<{ status: string }>(`/api/prompts/${id}`, {
    method: 'DELETE',
  });
}

export async function getStats(): Promise<Stats> {
  return request<Stats>('/api/stats');
}

export async function exportPrompts(): Promise<Prompt[]> {
  return request<Prompt[]>('/api/export');
}
