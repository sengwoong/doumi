import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '100mb',
  },
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    const paths = formData.getAll('paths');
    const projectName = formData.get('projectName');

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files received' }, { status: 400 });
    }

    // 프로젝트 디렉토리 생성
    const projectDir = path.join(process.cwd(), 'uploads', projectName as string);
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    // 파일 저장
    for (let i = 0; i < files.length; i++) {
      const file = files[i] as File;
      const filePath = paths[i] as string;
      
      // 전체 파일 경로 생성
      const fullPath = path.join(projectDir, filePath);
      const folderPath = path.dirname(fullPath);

      // 필요한 하위 디렉토리 생성
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // 파일 내용을 ArrayBuffer로 변환 후 저장
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(fullPath, buffer);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Files uploaded successfully' 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files', details: error.message }, 
      { status: 500 }
    );
  }
}
