export interface User {
  id: number;
  login: string;
  email: string;
  image: { link: string };
}

export const getAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_42_UID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
  return `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
};

export const exchangeCodeForToken = async (code: string) => {
  const response = await fetch('https://api.intra.42.fr/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.NEXT_PUBLIC_42_UID,
      client_secret: process.env.FORTY_TWO_SECRET,
      code,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
    }),
  });
  return response.json();
};

export const getUserInfo = async (accessToken: string): Promise<User> => {
  const response = await fetch('https://api.intra.42.fr/v2/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.json();
};
