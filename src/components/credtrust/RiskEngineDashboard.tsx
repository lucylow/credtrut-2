 import { motion, AnimatePresence } from 'framer-motion';
 import { useRiskEngineStore } from '@/store/riskEngineStore';
 import { RiskScoreHero } from './RiskScoreHero';
 import { WorkflowSteps } from './WorkflowSteps';
 import { DataProtectorCard } from './DataProtectorCard';
 import { TEEExecutionCard } from './TEEExecutionCard';
 import { ProofGeneratorCard } from './ProofGeneratorCard';
 import { LoanNFTCard, DisclosureTokenCard } from './index';
 import { Button } from '@/components/ui/button';
 import { RotateCcw, Info, Lightbulb } from 'lucide-react';
import DemoDatasetPicker from '@/components/demo/DemoDatasetPicker';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function RiskEngineDashboard() {
  const { step, reset, setRiskScore, setStep } = useRiskEngineStore();

  const handleDemoSelect = (_data: any, score: number) => {
    setRiskScore(score);
    setStep(1);
  };

  const getStepGuide = () => {
    switch (step) {
      case 0: return "Start by selecting a demo dataset or uploading your own financial data. Your data is encrypted locally before being sent to the TEE.";
      case 1: return "The TEE (Trusted Execution Environment) is now processing your encrypted data to calculate your risk score without ever seeing the raw data.";
      case 2: return "Generating a Zero-Knowledge Proof to verify the computation was performed correctly in the TEE without revealing any sensitive information.";
      case 3: return "Your credit credential is ready to be minted as a Soulbound NFT. You can also issue Selective Disclosure tokens for specific verifiers.";
      default: return "";
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display text-foreground flex items-center gap-2">
            Risk Engine Dashboard
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="inline-flex">
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs font-normal">
                    The Risk Engine uses iExec TEE (Intel SGX) to compute your credit score privately. 
                    No one, not even CredTrust, can see your raw financial data.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h1>
          <p className="text-muted-foreground mt-1 max-w-lg">
            Confidential credit scoring powered by Intel SGX TEE. Your data is encrypted locally and never exposed in plaintext.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={reset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Guide Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex gap-3 items-start"
      >
        <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-primary uppercase tracking-wider text-[10px]">Onboarding: Current Step Guide</p>
          <p className="text-sm text-muted-foreground mt-1">
            {getStepGuide()}
          </p>
        </div>
      </motion.div>

      {/* Risk Score Hero + Demo Picker */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RiskScoreHero />
        </div>
        <div>
          <DemoDatasetPicker onSelectDataset={handleDemoSelect} />
        </div>
      </div>
 
       {/* Workflow Steps */}
       <WorkflowSteps />
 
       {/* Current Step Content */}
       <AnimatePresence mode="wait">
         <motion.div
           key={step}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           transition={{ duration: 0.3 }}
         >
           {step === 0 && <DataProtectorCard />}
           {step === 1 && <TEEExecutionCard />}
           {step === 2 && <ProofGeneratorCard />}
           {step === 3 && (
             <div className="space-y-8">
               <LoanNFTCard />
              
               <div className="pt-4">
                 <div className="flex items-center gap-2 mb-4">
                   <div className="h-8 w-1 bg-primary rounded-full" />
                   <h3 className="text-xl font-bold font-display">Disclosure Marketplace</h3>
                 </div>
                 <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
                   Issue ephemeral disclosure tokens to specific verifiers (like lenders or landlords). 
                   These tokens grant temporary access to specific subsets of your credit data without revealing your full profile.
                 </p>
                
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <DisclosureTokenCard
                     tokenId={101}
                     parentTokenId={1}
                     verifier="0xLender_Alpha..."
                     level={0}
                     expiresIn="7 days"
                     price="Free"
                   />
                   <DisclosureTokenCard
                     tokenId={102}
                     parentTokenId={1}
                     verifier="0xLender_Beta..."
                     level={1}
                     expiresIn="14 days"
                     price="0.01 ETH"
                   />
                   <DisclosureTokenCard
                     tokenId={103}
                     parentTokenId={1}
                     verifier="0xRental_Agency..."
                     level={2}
                     expiresIn="30 days"
                     price="0.05 ETH"
                   />
                 </div>
               </div>
             </div>
           )}
         </motion.div>
       </AnimatePresence>
     </div>
   );
 }