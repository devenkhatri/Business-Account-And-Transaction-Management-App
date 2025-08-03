import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { locationSchema } from '@/lib/validations';

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(locations);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = locationSchema.parse(body);
    
    const location = await prisma.location.create({
      data: validatedData,
    });
    
    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    );
  }
}