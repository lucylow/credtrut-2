import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, Suspense } from 'react';
import AppHeader from '@/components/app/AppHeader';
import { RiskEngineDashboard } from '@/components/credtrust';
import FloatingParticles from '@/components/landing/FloatingParticles';
import LoanMarketplace from '@/components/marketplace/LoanMarketplace';
import CreditDashboard from '@/components/analytics/CreditDashboard';
import TEEWorkflow from '@/components/iExecIntegration/TEEWorkflow';
import { SlideViewer } from '@/components/slides';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

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
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/slides" element={<SlidesPage />} />
                <Route path="/tee" element={<TEEPage />} />
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
