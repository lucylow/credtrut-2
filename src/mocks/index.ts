// Mock Data Exports
export * from './mockData';
export * from './api';
export * from './borrowerGenerator';
export * from './demoBorrowers';
export * from './portfolioData';
export * from './productionDatasets';

// Re-export types
export type {
  BorrowerProfile,
  Portfolio,
  PortfolioTranche,
  ZKProof,
  ContractEvent,
  APIResponse,
  RiskTier,
  Region,
  KycLevel,
  EmploymentType,
} from '@/types/borrower.types';
