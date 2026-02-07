 export interface DemoFinancialData {
   fico: number;
   income: number;
   debt: number;
   employmentMonths: number;
   assets: number;
   tier: 'A' | 'B' | 'C' | 'D';
 }
 
 const BASE_DATASETS = {
   A: { fico: 780, income: 95000, debt: 15000, employmentMonths: 36, assets: 250000 },
   B: { fico: 720, income: 75000, debt: 25000, employmentMonths: 24, assets: 120000 },
   C: { fico: 680, income: 55000, debt: 35000, employmentMonths: 18, assets: 50000 },
   D: { fico: 620, income: 40000, debt: 45000, employmentMonths: 12, assets: 10000 },
   A_PLUS: { fico: 820, income: 150000, debt: 10000, employmentMonths: 120, assets: 1000000 },
   B_MINUS: { fico: 700, income: 65000, debt: 30000, employmentMonths: 36, assets: 80000 },
   C_PLUS: { fico: 690, income: 60000, debt: 28000, employmentMonths: 48, assets: 65000 },
 };

 export const generateDemoDataset = (tier: 'A' | 'B' | 'C' | 'D' | 'A_PLUS' | 'B_MINUS' | 'C_PLUS' = 'A'): DemoFinancialData => {
   const base = BASE_DATASETS[tier] || BASE_DATASETS['A'];
   return {
     ...base,
     tier: (tier.includes('_') ? tier.split('_')[0] : tier) as 'A' | 'B' | 'C' | 'D',
     fico: Math.round(base.fico + (Math.random() - 0.5) * 20),
     income: Math.round(base.income + (Math.random() - 0.5) * 5000),
   };
 };
 
 export const DEMO_DATASETS = [
   { label: 'Prime Borrower (A)', tier: 'A' as const, color: 'text-success' },
   { label: 'Good Credit (B)', tier: 'B' as const, color: 'text-primary' },
   { label: 'Fair Credit (C)', tier: 'C' as const, color: 'text-[hsl(var(--warning))]' },
   { label: 'Risky (D)', tier: 'D' as const, color: 'text-destructive' },
 ];
 
 export const calculateRiskScore = (data: DemoFinancialData): number => {
   const dti = data.debt / data.income;
   const ficoWeight = data.fico * 0.45; // Increased FICO weight
   const dtiWeight = (1 - Math.min(dti, 1)) * 300;
   const employmentWeight = Math.min(data.employmentMonths / 60, 1) * 80; // Adjusted employment weight
   const assetWeight = Math.min(data.assets / 500000, 1) * 120; // Increased asset weight
  
   // Add utilization factor (simulated)
   const utilization = data.debt / (data.assets * 0.5 + 10000);
   const utilizationWeight = (1 - Math.min(utilization, 1)) * 50;
  
   return Math.min(850, Math.round(ficoWeight + dtiWeight + employmentWeight + assetWeight + utilizationWeight));
 };