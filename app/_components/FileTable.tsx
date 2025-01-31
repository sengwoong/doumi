"use client"
import { useState, useEffect, useMemo, memo } from 'react';

interface FileTableProps {
  projectId: string;
}

interface Method {
  id: string;
  methodName: string;
  httpMethod?: string;
  // 필요한 다른 메소드 속성들을 추가할 수 있습니다
}

interface File {
  id: string;
  name: string;
  type: string;
  methods: Method[];
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// 테이블 헤더 컴포넌트
const TableHeader = memo(() => (
  <thead className="sticky top-0 bg-zinc-700/50 w-full block">
    <tr className="table w-full table-fixed">
      <th className="px-6 py-2 text-left text-zinc-200 w-[60%]">이름</th>
      <th className="px-6 py-2 text-left text-zinc-200 w-[20%]">타입</th>
      <th className="px-6 py-2 text-left text-zinc-200 w-[20%]">메소드</th>
    </tr>
  </thead>
));

// 파일 행 컴포넌트
const FileRow = memo(({ file }: { file: File }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left,
      y: rect.top - 10
    });
    setShowTooltip(true);
    console.log('File Methods:', file.methods);
  };

  return (
    <>
      <tr className="table w-full table-fixed hover:bg-zinc-700/30">
        <td className="px-6 py-2 text-zinc-200 w-[60%] truncate">{file.name}</td>
        <td className="px-6 py-2 text-zinc-300 w-[20%]">{file.type}</td>
        <td className="px-6 py-2 text-zinc-300 w-[20%]">
          <span 
            className="cursor-help"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {Array.isArray(file.methods) ? file.methods.length : 0}
          </span>
        </td>
      </tr>

      {/* 툴팁 */}
      {showTooltip && Array.isArray(file.methods) && file.methods.length > 0 && (
        <div 
          className="fixed z-50 bg-zinc-900 text-zinc-200 p-3 rounded-md shadow-lg min-w-[200px] max-w-[300px]"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="text-sm space-y-1">
            {file.methods.map((method) => (
              <div key={method.id} className="truncate">
                {method.methodName}
                {method.httpMethod && (
                  <span className="ml-2 text-xs text-zinc-400">
                    {method.httpMethod}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-4 transform translate-y-full">
            <div className="w-3 h-3 bg-zinc-900 rotate-45" />
          </div>
        </div>
      )}
    </>
  );
});

// 타입 필터 버튼 컴포넌트
const TypeFilterButton = memo(({ 
  type, 
  currentType, 
  onClick 
}: { 
  type: string;
  currentType: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded ${
      currentType === type
        ? 'bg-blue-500 text-white'
        : 'bg-zinc-700 text-zinc-200 hover:bg-zinc-600'
    }`}
  >
    {type.charAt(0).toUpperCase() + type.slice(1)}
  </button>
));

export default function FileTable({ projectId }: FileTableProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [currentType, setCurrentType] = useState('controller');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/projects/${projectId}/dbfolders?page=${currentPage}&limit=10&type=${currentType}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch files');
        const data = await response.json();
        console.log('Fetched Files:', data.files);
        setFiles(data.files || []);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Error fetching files:', error);
        setFiles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [projectId, currentPage, currentType]);

  const fileTypes = useMemo(() => ['controller', 'service', 'exception'], []);

  const typeButtons = useMemo(() => (
    <div className="flex space-x-2 mb-4">
      {fileTypes.map((type) => (
        <TypeFilterButton
          key={type}
          type={type}
          currentType={currentType}
          onClick={() => {
            setCurrentType(type);
            setCurrentPage(1);
          }}
        />
      ))}
    </div>
  ), [currentType, fileTypes]);

  const tableContent = useMemo(() => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={3} className="h-[200px]">
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-zinc-700 rounded"></div>
                    <div className="h-4 bg-zinc-700 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      );
    }

    if (files.length === 0) {
      return (
        <tr>
          <td colSpan={3} className="text-center p-4 text-zinc-200">
            파일이 없습니다.
          </td>
        </tr>
      );
    }

    return files.map((file) => (
      <FileRow key={file.id} file={file} />
    ));
  }, [isLoading, files]);

  return (
    <div className="space-y-4">
      {typeButtons}

      <div className="bg-zinc-800 rounded-lg overflow-hidden">
        <div className="bg-zinc-700 px-6 py-2">
          <h3 className="font-medium text-zinc-100">
            {currentType.charAt(0).toUpperCase() + currentType.slice(1)}
            <span className="ml-2 text-sm text-zinc-400">
              ({pagination.totalItems}개 파일)
            </span>
          </h3>
        </div>
        
        <div className="overflow-hidden">
          <table className="w-full">
            <TableHeader />
            <tbody className="block h-[400px] overflow-y-auto w-full">
              {tableContent}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center gap-2 mt-4 mb-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || isLoading}
            className="px-3 py-1 rounded bg-zinc-700 text-zinc-200 disabled:opacity-50"
          >
            이전
          </button>
          <span className="px-3 py-1 text-zinc-200">
            {currentPage} / {pagination.totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={currentPage === pagination.totalPages || isLoading}
            className="px-3 py-1 rounded bg-zinc-700 text-zinc-200 disabled:opacity-50"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
} 