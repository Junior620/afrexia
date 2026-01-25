import { NextRequest, NextResponse } from 'next/server';
import { getResourceById } from '@/lib/sanity/queries';

/**
 * Resource download API route
 * Tracks download event and redirects to Sanity CDN file URL
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch resource from Sanity
    const resource = await getResourceById(id);

    if (!resource || !resource.file?.asset?.url) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    // Track download event (analytics)
    // In a production environment, you would send this to your analytics service
    // Example: trackEvent('resource_download', { resourceId: id, title: resource.title })
    console.log('Resource downloaded:', {
      id: resource._id,
      title: resource.title,
      category: resource.category,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.ip || request.headers.get('x-forwarded-for'),
    });

    // Redirect to Sanity CDN file URL
    const fileUrl = resource.file.asset.url;
    return NextResponse.redirect(fileUrl);
  } catch (error) {
    console.error('Resource download error:', error);
    return NextResponse.json(
      { error: 'Failed to download resource' },
      { status: 500 }
    );
  }
}
