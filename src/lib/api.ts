// src/lib/api.ts
// Use relative paths in development so Vite/Lovable proxy can handle CORS
const BACKEND_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_BACKEND_URL || 'https://your-backend-domain.com');

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BACKEND_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Required for CORS cookies
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-2xx responses
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// TEE Endpoints
export const teeApi = {
  protectData: (data: any, wallet: string) => 
    apiFetch('/api/tee/protect', {
      method: 'POST',
      body: JSON.stringify({ data: typeof data === 'string' ? data : JSON.stringify(data), wallet })
    }),
    
  runTeeJob: (ipfsHash: string, wallet?: string, factors?: any) => 
    apiFetch('/api/tee/run', {
      method: 'POST', 
      body: JSON.stringify({ ipfsHash, wallet, factors })
    }),
    
  getStatus: () => apiFetch('/api/tee/status')
};

// Tranche Pricing
export const trancheApi = {
  getPrices: () => apiFetch('/api/tranches/prices'),
  getDetails: (id: string) => apiFetch(`/api/tranches/${id}`)
};
