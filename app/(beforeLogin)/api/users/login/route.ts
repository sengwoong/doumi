import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 필수 필드 검증
    if (!email || !password) {
      return NextResponse.json(
        { error: '아이디와 비밀번호를 모두 입력해주세요.' },
        { status: 400 }
      );
    }
    console.log('email', email);
    console.log('password', password);
    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('Stored hashed password:', user?.password);
    console.log('Input password:', password);
    
    // 사용자가 존재하지 않는 경우
    if (!user) {
      return NextResponse.json(
        { error: '존재하지 않는 사용자입니다.' },
        { status: 404 }
      );
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare( password,user.password);
    console.log('isPasswordValid', isPasswordValid);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // 비밀번호를 제외한 사용자 정보 반환
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(userWithoutPassword);
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '로그인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 