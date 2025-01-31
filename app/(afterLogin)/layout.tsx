import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import AuthSession from "@/app/_components/AuthSession";
import AuthButton from "../_components/AuthButton";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (

        <div className="flex flex-col min-h-screen">
          <header className="w-full flex items-center justify-between py-6 px-8 bg-gray-900 shadow-md">
            <div className='flex items-center gap-8'>
              <h1 className="text-2xl font-bold text-white whitespace-nowrap">프로젝트 관리 플랫폼</h1>
              <nav className="flex gap-2">
                <Link href="/" className="nav-button">홈</Link>
                <Link href="/upload" className="nav-button">프로젝트</Link>
                <Link href="/createNotion" className="nav-button">노션</Link>
                <Link href="/settings" className="nav-button">설정</Link>
              </nav>
            </div>
            <AuthButton />
          </header>

          <main className="flex-grow">
            {children}
          </main>

          {modal}
        </div>

  );
}
