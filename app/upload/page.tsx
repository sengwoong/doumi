'use client';

import React, { useState, useCallback } from 'react';

interface FileItem {
  name: string;
  path: string;
  file: File;
  selected: boolean;
}

interface FolderStructure {
  name: string;
  path: string;
  files: FileItem[];
  folders: FolderStructure[];
  selected: boolean;
}

export default function Home() {
  const [projectName, setProjectName] = useState('');
  const [structure, setStructure] = useState<FolderStructure | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);
    const structure: FolderStructure = {
      name: 'root',
      path: '/',
      files: [],
      folders: [],
      selected: true,
    };

    files.forEach((file) => {
      const pathParts = file.webkitRelativePath.split('/');
      let currentLevel = structure;

      for (let i = 1; i < pathParts.length - 1; i++) {
        const folderName = pathParts[i];
        let folder = currentLevel.folders.find((f) => f.name === folderName);

        if (!folder) {
          folder = {
            name: folderName,
            path: pathParts.slice(0, i + 1).join('/'),
            files: [],
            folders: [],
            selected: true,
          };
          currentLevel.folders.push(folder);
        }
        currentLevel = folder;
      }

      // 파일 객체가 올바른지 확인 후 저장
      if (file instanceof File) {
        currentLevel.files.push({
          name: file.name,
          path: file.webkitRelativePath,
          file: file,
          selected: true,
        });
      } else {
        console.error('Invalid file object:', file);
      }
    });

    setStructure(structure);
  }, []);

  const toggleFolder = useCallback((path: string) => {
    setStructure((prev) => {
      if (!prev) return prev;

      const newStructure = JSON.parse(JSON.stringify(prev));

      const toggleNode = (node: FolderStructure): boolean => {
        if (node.path === path) {
          node.selected = !node.selected;

          const updateChildren = (folder: FolderStructure) => {
            folder.selected = node.selected;
            folder.files.forEach((file) => (file.selected = node.selected));
            folder.folders.forEach(updateChildren);
          };

          node.files.forEach((file) => (file.selected = node.selected));
          node.folders.forEach(updateChildren);
          return true;
        }

        for (const folder of node.folders) {
          if (toggleNode(folder)) return true;
        }
        return false;
      };

      toggleNode(newStructure);
      return newStructure;
    });
  }, []);

  const renderStructure = (node: FolderStructure, level = 0) => {
    return (
      <div key={node.path} style={{ marginLeft: `${level * 20}px` }}>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={node.selected}
            onChange={() => toggleFolder(node.path)}
            className="form-checkbox h-4 w-4 text-violet-600"
          />
          <span>📁 {node.name}</span>
        </div>
        {node.files.map((file) => (
          <div key={file.path} className="flex items-center gap-2" style={{ marginLeft: '20px' }}>
            <input
              type="checkbox"
              checked={file.selected}
              onChange={() => {
                file.selected = !file.selected;
                setStructure((prev) => ({ ...prev! }));
              }}
              className="form-checkbox h-4 w-4 text-violet-600"
            />
            <span>📄 {file.name}</span>
          </div>
        ))}
        {node.folders.map((folder) => renderStructure(folder, level + 1))}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!structure || !projectName.trim()) {
      alert('프로젝트 이름을 입력해주세요.');
      return;
    }
    
    setIsUploading(true);
    setUploadSuccess(false);
    
    const formData = new FormData();
    formData.append('projectName', projectName);
    
    const addSelectedFiles = (node: FolderStructure) => {
      node.files.forEach(file => {
        if (file.selected) {
          formData.append('files', file.file);
          const relativePath = file.path.split('/').slice(1).join('/');
          formData.append('paths', relativePath);
        }
      });
      node.folders.forEach(folder => addSelectedFiles(folder));
    };
    
    addSelectedFiles(structure);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      setUploadSuccess(true);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                프로젝트 이름
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="프로젝트 이름을 입력하세요"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white 
                  placeholder-gray-400 focus:outline-none focus:border-violet-500"
                required
              />
            </div>

            <input
              type="file"
              name="files"
              webkitdirectory=""
              multiple
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
            />
            
            {structure && (
              <>
                <div className="mt-4 bg-gray-900 p-4 rounded-lg max-h-96 overflow-auto">
                  <div className="text-gray-200">{renderStructure(structure)}</div>
                </div>

                <button
                  type="submit"
                  disabled={isUploading || !structure || !projectName.trim()}
                  className={`w-full px-4 py-2 rounded ${
                    isUploading || !projectName.trim()
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-violet-600 hover:bg-violet-700'
                  } text-white transition-colors`}
                >
                  {isUploading ? '업로드 중...' : '업로드'}
                </button>

                {uploadSuccess && (
                  <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
                    업로드 성공!
                  </div>
                )}
              </>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
