import { motion } from 'framer-motion';
import { AgentAvatar } from './agent-avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, Settings, Zap, ShieldCheck } from 'lucide-react';
import { useEliza } from '@/providers/eliza-provider';
import { useChatStore } from '@/store/chat-store';
import { Badge } from '@/components/ui/badge';

interface AgentCardProps {
  agentId: string;
  name: string;
  type: 'credit-agent' | 'disclosure-agent' | 'marketplace-agent' | 'risk-analyst' | 'market-bot' | 'tdx-agent';
  reputation: number;
  status: 'idle' | 'thinking' | 'active';
  description?: string;
}

export function AgentCard({ agentId, name, type, reputation, status, description }: AgentCardProps) {
  const eliza = useEliza();
  const { openChat } = useChatStore();

  const deployAgent = async () => {
    try {
      const deployed = await eliza.deployAgent({
        name,
        model: 'grok-4',
        tools: type === 'credit-agent' ? ['credit-score', 'risk-analysis'] :
                type === 'disclosure-agent' ? ['disclosure-token', 'privacy-audit'] :
                type === 'risk-analyst' ? ['risk-score', 'on-chain-audit'] :
                type === 'market-bot' ? ['market-yields', 'volatility-check'] :
                type === 'tdx-agent' ? ['verify-attestation', 'tee-secure'] :
                ['marketplace-search', 'agent-fork']
      });
      openChat(deployed.agentId, type);
    } catch (e) {
      console.error('Deploy failed:', e);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card p-6 rounded-3xl group cursor-pointer border-white/20 hover:border-white/40 transition-all duration-300"
      onClick={() => openChat(agentId, type)}
    >
      <div className="flex items-start gap-4 mb-6">
        <AgentAvatar 
          agentId={agentId} 
          name={name} 
          type={type} 
          status={status}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-xl text-white mb-1 truncate">
            {name}
          </h3>
          {description && (
            <p className="text-xs text-slate-400 mb-3 line-clamp-2 italic">
              {description}
            </p>
          )}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1 text-sm text-emerald-400">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              {reputation}/100
            </div>
            <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-slate-400">
              {type.replace('-agent', '')}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Zap className="w-3 h-3" />
            ElizaOS v2.1 • 24h uptime
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-[10px] h-5 bg-blue-500/20 text-blue-400 border-none">
              <ShieldCheck className="w-3 h-3 mr-1" />
              NFT Minted
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-white/10">
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1 font-mono"
          onClick={(e) => {
            e.stopPropagation();
            deployAgent();
          }}
        >
          Deploy Agent
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            openChat(agentId, type);
          }}
        >
          <MessageSquare className="w-4 h-4 mr-1" />
          Chat
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
