import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const locationId = searchParams.get('locationId');
    const accountId = searchParams.get('accountId');
    const format = searchParams.get('format');

    const where: any = {};

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (locationId && locationId !== 'all') {
      where.locationId = parseInt(locationId);
    }

    if (accountId) {
      where.accountId = parseInt(accountId);
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        account: true,
        location: true,
      },
      orderBy: { date: 'desc' },
    });

    if (format === 'csv') {
      const csvHeaders = 'Date,Transaction No,Type,Amount,Account,Location,Description\n';
      const csvData = transactions
        .map(
          (t) =>
            `${t.date.toISOString().split('T')[0]},${t.transactionNo},${t.type},${t.amount},${t.account.name},${t.location.name},"${t.description || ''}"`
        )
        .join('\n');

      return new NextResponse(csvHeaders + csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="transactions-report.csv"',
        },
      });
    }

    // Group by date for summary
    const dailySummary = transactions.reduce((acc: any, transaction) => {
      const date = transaction.date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { credits: 0, debits: 0, count: 0 };
      }
      
      if (transaction.type === 'CREDIT') {
        acc[date].credits += Number(transaction.amount);
      } else {
        acc[date].debits += Number(transaction.amount);
      }
      acc[date].count += 1;
      
      return acc;
    }, {});

    // Account-wise summary
    const accountSummary = transactions.reduce((acc: any, transaction) => {
      const accountName = transaction.account.name;
      if (!acc[accountName]) {
        acc[accountName] = { credits: 0, debits: 0, count: 0 };
      }
      
      if (transaction.type === 'CREDIT') {
        acc[accountName].credits += Number(transaction.amount);
      } else {
        acc[accountName].debits += Number(transaction.amount);
      }
      acc[accountName].count += 1;
      
      return acc;
    }, {});

    return NextResponse.json({
      transactions,
      dailySummary,
      accountSummary,
      totals: {
        credits: transactions
          .filter((t) => t.type === 'CREDIT')
          .reduce((sum, t) => sum + Number(t.amount), 0),
        debits: transactions
          .filter((t) => t.type === 'DEBIT')
          .reduce((sum, t) => sum + Number(t.amount), 0),
        count: transactions.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}