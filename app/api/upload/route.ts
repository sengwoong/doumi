import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    const paths = formData.getAll('paths');
    const projectName = formData.get('projectName');

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files received' }, { status: 400 });
    }

    if (!projectName) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    // public/uploads 디렉토리에 저장하도록 수정
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', projectName as string);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const rootFolder = await prisma.folder.create({
      data: {
        name: projectName as string,
        path: `/uploads/${projectName}`,  // public 경로 반영
      }
    });

    for (let i = 0; i < files.length; i++) {
      const file = files[i] as File;
      const filePath = paths[i] as string;
      
      // 프로젝트 폴더 내에 전체 파일 경로 생성
      const fullPath = path.join(uploadsDir, filePath);
      
      // 파일이 위치할 디렉토리 경로
      const dirPath = path.dirname(fullPath);
      
 
      // 디렉토리가 없으면 생성 (상위 디렉토리 포함)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      try {
        // 파일 저장
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(fullPath, buffer);
      } catch (err) {
        console.error(`Error saving file ${filePath}:`, err);
        throw new Error(`Failed to save file ${filePath}: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Files uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
