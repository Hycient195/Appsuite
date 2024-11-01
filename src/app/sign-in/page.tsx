"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { parseCookies, setCookie } from "nookies";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google"
import { GoogleIcon, LogoIcon } from "@/sharedComponents/CustomIcons";
import Link from "next/link";
import { useRouter } from "next/navigation";


const SignIn = () => {
  const router = useRouter();
  const [ signInResponse, setSignInResponse ] = useState<Omit<TokenResponse, "error" | "error_description" | "error_uri">>();
  const[ profile, setProfile ] = useState();


  const onSignInError = (err: Pick<TokenResponse, "error" | "error_description" | "error_uri">) => {
    console.log(err)
  };

  useEffect(() => {
    const cookieAccessToken = parseCookies().asAccessToken;
    if (signInResponse) {
      axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${signInResponse.access_token??cookieAccessToken}`, {
          headers: {
              Authorization: `Bearer ${signInResponse.access_token??cookieAccessToken}`,
              Accept: 'application/json'
          }
      })
      .then((res) => {
          setProfile(res.data);
          setCookie(null, "asUserProfile", JSON.stringify(res.data), { path: "/", maxAge: (60 * 60 * 48) });
          window.location.assign("/app/balance-sheet/create");
      })
      .catch((err) => console.log(err));
    }
  }, [ signInResponse ]);

  const handleSignIn = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setSignInResponse(codeResponse);
      setCookie(null, "asAccessToken", codeResponse.access_token, { path: "/", maxAge: (60 * 60 * 48) });
    },
    onError: onSignInError,
    scope: "profile email https://www.googleapis.com/auth/drive.file",
    include_granted_scopes: true,
    // access_type: "", // Ensures refresh token is included in the response.
    prompt: "consent" // Ask the user to re-authorize to get a refresh token
  })

  return (
    <main className="h-screen bg-zinc-50 px-4">
      <div className="max-w-screen-xl h-full relative mx-auto flex flex-col justify-center items-center ">
        {/* <p className="absolute top-[3%] right-0">Having Problem? <Link to="/get-help" className="underline text-blue">Get Help</Link></p> */}
        
        <div  className="max-w-xl mx-auto flex flex-col gap-3 justify-center bg-white rounded-md border p-[clamp(16px,4%,80px)]">
        <div className="flex flex-row items-center mb-5 gap-2">
            <LogoIcon />
            <h2 className="text-xl font-sans font-semibold tracking-wide">APP SUITE</h2>
          </div>
          <div className="line"></div>
          <h2 className="text-2xl text-slate-800 text-center">Sign in to AppSuite</h2>
          <p className="text-zinc-500 text-center mt-4">Lightweight and precisely crafted software applications for custom workflows</p>

          <div className="mt-4 flex flex-col gap-5">
            
            <div className="flex justify-center items-center flex-col gap-3">
              {/* <LoadingButton loading={isLoading} className="!px-10 rounded-md shadow !py-2.5 text-sl bg-primary text-white">Sign In</LoadingButton> */}
              <button onClick={() => handleSignIn()} className="btn bg-black text-white flex items-center gap-1"><GoogleIcon /> Sign in with google</button>
              <button onClick={() => router.push("/app/balance-sheet/null-id")} className="btn !shadow-none !drop-shadow-none bg-white border border-zinc-300 text-zinc-500">Preview without sign in</button>
              <p className="text-zinc-400 text-center text-sm">Without signing in, all data would be lost when the page is refreshed</p>
            </div>
            <div className="line"></div>
            <p className="top-[3%] text-center right-0 text-zinc-600">Preview <Link href="/terms-of-service" className="underline text-blue">Terms of Service</Link> and <Link href="/privacy-policy" className="underline text-blue">Privacy Policy</Link></p>

          </div>
        </div>
      </div>
    </main>
  )
}

export default SignIn