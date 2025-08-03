'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AccountDetail {
  id: number;
  name: string;
  phoneNumber: string;
  createdAt: string;
  transactions: Array<{
    id: number;
    transactionNo: string;
    date: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    description: string | null;
    location: {
      name: string;
    };
  }>;
}

export default function AccountDetailPage() {
  const params = useParams();
  const [account, setAccount] = useState<AccountDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch(`/api/accounts/${params.id}`);
        const data = await response.json();
        setAccount(data);
      } catch (error) {
        console.error('Failed to fetch account:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccount();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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

  if (!account) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-600">Account not found</h2>
        </div>
      </div>
    );
  }

  const totalCredits = account.transactions
    .filter((t) => t.type === 'CREDIT')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalDebits = account.transactions
    .filter((t) => t.type === 'DEBIT')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const locationSummary = account.transactions.reduce((acc: any, transaction) => {
    const locationName = transaction.location.name;
    if (!acc[locationName]) {
      acc[locationName] = { credits: 0, debits: 0 };
    }
    
    if (transaction.type === 'CREDIT') {
      acc[locationName].credits += Number(transaction.amount);
    } else {
      acc[locationName].debits += Number(transaction.amount);
    }
    
    return acc;
  }, {});

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/accounts">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{account.name}</h1>
      </div>

      {/* Account Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Phone Number
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-lg font-semibold">{account.phoneNumber}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Credits
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-lg font-semibold text-green-600">
              ${totalCredits.toFixed(2)}
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
            <div className="text-lg font-semibold text-red-600">
              ${totalDebits.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Net Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div
              className={`text-lg font-semibold ${
                totalCredits - totalDebits >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ${(totalCredits - totalDebits).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Location-wise Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Debits</TableHead>
                <TableHead>Net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(locationSummary).map(([location, data]: [string, any]) => (
                <TableRow key={location}>
                  <TableCell className="font-medium">{location}</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {account.transactions.slice(0, 10).map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.transactionNo}
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.type === 'CREDIT' ? 'default' : 'destructive'
                      }
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>${transaction.amount}</TableCell>
                  <TableCell>{transaction.location.name}</TableCell>
                  <TableCell>{transaction.description || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}