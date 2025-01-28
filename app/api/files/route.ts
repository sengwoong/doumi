import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const file = await prisma.file.create({
      data: {
        name: body.name,
        path: body.path,
        folderId: body.folderId,
      },
    });

    return NextResponse.json(file);
  } catch (error) {
    console.error('파일 저장 실패:', error);
    return NextResponse.json(
      { error: '파일 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
} 