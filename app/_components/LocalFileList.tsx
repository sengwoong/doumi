"use client"
import { useState, useEffect } from 'react';

interface LocalFile {
  id: string;
  name: string;
  fullPath: string;
  type: string;
}

interface LocalFileListProps {
  projectId: string;
}

export default function LocalFileList({ projectId }: LocalFileListProps) {
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocalFiles = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/localfolders`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response)
        if (!response.ok) throw new Error('Failed to fetch local files');
        const data = await response.json();
        setFiles(data.localFiles || []);
      } catch (error) {
        console.error('Error fetching local files:', error);
        setFiles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocalFiles();
  }, [projectId]);

  // 파일들을 최상위 부모 폴더로 그룹화하는 함수
  const groupFilesByParentFolder = (files: LocalFile[]) => {
    const groups: { [key: string]: LocalFile[] } = {};
    
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
      }, {} as { [key: string]: LocalFile[] });
  };

  // 드래그 시작 핸들러
  const handleDragStart = (file: LocalFile) => (event: React.DragEvent) => {
    event.dataTransfer.setData('text/plain', JSON.stringify(file));
  };

  if (isLoading) {
    return (
      <div className="border border-zinc-700 rounded p-4 bg-zinc-800">
        <div className="text-center text-zinc-400">Loading...</div>
      </div>
    );
  }

  const groupedFiles = groupFilesByParentFolder(files);

  return (
    <div className="border border-zinc-700 rounded p-4 bg-zinc-800">
      <h2 className="text-xl font-semibold mb-3 text-zinc-100">로컬 파일</h2>
      <div className="space-y-4">
        {Object.entries(groupedFiles).map(([folder, folderFiles]) => (
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
  );
} 