import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { files } = await request.json();

    files.forEach((file: { name: string; path: string; content: string }) => {
      const fullPath = path.join(process.cwd(), 'uploads', file.path);
      const folderPath = path.dirname(fullPath);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true }); // 폴더 생성
      }

      const buffer = Buffer.from(file.content, 'base64'); // Base64 디코딩
      fs.writeFileSync(fullPath, buffer); // 파일 저장
      console.log(`File saved: ${file.path}`);
    });

    return NextResponse.json({ success: true, message: 'Files uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload files', details: error.message }, { status: 500 });
  }
}
