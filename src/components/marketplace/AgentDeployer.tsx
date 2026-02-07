import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { credtrustEliza, CredTrustAgentConfig } from '@/lib/eliza';
import { Bot, Zap, Shield, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AgentDeployerProps {
  agents?: CredTrustAgentConfig[];
  onDeploySuccess?: (agentId: string) => void;
}

const DEFAULT_AGENTS: CredTrustAgentConfig[] = [
  { name: 'FICO Agent', model: 'llama3.1', tools: ['fico-score', 'risk-analysis'] },
  { name: 'Income Agent', model: 'grok-4', tools: ['income-analysis', 'disclosure'] },
  { name: 'Reputation Agent', model: 'llama3.1', tools: ['reputation-scoring'] }
];

export const AgentDeployer: React.FC<AgentDeployerProps> = ({ 
  agents = DEFAULT_AGENTS,
  onDeploySuccess 
}) => {
  const [isDeploying, setIsDeploying] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeploy = async (config: CredTrustAgentConfig) => {
    setIsDeploying(config.name);
    try {
      // 1. Deploy via Eliza OS
      // 2. Mint Agent NFT + list on marketplace (handled inside deployAgent in our mock)
      const agentId = await credtrustEliza.deployAgent(config);
      
      toast({
        title: "Agent Deployed & NFT Minted",
        description: `Successfully deployed ${config.name} (ID: ${agentId}) and listed on Marketplace.`,
      });
      
      if (onDeploySuccess) onDeploySuccess(agentId);
    } catch (error) {
      toast({
        title: "Deployment Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <Card key={agent.name} className="overflow-hidden border-2 transition-all hover:border-primary/50">
          <CardHeader className="bg-muted/50 pb-4">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="secondary" className="capitalize">
                {agent.model}
              </Badge>
            </div>
            <CardTitle className="mt-4">{agent.name}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Available Tools
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {agent.tools.map((tool) => (
                    <Badge key={tool} variant="outline" className="bg-background">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-green-500" />
                <span>TEE Secured Execution</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Real-time On-chain Minting</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/20">
            <Button 
              className="w-full" 
              onClick={() => handleDeploy(agent)}
              disabled={isDeploying !== null}
            >
              {isDeploying === agent.name ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>Deploy & Mint NFT</>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
