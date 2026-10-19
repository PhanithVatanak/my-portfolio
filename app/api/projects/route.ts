import { NextRequest, NextResponse } from 'next/server';
import { portfolioDb } from '@/lib/data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const query = searchParams.get('q');
    const tech = searchParams.get('tech');

    let projects = portfolioDb.getProjects();

    if (category && category !== 'All') {
      projects = projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (tech && tech !== 'All') {
      projects = projects.filter(p => p.tags.some(t => t.toLowerCase() === tech.toLowerCase()));
    }

    if (query) {
      const q = query.toLowerCase();
      projects = projects.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch projects.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, tags, liveUrl, githubUrl } = body;

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'Title and description are required.' }, { status: 400 });
    }

    const newProject = portfolioDb.addProject({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      longDescription: body.longDescription || description,
      category: category || 'Web Apps',
      tags: Array.isArray(tags) ? tags : ['Next.js', 'TypeScript'],
      liveUrl: liveUrl || '#',
      githubUrl: githubUrl || '#',
      iconName: body.iconName || 'terminal',
      stars: body.stars || 1,
      featured: !!body.featured,
      status: body.status || 'Live',
      metrics: body.metrics || 'Just deployed',
      architectureHighlights: body.architectureHighlights || ['Clean Next.js architecture']
    });

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    return NextResponse.json({ success: false, error: 'Failed to create project.' }, { status: 500 });
  }
}
