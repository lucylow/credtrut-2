// Hook for accessing mock data with real-time simulation
import { useState, useEffect, useCallback } from 'react';
import { mockData, type MockWallet, type MockEnclave, type MockLoan, type MockCampaign, type ChartDataPoint } from '@/data/mock-generators';

export function useMockData() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [liveEnclaveCount, setLiveEnclaveCount] = useState(47);

  // Simulate real-time enclave count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveEnclaveCount(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(40, Math.min(55, prev + delta));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const refresh = useCallback(() => {
    mockData.refresh();
    setRefreshKey(k => k + 1);
  }, []);

  return {
    wallets: mockData.wallets,
    enclaves: mockData.enclaves,
    loans: mockData.loans,
    campaigns: mockData.campaigns,
    chartData: mockData.chartData,
    tierDistribution: mockData.tierDistribution,
    stats: { ...mockData.stats, activeEnclaves: liveEnclaveCount },
    refresh,
    refreshKey,
    liveEnclaveCount,
  };
}

export function useFilteredLoans(loans: MockLoan[]) {
  const [sortBy, setSortBy] = useState<'apr' | 'amount' | 'ltv' | 'newest'>('apr');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = loans
    .filter(l => filterTier === 'all' || l.requiredTier === filterTier)
    .filter(l => filterStatus === 'all' || l.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'apr') return a.apr - b.apr;
      if (sortBy === 'amount') return b.amount - a.amount;
      if (sortBy === 'ltv') return a.ltv - b.ltv;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return { filtered, sortBy, setSortBy, filterTier, setFilterTier, filterStatus, setFilterStatus };
}
