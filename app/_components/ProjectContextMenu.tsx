"use client"
import { useState, useRef, useEffect } from 'react';
import { useProjectStore } from '@/store/useProjectStore';

interface ContextMenuProps {
  projectId: string;
  projectTitle: string;
  x: number;
  y: number;
  onClose: () => void;
}

export default function ProjectContextMenu({ projectId, projectTitle, x, y, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { setNotionTitle, setProjectId } = useProjectStore();

  console.log(projectId);
  console.log(projectTitle);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleNotionExport = () => {
    setNotionTitle(projectTitle);
    setProjectId(projectId);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-zinc-800 rounded-md shadow-lg py-1 z-50"
      style={{ top: y, left: x }}
    >
      <button
        onClick={handleNotionExport}
        className="w-full px-4 py-2 text-left text-zinc-200 hover:bg-zinc-700 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        노션으로 내보내기
      </button>
    </div>
  );
} 