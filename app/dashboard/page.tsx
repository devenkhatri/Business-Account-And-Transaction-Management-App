'use client';

import { useEffect, useState } from 'react';
import { useLocationStore } from '@/store/use-location-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyBalanceChart } from '@/components/charts/daily-balance-chart';
import { AccountPieChart } from '@/components/charts/account-pie-chart';
import { DashboardMetrics, ChartData, AccountSummary } from '@/types';

export default function DashboardPage() {
  const { selectedLocationId } = useLocationStore();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalCredits: 0,
    totalDebits: 0,
    netBalance: 0,
    transactionCount: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [accountData, setAccountData] = useState<AccountSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedLocationId) {
          params.append('locationId', selectedLocationId.toString());
        } else {
          params.append('locationId', 'all');
        }

        const response = await fetch(`/api/dashboard?${params}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        // Ensure we have valid metrics data with fallbacks
        const safeMetrics = {
          totalCredits: data.metrics?.totalCredits ?? 0,
          totalDebits: data.metrics?.totalDebits ?? 0,
          netBalance: data.metrics?.netBalance ?? 0,
          transactionCount: data.metrics?.transactionCount ?? 0,
        };
        
        console.log('Setting metrics:', safeMetrics);
        setMetrics(safeMetrics);
        setChartData(data.chartData ?? []);
        setAccountData(data.accountData ?? []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set default values on error
        setMetrics({
          totalCredits: 0,
          totalDebits: 0,
          netBalance: 0,
          transactionCount: 0,
        });
        setChartData([]);
        setAccountData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedLocationId]);

  // Format currency in Indian Rupees
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      currencyDisplay: 'symbol'
    }).format(amount);
  };

  // Safety check to ensure metrics is never undefined
  const safeMetrics = metrics || {
    totalCredits: 0,
    totalDebits: 0,
    netBalance: 0,
    transactionCount: 0,
  };

  console.log('Current metrics state:', metrics);
  console.log('Safe metrics:', safeMetrics);

  // Additional safety check - if metrics is still undefined after loading, show loading
  if (isLoading || !metrics) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Credits Today
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-green-600">
              {formatINR(safeMetrics.totalCredits)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Debits Today
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-red-600">
              {formatINR(safeMetrics.totalDebits)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Net Balance Today
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div
              className={`text-2xl font-bold ${
                safeMetrics.netBalance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatINR(safeMetrics.netBalance)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Transactions Today
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-blue-600">
              {safeMetrics.transactionCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Transaction Amounts (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <DailyBalanceChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account-wise Transaction Totals</CardTitle>
          </CardHeader>
          <CardContent>
            {accountData.length > 0 ? (
              <AccountPieChart data={accountData} />
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}