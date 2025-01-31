"use client"
import { Suspense } from 'react';
import FileTable from '@/app/_components/FileTable';
import LocalFileList from '@/app/_components/LocalFileList';
import AddFileButton from '@/app/_components/AddFileButton';
import { auth } from '@/app/auth';
import { useParams } from 'next/navigation';

export default  function ProjectPage({ params }) {
  try {
    const params = useParams();
    const projectId = params.id;

    return (
      <div className="p-4 bg-zinc-900">
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