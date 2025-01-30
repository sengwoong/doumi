'use client';


import React from 'react';
import Link from 'next/link';

function Page() {
  return (
    <div className="bg-black text-white">


      <main className="flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-6xl flex flex-col items-center">
          <div className="w-full h-48 bg-gray-800 rounded-lg mb-8"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-8">
            <div className="h-48 bg-gray-800 rounded-lg"></div>
            <div className="h-48 bg-gray-800 rounded-lg"></div>
            <div className="h-48 bg-gray-800 rounded-lg"></div>
            <div className="h-48 bg-gray-800 rounded-lg"></div>
          </div>

          <div className="w-full text-center mb-6">
            <h2 className="text-xl font-semibold">프로젝트와 노션을 비교해보아요</h2>
            <p className="text-gray-400 mt-2">
              맞추기 기능은 컨벤션 등을 맞추어 노션에 넣거나 프로젝트를 비교하여 컨벤션을 맞지 않은 부분도 활용할 수 있습니다.
            </p>
          </div>

          <div className="w-full h-32 bg-gray-800 rounded-lg"></div>
        </div>
      </main>

      <footer className="w-full py-6 bg-gray-900 text-center text-sm text-gray-400">
        사이드 프로젝트 사용한 만큼 요금이 측정되어요!
      </footer>
    </div>
  );
}

export default Page;