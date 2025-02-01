import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("data");
    console.log(data);

    // 텍스트 셀 생성 헬퍼 함수
    const createTextCell = (content: string) => ({
      type: 'text',
      text: { content }
    });

    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID!,
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: "API 분석 문서",
              },
            },
          ],
        },
      },
      children: [
        // 서비스 섹션
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ type: 'text', text: { content: '1. 서비스 분석' } }]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: '서비스 계층의 메소드 분석 결과입니다.' } }]
          }
        },
        ...data.services.map((service: any) => ({
          object: 'block',
          type: 'table',
          table: {
            table_width: 4,
            has_column_header: true,
            children: [
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [createTextCell('메소드명')],
                    [createTextCell('사용 목적')],
                    [createTextCell('반환값')],
                    [createTextCell('서비스 흐름도')]
                  ]
                }
              },
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [createTextCell(service.name)],
                    [createTextCell(service.purpose)],
                    [createTextCell(service.returnValue)],
                    [createTextCell(service.flowChart)]
                  ]
                }
              }
            ]
          }
        })),
        // 구분선
        {
          object: 'block',
          type: 'divider',
          divider: {}
        },

        // 컨트롤러 섹션
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ type: 'text', text: { content: '2. 컨트롤러 분석' } }]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: '컨트롤러 계층의 메소드 분석 결과입니다.' } }]
          }
        },
        ...data.controllers.map((controller: any) => ({
          object: 'block',
          type: 'table',
          table: {
            table_width: 4,
            has_column_header: true,
            children: [
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [createTextCell('메소드명')],
                    [createTextCell('사용 목적')],
                    [createTextCell('반환값')],
                    [createTextCell('유효성 검사')]
                  ]
                }
              },
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [createTextCell(controller.name)],
                    [createTextCell(controller.purpose)],
                    [createTextCell(controller.returnValue)],
                    [createTextCell(controller.validation)]
                  ]
                }
              }
            ]
          }
        })),
        // 구분선
        {
          object: 'block',
          type: 'divider',
          divider: {}
        },

        // 에러 섹션
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ type: 'text', text: { content: '3. 에러 분석' } }]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: '커스텀 예외 처리 분석 결과입니다.' } }]
          }
        },
        ...data.errors.map((error: any) => ({
          object: 'block',
          type: 'table',
          table: {
            table_width: 3,
            has_column_header: true,
            children: [
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [createTextCell('에러명')],
                    [createTextCell('사용 목적')],
                    [createTextCell('발생 메시지')]
                  ]
                }
              },
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [createTextCell(error.name)],
                    [createTextCell(error.purpose)],
                    [createTextCell(error.message)]
                  ]
                }
              }
            ]
          }
        })),
        // 구분선
        {
          object: 'block',
          type: 'divider',
          divider: {}
        },

        // 변수 섹션
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ type: 'text', text: { content: '4. 변수/DTO 분석' } }]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: '주요 변수 및 DTO 분석 결과입니다.' } }]
          }
        },
        ...data.variables.map((variable: any) => ({
          object: 'block',
          type: 'table',
          table: {
            table_width: 4,
            has_column_header: true,
            children: [
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [createTextCell('변수/DTO명')],
                    [createTextCell('사용한 위치')],
                    [createTextCell('사용 목적')],
                    [createTextCell('포함된 속성')]
                  ]
                }
              },
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [createTextCell(variable.name)],
                    [createTextCell(variable.location)],
                    [createTextCell(variable.purpose)],
                    [createTextCell(variable.properties)]
                  ]
                }
              }
            ]
          }
        }))
      ],
    });

    return NextResponse.json({ 
      success: true, 
      url: response.url 
    });
  } catch (error) {
    console.error('Notion API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create Notion page' },
      { status: 500 }
    );
  }
} 