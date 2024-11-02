import axios from 'axios';
import { setCookie } from 'nookies';

interface CodeResponse {
  code: string;
}

export interface IGetRefreshTokenResponse {
  access_token: string;
  expires: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface IGetAccessTokenResponse {
  access_token: string;
  expires: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export const getRefreshToken = async (
  codeResponse: CodeResponse,
) => {
  const payload = {
    grant_type: 'authorization_code',
    code: codeResponse.code,
    client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID,
    client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.NODE_ENV === "production" ? "https://app-suite.vercel.app" : 'http://localhost:3000',
  };

  try {
    const res = await axios.post<IGetRefreshTokenResponse>('https://oauth2.googleapis.com/token', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (err) {
    console.error('Error fetching refresh token:', err);
  }
};

export const getNewAccessToken = async (refreshToken: string) => {
  const payloadForAccessToken = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID,
    client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
  };

  try {
    const res = await axios.post<IGetAccessTokenResponse>(
      'https://oauth2.googleapis.com/token',
      payloadForAccessToken,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    setCookie(null, "asAccessToken", res.data.access_token, { path: "/", maxAge: (60 * 60) });
    console.log(res.data)
    return res.data
  } catch (err) {
    console.error('Error fetching new access token:', err);
  }
};