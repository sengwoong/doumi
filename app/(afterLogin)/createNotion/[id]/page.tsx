'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/app/_components/LoadingSpinner';

interface ServiceData {
  name: string;
  purpose: string;
  returnValue: string;
  flowChart: string;  // 서비스 흐름도
}

interface ControllerData {
  name: string;
  purpose: string;
  returnValue: string;
  validation: string;  // 유효성 검사 항목  
}

interface ErrorData {
  name: string;          // 에러 이름
  purpose: string;       // 사용 목적
  message: string;       // 발생하는 메시지
}

interface VariableData {
  name: string;          // 변수/DTO명
  location: string;      // 사용한 위치
  purpose: string;       // 사용 목적
  properties: string;    // 포함된 속성들과 설명
}

export default function NotionDetailPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serviceData, setServiceData] = useState<ServiceData[]>([
    { 
      name: 'createPost', 
      purpose: '새로운 게시글을 생성하고 저장',
      returnValue: 'Post',
      flowChart: '1. postId 유효성 검사\n2. 사용자 권한 확인\n3. 게시글 저장\n4. 결과 반환'
    }
  ]);
  const [controllerData, setControllerData] = useState<ControllerData[]>([
    { 
      name: 'createPost', 
      purpose: '포스트 생성을 위한 컨트롤러',
      returnValue: 'ResponseEntity<Post>',
      validation: '- title: 최소 2자\n- content: 최소 10자\n- category: Not Null'
    },
    { 
      name: 'updatePost', 
      purpose: '포스트 수정을 위한 컨트롤러',
      returnValue: 'ResponseEntity<Post>',
      validation: '- postId: Not Null\n- title: 최소 2자\n- content: 최소 10자'
    },
    { 
      name: 'deletePost', 
      purpose: '포스트 삭제를 위한 컨트롤러',
      returnValue: 'ResponseEntity<Void>',
      validation: '- postId: Not Null\n- userId: 작성자 확인'
    }
  ]);
  const [errorData, setErrorData] = useState<ErrorData[]>([
    { 
      name: 'PostNotFoundException', 
      purpose: '게시글을 찾을 수 없을 때 발생',
      message: '요청하신 게시글을 찾을 수 없습니다. (ID: ${postId})'
    }
  ]);
  const [variableData, setVariableData] = useState<VariableData[]>([
    { 
      name: 'PostContentReq', 
      location: 'PostController, PostService',
      purpose: '포스트의 컨텐트만 수정 및 제어하기 위해 만들어진 DTO',
      properties: '- postId: 포스트의 아이디\n- postContent: 포스트의 컨텐트'
    },
    { 
      name: 'PostCreateReq', 
      location: 'PostController',
      purpose: '새로운 포스트 생성 시 필요한 데이터를 전달하기 위한 DTO',
      properties: '- title: 포스트 제목\n- content: 포스트 내용\n- category: 카테고리'
    },
    { 
      name: 'PostListRes', 
      location: 'PostService',
      purpose: '포스트 목록 조회 결과를 반환하기 위한 DTO',
      properties: '- posts: Post[]\n- totalCount: 전체 포스트 수\n- currentPage: 현재 페이지'
    }
  ]);

  const handleSave = () => {
    // 저장 로직
    alert('저장되었습니다!');
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true); // 로딩 시작

      // 노션에 보낼 데이터 구조화
      const notionData = {
        services: serviceData.map(service => ({
          name: service.name,
          purpose: service.purpose,
          returnValue: service.returnValue,
          flowChart: service.flowChart,
        })),
        controllers: controllerData.map(controller => ({
          name: controller.name,
          purpose: controller.purpose,
          returnValue: controller.returnValue,
          validation: controller.validation,
        })),
        errors: errorData.map(error => ({
          name: error.name,
          purpose: error.purpose,
          message: error.message
        })),
        variables: variableData.map(variable => ({
          name: variable.name,
          location: variable.location,
          purpose: variable.purpose,
          properties: variable.properties
        }))
      };

      const response = await fetch('/api/notion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notionData)
      });

      if (!response.ok) {
        throw new Error('노션 페이지 생성에 실패했습니다.');
      }

      const result = await response.json();
      alert('노션 페이지가 생성되었습니다!');
      window.open(result.url, '_blank');
    } catch (error) {
      console.error('노션 전송 중 오류 발생:', error);
      alert('노션 페이지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">노션 분석 결과</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 min-w-[100px]"
            >
              저장하기
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-4 py-2 bg-gray-700 text-white rounded-lg 
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'} 
                flex items-center justify-center min-w-[140px]`}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="-ml-1 mr-3" />
                  <span>노션으로 보내는 중...</span>
                </>
              ) : (
                <span>노션으로 보내기</span>
              )}
            </button>
          </div>
        </div>

        {/* 로딩 오버레이 */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg flex items-center space-x-4">
              <LoadingSpinner size="lg" />
              <span className="text-white text-lg">노션 페이지 생성 중...</span>
            </div>
          </div>
        )}

        {/* 서비스 테이블 */}
        <div className="bg-gray-800/50 p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4">서비스 분석</h2>
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-4 text-left text-white">메소드명</th>
                <th className="p-4 text-left text-white">사용 목적</th>
                <th className="p-4 text-left text-white">반환값</th>
                <th className="p-4 text-left text-white">서비스 흐름도</th>
                <th className="p-4 text-left text-white">작업</th>
              </tr>
            </thead>
            <tbody>
              {serviceData.map((item, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="p-4">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const newData = [...serviceData];
                        newData[index].name = e.target.value;
                        setServiceData(newData);
                      }}
                      className="bg-gray-700 px-2 py-1 rounded text-white w-full"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={item.purpose}
                      onChange={(e) => {
                        const newData = [...serviceData];
                        newData[index].purpose = e.target.value;
                        setServiceData(newData);
                      }}
                      className="bg-gray-700 px-2 py-1 rounded text-white w-full"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={item.returnValue}
                      onChange={(e) => {
                        const newData = [...serviceData];
                        newData[index].returnValue = e.target.value;
                        setServiceData(newData);
                      }}
                      className="bg-gray-700 px-2 py-1 rounded text-white w-full"
                    />
                  </td>
                  <td className="p-4">
                    <textarea
                      value={item.flowChart}
                      onChange={(e) => {
                        const newData = [...serviceData];
                        newData[index].flowChart = e.target.value;
                        setServiceData(newData);
                      }}
                      className="bg-gray-700 px-2 py-1 rounded text-white w-full resize-y min-h-[2.5rem]"
                    />
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => {
                        const newData = serviceData.filter((_, i) => i !== index);
                        setServiceData(newData);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setServiceData([...serviceData, { 
              name: '', 
              purpose: '', 
              returnValue: '',
              flowChart: ''
            }])}
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            항목 추가
          </button>
        </div>

        {/* 컨트롤러 테이블 */}
        <div className="bg-gray-800/50 p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4">컨트롤러 분석</h2>
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-4 text-left text-white">메소드명</th>
                <th className="p-4 text-left text-white">사용 목적</th>
                <th className="p-4 text-left text-white">반환값</th>
                <th className="p-4 text-left text-white">유효성 검사</th>
                <th className="p-4 text-left text-white">작업</th>
              </tr>
            </thead>
            <tbody>
              {controllerData.map((item, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="p-4">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const newData = [...controllerData];
                        newData[index].name = e.target.value;
                        setControllerData(newData);
                      }}
                      className="bg-gray-700 px-2 py-1 rounded text-white w-full"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={item.purpose}
                      onChange={(e) => {
                        const newData = [...controllerData];
                        newData[index].purpose = e.target.value;
                        setControllerData(newData);
                      }}
                      className="bg-gray-700 px-2 py-1 rounded text-white w-full"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={item.returnValue}
                      onChange={(e) => {
                        const newData = [...controllerData];
                        newData[index].returnValue = e.target.value;
                        setControllerData(newData);
                      }}
                      className="bg-gray-700 px-2 py-1 rounded text-white w-full"
                    />
                  </td>
                  <td className="p-4">
                    <textarea
                      value={item.validation}
                      onChange={(e) => {
                        const newData = [...controllerData];
                        newData[index].validation = e.target.value;
                        setControllerData(newData);
                      }}
                      className="bg-gray-700 px-2 py-1 rounded text-white w-full resize-y min-h-[2.5rem]"
                    />
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => {
                        const newData = controllerData.filter((_, i) => i !== index);
                        setControllerData(newData);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setControllerData([...controllerData, { 
              name: '', 
              purpose: '', 
              returnValue: '',
              validation: ''
            }])}
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            항목 추가
          </button>
        </div>

        {/* 에러 테이블 */}
        <div className="bg-gray-800/50 p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4">에러 분석</h2>
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-4 text-left text-white">에러명</th>
                <th className="p-4 text-left text-white">사용 목적</th>
                <th className="p-4 text-left text-white">발생 메시지</th>
                <th className="p-4 text-left text-white">작업</th>
              </tr>
            </thead>
            <tbody>
              {errorData.map((item, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="p-4">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const newData = [...errorData];
                        newData[index].name = e.target.value;
                        setErrorData(newData);
                      }}
                      className="bg-gray-700 px-2 py-1 rounded text-white w-full"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={item.purpose}
                      onChange={(e) => {
                        const newData = [...errorData];
                        newData[index].purpose = e.target.value;
                        setErrorData(newData);
                      }}
                      className="bg-gray-700 px-2 py-1 rounded text-white w-full"
                    />
                  </td>
                  <td className="p-4">
                    <textarea
                      value={item.message}
                      onChange={(e) => {
                        const newData = [...errorData];
                        newData[index].message = e.target.value;
                        setErrorData(newData);
                      }}
                      className="bg-gray-700 px-2 py-1 rounded text-white w-full resize-y min-h-[2.5rem]"
                    />
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => {
                        const newData = errorData.filter((_, i) => i !== index);
                        setErrorData(newData);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setErrorData([...errorData, { 
              name: '', 
              purpose: '', 
              message: ''
            }])}
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            항목 추가
          </button>
        </div>

        {/* 변수명 분석 테이블 */}
        <div className="bg-gray-800/50 p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4">변수명 분석</h2>
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-4 text-left text-white">변수/DTO명</th>
                <th className="p-4 text-left text-white">사용한 위치</th>
                <th className="p-4 text-left text-white">사용 목적</th>
                <th className="p-4 text-left text-white">포함된 속성</th>
                <th className="p-4 text-left text-white">작업</th>
              </tr>
            </thead>
            <tbody>
              {variableData.map((item, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="p-4">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const newData = [...variableData];
                        newData[index].name = e.target.value;
                        setVariableData(newData);
                      }}
                      className="bg-gray-700 px-2 py-1 rounded text-white w-full"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={item.location}
                      onChange={(e) => {
                        const newData = [...variableData];
                        newData[index].location = e.target.value;
                        setVariableData(newData);
                      }}
                      className="bg-gray-700 px-2 py-1 rounded text-white w-full"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={item.purpose}
                      onChange={(e) => {
                        const newData = [...variableData];
                        newData[index].purpose = e.target.value;
                        setVariableData(newData);
                      }}
                      className="bg-gray-700 px-2 py-1 rounded text-white w-full"
                    />
                  </td>
                  <td className="p-4">
                    <textarea
                      value={item.properties}
                      onChange={(e) => {
                        const newData = [...variableData];
                        newData[index].properties = e.target.value;
                        setVariableData(newData);
                      }}
                      className="bg-gray-700 px-2 py-1 rounded text-white w-full resize-y min-h-[2.5rem]"
                    />
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => {
                        const newData = variableData.filter((_, i) => i !== index);
                        setVariableData(newData);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setVariableData([...variableData, { 
              name: '', 
              location: '',
              purpose: '',
              properties: ''
            }])}
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            항목 추가
          </button>
        </div>
      </div>
    </div>
  );
}
