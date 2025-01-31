import { NextResponse } from 'next/server';
import prisma  from '@/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

interface FileAnalysis {
  type: string;
  analysis: {
    dependencies?: string[];
    methods?: string[];
    className?: string;
    packageName?: string;
  };
}

// Method 타입 정의 추가
interface MethodData {
  name: string;
  returnType: string | null;
  parameters: string | null;
  httpMethod: string | null;
  path: string | null;
  errorMessage?: string | null;
  errorCode?: string | null;
  fullMethod: string;
}

// 파일 분석을 위한 전략 패턴 인터페이스
// 각 파일 타입(Controller, Service, Exception)별로 다른 분석 전략을 구현
interface FileAnalyzer {
  analyze(methodContent: string): MethodData | null;
}

// 컨트롤러 클래스 분석을 위한 전략 구현
// HTTP 매핑(@GetMapping, @PostMapping 등)과 메소드 정보를 추출
class ControllerAnalyzer implements FileAnalyzer {
  analyze(methodContent: string): MethodData | null {
    // 기존의 parseControllerMethod 함수를 재사용하여 컨트롤러 메소드 분석
    return parseControllerMethod(methodContent);
  }
}

// 서비스 클래스 분석을 위한 전략 구현
// 비즈니스 로직 메소드와 예외 처리 정보를 추출
class ServiceAnalyzer implements FileAnalyzer {
  analyze(methodContent: string): MethodData | null {
    // 메소드 기본 정보 추출
    const methodMatch = methodContent.match(/public\s+([\w<>[\]]+)\s+(\w+)\s*\((.*?)\)/);
    if (!methodMatch) return null;
    
    const [_, returnType, methodName, params] = methodMatch;
    let errorCode = null;
    let errorMessage = null;

    // 직접적인 예외 throw 패턴 검사
    const throwMatch = methodContent.match(/throw\s+new\s+(\w+)\("([^"]+)"\s*\+?\s*([^)]+)?\)/);
    if (throwMatch) {
      errorCode = throwMatch[1];      // 예외 클래스명
      errorMessage = throwMatch[2] + (throwMatch[3] ? throwMatch[3].trim() : '');  // 에러 메시지
    }

    // Optional의 orElseThrow 패턴 검사
    const orElseThrowMatch = methodContent.match(/orElseThrow\s*\(\s*\(\s*\)\s*->\s*new\s+(\w+)\("([^"]+)"\s*\+?\s*([^)]+)?\)/);
    if (orElseThrowMatch) {
      errorCode = orElseThrowMatch[1];    // 예외 클래스명
      errorMessage = orElseThrowMatch[2] + (orElseThrowMatch[3] ? orElseThrowMatch[3].trim() : '');  // 에러 메시지
    }

    return {
      name: methodName,
      returnType: returnType,
      parameters: params.trim(),
      httpMethod: null,  // 서비스 클래스는 HTTP 메소드가 없음
      path: null,        // 서비스 클래스는 경로가 없음
      errorMessage,
      errorCode,
      fullMethod: methodContent
    };
  }
}

// 예외 클래스 분석을 위한 전략 구현
// 예외 클래스의 메소드와 에러 메시지 정보를 추출
class ExceptionAnalyzer implements FileAnalyzer {
  analyze(methodContent: string): MethodData | null {
    // 서비스와 동일한 분석 로직 사용 (예외 처리 정보 추출이 중요)
    const methodMatch = methodContent.match(/public\s+([\w<>[\]]+)\s+(\w+)\s*\((.*?)\)/);
    if (!methodMatch) return null;
    
    const [_, returnType, methodName, params] = methodMatch;
    let errorCode = null;
    let errorMessage = null;

    // 예외 처리 패턴들 검사
    const throwMatch = methodContent.match(/throw\s+new\s+(\w+)\("([^"]+)"\s*\+?\s*([^)]+)?\)/);
    if (throwMatch) {
      errorCode = throwMatch[1];
      errorMessage = throwMatch[2] + (throwMatch[3] ? throwMatch[3].trim() : '');
    }

    const orElseThrowMatch = methodContent.match(/orElseThrow\s*\(\s*\(\s*\)\s*->\s*new\s+(\w+)\("([^"]+)"\s*\+?\s*([^)]+)?\)/);
    if (orElseThrowMatch) {
      errorCode = orElseThrowMatch[1];
      errorMessage = orElseThrowMatch[2] + (orElseThrowMatch[3] ? orElseThrowMatch[3].trim() : '');
    }

    return {
      name: methodName,
      returnType: returnType,
      parameters: params.trim(),
      httpMethod: null,
      path: null,
      errorMessage,
      errorCode,
      fullMethod: methodContent
    };
  }
}

// 파일 타입에 따른 적절한 분석기를 반환하는 팩토리 함수
// 타입: 'controller', 'service', 'exception'
const getAnalyzer = (type: string): FileAnalyzer => {
  switch (type) {
    case 'controller':
      return new ControllerAnalyzer();
    case 'service':
      return new ServiceAnalyzer();
    case 'exception':
      return new ExceptionAnalyzer();
    default:
      throw new Error('Unknown file type');
  }
};

function analyzeJavaFile(filePath: string, originalPath: string): FileAnalysis {
  try {
    const projectRoot = process.cwd();
    const uploadsPath = path.join(projectRoot, 'public', 'uploads');
    const projectFolders = fs.readdirSync(uploadsPath);
    let content = '';
    
    for (const folder of projectFolders) {
      const possiblePath = path.join(uploadsPath, folder, originalPath);
      if (fs.existsSync(possiblePath)) {
        content = fs.readFileSync(possiblePath, 'utf-8');
        break;
      }
    }

    if (!content) {
      console.warn('파일을 찾을 수 없습니다:', originalPath);
      return { type: '', analysis: {} };
    }

    const analysis: FileAnalysis = {
      type: '',
      analysis: {
        methods: extractMethods(content),
        packageName: extractPackageName(content),
        className: extractClassName(content),
        dependencies: extractDependencies(content)
      }
    };

    return analysis;
  } catch (error) {
    console.error('파일 분석 중 오류 발생:', error);
    return { type: '', analysis: {} };
  }
}

function extractMethods(content: string): string[] {
  const methods: string[] = [];
  const lines = content.split('\n');
  let currentMethod = '';
  let braceCount = 0;
  let isInMethod = false;
  let methodStarted = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 클래스 선언이나 필드 선언은 건너뛰기
    if (line.includes('class ') || 
        line.includes('private final') || 
        line.includes('public final') || 
        line.startsWith('@RequiredArgsConstructor')) {
      continue;
    }

    // 메소드 시작 감지 (어노테이션부터)
    if (line.startsWith('@') || 
        line.match(/^(?:public|private|protected)\s+(?:static\s+)?[\w<>[\]]+\s+\w+\s*\(/)) {
      
      if (!methodStarted) {
        methodStarted = true;
        currentMethod = '';
      }
      currentMethod += line + '\n';
      
      if (line.includes('{')) {
        isInMethod = true;
        braceCount += (line.match(/{/g) || []).length;
        braceCount -= (line.match(/}/g) || []).length;
      }
      continue;
    }

    // 메소드 내용 수집
    if (methodStarted) {
      currentMethod += line + '\n';
      
      if (line.includes('{')) {
        isInMethod = true;
        braceCount += (line.match(/{/g) || []).length;
      }
      if (line.includes('}')) {
        braceCount -= (line.match(/}/g) || []).length;
      }

      // 메소드 끝 감지
      if (isInMethod && braceCount === 0) {
        methods.push(currentMethod.trim());
        currentMethod = '';
        isInMethod = false;
        methodStarted = false;
      }
    }
  }

  return methods;
}

function extractPackageName(content: string): string {
  const match = content.match(/package\s+([\w.]+);/);
  return match ? match[1] : '';
}

function extractClassName(content: string): string {
  const match = content.match(/class\s+(\w+)/);
  return match ? match[1] : '';
}

function extractDependencies(content: string): string[] {
  const matches = content.match(/import\s+([\w.]+);/g);
  return matches ? matches.map(imp => imp.replace(/import\s+/, '').replace(';', '')) : [];
}

function parseControllerMethod(methodContent: string): MethodData | null {
  // 컨트롤러의 HTTP 매핑 정보를 추출하기 위한 매핑 객체
  const mappings = {
    '@GetMapping': 'GET',
    '@PostMapping': 'POST',
    '@PutMapping': 'PUT',
    '@DeleteMapping': 'DELETE',
    '@PatchMapping': 'PATCH'
  };

  let httpMethod = 'OTHER';
  let path = null;

  const lines = methodContent.split('\n');
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // @GetMapping, @PostMapping 등의 HTTP 메소드 어노테이션 검사
    // 예: @GetMapping("/users") -> GET, "/users"
    for (const [annotation, method] of Object.entries(mappings)) {
      if (trimmedLine.startsWith(annotation)) {
        httpMethod = method;
        // URL 경로 추출: "/users/{id}" 형식의 경로를 찾음
        const pathMatch = trimmedLine.match(/["']([^"']+)["']/);
        if (pathMatch) {
          path = pathMatch[1];
        }
        break;
      }
    }
    
    // @RequestMapping 어노테이션 처리
    // 예: @RequestMapping(value = "/users", method = RequestMethod.GET)
    if (trimmedLine.startsWith('@RequestMapping')) {
      // HTTP 메소드 추출: RequestMethod.GET -> GET
      const methodMatch = trimmedLine.match(/method\s*=\s*RequestMethod\.(\w+)/);
      if (methodMatch) {
        httpMethod = methodMatch[1];
      }
      // URL 경로 추출
      const pathMatch = trimmedLine.match(/["']([^"']+)["']/);
      if (pathMatch) {
        path = pathMatch[1];
      }
    }

    // 메소드 선언부를 만나면 어노테이션 검색 중단
    if (trimmedLine.match(/^(?:public|private|protected)/)) {
      break;
    }
  }

