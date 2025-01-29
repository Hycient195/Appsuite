"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { parseCookies, setCookie } from "nookies";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google"
import { GoogleIcon, LogoIcon } from "@/sharedComponents/CustomIcons";
import Link from "next/link";
import { getNewAccessToken, getRefreshToken, IGetRefreshTokenResponse } from "@/utils/getRefreshToken";
import { ILoggedInUser } from "@/types/shared.types";
import LoadingButton from "@/sharedComponents/LoadingButton";
import { useRouter } from "next/navigation";


const SignIn = () => {
  const [ isSigningIn, setIsSigningIn ] = useState<boolean>(false);
  
  /* Automatically route the user to the application if already signed in */
  useEffect(() => {
    (async() => {
      const cookies = parseCookies();
      const accessToken = cookies?.asAccessToken
      const refreshToken = cookies?.asRefreshToken
      if (accessToken) {
        window.location.assign("/app/finance-tracker");
      } else {
        if (refreshToken) {
          const tokenResponse = (await getNewAccessToken(refreshToken as string));
          if (tokenResponse) {
            setCookie(null, "asAccessToken", tokenResponse.access_token, { path: "/", maxAge: (60 * 60) });
            window.location.assign("/app/finance-tracker");
          }
        }
      }
    })();
  }, [])

  const [ signInResponse, setSignInResponse ] = useState<IGetRefreshTokenResponse>();
  const onSignInError = (err: Pick<TokenResponse, "error" | "error_description" | "error_uri">) => {
    console.log(err)
  };

  // console.log(data)

  useEffect(() => {
    const cookieAccessToken = parseCookies().asAccessToken;
    if (signInResponse) {
      axios
      .get<ILoggedInUser>(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${signInResponse.access_token??cookieAccessToken}`, {
          headers: {
              Authorization: `Bearer ${signInResponse.access_token??cookieAccessToken}`,
              Accept: 'application/json'
          }
      })
      .then((res) => {
        console.log(res.data)
        axios.post<ILoggedInUser>("/api/user/sign-in", res.data)
          .then((signInRes) => {
            setIsSigningIn(false);
            setCookie(null, "asUserProfile", JSON.stringify(res.data), { path: "/", maxAge: (60 * 60 * 24 * 7) });
            window.location.assign("/app/finance-tracker");
          }).catch(() => {
            setIsSigningIn(false);
            setCookie(null, "asUserProfile", JSON.stringify(res.data), { path: "/", maxAge: (60 * 60 * 24 * 7) });
            window.location.assign("/app/finance-tracker");
          })
      })
      .catch((err) => console.log(err));
    }
  }, [ signInResponse ]);

  const handleSignIn = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setIsSigningIn(true);
      const res = (await getRefreshToken(codeResponse));
      if (res) {
        setCookie(null, "asRefreshToken", res.refresh_token, { path: "/", maxAge: (60 * 60 * 24 * 7) });
        setCookie(null, "asAccessToken", res.access_token, { path: "/", maxAge: (60 * 60) });
      }
      setSignInResponse(res);
    },
    onError: onSignInError,
    flow: "auth-code",
    scope: "profile email https://www.googleapis.com/auth/drive.file",
    include_granted_scopes: true,
    // access_type: "", // Ensures refresh token is included in the response.
    // prompt: "consent" // Ask the user to re-authorize to get a refresh token
  });

  const getDummyRefreshTokenForPreviewWithoutSignIn = (): void => {
    setCookie(null, "asRefreshToken", "DUMMY_PREVIEW_REFRESH_TOKEN", { path: "/", maxAge: (60 * 60 * 24 * 2) });
    window.location.assign("/app/finance-tracker/null-id");
  }

  return (
    <main className="h-screen bg-slate-100 px-4">
      <div className="max-w-screen-xl h-full relative mx-auto flex flex-col justify-center items-center ">
        {/* <p className="absolute top-[3%] right-0">Having Problem? <Link to="/get-help" className="underline text-blue">Get Help</Link></p> */}
        
        <div  className="max-w-xl mx-auto flex flex-col gap-3 justify-center bg-white rounded-lg border p-[clamp(16px,4%,80px)]">
        <div className="flex flex-row items-center mb-5 gap-2">
            <LogoIcon />
            <h2 className="text-xl font-sans font-semibold tracking-wide">APP SUITE</h2>
          </div>
          <div className="line"></div>
          <h2 className="text-2xl text-slate-800 text-center">Sign in to AppSuite</h2>
          <p className="text-slate-500 text-center mt-4">Lightweight and precisely crafted software applications for custom workflows</p>

          <div className="mt-4 flex flex-col gap-5">
            
            <div className="flex justify-center items-center flex-col gap-3">
              {/* <LoadingButton loading={isLoading} className="!px-10 rounded-md shadow !py-2.5 text-sl bg-primary text-white">Sign In</LoadingButton> */}
              <LoadingButton loading={isSigningIn} onClick={() => handleSignIn()} className="btn bg-primary text-white flex items-center gap-1"><span className="flex flex-row items-center gap-1"><GoogleIcon /> Sign in with google</span></LoadingButton>
              {/* <button onClick={getDummyRefreshTokenForPreviewWithoutSignIn} className="btn !shadow-none !drop-shadow-none bg-white border border-slate-300 text-slate-500">Preview without sign in</button> */}
              {/* <button onClick={iGet} className="btn !shadow-none !drop-shadow-none bg-white border border-slate-300 text-slate-500">Preview without sign in</button> */}
              <p className="text-slate-400 text-center text-sm">Without signing in, all data would be lost when the page is refreshed</p>
            </div>
            <div className="line"></div>
            <p className="top-[3%] text-center right-0 text-slate-600">Preview <Link href="/terms-of-service" className="underline text-blue">Terms of Service</Link> and <Link href="/privacy-policy" className="underline text-blue">Privacy Policy</Link></p>

          </div>
        </div>
      </div>
    </main>
  )
}

export default SignIn