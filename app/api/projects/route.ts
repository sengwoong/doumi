import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const projects = await prisma.folder.findMany({
      where: {
        parentId: null
      },
      include: {
        _count: {
          select: { files: true }
        }
      }
    });

    const formattedProjects = projects.map(project => ({
      id: project.id,
      name: project.name,
      uploadDate: project.createdAt.toISOString().split('T')[0],
      fileCount: project._count.files,
      status: project.status || 'pending'
    }));

    console.log('Fetched projects:', formattedProjects);
    return NextResponse.json({ projects: formattedProjects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 