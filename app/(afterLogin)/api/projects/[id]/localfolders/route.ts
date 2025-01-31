import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

interface LocalFile {
  id: string;
  name: string;
  fullPath: string;  // 전체 경로 (파일명 포함)
  path: string;      // 상위 디렉토리 경로
  type: 'local';
}

interface LocalFolder {
  id: string;
  name: string;
  fullPath: string;  // 전체 경로 (폴더명 포함)
  path: string;      // 상위 디렉토리 경로
  type: 'local';
  isDirectory: true;
}

export async function GET(request: Request) {
  try {
    const projectId = request.url.split('/projects/')[1].split('/')[0];
    
    // 1. 폴더 정보 가져오기
    const folder = await prisma.folder.findUnique({
      where: { id: projectId },
      select: { id: true, name: true }
    });

    if (!folder) {
      return NextResponse.json({ error: '폴더를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 2. 로컬 파일과 폴더 정보 가져오기
    const uploadsPath = path.join(process.cwd(), 'public', 'uploads', folder.name);
    let localFiles: LocalFile[] = [];
    let localFolders: LocalFolder[] = [];
    
    try {
      // 재귀적으로 모든 파일과 폴더를 가져오는 함수
      const getAllItems = async (currentPath: string, relativePath: string = '') => {
        const dirents = await fs.readdir(currentPath, { withFileTypes: true });
        
        for (const dirent of dirents) {
          const itemPath = relativePath;
          const itemFullPath = path.join(relativePath, dirent.name);
          
          if (dirent.isDirectory()) {
            // 폴더인 경우
            localFolders.push({
              id: `local-folder-${itemFullPath}`,
              name: dirent.name,
              fullPath: itemFullPath,
              path: itemPath,
              type: 'local',
              isDirectory: true
            });
            // 재귀적으로 하위 항목들도 가져오기
            await getAllItems(path.join(currentPath, dirent.name), itemFullPath);
          } else {
            // 파일인 경우
            localFiles.push({
              id: `local-file-${itemFullPath}`,
              name: dirent.name,
              fullPath: itemFullPath,
              path: itemPath,
              type: 'local'
            });
          }
        }
      };

      await getAllItems(uploadsPath);
      
    } catch (error) {
      console.log('로컬 파일을 찾을 수 없습니다:', error);
    }

    // 3. DB에 저장된 파일 정보 가져오기
    const dbFiles = await prisma.file.findMany({
      where: {
        folderId: folder.id
      }
    });

    const result = {
      folder,
      localFolders,
      localFiles,
      dbFiles
    };

    return NextResponse.json(result);
    
  } catch (error) {
    console.error('정보를 가져오는데 실패했습니다:', error);
    return NextResponse.json(
      { error: '정보를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 