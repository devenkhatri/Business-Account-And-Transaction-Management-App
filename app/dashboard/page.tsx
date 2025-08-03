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
      <div className="container p-4 mx-auto">
        <h1 className="mb-6 text-2xl font-bold md:mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-full">
              <CardContent className="p-4 sm:p-6">
                <div className="h-5 w-3/4 mb-2 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-xl px-3 mx-auto sm:px-4 md:px-6">
      <h1 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl md:mb-8">
        Dashboard
      </h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        <Card className="h-full transition-all duration-200 hover:shadow-md">
          <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
            <CardTitle className="text-xs font-medium text-gray-600 sm:text-sm">
              Total Credits
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="text-lg font-bold text-green-600 sm:text-xl md:text-2xl whitespace-nowrap overflow-hidden text-ellipsis">
              {formatINR(safeMetrics.totalCredits)}
            </div>
          </CardContent>
        </Card>

        <Card className="h-full transition-all duration-200 hover:shadow-md">
          <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
            <CardTitle className="text-xs font-medium text-gray-600 sm:text-sm">
              Total Debits
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="text-lg font-bold text-red-600 sm:text-xl md:text-2xl whitespace-nowrap overflow-hidden text-ellipsis">
              {formatINR(safeMetrics.totalDebits)}
            </div>
          </CardContent>
        </Card>

        <Card className="h-full transition-all duration-200 hover:shadow-md">
          <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
            <CardTitle className="text-xs font-medium text-gray-600 sm:text-sm">
              Net Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div
              className={`text-lg font-bold sm:text-xl md:text-2xl whitespace-nowrap overflow-hidden text-ellipsis ${
                safeMetrics.netBalance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatINR(safeMetrics.netBalance)}
            </div>
          </CardContent>
        </Card>

        <Card className="h-full transition-all duration-200 hover:shadow-md">
          <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
            <CardTitle className="text-xs font-medium text-gray-600 sm:text-sm">
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="text-lg font-bold text-blue-600 sm:text-xl md:text-2xl">
              {safeMetrics.transactionCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="flex flex-col w-full gap-4 mb-6 sm:gap-6">
        <div className="w-full">
          <Card className="w-full overflow-hidden">
            <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">
                Daily Transactions (7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] px-2 pb-2 sm:px-4 sm:pb-4">
                <DailyBalanceChart data={chartData} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full">
          <Card className="w-full overflow-hidden">
            <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">
                Account-wise Totals
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] px-2 pb-2 sm:px-4 sm:pb-4">
                {accountData.length > 0 ? (
                  <AccountPieChart data={accountData} />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-sm text-gray-500 sm:text-base">
                    No data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}