"use server";

import {redirect} from "next/navigation";
import {signIn} from "@/app/auth";

export async function signup(prevState: { message: string | null }, formData: FormData) {
  if (!formData.get('username') || !(formData.get('username') as string)?.trim()) {
    return {message: 'no_username'};
  }
  if (!formData.get('email') || !(formData.get('email') as string)?.trim()) {
    return {message: 'no_email'};
  }
  if (!formData.get('password') || !(formData.get('password') as string)?.trim()) {
    return {message: 'no_password'};
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
      method: 'POST',
      body: JSON.stringify({
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role') || 'USER'
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 응답 내용 로깅
    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', responseText);
    console.log('Response formData.get(password):',formData.get('password'));

    
    if (response.status === 403) {
      return {message: 'user_exists'};
    } else if (!response.ok) {
      console.error('Error response:', responseText);
      return { message: `Server error: ${response.status}` };
    }
    

    // 먼저 로그인 API 직접 호출
    const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      console.error('Login failed:', loginData.error);
      return;
    }

    // 로그인 API 성공 후 signIn 호출 (비밀번호 제외)
    const result = await signIn("credentials", {
      user: JSON.stringify(loginData), 
      redirect: false,
      callbackUrl: '/'
    });

    if (result?.ok) {
      redirect('/');
    }
  } catch (error) {
    console.error('Signup error:', error);
    return { message: error.message };
  }
}