import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cpu, Zap, Activity, Lock, Globe, RefreshCw, Copy, CheckCircle2, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { AIAgentChat } from './AIAgentChat';
import { useMockData } from '@/hooks/useMockData';
import type { MockEnclave } from '@/data/mock-generators';

const statusColors: Record<string, string> = {
  RUNNING: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  COMPLETED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  FAILED: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const agentColors: Record<string, string> = {
  emerald: 'text-emerald-500',
  blue: 'text-blue-500',
  amber: 'text-amber-500',
  purple: 'text-purple-500',
  cyan: 'text-cyan-500',
};

function EnclaveCard({ enclave, index }: { enclave: MockEnclave; index: number }) {
  const [copied, setCopied] = useState(false);
  
  const copyMrenclave = () => {
    navigator.clipboard.writeText(enclave.mrenclave);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-xl border border-border/50 p-4 space-y-3 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${enclave.status === 'RUNNING' ? 'bg-emerald-500 animate-pulse' : enclave.status === 'COMPLETED' ? 'bg-blue-500' : enclave.status === 'PENDING' ? 'bg-amber-500' : 'bg-red-500'}`} />
          <span className={`text-xs font-bold ${agentColors[enclave.agentColor] || 'text-primary'}`}>{enclave.agent}</span>
        </div>
        <Badge variant="outline" className={`text-[9px] ${statusColors[enclave.status]}`}>{enclave.status}</Badge>
      </div>
      
      <Progress value={enclave.progress} className="h-1.5" />
      
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{enclave.progress}% complete</span>
        <span>{enclave.duration}s</span>
      </div>
      
      <div className="flex items-center gap-1">
        <code className="text-[9px] font-mono text-muted-foreground truncate flex-1">{enclave.mrenclave.slice(0, 20)}...</code>
        <button onClick={copyMrenclave} className="p-1 hover:bg-muted rounded">
          {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div className="flex justify-between">
          <span className="text-muted-foreground">CPU</span>
          <span className="font-mono">{enclave.cpuUsage}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">RAM</span>
          <span className="font-mono">{enclave.memoryMb}MB</span>
        </div>
      </div>
    </motion.div>
  );
}

export const TDXAgentDashboard: React.FC = () => {
  const { enclaves, stats, refresh, liveEnclaveCount } = useMockData();
  const [isDeploying, setIsDeploying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [showChat, setShowChat] = useState(true);

  const handleDeploy = () => {
    setIsDeploying(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsDeploying(false);
        refresh();
      }
    }, 100);
  };

  const filteredEnclaves = filterAgent === 'all' ? enclaves : enclaves.filter(e => e.agent === filterAgent);
  const agents = [...new Set(enclaves.map(e => e.agent))];

  return (
    <div className="space-y-6">
      {/* Header with live stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">TDX Autonomous Agents</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {liveEnclaveCount} live enclaves · {stats.actionsPerHour} actions/hour · {stats.aum} AUM
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refresh} className="gap-1">
            <RefreshCw className="w-3 h-3" /> Refresh
          </Button>
          <Button onClick={handleDeploy} disabled={isDeploying} size="sm">
            {isDeploying ? 'Deploying...' : 'Deploy New Agent'}
          </Button>
        </div>
      </div>

      {isDeploying && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Initializing Intel TDX Enclave...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Enclaves', value: liveEnclaveCount, icon: Cpu, color: 'text-emerald-500' },
          { label: 'Wallets Scored', value: stats.totalWallets, icon: Users, color: 'text-blue-500' },
          { label: 'Avg Score', value: stats.avgScore, icon: BarChart3, color: 'text-purple-500' },
          { label: 'Avg APR', value: `${stats.avgApr}%`, icon: TrendingUp, color: 'text-amber-500' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glass-card">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">{stat.label}</span>
                </div>
                <p className="text-xl font-black">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enclaves Grid */}
        <div className="lg:col-span-2 space-y-4">
          {/* Agent Filters */}
          <div className="flex gap-2 flex-wrap">
            <Badge 
              variant={filterAgent === 'all' ? 'default' : 'outline'} 
              className="cursor-pointer" 
              onClick={() => setFilterAgent('all')}
            >
              All ({enclaves.length})
            </Badge>
            {agents.map(a => (
              <Badge 
                key={a} 
                variant={filterAgent === a ? 'default' : 'outline'} 
                className="cursor-pointer"
                onClick={() => setFilterAgent(a)}
              >
                {a} ({enclaves.filter(e => e.agent === a).length})
              </Badge>
            ))}
          </div>

          {/* Enclave Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredEnclaves.slice(0, 12).map((enclave, i) => (
              <EnclaveCard key={enclave.taskId} enclave={enclave} index={i} />
            ))}
          </div>
          
          {filteredEnclaves.length > 12 && (
            <p className="text-xs text-center text-muted-foreground">
              Showing 12 of {filteredEnclaves.length} enclaves
            </p>
          )}
        </div>

        {/* Chat Sidebar */}
        <div className="lg:col-span-1">
          <AIAgentChat />
        </div>
      </div>
    </div>
  );
};
