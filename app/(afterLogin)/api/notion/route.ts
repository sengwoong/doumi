import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const createTextCell = (content: string) => ({
  type: 'text',
  text: { content: content || '-' }
});

const createLinkCell = (content: string, dtoId: string) => {
  if (!content) return [createTextCell('-')];
  
  return [{
    type: 'text',
    text: {
      content: content,
      link: dtoId ? {
        url: `https://www.notion.so/${dtoId.replace(/-/g, '')}`
      } : undefined
    }
  }];
};

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Received data:", JSON.stringify(data, null, 2));

    if (!process.env.NOTION_DATABASE_ID) {
      console.error('NOTION_DATABASE_ID is not defined');
      return NextResponse.json(
        { error: 'NOTION_DATABASE_ID is not configured' },
        { status: 500 }
      );
    }

    // 먼저 DTO 페이지들을 생성하고 ID를 저장
    const dtoPages = new Map();
    
    for (const dto of data.variables) {
      const dtoPage = await notion.pages.create({
        parent: { database_id: process.env.NOTION_DATABASE_ID! },
        properties: {
          title: {
            title: [{ text: { content: dto.name } }]
          }
        },
        children: [
          {
            object: 'block',
            type: 'heading_3',
            heading_3: {
              rich_text: [{ text: { content: '상세 정보' } }]
            }
          },
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{ text: { content: `위치: ${dto.location}` } }]
            }
          },
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{ text: { content: `목적: ${dto.purpose}` } }]
            }
          },
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{ text: { content: '속성:' } }]
            }
          },
          {
            object: 'block',
            type: 'code',
            code: {
              language: 'typescript',
              rich_text: [{ text: { content: dto.properties } }]
            }
          }
        ]
      });
      
      dtoPages.set(dto.name, dtoPage.id);
    }

    // 메인 문서 생성
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID! },
      properties: {
        title: {
          title: [{ text: { content: "API 분석 문서" } }]
        }
      },
      children: [
        // 서비스 섹션
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: '서비스 분석' } }]
          }
        },
        {
          object: 'block',
          type: 'table',
          table: {
            table_width: 6,
            has_column_header: true,
            children: [
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [createTextCell('메소드명')],
                    [createTextCell('사용 목적')],
                    [createTextCell('반환값')],
                    [createTextCell('서비스 흐름도')],
                    [createTextCell('입력 DTO')],
                    [createTextCell('출력 DTO')]
                  ]
                }
              },
              ...(data.services || []).map((service: any) => ({
                type: 'table_row',
                table_row: {
                  cells: [
                    [createTextCell(service.name)],
                    [createTextCell(service.purpose)],
                    [createTextCell(service.returnValue)],
                    [createTextCell(service.flowChart)],
                    createLinkCell(service.inputDto, dtoPages.get(service.inputDto)),
                    createLinkCell(service.outputDto, dtoPages.get(service.outputDto))
                  ]
                }
              }))
            ]
          }
        },
        // 구분선
        { object: 'block', type: 'divider', divider: {} },

        // 컨트롤러 섹션
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: '컨트롤러 분석' } }]
          }
        },
        {
          object: 'block',
          type: 'table',
          table: {
            table_width: 6,
            has_column_header: true,
            children: [
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [createTextCell('메소드명')],
                    [createTextCell('사용 목적')],
                    [createTextCell('반환값')],
                    [createTextCell('유효성 검사')],
                    [createTextCell('요청 DTO')],
                    [createTextCell('응답 DTO')]
                  ]
                }
              },
              ...(data.controllers || []).map((controller: any) => ({
                type: 'table_row',
                table_row: {
                  cells: [
                    [createTextCell(controller.name)],
                    [createTextCell(controller.purpose)],
                    [createTextCell(controller.returnValue)],
                    [createTextCell(controller.validation)],
                    createLinkCell(controller.requestDto, dtoPages.get(controller.requestDto)),
                    createLinkCell(controller.responseDto, dtoPages.get(controller.responseDto))
                  ]
                }
              }))
            ]
          }
        },
        // 구분선
        { object: 'block', type: 'divider', divider: {} },

        // DTO 섹션
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'DTO 분석' } }]
          }
        },
        {
          object: 'block',
          type: 'table',
          table: {
            table_width: 6,
            has_column_header: true,
            children: [
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [createTextCell('DTO명')],
                    [createTextCell('사용한 위치')],
                    [createTextCell('사용 목적')],
                    [createTextCell('포함된 속성')],
                    [createTextCell('입력으로 사용하는 서비스/컨트롤러')],
                    [createTextCell('출력으로 사용하는 서비스/컨트롤러')]
                  ]
                }
              },
              ...(data.variables || []).map((variable: any) => {
                const usedAsInput = [
                  ...data.services.filter(s => s.inputDto === variable.name).map(s => `Service: ${s.name}`),
                  ...data.controllers.filter(c => c.requestDto === variable.name).map(c => `Controller: ${c.name}`)
                ].join(', ');
                
                const usedAsOutput = [
                  ...data.services.filter(s => s.outputDto === variable.name).map(s => `Service: ${s.name}`),
                  ...data.controllers.filter(c => c.responseDto === variable.name).map(c => `Controller: ${c.name}`)
                ].join(', ');

                return {
                  type: 'table_row',
                  table_row: {
                    cells: [
                      createLinkCell(variable.name, dtoPages.get(variable.name)),
                      [createTextCell(variable.location)],
                      [createTextCell(variable.purpose)],
                      [createTextCell(variable.properties)],
                      [createTextCell(usedAsInput || '-')],
                      [createTextCell(usedAsOutput || '-')]
                    ]
                  }
                };
              })
            ]
          }
        }
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