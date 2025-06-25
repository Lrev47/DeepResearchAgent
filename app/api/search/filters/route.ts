import { NextRequest, NextResponse } from 'next/server';
import { unifiedSearchService } from '@/lib/services/search/unifiedSearch';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const filters = unifiedSearchService.getAvailableFilters();
    
    return NextResponse.json({
      filters,
      sources: [
        {
          id: 'google_scholar',
          name: 'Google Scholar',
          description: 'Academic papers and citations',
          icon: '🎓'
        },
        {
          id: 'arxiv',
          name: 'arXiv',
          description: 'Scientific preprints',
          icon: '📄'
        },
        {
          id: 'pubmed',
          name: 'PubMed',
          description: 'Biomedical literature',
          icon: '🧬'
        },
        {
          id: 'web',
          name: 'Web Search',
          description: 'General web results',
          icon: '🌐'
        }
      ]
    }, { status: 200 });

  } catch (error: any) {
    console.error('Filters API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filters' },
      { status: 500 }
    );
  }
} 