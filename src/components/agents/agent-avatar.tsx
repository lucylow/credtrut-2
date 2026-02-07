import { motion } from 'framer-motion';
import { Brain, Shield, Zap, Activity, TrendingUp, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const agentIcons = {
  'credit-agent': Shield,
  'disclosure-agent': Brain,
  'marketplace-agent': Zap,
  'risk-analyst': Activity,
  'market-bot': TrendingUp,
  'tdx-agent': Lock
};

interface AgentAvatarProps {
  agentId: string;
  name: string;
  type: 'credit-agent' | 'disclosure-agent' | 'marketplace-agent' | 'risk-analyst' | 'market-bot' | 'tdx-agent';
  status: 'idle' | 'thinking' | 'active';
  size?: 'sm' | 'md' | 'lg';
}

export function AgentAvatar({ agentId, name, type, status, size = 'md' }: AgentAvatarProps) {
  const Icon = agentIcons[type];
  
  return (
    <motion.div
      animate={{ 
        scale: status === 'active' ? [1, 1.05, 1] : 1 
      }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={cn(
        'glass-card rounded-2xl flex items-center gap-3 p-3 md:p-4 shadow-2xl border-white/20',
        size === 'sm' && 'w-16 h-16',
        size === 'md' && 'w-20 h-20',
        size === 'lg' && 'w-24 h-24 p-6'
      )}
    >
      <div className={cn(
        'w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg',
        {
          'bg-gradient-to-r from-emerald-500/80 to-teal-500/80': type === 'credit-agent',
          'bg-gradient-to-r from-purple-500/80 to-pink-500/80': type === 'disclosure-agent',
          'bg-gradient-to-r from-blue-500/80 to-indigo-500/80': type === 'marketplace-agent',
          'bg-gradient-to-r from-red-500/80 to-orange-500/80': type === 'risk-analyst',
          'bg-gradient-to-r from-yellow-500/80 to-amber-500/80': type === 'market-bot',
          'bg-gradient-to-r from-cyan-500/80 to-blue-600/80': type === 'tdx-agent'
        }
      )}>
        <Icon className="w-4 h-4 md:w-5 md:h-5 text-white drop-shadow-lg" />
      </div>
      {size !== 'sm' && (
        <div className="hidden md:flex flex-col items-start">
          <div className="font-bold text-white text-sm leading-tight truncate max-w-20">
            {name}
          </div>
          <div className={cn(
            'text-xs font-mono px-2 py-0.5 rounded-full',
            status === 'idle' && 'bg-slate-500/30 text-slate-400',
            status === 'thinking' && 'bg-amber-500/30 text-amber-400 animate-pulse',
            status === 'active' && 'bg-emerald-500/30 text-emerald-400'
          )}>
            {status}
          </div>
        </div>
      )}
    </motion.div>
  );
}
