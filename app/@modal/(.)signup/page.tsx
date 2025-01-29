'use client';

import onSubmit from '@/app/_components/_lib/signup';
import BackButton from '@/app/_components/BackButton';
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="actionButton"
    >
      {pending ? '가입 중...' : '가입하기'}
    </button>
  );
}

function showMessage(message: string | null | undefined) {
  if (message === 'no_role') {
    return '역할을 선택하세요.';
  }
  if (message === 'no_username') {
    return '유저네임을 입력하세요.';
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

const initialState = {
  message: null,
  id: '',
  name: '',
  password: '',
  image: null as File | null,
};

export default function SignupModal() {
  const router = useRouter();
  const [state, formAction] = useFormState(onSubmit, initialState);

  return (
    <div 
      className="modalBackground"
      onClick={() => router.back()}
    >
      <div className="modal">
        <div className="modalHeader">
          <BackButton />
          <div>계정을 생성하세요.</div>
        </div>
        <form action={formAction}>
          <div className="modalBody">
            <div className="inputDiv">
              <label className="inputLabel" htmlFor="id">아이디</label>
              <input 
                id="id" 
                name="id" 
                className="input" 
                type="text" 
                placeholder=""
                required 
                defaultValue={state.id as string}
              />
            </div>
            <div className="inputDiv">
              <label className="inputLabel" htmlFor="name">닉네임</label>
              <input 
                id="name" 
                name="name" 
                className="input" 
                type="text" 
                placeholder=""
                required 
                defaultValue={state.name as string}
              />
            </div>
            <div className="inputDiv">
              <label className="inputLabel" htmlFor="password">비밀번호</label>
              <input 
                id="password" 
                name="password" 
                className="input" 
                type="password" 
                placeholder=""
                required 
                defaultValue={state.password as string}
              />
            </div>
            <div className="inputDiv">
              <label className="inputLabel" htmlFor="image">프로필</label>
              <input 
                id="image" 
                name="image"
                required 
                className="input" 
                type="file" 
                accept="image/*"
              />
            </div>
          </div>
          <div className="modalFooter">
            <SubmitButton />
            <div className="error">{showMessage(state?.message)}</div>
          </div>
        </form>
      </div>
    </div>
  );
} 