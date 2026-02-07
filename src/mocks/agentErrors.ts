export interface AgentError {
  code: string;
  message: string;
  details?: string;
  recoverySuggestion?: string;
  type: 'NETWORK' | 'AUTH' | 'TEE_FAILURE' | 'RATE_LIMIT' | 'PRIVACY_VIOLATION' | 'UNKNOWN';
}

export const MOCK_AGENT_ERRORS: Record<string, AgentError> = {
  RATE_LIMIT: {
    code: 'ELIZA_429',
    message: 'Too many requests to the agent.',
    details: 'The agent is currently processing a high volume of credit audits.',
    recoverySuggestion: 'Please wait 30 seconds before trying again.',
    type: 'RATE_LIMIT',
  },
  TEE_FAILURE: {
    code: 'TDX_500',
    message: 'TEE Attestation failed.',
    details: 'The Intel TDX enclave could not verify the ZKP circuit integrity.',
    recoverySuggestion: 'Restarting the confidential computing session...',
    type: 'TEE_FAILURE',
  },
  NETWORK_TIMEOUT: {
    code: 'NET_408',
    message: 'Agent connection timed out.',
    details: 'Failed to establish a secure websocket connection to the Eliza OS runtime.',
    recoverySuggestion: 'Check your network connection or try a different agent.',
    type: 'NETWORK',
  },
  PRIVACY_VIOLATION: {
    code: 'PRIV_403',
    message: 'Potential privacy leak detected.',
    details: 'The requested action attempted to expose raw metadata outside the TEE.',
    recoverySuggestion: 'Use selective disclosure prompts instead.',
    type: 'PRIVACY_VIOLATION',
  },
  AUTH_EXPIRED: {
    code: 'AUTH_401',
    message: 'Agent session expired.',
    details: 'Your Web3 signature for this agent session is no longer valid.',
    recoverySuggestion: 'Re-sign the message to re-authenticate.',
    type: 'AUTH',
  }
};

export const getRandomAgentError = (): AgentError => {
  const keys = Object.keys(MOCK_AGENT_ERRORS);
  return MOCK_AGENT_ERRORS[keys[Math.floor(Math.random() * keys.length)]];
};
