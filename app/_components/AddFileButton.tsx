"use client"
import { useModalStore } from '@/store/useModalStore';

export default function AddFileButton() {
  const { openModal } = useModalStore();

  return (
    <button
      onClick={openModal}
      className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
} 