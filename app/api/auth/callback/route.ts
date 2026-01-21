import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getUserInfo } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(new URL(`/login?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    console.log('Exchanging code for token...');
    const tokenData = await exchangeCodeForToken(code);
    
    console.log('Fetching user info...');
    const user = await getUserInfo(tokenData.access_token);

    const cookieStore = await cookies();
    
    // Set cookies with proper settings
    cookieStore.set('access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in || 7200,
      path: '/',
    });
    
    cookieStore.set('user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in || 7200,
      path: '/',
    });

    console.log('Authentication successful for user:', user.login);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}
