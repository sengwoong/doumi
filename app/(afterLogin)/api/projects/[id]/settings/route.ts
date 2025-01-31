import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: 실제 데이터베이스에서 프로젝트 설정을 가져오는 로직 구현
    // 임시 데이터 반환
    const settings = {
      name: '프로젝트 이름',
      description: '프로젝트 설명',
      visibility: 'private'
    };

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch project settings' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    // TODO: 실제 데이터베이스에 프로젝트 설정을 저장하는 로직 구현

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update project settings' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = params;

    await prisma.folder.delete({
      where: { id },
    });

    return new NextResponse('Project deleted successfully');
  } catch (error) {
    console.error('Error deleting project:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 