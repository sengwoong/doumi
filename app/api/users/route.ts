import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, email, role, password } = await req.json();
    console.log('all', username, email, role, password);
    if (!username || !email || !role || !password) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 기존 사용자 확인 (username과 email 모두 체크)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
        ]
      }
    });

    if (existingUser) {
      const field = existingUser.username === username ? '아이디' : '이메일';
      return NextResponse.json(
        { error: `이미 존재하는 ${field}입니다.` },
        { status: 403 }
      );
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 사용자 생성
    const user = await prisma.user.create({
      data: {
        username,
        email,
        role,
        password: hashedPassword,
      },
    });

    // 비밀번호 제외하고 응답
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(userWithoutPassword);
    
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}