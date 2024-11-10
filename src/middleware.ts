import { getNewAccessToken } from "@/utils/getRefreshToken";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const cookieStore = request.cookies;
  
  const accessToken = cookieStore.get("asAccessToken")?.value;

  if (!accessToken) {
    const refreshToken = cookieStore.get("asRefreshToken")?.value;
    if (refreshToken && refreshToken !== "DUMMY_PREVIEW_REFRESH_TOKEN") {
      const newAccessToken = (await getNewAccessToken(refreshToken as string));
      if (newAccessToken) {
        response.cookies.set("asAccessToken", newAccessToken?.access_token as string, { path: "/", maxAge: (60*60) });
        return response;
      } else {
        return response;
      }
    } else {
      return response;
    }
  } else {
    return response
  }
}