"use client"
import { Suspense, useState } from 'react';
import FileTable from '@/app/_components/FileTable';
import LocalFileList from '@/app/_components/LocalFileList';
import AddFileButton from '@/app/_components/AddFileButton';
import ProjectContextMenu from '@/app/_components/ProjectContextMenu';
import { useParams } from 'next/navigation';

interface PageError extends Error {
  message: string;
}

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  try {
    return (
      <div 
        className="p-4 bg-zinc-900"
        onContextMenu={handleContextMenu}
      >
        {/* <h1 className="text-2xl font-bold mb-4 text-zinc-100">{data.folder.name}</h1> */}
        
        <div className="grid grid-cols-2 gap-4">
          {/* 로컬 파일 목록 */}
          <Suspense fallback={<div>Loading...</div>}>
            <LocalFileList projectId={projectId} />
          </Suspense>

          {/* 분류된 파일 테이블 */}
          <Suspense fallback={<div>Loading...</div>}>
            <FileTable projectId={projectId} />
          </Suspense>
        </div>

        <AddFileButton />

        {/* 컨텍스트 메뉴 */}
        {contextMenu && (
          <ProjectContextMenu
            projectId={projectId}
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error('Error in ProjectPage:', error);
    const err = error as PageError;
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="text-red-400">
          {err.message === 'Unauthorized' 
            ? '로그인이 필요합니다.' 
            : '프로젝트 정보를 불러오는데 실패했습니다.'}
        </div>
      </div>
    );
  }
}