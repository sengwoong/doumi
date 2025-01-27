'use client';

import { useState } from 'react';

interface Project {
  id: string;
  name: string;
  uploadDate: string;
  fileCount: number;
  status: 'pending' | 'completed';
}

export default function ProjectTable() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  // 임시 데이터 (나중에 실제 데이터로 교체)
  const projects: Project[] = [
    {
      id: '1',
      name: 'Spring Boot Project',
      uploadDate: '2024-03-20',
      fileCount: 15,
      status: 'pending'
    },
    {
      id: '2',
      name: 'React Project',
      uploadDate: '2024-03-19',
      fileCount: 23,
      status: 'completed'
    }
  ];

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId === selectedProject ? null : projectId);
  };

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
                ${selectedProject === project.id ? 'bg-violet-900/20' : ''}`}
            >
              <td className="p-4">
                <input
                  type="checkbox"
                  checked={selectedProject === project.id}
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
                  {project.status === 'completed' ? '완료' : '대기중'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 