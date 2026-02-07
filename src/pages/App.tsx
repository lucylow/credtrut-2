import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, Suspense } from 'react';
import AppHeader from '@/components/app/AppHeader';
import { RiskEngineDashboard } from '@/components/credtrust';
import FloatingParticles from '@/components/landing/FloatingParticles';
import LoanMarketplace from '@/components/marketplace/LoanMarketplace';
import CreditDashboard from '@/components/analytics/CreditDashboard';
import TEEWorkflow from '@/components/iExecIntegration/TEEWorkflow';
import PrivacyDashboard from '@/components/privacy/PrivacyDashboard';
import { SlideViewer } from '@/components/slides';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { TrancheManager } from '@/components/debt-marketplace';
import { AIAgentChat } from '@/components/app/AIAgentChat';
import AgentMarketplace from '@/pages/AgentMarketplace';
import { TDXAgentDashboard } from '@/components/app/TDXAgentDashboard';
import { 
  Plus,
  Shield, 
  Upload, 
  FileText, 
  Database, 
  Lock, 
  ArrowRight, 
  Coins, 
  TrendingUp, 
  Wallet,
  Settings as SettingsIcon,
  User,
  Bell,
  Fingerprint,
  CheckCircle,
  Zap
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";
export default function AppPage() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingParticles />
      <AppHeader />
      
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar className="sticky top-16 h-[calc(100vh-4rem)]" />
        
        <main className="flex-1 overflow-auto">
          <div className="container py-6 lg:py-8 max-w-6xl">
            <Suspense fallback={<LoadingSkeleton type="card" count={3} />}>
              <Routes>
                <Route path="/" element={<RiskEnginePage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/agents" element={<AgentsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/slides" element={<SlidesPage />} />
                <Route path="/tee" element={<TEEPage />} />
                <Route path="/tranches" element={<TranchesPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/tdx" element={<TDXPage />} />
                <Route path="/submit" element={<SubmitDataPage />} />
                <Route path="/nft" element={<MyNFTsPage />} />
                <Route path="/staking" element={<StakingPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/app" replace />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

function RiskEnginePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <RiskEngineDashboard />
    </motion.div>
  );
}

function MarketplacePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <LoanMarketplace />
    </motion.div>
  );
}

function AnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <CreditDashboard />
    </motion.div>
  );
}

function TEEPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6 lg:space-y-8"
    >
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">iExec TEE Workflow</h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          Experience confidential computing with Intel SGX trusted execution
        </p>
      </div>
      <TEEWorkflow
        encryptedData="demo-encrypted-data"
        onComplete={(result, attestation) => {
          console.log('TEE Complete:', result, attestation);
        }}
      />
    </motion.div>
  );
}

function TranchesPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <TrancheManager />
    </motion.div>
  );
}

function PrivacyPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <PrivacyDashboard />
    </motion.div>
  );
}

function SlidesPage() {
  const [activeSlug, setActiveSlug] = useState('solution');
  const slugs = ['problem', 'solution', 'privacy-features'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 lg:space-y-8"
    >
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Presentation Slides</h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          Interactive mock data slides showcasing CredTrust features
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {slugs.map(slug => (
          <Button
            key={slug}
            variant={activeSlug === slug ? 'default' : 'outline'}
            onClick={() => setActiveSlug(slug)}
            className="capitalize"
          >
            {slug.replace('-', ' ')}
          </Button>
        ))}
      </div>

      <SlideViewer slug={activeSlug} />
    </motion.div>
  );
}

function ChatPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 lg:space-y-8"
    >
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">AI Agent Chat</h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          Interact with Eliza OS agents for risk analysis and market insights
        </p>
      </div>
      <AIAgentChat />
    </motion.div>
  );
}

function AgentsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AgentMarketplace />
    </motion.div>
  );
}

