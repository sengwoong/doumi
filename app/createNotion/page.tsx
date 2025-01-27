'use client';

import ProjectTable from "../components/ProjectTable";


export default function CreateNotionPage() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">노션 페이지 생성</h1>
          <button
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 
              transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 
              focus:ring-offset-gray-900"
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

            <ProjectTable />
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
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-violet-500 
                        focus:ring-violet-500 focus:ring-offset-gray-800"
                    />
                    <span className="text-gray-300">서비스 분석 포함</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-violet-500 
                        focus:ring-violet-500 focus:ring-offset-gray-800"
                    />
                    <span className="text-gray-300">api 문서화 포함</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
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