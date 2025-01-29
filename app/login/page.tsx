'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
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
      const result = await signIn('credentials', {
        username: credentials.username,
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
    <div className="min-h-screen flex bg-gradient-to-b from-gray-900 to-black">
      {/* Left decorative section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-violet-500/10 backdrop-blur-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-violet-900/20 to-transparent"></div>
        <div className="relative w-full h-full flex items-center justify-center p-12">
          <h1 className="text-5xl font-bold text-white/90 tracking-wider">Welcome Back</h1>
        </div>
      </div>
      
      {/* Right login section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">로그인</h2>
            <p className="text-gray-400">계정이 없으신가요? <Link href="/signup" className="text-violet-400 hover:text-violet-300">회원가입</Link></p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent rounded-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent rounded-xl"></div>
            <div className="relative bg-gray-800/50 p-8 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-700">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                    아이디
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white 
                      placeholder-gray-400 focus:outline-none focus:border-violet-500"
                    placeholder="아이디를 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    비밀번호
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white 
                      placeholder-gray-400 focus:outline-none focus:border-violet-500"
                    placeholder="비밀번호를 입력하세요"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`nav-button w-full ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? '로그인 중...' : '로그인'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Drone Kid */}
      <div className="fixed right-0 bottom-0 w-64 h-64 pointer-events-none">
        <img 
          src="/drone-kid.png" 
          alt="Drone Kid" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}