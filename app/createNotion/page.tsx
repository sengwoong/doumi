'use client';

import { useState } from 'react';
import ProjectTable from "../components/ProjectTable";
import { useRouter } from 'next/navigation';

interface NotionSettings {
  title: string;
  template: string;
  options: {
    serviceAnalysis: boolean;
    apiDocs: boolean;
    conventionCheck: boolean;
  };
}

export default function CreateNotionPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [settings, setSettings] = useState<NotionSettings>({
    title: '',
    template: 'default',
    options: {
      serviceAnalysis: false,
      apiDocs: false,
      conventionCheck: false
    }
  });
  const router = useRouter();

  const handleSettingsChange = (
    field: keyof NotionSettings,
    value: string | boolean | Record<string, boolean>
  ) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (option: keyof NotionSettings['options']) => {
    setSettings(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [option]: !prev.options[option]
      }
    }));
  };

  const handleExport = async () => {
    if (!selectedProjectId || !settings.title) {
      alert('프로젝트와 노션 페이지 제목을 선택해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/notion/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: selectedProjectId,
          settings
        }),
      });

      if (!response.ok) throw new Error('Export failed');

      alert('노션 페이지가 생성되었습니다!');
    } catch (error) {
      console.error('Export error:', error);
      alert('노션 페이지 생성 중 오류가 발생했습니다.');
    }
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">노션 페이지 생성</h1>
          <button
            onClick={handleExport}
            disabled={!selectedProjectId || !settings.title}
            className={`px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 
              focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900
              ${!selectedProjectId || !settings.title
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-violet-600 hover:bg-violet-700 text-white'
              }`}
          >
            노션으로 내보내기
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 프로젝트 선택 */}
          <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-xl space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">프로젝트 선택</h2>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="프로젝트 검색..."
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white 
                    placeholder-gray-400 focus:outline-none focus:border-violet-500"
                />
                <select
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white 
                    focus:outline-none focus:border-violet-500"
                >
                  <option value="all">모든 상태</option>
                  <option value="pending">제작중</option>
                  <option value="completed">완료</option>
                </select>
              </div>
            </div>

            <ProjectTable 
              onSelect={setSelectedProjectId} 
              selected={selectedProjectId}
              onProjectClick={handleProjectClick}
            />
          </div>

          {/* 오른쪽: 노션 설정 */}
          <div className="bg-gray-800/50 p-6 rounded-xl space-y-6">
            <h2 className="text-lg font-semibold text-white">노션 설정</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  노션 페이지 제목
                </label>
                <input
                  type="text"
                  value={settings.title}
                  onChange={(e) => handleSettingsChange('title', e.target.value)}
                  placeholder="페이지 제목 입력..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white 
                    placeholder-gray-400 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  템플릿 선택
                </label>
                <select
                  value={settings.template}
                  onChange={(e) => handleSettingsChange('template', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white 
                    focus:outline-none focus:border-violet-500"
                >
                  <option value="default">기본 템플릿</option>
                  <option value="simple">심플 템플릿</option>
                  <option value="detailed">상세 템플릿</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  추가 옵션
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.options.serviceAnalysis}
                      onChange={() => handleOptionChange('serviceAnalysis')}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-violet-500 
                        focus:ring-violet-500 focus:ring-offset-gray-800"
                    />
                    <span className="text-gray-300">서비스 분석 포함</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.options.apiDocs}
                      onChange={() => handleOptionChange('apiDocs')}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-violet-500 
                        focus:ring-violet-500 focus:ring-offset-gray-800"
                    />
                    <span className="text-gray-300">api 문서화 포함</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.options.conventionCheck}
                      onChange={() => handleOptionChange('conventionCheck')}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-violet-500 
                        focus:ring-violet-500 focus:ring-offset-gray-800"
                    />
                    <span className="text-gray-300">컨벤션 체크 포함</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 