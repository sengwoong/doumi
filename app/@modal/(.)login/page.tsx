'use client';

import { useRouter } from 'next/navigation';
import LoginForm from '@/app/_components/LoginForm';

export default function LoginModal() {
  const router = useRouter();

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      onClick={() => router.back()}
    >
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 p-8 shadow-2xl transition-all border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent"></div>
            <button
              onClick={() => router.back()}
              className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <LoginForm />
            <p className="text-gray-400 mb-6">
              계정이 없으신가요?{' '}
              <button 
                onClick={() => router.push('/signup')}
                className="text-violet-400 hover:text-violet-300 underline"
              >
                회원가입
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}