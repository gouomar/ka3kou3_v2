import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getUserInfo } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  // If no code, redirect to 42 OAuth
  if (!code) {
    const params = new URLSearchParams({
      client_id: process.env.FORTY_TWO_CLIENT_ID!,
      redirect_uri: process.env.FORTY_TWO_REDIRECT_URI!,
      response_type: 'code',
      scope: 'public',
    });
    return NextResponse.redirect(`https://api.intra.42.fr/oauth/authorize?${params.toString()}`);
  }

  // Handle callback with code
  try {
    const accessToken = await exchangeCodeForToken(code);
    const user = await getUserInfo(accessToken);
    const cookieStore = await cookies();

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
      image: user.image?.link,
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
