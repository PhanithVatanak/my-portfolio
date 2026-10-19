import { NextRequest, NextResponse } from 'next/server';
import { portfolioDb } from '@/lib/data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const query = searchParams.get('q');
    const status = searchParams.get('status');

    let articles = portfolioDb.getArticles();

    if (category && category !== 'All' && category !== 'all') {
      articles = articles.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== 'All Statuses') {
      articles = articles.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }

    if (query) {
      const q = query.toLowerCase();
      articles = articles.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      count: articles.length,
      articles
    });
  } catch (error) {
    console.error('Error in GET /api/articles:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch articles.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, content, excerpt, tags, status } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: 'Article title is required.' }, { status: 400 });
    }

    const newArticle = portfolioDb.addArticle({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: category || 'Architecture',
      views: '1 view',
      readRate: '100% read rate',
      readTime: `${Math.max(2, Math.ceil((content || excerpt || '').length / 400))} min read`,
      publishedDate: 'Just now',
      status: status || 'Draft',
      excerpt: excerpt || (content ? content.slice(0, 160) + '...' : 'New research draft.'),
      tags: Array.isArray(tags) && tags.length > 0 ? tags : ['Engineering', 'Research'],
      content: content || 'Draft content in progress...'
    });

    return NextResponse.json({ success: true, article: newArticle }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/articles:', error);
    return NextResponse.json({ success: false, error: 'Failed to create article.' }, { status: 500 });
  }
}
