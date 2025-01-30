import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';


export async function POST(request: Request) {
  let uploadsDir: string;
  
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

    // 트랜잭션 실행
    const result = await prisma.$transaction(async (tx) => {
      // userId 포함하여 폴더 생성
      const rootFolder = await tx.folder.create({
        data: {
          name: projectName as string,
          path: `/uploads/${projectName}`,

                }
      });

      // 데이터베이스 작업 성공 후 폴더 생성
      uploadsDir = path.join(process.cwd(), 'public', 'uploads', projectName as string);
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // 파일 업로드 처리
      for (let i = 0; i < files.length; i++) {
        const file = files[i] as File;
        const filePath = paths[i] as string;
        const fullPath = path.join(uploadsDir, filePath);
        const dirPath = path.dirname(fullPath);
        
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(fullPath, buffer);
      }

      return { rootFolder };
    }, {
      maxWait: 10000,
      timeout: 30000
    });

    // 트랜잭션 성공 후 응답 반환
    return NextResponse.json({
      success: true,
      message: 'Files uploaded successfully',
      folderId: result.rootFolder.id
    });

  } catch (error: any) {
    // 안전한 에러 로깅
    const errorMessage = error?.message || 'Unknown error occurred';
    console.log('Upload error:', errorMessage);
    
    // 에러 발생 시 생성된 폴더 삭제
    if (uploadsDir && fs.existsSync(uploadsDir)) {
      try {
        fs.rmSync(uploadsDir, { recursive: true, force: true });
      } catch (deleteError) {
        console.log('Error deleting folder:', deleteError instanceof Error ? deleteError.message : 'Unknown error');
      }
    }

    // 에러 응답
    const errorResponse = {
      error: 'Upload failed',
      details: errorMessage
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
