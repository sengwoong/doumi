'use client';

import { useFormStatus, useFormState } from 'react-dom';
import Link from 'next/link';
import { signup } from '@/app/_components/_lib/signup';

function showMessage(message: string | null | undefined) {
  if (message === 'no_username') {
    return '아이디를 입력하세요.';
  }
  if (message === 'no_email') {
    return '이메일을 입력하세요.';
  }
  if (message === 'no_password') {
    return '비밀번호를 입력하세요.';
  }
  if (message === 'user_exists') {
    return '이미 사용 중인 아이디입니다.';
  }
  return message;
}


export default function SignupModal() {
  const [state, formAction] = useFormState(signup, { message: null });
  const { pending } = useFormStatus();

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-gray-900 to-black">
      {/* Left decorative section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-violet-500/10 backdrop-blur-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-violet-900/20 to-transparent"></div>
        <div className="relative w-full h-full flex items-center justify-center p-12">
          <h1 className="text-5xl font-bold text-white/90 tracking-wider">Create Account</h1>
        </div>
      </div>
      
      {/* Right signup section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">계정을 생성하세요</h2>
            <p className="text-gray-400">이미 계정이 있으신가요? <Link href="/login" className="text-violet-400 hover:text-violet-300">로그인</Link></p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent rounded-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent rounded-xl"></div>
            <div className="relative bg-gray-800/50 p-8 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-700">
              <form action={formAction}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="username">
                      아이디
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white 
                        placeholder-gray-400 focus:outline-none focus:border-violet-500"
                      placeholder="아이디를 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
                      이메일
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white 
                        placeholder-gray-400 focus:outline-none focus:border-violet-500"
                      placeholder="이메일을 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">
                      비밀번호
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white 
                        placeholder-gray-400 focus:outline-none focus:border-violet-500"
                      placeholder="비밀번호를 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="role">
                      역할
                    </label>
                    <select
                      id="role"
                      name="role"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white 
                        focus:outline-none focus:border-violet-500"
                      defaultValue="USER"
                    >
                      <option value="USER">일반 사용자</option>
                      <option value="ADMIN">관리자</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={pending}
                    className={`w-full px-4 py-2 bg-violet-500 text-white rounded-lg font-medium
                      hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                      transition-colors ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {pending ? '가입 중...' : '가입하기'}
                  </button>

                  {state?.message && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
                      {showMessage(state.message)}
                    </div>
                  )}
                </div>
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