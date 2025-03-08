import React, { useEffect, useState, useCallback } from 'react';
import { Users, FileText, Activity, BarChart3, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getBlockchainStats } from './api/hiveClient';
import StatCard from './components/StatCard';
import type { BlockchainStats, ChartData, TimeRange } from './types';

const TIME_RANGES: TimeRange[] = [
  { label: '1m', value: 1 },
  { label: '5m', value: 5 },
  { label: '15m', value: 15 },
  { label: '30m', value: 30 }
];

function App() {
  const [stats, setStats] = useState<BlockchainStats | null>(null);
  const [previousStats, setPreviousStats] = useState<BlockchainStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedRange, setSelectedRange] = useState<TimeRange>(TIME_RANGES[0]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getBlockchainStats();
      setPreviousStats(stats);
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch blockchain statistics');
    } finally {
      setLoading(false);
    }
  }, [stats]);

  useEffect(() => {
    fetchStats();
    
    if (autoRefresh) {
      const interval = setInterval(fetchStats, selectedRange.value * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, selectedRange, fetchStats]);

  const calculateChange = (current: number, previous: number): number => {
    if (!previous) return 0;
    return Number(((current - previous) / previous * 100).toFixed(1));
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const chartData: ChartData[] = stats ? [
    { name: 'Total Accounts', value: stats.totalAccounts },
    { name: 'Active Accounts', value: stats.activeAccounts },
    { name: 'Total Posts', value: stats.totalPosts },
    { name: 'Avg Transactions', value: Math.round(stats.averageTransactions) }
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hive Blockchain Analytics</h1>
            <p className="text-gray-600 mt-2">Real-time insights into the Hive blockchain</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {TIME_RANGES.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setSelectedRange(range)}
                  className={`px-3 py-1 rounded ${
                    selectedRange.value === range.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                autoRefresh ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <RefreshCw size={16} className={autoRefresh ? 'animate-spin' : ''} />
              {autoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'}
            </button>
            <button
              onClick={fetchStats}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              Refresh Now
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats && (
            <>
              <StatCard
                title="Total Accounts"
                value={stats.totalAccounts || 0}
                icon={<Users size={24} />}
                change={calculateChange(
                  stats.totalAccounts,
                  previousStats?.totalAccounts || 0
                )}
              />
              <StatCard
                title="Active Accounts"
                value={stats.activeAccounts || 0}
                icon={<Activity size={24} />}
                change={calculateChange(
                  stats.activeAccounts,
                  previousStats?.activeAccounts || 0
                )}
              />
              <StatCard
                title="Total Posts"
                value={stats.totalPosts || 0}
                icon={<FileText size={24} />}
                change={calculateChange(
                  stats.totalPosts,
                  previousStats?.totalPosts || 0
                )}
              />
              <StatCard
                title="Avg Transactions"
                value={Math.round(stats.averageTransactions) || 0}
                icon={<BarChart3 size={24} />}
                change={calculateChange(
                  stats.averageTransactions,
                  previousStats?.averageTransactions || 0
                )}
              />
            </>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Blockchain Metrics Overview</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;