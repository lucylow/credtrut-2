import { 
  Shield, 
  Lock, 
  EyeOff, 
  Zap, 
  Database, 
  FileCheck, 
  Activity,
  AlertTriangle,
  Fingerprint,
  RefreshCcw,
  CheckCircle2,
  Settings2,
  History,
  ShieldCheck,
  Eye,
  Server,
  Network
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { AgentCard } from '@/components/agents/agent-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import React from 'react';

const PrivacyDashboard: React.FC = () => {
  const [activeFeatures, setActiveFeatures] = React.useState<Record<string, boolean>>({
    'Data Minimization': true,
    'Selective Disclosure': true,
    'TEE Enclaves': true,
    'Auditable Anchors': true,
  });

  const privacyMetrics = [
    { label: 'Data Exposure Reduction', value: 90, unit: '%', icon: Shield, color: 'text-emerald-500' },
    { label: 'Verification Latency', value: 98, unit: '%', icon: Zap, color: 'text-amber-500' },
    { label: 'Identity Fragmentation', value: 15, unit: '%', icon: Database, color: 'text-blue-500' },
    { label: 'Privacy Score', value: 94, unit: '/100', icon: Activity, color: 'text-purple-500' },
  ];

  const privacyFeatures = [
    {
      title: 'Data Minimization',
      description: 'Transmit only required assertions — raw metadata never leaves the custodian.',
      icon: EyeOff,
      status: 'Active',
      details: '74% reduction in payload size'
    },
    {
      title: 'Selective Disclosure',
      description: 'Reveal specific, verifiable attributes without exposing underlying records.',
      icon: FileCheck,
      status: 'Enabled',
      details: 'ZK-SNARKs powered'
    },
    {
      title: 'TEE Enclaves',
      description: 'Sensitive checks run inside hardware-backed Intel SGX enclaves.',
      icon: Lock,
      status: 'Secure',
      details: 'Arbitrum Nitro integration'
    },
    {
      title: 'Auditable Anchors',
      description: 'Concise proofs anchored on-chain with revocation flags.',
      icon: Fingerprint,
      status: 'Verified',
      details: 'Block #19283746'
    }
  ];

  const recentEvents = [
    { id: 1, type: 'Attestation', message: 'ZK-Proof verified for Credit Score', time: '2m ago', status: 'success' },
    { id: 2, type: 'Enclave', message: 'Intel SGX Enclave Heartbeat', time: '5m ago', status: 'success' },
    { id: 3, type: 'Privacy', message: 'Selective Disclosure requested by Agent 007', time: '12m ago', status: 'warning' },
    { id: 4, type: 'Network', message: 'Anchor updated on Arbitrum Sepolia', time: '18m ago', status: 'success' },
    { id: 5, type: 'Security', message: 'Data minimization applied to Tranche #4', time: '24m ago', status: 'success' },
  ];

  const toggleFeature = (title: string) => {
    setActiveFeatures(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Privacy Dashboard
          </h1>
          <p className="text-slate-400 mt-2">
            Monitor and manage your privacy-preserving attestations and confidential computing enclaves.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10">
            <Settings2 className="h-4 w-4 mr-2" />
            Privacy Settings
          </Button>
          <Button size="sm" className="shadow-[0_0_15px_rgba(var(--primary),0.3)]">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Rotate Keys
          </Button>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {privacyMetrics.map((metric, index) => (
          <Card key={index} className="glass-card border-white/10 overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-16 h-16 opacity-10 -mr-4 -mt-4`}>
               <metric.icon className={`w-full h-full ${metric.color}`} />
            </div>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-white/5`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
                <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/20 text-emerald-400">LIVE</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{metric.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">{metric.value}</span>
                  <span className="text-sm text-slate-500">{metric.unit}</span>
                </div>
              </div>
              <Progress value={metric.value} className="h-1 mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Status Area */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="tunnel" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="tunnel" className="data-[state=active]:bg-primary/20">Privacy Tunnel</TabsTrigger>
                <TabsTrigger value="enclave" className="data-[state=active]:bg-primary/20">Enclave Health</TabsTrigger>
                <TabsTrigger value="network" className="data-[state=active]:bg-primary/20">Network Proofs</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="tunnel" className="mt-0">
              <Card className="glass-card border-white/10 overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <RefreshCcw className="h-5 w-5 text-primary animate-spin-slow" />
                    Active Privacy Tunnel
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Real-time ZK/TEE attestation stream from Arbitrum Sepolia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-56 w-full bg-slate-950/50 rounded-2xl flex items-center justify-center overflow-hidden border border-white/5">
                    {/* Visual Tunnel Effect */}
                    <div className="absolute inset-0 flex items-center justify-around px-8">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.3, 0.1],
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            delay: i * 0.5 
                          }}
                          className="w-24 h-24 rounded-full border border-primary/20 bg-primary/5 blur-md"
                        />
                      ))}
                    </div>
                    
                    {/* Data Flow Particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ 
                            x: ['0%', '100%'],
                            opacity: [0, 1, 1, 0]
                          }}
                          transition={{ 
                            duration: 4, 
                            repeat: Infinity, 
                            delay: i * 0.6,
                            ease: "linear"
                          }}
                          className="absolute top-1/2 -translate-y-1/2 h-0.5 w-6 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_10px_rgba(var(--primary),0.8)]"
                          style={{ top: `${15 + (i * 12) % 70}%` }}
                        />
                      ))}
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-4 w-full px-12">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col items-center gap-3">
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="p-4 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl relative group"
                          >
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity" />
                            <Database className="h-6 w-6 text-blue-400" />
                          </motion.div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Raw Data Source</span>
                        </div>

                        <div className="flex-1 mx-4 h-px bg-gradient-to-r from-blue-500/20 via-primary to-emerald-500/20 relative">
                           <motion.div 
                             animate={{ left: ['0%', '100%'] }}
                             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                             className="absolute -top-1 h-2 w-2 bg-primary rounded-full blur-[2px] shadow-[0_0_8px_rgba(var(--primary),1)]"
                           />
                        </div>

                        <div className="flex flex-col items-center gap-3">
                          <motion.div 
                            animate={{ 
                              boxShadow: ['0 0 0px rgba(var(--primary),0)', '0 0 20px rgba(var(--primary),0.3)', '0 0 0px rgba(var(--primary),0)']
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="p-6 bg-primary/10 rounded-3xl border border-primary/30 shadow-xl relative overflow-hidden group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
                            <Shield className="h-10 w-10 text-primary relative z-10" />
                          </motion.div>
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest animate-pulse">TEE Enclave</span>
                        </div>

                        <div className="flex-1 mx-4 h-px bg-gradient-to-r from-primary/20 via-emerald-500 to-transparent relative">
                            <motion.div 
                             animate={{ left: ['0%', '100%'] }}
                             transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                             className="absolute -top-1 h-2 w-2 bg-emerald-500 rounded-full blur-[2px] shadow-[0_0_8px_rgba(16,185,129,1)]"
                           />
                        </div>

                        <div className="flex flex-col items-center gap-3">
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="p-4 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl group"
                          >
                            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                          </motion.div>
                          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Verified Proof</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Uptime</p>
                      <p className="text-sm font-mono text-white">99.998%</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Throughput</p>
                      <p className="text-sm font-mono text-white">1.2k req/s</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Active Jobs</p>
                      <p className="text-sm font-mono text-white">42</p>
                    </div>
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                      <p className="text-[10px] text-primary/70 uppercase font-bold tracking-wider mb-1">Security Level</p>
                      <p className="text-sm font-mono text-emerald-400 font-black">L3 HSM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="enclave" className="mt-0">
               <Card className="glass-card border-white/10 h-[380px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Server className="h-12 w-12 text-primary mx-auto opacity-50" />
                    <div>
                      <h3 className="text-lg font-bold text-white">Enclave Health Monitor</h3>
                      <p className="text-slate-400 text-sm">Detailed hardware-level metrics coming soon.</p>
                    </div>
                    <Button variant="outline" size="sm">Connect Intel SGX</Button>
                  </div>
               </Card>
            </TabsContent>

            <TabsContent value="network" className="mt-0">
               <Card className="glass-card border-white/10 h-[380px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Network className="h-12 w-12 text-primary mx-auto opacity-50" />
                    <div>
                      <h3 className="text-lg font-bold text-white">Network Proof Explorer</h3>
                      <p className="text-slate-400 text-sm">Real-time on-chain verification explorer.</p>
                    </div>
                    <Button variant="outline" size="sm">View on Arbitrum</Button>
                  </div>
               </Card>
            </TabsContent>
          </Tabs>

          {/* Privacy Features List with Controls */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              Privacy Control Center
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {privacyFeatures.map((feature, index) => (
                <Card key={index} className={`glass-card border-white/5 hover:border-primary/20 transition-all group ${!activeFeatures[feature.title] ? 'opacity-60' : ''}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg transition-colors ${activeFeatures[feature.title] ? 'bg-primary/10' : 'bg-slate-800'}`}>
                        <feature.icon className={`h-5 w-5 ${activeFeatures[feature.title] ? 'text-primary' : 'text-slate-500'}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-white">{feature.title}</h4>
                            <Badge variant={activeFeatures[feature.title] ? "secondary" : "outline"} className="text-[9px] h-4">
                              {activeFeatures[feature.title] ? feature.status : 'Disabled'}
                            </Badge>
                          </div>
                          <Switch 
                            checked={activeFeatures[feature.title]} 
                            onCheckedChange={() => toggleFeature(feature.title)}
                          />
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {feature.description}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <p className="text-[10px] font-mono text-primary/70">
                            {feature.details}
                          </p>
                          {activeFeatures[feature.title] && (
                             <span className="flex items-center gap-1 text-[9px] text-emerald-500 font-bold uppercase">
                               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                               Active
                             </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Status Area */}
        <div className="space-y-6">
          <Card className="glass-card border-white/10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500" />
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Privacy Agent</CardTitle>
              <CardDescription className="text-slate-400">Autonomous monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AgentCard 
                agentId="privacy-guard-001"
                name="Privacy Guard"
                type="disclosure-agent"
                reputation={98}
                status="active"
              />
              
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-3 items-start relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:rotate-12 transition-transform">
                   <AlertTriangle className="h-8 w-8 text-amber-500" />
                </div>
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 relative z-10" />
                <div className="space-y-1 relative z-10">
                  <p className="text-xs font-bold text-amber-500">Risk Detected</p>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Potential identity linkability detected in Tranche #4 secondary market. Agent is auto-obfuscating.
                  </p>
                </div>
              </div>

              <Button variant="outline" className="w-full text-xs h-10 border-white/10 hover:bg-white/5">
                <Eye className="h-4 w-4 mr-2" />
                View Privacy Logs
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[250px] px-4 pb-4">
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex gap-3 group">
                      <div className="relative flex flex-col items-center">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${
                          event.status === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                          event.status === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 
                          'bg-blue-500'
                        }`} />
                        <div className="w-px flex-1 bg-white/5 group-last:bg-transparent" />
                      </div>
                      <div className="pb-4">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{event.type}</span>
                          <span className="text-[9px] text-slate-600">• {event.time}</span>
                        </div>
                        <p className="text-xs text-slate-300 group-hover:text-white transition-colors">{event.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-white/5">
                <Button variant="ghost" className="w-full h-8 text-xs text-slate-400 hover:text-white">
                  View Full Audit Log
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white font-bold">Compliance Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pb-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">GDPR Compliance</span>
                <span className="text-emerald-500 font-black">100%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">CCPA/CPRA</span>
                <span className="text-emerald-500 font-black">100%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">MiCA Privacy Layer</span>
                <div className="flex items-center gap-2">
                  <Progress value={65} className="h-1 w-12" />
                  <span className="text-amber-500 font-bold">65%</span>
                </div>
              </div>
              <div className="h-px bg-white/5 my-2" />
              <Button size="sm" className="w-full h-9 text-xs font-bold group">
                Generate Report
                <FileCheck className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyDashboard;
