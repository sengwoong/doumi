'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="nav-button">로딩중...</div>
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-white">
          {session.user.username || session.user.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="nav-button"
        >
          로그아웃
        </button>
      </div>
    )
  }

  return (
    <Link 
      href="/login" 
      className="nav-button"
      prefetch={true}
    >
      로그인
    </Link>
  )
} 