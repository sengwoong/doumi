"use client"
import { useParams } from 'next/navigation';
import { useModalStore } from '@/store/useModalStore';

function FileUploadModal() {
  const params = useParams();
  const projectId = params.id;
  const { isOpen, closeModal } = useModalStore();

  const handleFileDrop = async (file, type) => {
    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: file.name,
          path: file.fullPath,
          folderId: projectId,
          type: type
        }),
      });

      if (!response.ok) throw new Error('Failed to save file');
      window.location.href = `/projects/${projectId}`;
    } catch (error) {
      console.error('파일 저장 실패:', error);
    }
  };

  const DropZone = ({ title, onDrop }) => {
    const handleDrop = async (e) => {
      e.preventDefault();
      try {
        const item = JSON.parse(e.dataTransfer.getData('text/plain'));
        await onDrop(item, title.toLowerCase());
      } catch (error) {
        console.error(`${title} 드롭 처리 실패:`, error);
      }
    };

    return (
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-zinc-700 rounded-lg p-4 bg-zinc-800/50 hover:bg-zinc-700/50 hover:border-zinc-500 transition-all"
      >
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-zinc-200">{title}</h3>
        </div>
        <div className="text-center text-zinc-400 text-sm">
          <p>여기에 {title} 파일을</p>
          <p>드래그하여 추가</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-[500px] transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="h-full bg-zinc-900 p-10 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-zinc-100">파일 분류</h2>
          <button
            onClick={closeModal}
            className="text-zinc-400 hover:text-zinc-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-6">
          <DropZone 
            title="Controller" 
            onDrop={(file) => handleFileDrop(file, 'controller')} 
          />
          <DropZone 
            title="Service" 
            onDrop={(file) => handleFileDrop(file, 'service')} 
          />
          <DropZone 
            title="Exception" 
            onDrop={(file) => handleFileDrop(file, 'exception')} 
          />
        </div>
      </div>
    </div>
  );
}

export default FileUploadModal;