function SubmitDataPage() {
  const [uploading, setUploading] = useState(false);
  const [dataReady, setDataReady] = useState(false);

  if (dataReady) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto space-y-6 lg:space-y-8"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">TEE Processing</h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Your data is being processed in a secure Intel SGX enclave
          </p>
        </div>
        <TEEWorkflow
          encryptedData="user-uploaded-financial-data"
          onComplete={(result, attestation) => {
            console.log('TEE Complete:', result, attestation);
          }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Submit Private Data</h1>
          <p className="text-muted-foreground mt-1">Upload your financial history securely to the CredTrust TEE.</p>
        </div>
        <Badge variant="outline" className="mb-1 gap-1 py-1">
          <Lock className="w-3 h-3" /> TEE Protected
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Upload Documents</CardTitle>
            <CardDescription>We support PDF, JSON, and CSV exports from major banks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className={cn(
                "p-12 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors",
                uploading ? "bg-muted/50 border-primary/50" : "hover:bg-muted/30 border-border"
              )}
            >
              <div className="p-4 rounded-full bg-primary/10 mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <p className="text-center font-medium">Drag and drop your files here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse from your device</p>
              <Input type="file" className="hidden" id="file-upload" onChange={() => setUploading(true)} />
              <Button 
                variant="outline" 
                className="mt-6" 
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Select Files"}
              </Button>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20 border border-secondary/30">
              <Shield className="w-10 h-10 text-secondary shrink-0" />
              <div className="text-xs space-y-1">
                <p className="font-bold">End-to-End Encryption</p>
                <p className="text-muted-foreground">Your data is encrypted in your browser before being sent to the secure enclave. Even we cannot see it.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end border-t p-6">
            <Button 
              disabled={!uploading} 
              className="gap-2"
              onClick={() => setDataReady(true)}
            >
              Process Data <ArrowRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Connect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3" size="sm">
                <Database className="w-4 h-4 text-blue-500" /> Plaid
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" size="sm">
                <FileText className="w-4 h-4 text-green-500" /> Quickbooks
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" size="sm">
                <Shield className="w-4 h-4 text-purple-500" /> Coinbase
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h4 className="font-bold text-sm mb-2">Why submit data?</h4>
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-primary mt-0.5" />
                  Increase your credit score
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-primary mt-0.5" />
                  Unlock lower interest rates
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-primary mt-0.5" />
                  Access higher loan amounts
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

function MyNFTsPage() {
  const nfts = [
    { id: '1284', score: 785, tier: 'Platinum', date: '2024-05-12', color: 'from-blue-500 to-cyan-400' },
    { id: '0942', score: 712, tier: 'Gold', date: '2024-03-20', color: 'from-amber-400 to-yellow-600' },
    { id: '2156', score: 824, tier: 'Diamond', date: '2024-06-05', color: 'from-purple-500 to-indigo-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Loan NFTs</h1>
          <p className="text-muted-foreground mt-1">Privacy-preserving credit score vouchers on-chain.</p>
        </div>
        <Button className="gap-2">
          Mint New NFT
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map(nft => (
          <motion.div 
            key={nft.id} 
            whileHover={{ y: -5 }}
            className="glass-card overflow-hidden rounded-2xl border border-border group"
          >
            <div className={cn("w-full h-56 bg-gradient-to-br relative flex items-center justify-center p-8", nft.color)}>
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Shield className="w-24 h-24 text-white/90 drop-shadow-2xl" />
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider border border-white/30">
                Verified
              </div>
              <div className="absolute bottom-4 left-6 text-white">
                <p className="text-[10px] uppercase font-bold tracking-tighter opacity-70">Credit Score</p>
                <p className="text-3xl font-black">{nft.score}</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">CredTrust Voucher</h3>
                  <p className="text-xs text-muted-foreground">ID: #CT-{nft.id}</p>
                </div>
                <Badge className="bg-primary/20 text-primary border-none">{nft.tier}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Issue Date</p>
                  <p className="font-medium">{nft.date}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-muted-foreground">Expiry</p>
                  <p className="font-medium">2025-05-12</p>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs">View Details</Button>
                <Button size="sm" className="flex-1 text-xs">Use in Loan</Button>
              </div>
            </div>
          </motion.div>
        ))}
        
        <button className="h-full min-h-[400px] rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 hover:bg-muted/30 transition-colors">
          <div className="p-4 rounded-full bg-muted">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-bold">Generate New Score</p>
            <p className="text-xs text-muted-foreground px-8 mt-1">Submit fresh data to update your on-chain credit reputation.</p>
          </div>
        </button>
      </div>
    </motion.div>
  );
}

function TDXPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <TDXAgentDashboard />
    </motion.div>
  );
}

function StakingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Stake & Earn</h1>
          <p className="text-muted-foreground mt-1">Provide liquidity to credit pools and earn rewards.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase font-bold">Total Staked</p>
            <p className="text-xl font-bold">$1,240,500</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase font-bold">Total Rewards</p>
            <p className="text-xl font-bold text-primary">$45,210</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Yield Pools</CardTitle>
            <CardDescription>Select a risk-adjusted pool to provide liquidity.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Stable Yield (Tier A)', apy: '4.5%', risk: 'Low', tvl: '$450k', icon: Shield },
                { name: 'Growth Pool (Tier B)', apy: '8.2%', risk: 'Medium', tvl: '$320k', icon: TrendingUp },
                { name: 'Alpha Vault (Tier C)', apy: '14.5%', risk: 'High', tvl: '$180k', icon: Zap },
              ].map((pool) => (
                <div key={pool.name} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <pool.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{pool.name}</p>
                      <p className="text-xs text-muted-foreground">TVL: {pool.tvl}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">APY</p>
                      <p className="font-bold text-success">{pool.apy}</p>
                    </div>
                    <Button size="sm">Stake</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Positions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex justify-between items-center mb-4">
                <Badge>Stable Yield</Badge>
                <p className="text-xs text-muted-foreground">#823</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold">5,000 USDC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rewards</span>
                  <span className="font-bold text-success">+12.45 USDC</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">Claim Rewards</Button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold">Platform Stats</h4>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
                  <p className="text-muted-foreground">Protocol Fee</p>
                  <p className="font-bold">0.15%</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
                  <p className="text-muted-foreground">Avg. APY</p>
                  <p className="font-bold">7.4%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and platform preferences.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5" /> Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input id="display-name" placeholder="Enter name" defaultValue="Anonymous Borrower" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Notification (Optional)</Label>
              <Input id="email" type="email" placeholder="email@example.com" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="w-5 h-5" /> Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Stealth Mode</Label>
                <p className="text-xs text-muted-foreground">Hide your activity from public leaderboards.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between border-t pt-6">
              <div className="space-y-0.5">
                <Label>Zero-Knowledge Proofs</Label>
                <p className="text-xs text-muted-foreground">Always use ZKPs for loan applications.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between border-t pt-6">
              <div className="space-y-0.5">
                <Label>Biometric Auth</Label>
                <p className="text-xs text-muted-foreground">Require biometric verification for large withdrawals.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card border-destructive>
          <CardHeader>
            <CardTitle className="text-lg text-destructive flex items-center gap-2">
              <Fingerprint className="w-5 h-5" /> Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Once you delete your on-chain credit history, it cannot be recovered. This will affect your borrowing power.</p>
            <Button variant="destructive" size="sm">Purge Credit History</Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
