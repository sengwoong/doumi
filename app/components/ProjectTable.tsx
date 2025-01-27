'use client';

import { useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  uploadDate: string;
  fileCount: number;
  status: 'pending' | 'completed';
}

interface ProjectTableProps {
  onSelect: (projectId: string | null) => void;
  selected: string | null;
}

export default function ProjectTable({ onSelect, selected }: ProjectTableProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectSelect = (projectId: string) => {
    onSelect(projectId === selected ? null : projectId);
  };

  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto bg-gray-800 rounded-lg shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4 w-16">선택</th>
              <th className="p-4">프로젝트명</th>
              <th className="p-4">업로드 날짜</th>
              <th className="p-4">파일 수</th>
              <th className="p-4">상태</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, i) => (
              <tr key={i} className="border-t border-gray-700">
                <td className="p-4">
                  <div className="w-4 h-4 bg-gray-600 rounded animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="h-6 bg-gray-600 rounded w-32 animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="h-6 bg-gray-600 rounded w-24 animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="h-6 bg-gray-600 rounded w-16 animate-pulse" />
                </td>
                <td className="p-4">
                  <div className="h-6 bg-gray-600 rounded w-20 animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-gray-800 rounded-lg shadow-xl">
      <table className="w-full text-left">
        <thead className="bg-gray-700">
          <tr>
            <th className="p-4 w-16">선택</th>
            <th className="p-4">프로젝트명</th>
            <th className="p-4">업로드 날짜</th>
            <th className="p-4">파일 수</th>
            <th className="p-4">상태</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr 
              key={project.id}
              className={`border-t border-gray-700 hover:bg-gray-700/50 transition-colors
                ${selected === project.id ? 'bg-violet-900/20' : ''}`}
            >
              <td className="p-4">
                <input
                  type="checkbox"
                  checked={selected === project.id}
                  onChange={() => handleProjectSelect(project.id)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700/50 text-violet-500 
                    focus:ring-violet-500 focus:ring-offset-gray-800"
                />
              </td>
              <td className="p-4 font-medium text-white">{project.name}</td>
              <td className="p-4 text-gray-300">{project.uploadDate}</td>
              <td className="p-4 text-gray-300">{project.fileCount} 파일</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${project.status === 'completed' 
                    ? 'bg-green-900/20 text-green-400' 
                    : 'bg-yellow-900/20 text-yellow-400'
                  }`}
                >
                  {project.status === 'completed' ? '완료' : '제작중'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 