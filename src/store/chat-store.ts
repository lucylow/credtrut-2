import { create } from 'zustand';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: number;
  type?: string;
}

interface ChatStore {
  activeAgentId: string | null;
  agentTypes: Record<string, string>;
  messages: Record<string, Message[]>;
  isLoading: boolean;
  openChat: (agentId: string, type?: string) => void;
  sendMessage: (agentId: string, text: string) => Promise<void>;
}

const getContextualResponse = (text: string, agentType: string) => {
  const lowerText = text.toLowerCase();
  
  if (agentType === 'risk-analyst' || lowerText.includes('risk score')) {
    const score = Math.floor(Math.random() * 20) + 80;
    return `[RISK ANALYSIS] Based on current protocol metrics, the risk score is ${score}/100. Liquidity depth and collateral ratios are within optimal bounds.`;
  }
  
  if (agentType === 'market-bot' || lowerText.includes('market yields')) {
    return `[MARKET DATA] Current market yields: 
- Senior Tranche: 5.2% APY
- Mezzanine Tranche: 8.7% APY
- Junior Tranche: 14.5% APY
Volatility remains low at 2.4%.`;
  }
  
  if (agentType === 'tdx-agent' || lowerText.includes('attestations') || lowerText.includes('verify')) {
    return `[TDX ATTESTATION] Intel TDX hardware attestation verified. 
Status: SUCCESS
Root of Trust: Secured
Quote Signature: VALID
Execution Environment: Isolated TEE`;
  }

  return `I've processed your message: "${text}". How can I assist further?`;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  activeAgentId: null,
  agentTypes: {
    'risk-1': 'risk-analyst',
    'market-1': 'market-bot',
    'tdx-1': 'tdx-agent'
  },
  messages: {},
  isLoading: false,
  openChat: (agentId: string, type?: string) => set((state) => ({ 
    activeAgentId: agentId,
    agentTypes: type ? { ...state.agentTypes, [agentId]: type } : state.agentTypes
  })),
  sendMessage: async (agentId: string, text: string) => {
    const state = get();
    const agentType = state.agentTypes[agentId] || 'generic';

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text,
      timestamp: Date.now()
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [agentId]: [...(state.messages[agentId] || []), newMessage]
      },
      isLoading: true
    }));

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'agent',
        text: getContextualResponse(text, agentType),
        timestamp: Date.now(),
        type: agentType
      };

      set((state) => ({
        messages: {
          ...state.messages,
          [agentId]: [...(state.messages[agentId] || []), agentResponse]
        },
        isLoading: false
      }));
    }, 1500);
  }
}));
