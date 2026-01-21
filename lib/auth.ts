export interface User {
  id: number;
  login: string;
  email: string;
  image: { link: string };
}

export const getAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_42_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
  return `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri!)}&response_type=code&scope=public`;
};

export const exchangeCodeForToken = async (code: string) => {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.NEXT_PUBLIC_42_CLIENT_ID!,
    client_secret: process.env.FORTY_TWO_CLIENT_SECRET!,
    code: code,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
  });

  const response = await fetch('https://api.intra.42.fr/oauth/token', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Token exchange failed:', error);
    throw new Error('Failed to exchange code for token');
  }

  return response.json();
};

export const getUserInfo = async (accessToken: string): Promise<User> => {
  const response = await fetch('https://api.intra.42.fr/v2/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }

  return response.json();
};
