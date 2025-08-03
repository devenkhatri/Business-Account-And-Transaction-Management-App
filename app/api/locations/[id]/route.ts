import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { locationSchema } from '@/lib/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const location = await prisma.location.findUnique({
      where: { id: parseInt(params.id) },
    });
    
    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(location);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch location' },
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
    const validatedData = locationSchema.parse(body);
    
    const location = await prisma.location.update({
      where: { id: parseInt(params.id) },
      data: validatedData,
    });
    
    return NextResponse.json(location);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.location.delete({
      where: { id: parseInt(params.id) },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete location' },
      { status: 500 }
    );
  }
}