import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Debug endpoint to see raw project data from 42 API
export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const userCookie = cookieStore.get('user')?.value;

  if (!accessToken || !userCookie) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const user = JSON.parse(userCookie);

    // Fetch user's projects from 42 API
    const response = await fetch(
      `https://api.intra.42.fr/v2/users/${user.id}/projects_users?page[size]=100`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        error: 'Failed to fetch projects',
        status: response.status,
        details: errorText
      }, { status: 500 });
    }

    const projectsData = await response.json();

    // Return raw data with just the important fields for debugging
    const debugData = projectsData.map((p: any) => ({
      id: p.id,
      projectId: p.project?.id,
      name: p.project?.name,
      slug: p.project?.slug,
      status: p.status,
      validated: p['validated?'],
      finalMark: p.final_mark,
      cursusIds: p.cursus_ids,
    }));

    // Group by status for easy viewing
    const byStatus = {
      finished_validated: debugData.filter((p: any) => p.status === 'finished' && p.validated === true),
      finished_failed: debugData.filter((p: any) => p.status === 'finished' && p.validated === false),
      in_progress: debugData.filter((p: any) => p.status === 'in_progress'),
      other: debugData.filter((p: any) => !['finished', 'in_progress'].includes(p.status)),
    };

    // Get all unique slugs
    const allSlugs = [...new Set(debugData.map((p: any) => p.slug))].sort();

    return NextResponse.json({
      totalProjects: debugData.length,
      allSlugs,
      byStatus,
      rawData: debugData,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects', details: String(error) }, { status: 500 });
  }
}
