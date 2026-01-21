import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getUserInfo } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    const tokenData = await exchangeCodeForToken(code);
    const user = await getUserInfo(tokenData.access_token);

    const cookieStore = await cookies();
    cookieStore.set('access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenData.expires_in,
    });
    cookieStore.set('user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenData.expires_in,
    });

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}
