'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText } from 'lucide-react';
import { useLocationStore } from '@/store/use-location-store';
import { Account, Location } from '@/types';

export default function ReportsPage() {
  const { selectedLocationId } = useLocationStore();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    accountId: 'all',
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/accounts').then((res) => res.json()),
      fetch('/api/locations').then((res) => res.json()),
    ])
      .then(([accountsData, locationsData]) => {
        setAccounts(accountsData);
        setLocations(locationsData);
      })
      .catch(console.error);
  }, []);

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.accountId && filters.accountId !== 'all') params.append('accountId', filters.accountId);
      if (selectedLocationId) {
        params.append('locationId', selectedLocationId.toString());
      } else {
        params.append('locationId', 'all');
      }

      const response = await fetch(`/api/reports?${params}`);
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      const params = new URLSearchParams();
      
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.accountId && filters.accountId !== 'all') params.append('accountId', filters.accountId);
      if (selectedLocationId) {
        params.append('locationId', selectedLocationId.toString());
      } else {
        params.append('locationId', 'all');
      }
      params.append('format', 'csv');

      const response = await fetch(`/api/reports?${params}`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions-report.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export CSV:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex space-x-2">
          <Button onClick={generateReport} disabled={isLoading}>
            <FileText className="mr-2 h-4 w-4" />
            {isLoading ? 'Generating...' : 'Generate Report'}
          </Button>
          {reportData && (
            <Button variant="outline" onClick={exportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Account</label>
              <Select
                value={filters.accountId}
                onValueChange={(value) =>
                  setFilters({ ...filters, accountId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Accounts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Results */}
      {reportData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Credits
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-green-600">
                  ${reportData.totals.credits.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Debits
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-red-600">
                  ${reportData.totals.debits.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Transactions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-blue-600">
                  {reportData.totals.count}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Daily Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Debits</TableHead>
                    <TableHead>Net</TableHead>
                    <TableHead>Transactions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(reportData.dailySummary).map(([date, data]: [string, any]) => (
                    <TableRow key={date}>
                      <TableCell className="font-medium">
                        {new Date(date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-green-600">
                        ${data.credits.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-red-600">
                        ${data.debits.toFixed(2)}
                      </TableCell>
                      <TableCell
                        className={
                          data.credits - data.debits >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        ${(data.credits - data.debits).toFixed(2)}
                      </TableCell>
                      <TableCell>{data.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Account Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Account-wise Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Debits</TableHead>
                    <TableHead>Net</TableHead>
                    <TableHead>Transactions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(reportData.accountSummary).map(([account, data]: [string, any]) => (
                    <TableRow key={account}>
                      <TableCell className="font-medium">{account}</TableCell>
                      <TableCell className="text-green-600">
                        ${data.credits.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-red-600">
                        ${data.debits.toFixed(2)}
                      </TableCell>
                      <TableCell
                        className={
                          data.credits - data.debits >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        ${(data.credits - data.debits).toFixed(2)}
                      </TableCell>
                      <TableCell>{data.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}