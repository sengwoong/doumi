import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    // uploads 디렉토리가 없으면 빈 배열 반환
    if (!fs.existsSync(uploadsDir)) {
      return NextResponse.json({ projects: [] });
    }

    // 디렉토리 읽기
    const items = fs.readdirSync(uploadsDir, { withFileTypes: true });
    const projects = items
      .filter(item => item.isDirectory())
      .map(dir => {
        const projectPath = path.join(uploadsDir, dir.name);
        const stats = fs.statSync(projectPath);
        const files = fs.readdirSync(projectPath);

        return {
          id: dir.name,
          name: dir.name,
          uploadDate: stats.mtime.toISOString().split('T')[0],
          fileCount: files.length,
          status: 'pending'
        };
      });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
} 