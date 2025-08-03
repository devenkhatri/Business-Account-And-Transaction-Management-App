import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const where: any = {
      date: {
        gte: today,
        lt: tomorrow,
      },
    };

    if (locationId && locationId !== 'all') {
      const parsedLocationId = parseInt(locationId);
      if (isNaN(parsedLocationId)) {
        return NextResponse.json(
          { error: 'Invalid location ID' },
          { status: 400 }
        );
      }
      where.locationId = parsedLocationId;
    }

    // Today's metrics
    const [credits, debits, transactionCount] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...where, type: 'CREDIT' },
        _sum: { amount: true },
      }).catch(() => ({ _sum: { amount: null } })),
      prisma.transaction.aggregate({
        where: { ...where, type: 'DEBIT' },
        _sum: { amount: true },
      }).catch(() => ({ _sum: { amount: null } })),
      prisma.transaction.count({ where }).catch(() => 0),
    ]);

    const totalCredits = Number(credits._sum.amount || 0);
    const totalDebits = Number(debits._sum.amount || 0);

    // Last 7 days chart data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const chartWhere: any = {
      date: { gte: sevenDaysAgo },
    };

    if (locationId && locationId !== 'all') {
      chartWhere.locationId = parseInt(locationId);
    }

    const dailyData = await prisma.transaction.groupBy({
      by: ['date'],
      where: chartWhere,
      _sum: {
        amount: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const chartData = dailyData.map((item) => ({
      date: item.date.toISOString().split('T')[0],
      amount: Number(item._sum.amount || 0),
    }));

    // Account-wise summary for pie chart
    const accountSummary = await prisma.transaction.groupBy({
      by: ['accountId'],
      where: chartWhere,
      _sum: {
        amount: true,
      },
    });

    const accountData = await Promise.all(
      accountSummary.map(async (item) => {
        const account = await prisma.account.findUnique({
          where: { id: item.accountId },
        });
        return {
          accountId: item.accountId,
          accountName: account?.name || 'Unknown',
          total: Number(item._sum.amount || 0),
        };
      })
    );

    return NextResponse.json({
      metrics: {
        totalCredits,
        totalDebits,
        netBalance: totalCredits - totalDebits,
        transactionCount,
      },
      chartData,
      accountData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}