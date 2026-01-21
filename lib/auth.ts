export const authConfig = {
  clientId: process.env.FORTY_TWO_CLIENT_ID!,
  clientSecret: process.env.FORTY_TWO_CLIENT_SECRET!,
  redirectUri: process.env.FORTY_TWO_REDIRECT_URI!,
  authorizationUrl: 'https://api.intra.42.fr/oauth/authorize',
  tokenUrl: 'https://api.intra.42.fr/oauth/token',
  userInfoUrl: 'https://api.intra.42.fr/v2/me',
};

export function getAuthorizationUrl(): string {
  const params = new URLSearchParams({
    client_id: authConfig.clientId,
    redirect_uri: authConfig.redirectUri,
    response_type: 'code',
    scope: 'public',
  });
  return `${authConfig.authorizationUrl}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const response = await fetch(authConfig.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: authConfig.clientId,
      client_secret: authConfig.clientSecret,
      code,
      redirect_uri: authConfig.redirectUri,
    }),
  });
  const data = await response.json();
  return data.access_token;
}

export async function getUserInfo(accessToken: string): Promise<any> {
  const response = await fetch(authConfig.userInfoUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.json();
}
