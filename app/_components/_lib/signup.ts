"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/app/auth";

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
    // 1. 회원가입 API 호출
    const signupResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
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

    if (!signupResponse.ok) {
      const error = await signupResponse.text();
      return { message: error };
    }

    // 2. 로그인 API 호출
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

    if (!loginResponse.ok) {
      return { message: '로그인에 실패했습니다.' };
    }

    // 3. NextAuth signIn 호출
    const result = await signIn("credentials", {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirect: false,
    });

    if (result?.error) {
      return { message: result.error };
    }

    return { message: 'success', redirect: '/home' };

  } catch (error) {
    console.error('Signup error:', error);
    return { message: error.message };
  }
}