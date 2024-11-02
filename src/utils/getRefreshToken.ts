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
    client_id: '701915377258-ngs8l1g749itbjp0ean81fk8rjhn1k1k.apps.googleusercontent.com',
    client_secret: "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",
    redirect_uri: 'http://localhost:3000',
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
    client_id: '701915377258-ngs8l1g749itbjp0ean81fk8rjhn1k1k.apps.googleusercontent.com',
    client_secret: "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"
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
    setCookie(null, "asAccessToken", res.data.access_token, { path: "/", maxAge: res.data.expires });
    console.log(res.data)
    return res.data
  } catch (err) {
    console.error('Error fetching new access token:', err);
  }
};