"use client"
import { useState } from 'react';
import { Suspense } from 'react';
import FileTable from '@/app/_components/FileTable';
import LocalFileList from '@/app/_components/LocalFileList';
import AddFileButton from '@/app/_components/AddFileButton';
import { useParams } from 'next/navigation';
import ProjectContextMenu from '@/app/_components/ProjectContextMenu';

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id;
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      projectId: projectId
    });
  };

  try {
    return (
      <div 
        className="p-4 bg-zinc-900"
        onContextMenu={handleContextMenu}
      >
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

   
      </div>
    );
  } catch (error) {
    console.error('Error in ProjectPage:', error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="text-red-400">
          {error.message === 'Unauthorized' 
            ? '로그인이 필요합니다.' 
            : '프로젝트 정보를 불러오는데 실패했습니다.'}
        </div>
      </div>
    );
  }
} 