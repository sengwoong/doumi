'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. 먼저 로그인 API 호출
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '로그인에 실패했습니다.');
        return;
      }

      // 2. 로그인 API가 성공하면 NextAuth signIn 호출
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-white">환영합니다!</h2>
        <p className="text-gray-400">계정에 로그인하고 프로젝트를 관리하세요</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">이메일</label>
          <div className="relative">
            <input
              type="email"
              placeholder="name@company.com"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">비밀번호</label>
          <div className="relative">
            <input
              type="password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              required
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
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              router.push('/forgot-password');
            }}
            className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
          >
            비밀번호 찾기
          </button>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            계정이 없으신가요?{' '}
            <button
       
              onClick={(e) => {
                e.preventDefault();
                router.push('/signup');
              }}
              className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
            >
              회원가입
            </button>
          </p>
        </div>
      </form>
    </div>
  );
} 