  // 메소드의 기본 정보(반환 타입, 이름, 매개변수) 추출
  // 예: public ResponseEntity<User> createUser(UserRequest request)
  const methodMatch = methodContent.match(/(?:public|private|protected)\s+(?:static\s+)?([^(]+?)\s+(\w+)\s*\((.*?)\)/);
  if (!methodMatch) return null;

  const [_, returnType, methodName, parameters] = methodMatch;

  return {
    name: methodName,
    returnType: returnType.trim(),
    parameters: parameters.trim(),
    httpMethod,
    path,
    fullMethod: methodContent
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const analysis = analyzeJavaFile(body.path, body.path);
    
    // 파일 타입에 맞는 분석기를 가져와서 메소드들을 분석
    const analyzer = getAnalyzer(body.type);
    const methodsData = analysis.analysis.methods?.map(method => 
      analyzer.analyze(method)
    ).filter(Boolean) || [];




    const result = await prisma.$transaction(async (prisma) => {
      const file = await prisma.file.create({
        data: {
          name: body.name,
          path: body.path,
          type: body.type as 'controller' | 'service' | 'exception',
          folderId: body.folderId,
          packageName: analysis.analysis.packageName || '',
          className: analysis.analysis.className || '',
          dependencies: JSON.stringify(analysis.analysis.dependencies || []),
        },
      });

      const methods = await Promise.all(
        methodsData.map(method => 
          prisma.method.create({
            data: {
              methodName: method.name,
              returnType: method.returnType,
              parameters: method.parameters,
              httpMethod: method.httpMethod,
              path: method.path,
              errorMessage: method.errorMessage || null,
              errorCode: method.errorCode || null,
              exceptionType: method.errorCode || null,
              fullMethod: method.fullMethod,
              fileId: file.id,
            },
          })
        )
      );

      return { file, methods };
    });

    console.log('DB 저장 결과:', {
      fileId: result.file.id,
      methodCount: result.methods.length
    });

    return NextResponse.json({
      success: true,
      data: {
        fileName: body.name,
        content: body.content,
        type: body.type,
        methods: methodsData
      }
    });

  } catch (error) {
    console.error('에러 발생:', error instanceof Error ? error.message : '알 수 없는 에러');
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.' },
      { status: 500 }
    );
  }
}

