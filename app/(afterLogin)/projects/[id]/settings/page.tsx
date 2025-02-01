"use client"
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface ProjectSettings {
  name: string;
  description: string;
  visibility: 'public' | 'private';
}

export default function SettingsPage() {
  const params = useParams();
  const projectId = params.id;
  const [settings, setSettings] = useState<ProjectSettings>({
    name: '',
    description: '',
    visibility: 'private'
  });
  const [isLoading, setIsLoading] = useState(false);

  // 프로젝트 설정 데이터를 불러오는 함수 추가
  const fetchProjectSettings = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/settings`);
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  // 컴포넌트가 마운트될 때 데이터 불러오기
  useEffect(() => {
    fetchProjectSettings();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/projects/${projectId}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to update settings');
      alert('설정이 성공적으로 저장되었습니다.'); // 성공 메시지 추가
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('설정 저장에 실패했습니다.'); // 에러 메시지 추가
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-zinc-900 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-zinc-100 mb-6">프로젝트 설정</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 프로젝트 이름 */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              프로젝트 이름
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="프로젝트 이름을 입력하세요"
            />
          </div>

          {/* 프로젝트 설명 */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              프로젝트 설명
            </label>
            <textarea
              value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              placeholder="프로젝트에 대한 설명을 입력하세요"
            />
          </div>

          {/* 공개 설정 */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              공개 설정
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  value="public"
                  checked={settings.visibility === 'public'}
                  onChange={(e) => setSettings({ ...settings, visibility: 'public' as const })}
                  className="form-radio text-blue-500"
                />
                <span className="text-zinc-300">공개</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  value="private"
                  checked={settings.visibility === 'private'}
                  onChange={(e) => setSettings({ ...settings, visibility: 'private' as const })}
                  className="form-radio text-blue-500"
                />
                <span className="text-zinc-300">비공개</span>
              </label>
            </div>
          </div>

          {/* 위험 구역 */}
          <div className="pt-6 border-t border-zinc-700">
            <h2 className="text-lg font-medium text-red-500 mb-4">위험 구역</h2>
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => {
                // 프로젝트 삭제 로직
                if (window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
                  // 삭제 API 호출
                }
              }}
            >
              프로젝트 삭제
            </button>
          </div>

          {/* 저장 버튼 */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? '저장 중...' : '변경사항 저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 