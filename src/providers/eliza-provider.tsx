import React, { createContext, useContext } from 'react';
import { credtrustEliza } from '@/lib/eliza';

const ElizaContext = createContext(credtrustEliza);

export function ElizaProvider({ children }: { children: React.ReactNode }) {
  return (
    <ElizaContext.Provider value={credtrustEliza}>
      {children}
    </ElizaContext.Provider>
  );
}

export const useEliza = () => useContext(ElizaContext);
