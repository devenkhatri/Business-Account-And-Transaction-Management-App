import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { accountSchema } from '@/lib/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const account = await prisma.account.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        transactions: {
          include: {
            location: true
          },
          orderBy: { date: 'desc' }
        }
      }
    });
    
    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(account);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch account' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = accountSchema.parse(body);
    
    const account = await prisma.account.update({
      where: { id: parseInt(params.id) },
      data: validatedData,
    });
    
    return NextResponse.json(account);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update account' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.account.delete({
      where: { id: parseInt(params.id) },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}