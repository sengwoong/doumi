import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 루트 폴더만 가져오기 (parentId가 null인 폴더)
    const rootFolders = await prisma.folder.findMany({
      where: {
        parentId: null
      },
      include: {
        files: true,
        children: {
          include: {
            files: true,
            children: {
              include: {
                files: true,
                children: true
              }
            }
          }
        }
      }
    });
    console.log("rootFolders")
    console.log(rootFolders)
    return NextResponse.json({ success: true, data: rootFolders });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch folder structure' },
      { status: 500 }
    );
  }
} 