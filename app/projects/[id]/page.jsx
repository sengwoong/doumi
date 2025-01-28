"use client"
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

function Page() {
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const params = useParams();
  const projectId = params.id;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/folders`);
        const data = await response.json();
        
        if (data.folder) {
          setProject(data.folder);
          setFiles(data.localFiles || []);
        }
      } catch (error) {
        console.error('프로젝트 정보를 가져오는데 실패했습니다:', error);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleDragStart = (item) => (event) => {
    event.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

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

      const refreshResponse = await fetch(`/api/projects/${projectId}/folders`);
      const refreshData = await refreshResponse.json();
      setFiles(refreshData.localFiles || []);
      
    } catch (error) {
      console.error('파일 저장 실패:', error);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  if (!project) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="p-4 bg-zinc-900">
      <h1 className="text-2xl font-bold mb-4 text-zinc-100">{project.name}</h1>
      
      <div className="grid grid-cols-2 gap-4">
        {/* 로컬 파일 목록 */}
        <div className="border border-zinc-700 rounded p-4 bg-zinc-800">
          <h2 className="text-xl font-semibold mb-3 text-zinc-100">로컬 파일</h2>
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.id}
                draggable
                onDragStart={handleDragStart(file)}
                className="bg-zinc-700 rounded-lg p-4 hover:bg-zinc-600 transition-colors cursor-move"
              >
                <div className="font-medium text-zinc-100 mb-2">{file.name}</div>
                <div className="text-sm text-zinc-300">ID: {file.id}</div>
                <div className="text-sm text-zinc-300 truncate" title={file.fullPath}>
                  경로: {file.fullPath}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 드롭 영역 */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-zinc-700 rounded-lg p-4 min-h-[200px] flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 transition-colors"
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