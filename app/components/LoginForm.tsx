'use client';

export default function LoginForm() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-white">환영합니다!</h2>
        <p className="text-gray-400">계정에 로그인하고 프로젝트를 관리하세요</p>
      </div>
      
      <form className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">이메일</label>
          <div className="relative">
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">비밀번호</label>
          <div className="relative">
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 rounded-lg border-gray-600 bg-gray-700/50 text-violet-500 focus:ring-violet-500 focus:ring-offset-gray-800"
            />
            <label className="ml-2 text-sm text-gray-300">로그인 상태 유지</label>
          </div>
          <a href="#" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">비밀번호 찾기</a>
        </div>
        
        <button
          type="submit"
          className="w-full px-4 py-3 text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all transform hover:scale-[1.02]"
        >
          로그인
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            계정이 없으신가요?{' '}
            <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">회원가입</a>
          </p>
        </div>
      </form>
    </div>
  );
} 