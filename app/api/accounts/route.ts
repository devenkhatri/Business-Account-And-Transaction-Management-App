import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { accountSchema } from '@/lib/validations';

export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    });
    return NextResponse.json(accounts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = accountSchema.parse(body);
    
    const account = await prisma.account.create({
      data: validatedData,
    });
    
    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}