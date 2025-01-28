"use client"
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

function Page() {
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const projectId = params.id;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${projectId}/folders`);
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        const data = await response.json();
        
        if (data.folder) {
          setProject(data.folder);
          setFiles(data.localFiles || []);
        }
      } catch (error) {
        console.error('프로젝트 정보를 가져오는데 실패했습니다:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // 드래그 시작 핸들러
  const handleDragStart = (file) => (event) => {
    event.dataTransfer.setData('text/plain', JSON.stringify(file));
  };

  // 드롭 핸들러
  const handleDrop = async (event) => {
    event.preventDefault();
    try {
      const item = JSON.parse(event.dataTransfer.getData('text/plain'));
      
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: item.name,
          path: item.fullPath,
          folderId: project.id,
          type: 'local'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save file');
      }

      // 파일 목록 새로고침
      const refreshResponse = await fetch(`/api/projects/${projectId}/folders`);
      const refreshData = await refreshResponse.json();
      setFiles(refreshData.localFiles || []);
      
    } catch (error) {
      console.error('파일 저장 실패:', error);
    }
  };

  // 드래그 오버 핸들러
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="text-zinc-100">로딩 중...</div>
      </div>
    );
  }

  // 에러 상태 표시
  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="text-red-400">
          {error || '프로젝트를 찾을 수 없습니다.'}
        </div>
      </div>
    );
  }

  // 파일들을 최상위 부모 폴더로 그룹화하는 함수
  const groupFilesByParentFolder = (files) => {
    const groups = {};
    
    files.forEach(file => {
      const path = file.fullPath.replace(/\\/g, '/');
      const parts = path.split('/');
      const parentFolder = parts[parts.length - 2] || 'Other';
      
      if (!groups[parentFolder]) {
        groups[parentFolder] = [];
      }
      groups[parentFolder].push(file);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  };

  return (
    <div className="p-4 bg-zinc-900">
      <h1 className="text-2xl font-bold mb-4 text-zinc-100">{project.name}</h1>
      
      <div className="grid grid-cols-2 gap-4">
        {/* 로컬 파일 목록 */}
        <div className="border border-zinc-700 rounded p-4 bg-zinc-800">
          <h2 className="text-xl font-semibold mb-3 text-zinc-100">로컬 파일</h2>
          <div className="space-y-4">
            {Object.entries(groupFilesByParentFolder(files)).map(([folder, folderFiles]) => (
              <div key={folder} className="bg-zinc-700/50 rounded-lg overflow-hidden">
                <div className="bg-zinc-600/50 px-4 py-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <span className="font-medium text-zinc-100">{folder}</span>
                  <span className="text-sm text-zinc-400">({folderFiles.length})</span>
                </div>
                
                <div className="divide-y divide-zinc-600/30">
                  {folderFiles.map((file) => (
                    <div
                      key={file.id}
                      draggable
                      onDragStart={handleDragStart(file)}
                      className="p-4 hover:bg-zinc-600/30 transition-colors cursor-move"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-zinc-100">{file.name}</span>
                      </div>
                      <div className="mt-1 text-sm text-zinc-400 pl-6">
                        {file.fullPath}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 드롭 영역 */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-zinc-700 rounded-lg p-4 min-h-[200px] flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-500 transform hover:scale-[1.01] transition-all duration-300 ease-in-out"
        >
          <div className="text-center">
            <p className="text-zinc-300 mb-2">여기에 파일을 드래그하여</p>
            <p className="text-zinc-300">DB에 추가</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;