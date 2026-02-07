import React from 'react';
import { motion } from 'framer-motion';
import { AgentCard } from '@/components/agents/agent-card';
import { AgentDeployer } from '@/components/marketplace/AgentDeployer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Database, ShoppingBag, PlusCircle } from 'lucide-react';

const MOCK_AGENTS = [
  {
    agentId: 'risk-1',
    name: 'Risk Analyst Prime',
    type: 'risk-analyst' as const,
    reputation: 99,
    status: 'active' as const,
    description: 'Specializes in credit default swaps and collateralization ratios.'
  },
  {
    agentId: 'market-1',
    name: 'Yield Master Bot',
    type: 'market-bot' as const,
    reputation: 97,
    status: 'idle' as const,
    description: 'Optimizes liquidity provision across Arbitrum DeFi protocols.'
  },
  {
    agentId: 'tdx-1',
    name: 'TDX Attestator',
    type: 'tdx-agent' as const,
    reputation: 100,
    status: 'active' as const,
    description: 'Ensures hardware-level verification of TEE enclave execution.'
  },
  {
    agentId: 'agent_1',
    name: 'Credit Scorer Pro',
    type: 'credit-agent' as const,
    reputation: 98,
    status: 'active' as const,
    description: 'Privacy-preserving credit scoring using zero-knowledge proofs.'
  },
  {
    agentId: 'agent_2',
    name: 'Privacy Guard',
    type: 'disclosure-agent' as const,
    reputation: 95,
    status: 'idle' as const,
    description: 'Managed selective disclosure of sensitive financial documents.'
  }
];

export default function AgentMarketplace() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Agent Marketplace</h1>
            <Badge variant="outline" className="text-primary border-primary/50">Eliza OS v4</Badge>
          </div>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Deploy, trade, and manage autonomous AI agents. Every agent is minted as an NFT on-chain, 
            providing verifiable reputation and ownership in a TEE-secured network.
          </p>
        </div>
      </motion.div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Browse Agents
          </TabsTrigger>
          <TabsTrigger value="deploy" className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Deploy New Agent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Database className="w-4 h-4" />
            <span className="text-sm font-medium">Verified On-chain Registry</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_AGENTS.map((agent) => (
              <AgentCard key={agent.agentId} {...agent} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deploy" className="space-y-6">
          <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 mb-8">
            <h2 className="text-xl font-semibold mb-2">Deploy Custom Credit Models</h2>
            <p className="text-sm text-muted-foreground">
              Select a specialized agent template to deploy. Upon deployment, a unique Agent NFT 
              will be minted to your wallet, registering the agent in the global marketplace.
            </p>
          </div>
          <AgentDeployer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
