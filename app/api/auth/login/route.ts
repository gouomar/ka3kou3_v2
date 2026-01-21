import { NextResponse } from 'next/server';
import { getAuthorizationUrl } from '@/lib/auth';

export async function GET() {
  return NextResponse.redirect(getAuthorizationUrl());
}
