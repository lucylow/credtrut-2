const BACKEND_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_BACKEND_URL || 'https://your-backend-domain.com');

export type AgentRole = 'user' | 'agent' | 'error';

export interface AgentMessage {
  role: AgentRole;
  content: string;
  timestamp: number;
  actions?: AgentAction[];
  error?: {
    code: string;
    details?: string;
    recoverySuggestion?: string;
  };
}

export interface AgentAction {
  type: string;
  payload: any;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
}

const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      credentials: 'include'
    });

    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // Fallback if response is not JSON
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected network error occurred');
  }
};

export const elizaService = {
  async getAgents(): Promise<Agent[]> {
    const data = await apiFetch<{ success: boolean; agents: Agent[] }>('/api/eliza/agents');
    return data.agents || [];
  },

  async sendMessage(agentId: string, message: string, context?: Record<string, any>): Promise<AgentMessage> {
    const data = await apiFetch<{ success: boolean; data: AgentMessage }>('/api/eliza/chat', {
      method: 'POST',
      body: JSON.stringify({ agentId, message, context })
    });
    return data.data;
  }
};
