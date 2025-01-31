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
        const response = await fetch(`/api/projects/${projectId}/localfolders`);
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

      const refreshResponse = await fetch(`/api/projects/${projectId}/localfolders`);
      const refreshData = await refreshResponse.json();
      setFiles(refreshData.localFiles || []);
      
    } catch (error) {
      console.error('파일 저장 실패:', error);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // 파일들을 폴더 구조로 변환하는 함수
  const createFileTree = (files) => {
    const root = {};
    
    files.forEach(file => {
      const parts = file.fullPath.replace(/\\/g, '/').split('/');
      let current = root;
      
      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = {
            files: [],
            children: {}
          };
        }
        
        if (index === parts.length - 1) {
          current[part].files.push(file);
        } else {
          current = current[part].children;
        }
      });
    });
    
    return root;
  };

  // 폴더 트리를 렌더링하는 컴포넌트
  const FolderTree = ({ node, level = 0 }) => {
    return (
      <div className="pl-4">
        {Object.entries(node).map(([name, { files, children }]) => (
          <div key={name} className="mb-2">
            {/* 폴더 이름 */}
            <div className="flex items-center gap-2 py-2">
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span className="text-zinc-200 font-medium">{name}</span>
            </div>
            
            {/* 현재 폴더의 파일들 */}
            {files.map((file) => (
              <div
                key={file.id}
                draggable
                onDragStart={handleDragStart(file)}
                className="ml-6 mb-2 bg-zinc-700 rounded-lg p-4 hover:bg-zinc-600 transform hover:scale-[1.02] hover:shadow-lg transition-all duration-200 ease-in-out cursor-move"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium text-zinc-100">{file.name}</span>
                </div>
              </div>
            ))}
            
            {/* 하위 폴더 재귀적 렌더링 */}
            <FolderTree node={children} level={level + 1} />
          </div>
        ))}
      </div>
    );
  };

  if (!project) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="p-4 bg-zinc-900">
      <h1 className="text-2xl font-bold mb-4 text-zinc-100">{project.name}</h1>
      
      <div className="grid grid-cols-2 gap-4">
        {/* 로컬 파일 트리 */}
        <div className="border border-zinc-700 rounded p-4 bg-zinc-800">
          <h2 className="text-xl font-semibold mb-3 text-zinc-100">로컬 파일</h2>
          <FolderTree node={createFileTree(files)} />
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