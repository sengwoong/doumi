import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import prisma from '@/lib/prisma';

type Props = {
  params: Promise<{ id: string }>;
}

export async function GET(
  req: NextRequest,
  props: Props
) {
  try {
    const { searchParams } = new URL(req.url);

    const { id } = await props.params;
 



    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const type = searchParams.get('type') || 'controller';
    const skip = (page - 1) * limit;

    // 프로젝트 정보 조회
    const folder = await prisma.folder.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
   
    if (!folder) {
      return new NextResponse('Folder not found', { status: 404 });
    }


    // 파일 타입에 따른 조건 설정
    let typeCondition = {};
    if (type === 'controller') {
      typeCondition = { type: 'controller' };
    } else if (type === 'service') {
      typeCondition = { type: 'service' };
    } else if (type === 'exception') {
      typeCondition = { type: 'exception' };
    } 
   

    // 파일 목록 조회 (페이지네이션 적용)
    const [files, totalCount] = await Promise.all([
      prisma.file.findMany({
        where: {
          folderId: id,
          ...typeCondition,
        },
        include: {
          methods: true,
        },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.file.count({
        where: {
          folderId: id,
          ...typeCondition,
        },
      }),
    ]);
   

    return NextResponse.json({
      folder,
      files,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit,
      },
    });

    console.log(files[0].methods);
  } catch (error) {
    console.error('10. Error details:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 