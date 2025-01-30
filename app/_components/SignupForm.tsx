'use client';

import { useFormStatus, useFormState } from 'react-dom';
import Link from 'next/link';
import { signup } from '@/app/_components/_lib/signup';
import { useRouter } from 'next/navigation';

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

export default function SignupForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(signup, { message: null });
  const { pending } = useFormStatus();

  // state 변경을 감지하여 리다이렉트 처리
  if (state?.message === 'success') {
    router.push('/home');
    router.refresh();
  }

  const handleSubmit = async (formData: FormData) => {
    const result = await signup({ message: null }, formData);
    console.log('result:', result);
    if (result?.message === 'success') {
      router.push('/home');
      router.refresh();
    } else {
      console.error(result?.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-white">계정을 생성하세요</h2>
        <p className="text-gray-400">이미 계정이 있으신가요? <Link href="/login" className="text-violet-400 hover:text-violet-300">로그인</Link></p>
      </div>

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

          {state?.message && state.message !== 'success' && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
              {state.message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
} 