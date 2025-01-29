'use client';

import { useFormStatus, useFormState } from 'react-dom';
import Link from 'next/link';
import { signup } from '@/app/_components/_lib/signup';
import SignupForm from '@/app/_components/SignupForm';

export default function SignupPage() {
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
        <div className="w-full max-w-md">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent rounded-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent rounded-xl"></div>
            <div className="relative bg-gray-800/50 p-8 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-700">
              <SignupForm />
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