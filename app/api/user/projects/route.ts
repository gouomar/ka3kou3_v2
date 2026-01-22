import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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
      throw new Error('Failed to fetch projects');
    }

    const projectsData = await response.json();

    // Filter out piscine/pool projects - only keep cursus projects
    // Piscine projects typically have cursus_ids containing piscine cursus (9 for C piscine, etc.)
    // or have 'piscine' or 'pool' in the project name/slug
    const filteredData = projectsData.filter((p: any) => {
      const projectName = (p.project?.name || '').toLowerCase();
      const projectSlug = (p.project?.slug || '').toLowerCase();

      // Exclude piscine/pool projects
      const isPiscine = projectName.includes('piscine') ||
                        projectName.includes('pool') ||
                        projectSlug.includes('piscine') ||
                        projectSlug.includes('pool') ||
                        projectSlug.startsWith('c-piscine') ||
                        projectSlug.startsWith('piscine-');

      return !isPiscine;
    });

    // Process and categorize projects
    const projects = filteredData.map((p: any) => ({
      id: p.id,
      name: p.project?.name || 'Unknown',
      slug: p.project?.slug || '',
      status: p.status, // 'finished', 'in_progress', 'searching_a_group', 'creating_group', 'waiting_for_correction', 'parent'
      validated: p['validated?'],
      finalMark: p.final_mark,
      markedAt: p.marked_at,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      retriesCount: p.retriable_count || 0,
    }));

    // Categorize projects
    const completed = projects.filter((p: any) => p.status === 'finished' && p.validated === true);
    const failed = projects.filter((p: any) => p.status === 'finished' && p.validated === false);
    const inProgress = projects.filter((p: any) =>
      ['in_progress', 'searching_a_group', 'creating_group', 'waiting_for_correction'].includes(p.status)
    );

    return NextResponse.json({
      projects,
      stats: {
        total: projects.length,
        completed: completed.length,
        failed: failed.length,
        inProgress: inProgress.length,
      },
      categorized: {
        completed,
        failed,
        inProgress,
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
