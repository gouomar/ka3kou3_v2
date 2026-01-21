import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getUserInfo } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    const accessToken = await exchangeCodeForToken(code);
    const user = await getUserInfo(accessToken);
    const cookieStore = await cookies();

    // Find the 42cursus (main curriculum) data
    const cursus42 = user.cursus_users?.find(
      (c: any) => c.cursus?.slug === '42cursus' || c.cursus_id === 21
    );

    cookieStore.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    cookieStore.set('user', JSON.stringify({
      id: user.id,
      login: user.login,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      displayName: user.displayname || `${user.first_name} ${user.last_name}`,
      image: user.image?.versions?.medium || user.image?.link,
      level: cursus42?.level || 0,
      campus: user.campus?.[0]?.name || 'Unknown',
      campusCity: user.campus?.[0]?.city || '',
      poolYear: user.pool_year,
      poolMonth: user.pool_month,
      wallet: user.wallet || 0,
      correctionPoints: user.correction_point || 0,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.redirect(new URL('/', request.url));
  } catch {
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}
