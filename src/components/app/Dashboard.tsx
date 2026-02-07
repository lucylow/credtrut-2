import { motion } from 'framer-motion';
import { TrendingUp, Users, Shield, Zap, ArrowRight, Bot } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import { StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';
import { AIAgentChat } from './AIAgentChat';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const stats = [
  {
    label: 'Total Applications',
    value: '1,247',
    change: '+12.5%',
    isPositive: true,
    icon: TrendingUp,
    color: 'from-primary to-blue-600',
  },
  {
    label: 'Active Lenders',
    value: '89',
    change: '+5.2%',
    isPositive: true,
    icon: Users,
    color: 'from-secondary to-pink-600',
  },
  {
    label: 'TEE Validations',
    value: '3,892',
    change: '+23.1%',
    isPositive: true,
    icon: Shield,
    color: 'from-emerald-500 to-green-600',
  },
  {
    label: 'Avg. Processing',
    value: '2.3s',
    change: '-15%',
    isPositive: true,
    icon: Zap,
    color: 'from-orange-500 to-amber-600',
  },
];

const recentActivity = [
  { type: 'application', message: 'New credit application submitted', time: '2 min ago' },
  { type: 'validation', message: 'TEE validation completed', time: '5 min ago' },
  { type: 'nft', message: 'Credit NFT minted', time: '8 min ago' },
  { type: 'loan', message: 'Loan funded successfully', time: '12 min ago' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={stat.icon}
            color={stat.color}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 border-primary/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Recent Activity
            </h3>
            <span className="text-xs text-primary font-medium cursor-pointer hover:underline">View All</span>
          </div>
          <StaggerContainer staggerDelay={0.1} className="space-y-3">
            {recentActivity.map((activity, index) => (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ x: 4, backgroundColor: "rgba(var(--primary), 0.05)" }}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-primary/10"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      activity.type === 'application' ? 'bg-primary/10 text-primary' :
                      activity.type === 'validation' ? 'bg-success/10 text-success' :
                      activity.type === 'nft' ? 'bg-secondary/10 text-secondary' :
                      'bg-orange-500/10 text-orange-500'
                    )}>
                      {activity.type === 'application' && <Users className="w-4 h-4" />}
                      {activity.type === 'validation' && <Shield className="w-4 h-4" />}
                      {activity.type === 'nft' && <Zap className="w-4 h-4" />}
                      {activity.type === 'loan' && <TrendingUp className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{activity.message}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{activity.type}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{activity.time}</span>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card p-6 border-secondary/10 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Bot className="w-32 h-32 text-secondary rotate-12" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-secondary" />
            AI Agent Strategy
          </h3>
          <p className="text-sm text-muted-foreground mb-6 relative z-10">
            Our Eliza OS agents are currently optimizing your credit profile and monitoring marketplace liquidity.
          </p>
          <div className="space-y-4 relative z-10">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-primary text-sm">Risk Analyst Agent</h4>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">Active</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">Analyzing TEE-protected credit data. Current focus: Kenyan SME sector risk assessment.</p>
              <div className="mt-3 flex items-center gap-2 text-[10px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View Insights</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10 hover:bg-secondary/10 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-secondary text-sm">Market Bot Agent</h4>
                <Badge variant="outline" className="text-[10px] bg-secondary/10 text-secondary border-secondary/20">Active</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">Monitoring debt marketplace. Predicts 2.4% liquidity increase in Tranche A next 48h.</p>
              <div className="mt-3 flex items-center gap-2 text-[10px] font-medium text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View Predictions</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Agent Chat Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-4 p-8 flex flex-col justify-center bg-muted/30 border-r border-border">
            <Badge className="w-fit mb-4" variant="secondary">Powered by Eliza OS</Badge>
            <h3 className="text-2xl font-bold text-foreground mb-4 leading-tight">Interactive AI Intelligence</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Experience the future of DeFi with agents that understand your data without ever seeing it. 
              Ask about market trends, your credit score, or specialized SME lending pools.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                  <Shield className="w-3 h-3 text-success" />
                </div>
                Privacy-Preserving via iExec TEE
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-primary" />
                </div>
                Real-time Market Analytics
              </div>
            </div>
          </div>
          <div className="lg:col-span-8 p-6 bg-background/50">
            <AIAgentChat />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
