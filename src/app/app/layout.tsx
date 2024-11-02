"use client"

import { NavList } from "./_components/NavList";
import DashboardNav from "./_components/DashboardNav";
import { commonRoutes, navRoutes, signOutMobileRoute } from "./_constants/navRoutes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { useEffect } from "react";
import { parseCookies } from "nookies";
import authSlice from "@/redux/slices/auth.slice";
import sharedSlice from "@/redux/slices/shared.slice";
import NotificationModal from "./_components/NotificationModal";
import { ILoggedInUser } from "@/types/shared.types";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
// import WithAuth from "@/HOCs/WithAuth";

interface IProps {
  children: JSX.Element|React.ReactNode
}

function AppLayout({ children }: IProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const loggInUser: ILoggedInUser = parseCookies()?.asUserProfile ? JSON.parse(parseCookies()?.asUserProfile) : {};

  const isSidebarHidden = useAppSelector((rootState) => rootState?.sharedSlice?.sidebar?.isHidden);
  const isMobileSidebarHidden = useAppSelector((rootState) => rootState?.sharedSlice?.mobileSidebar?.isHidden);
  const isNotificationModalHidden = useAppSelector((rootState) => rootState?.sharedSlice?.notificationModal?.isHidden);

  useEffect(() => {
    const cookies = parseCookies();
    if (cookies.pftoken && cookies.asuser){
      dispatch(authSlice.actions.setCredentials({ token: cookies.pftoken, user: JSON.parse(cookies.asuser) }));
    }
  }, [ pathname, dispatch ]);

  const hideSidebarOnMobile = (): void => {
    dispatch(sharedSlice.actions.hideMobileSidebar());
  }

  const navigateToProfile = (): void => {
    router.push("/settings/user-profile");
  };

  return (
    <div onClick={hideSidebarOnMobile} className={`grid fixed w-full grid-cols-1 ${!isSidebarHidden && "lg:grid-cols-[max-content_1fr]"} font-lexend`}>
      <div className={`${isMobileSidebarHidden && "hidden"} slide-wrapper lg:hidden h-[100dvh] w-screen left-0 bg-gray-700/30 backdrop-blur-sm absolute z-[5] animate-screen-slide-in-right`} />
      {
        !isSidebarHidden
        && (
          <aside className={`${isMobileSidebarHidden ? "hidden" : "flex "} max-lg:absolute animate-slide-in-right max-lg:z-[5] max-lg:h-full max-lg:w-full max-lg:left-0 max-lg:top-0 bg-white lg:flex flex-col px-5 lg:px-6  max-w-[270px] w-[20vw] min-w-[280px]  h-[100dvh] border border-r-zinc-200`}>
            
            <Link href="/sign-in" className="py-4 -translate-x-2 flex flex-row items-center gap-x-1">
              <svg 
                width="30" 
                height="30" 
                viewBox="0 0 100 100" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="black"
                className=" animate-spin [animation-duration:4s]"
                >

                <circle cx="50" cy="50" r="12" fill="black" />

                <path d="M50,10 A40,40 0 0,1 90,50" fill="none" stroke="black" strokeWidth="6" />
                <path d="M90,50 A40,40 0 0,1 50,90" fill="none" stroke="black" strokeWidth="6" />
                <path d="M50,90 A40,40 0 0,1 10,50" fill="none" stroke="black" strokeWidth="6" />
                <path d="M10,50 A40,40 0 0,1 50,10" fill="none" stroke="black" strokeWidth="6" />

                <circle cx="50" cy="10" r="6" fill="black" />
                <circle cx="90" cy="50" r="6" fill="black" />
                <circle cx="50" cy="90" r="6" fill="black" />
                <circle cx="10" cy="50" r="6" fill="black" />
              </svg>
              <h2 className="text-xl font-sans font-semibold tracking-wide">APP SUITE</h2>
            </Link>
            <h4 className="text-neutral-400 text-xs mt-[2vh]">PRIMARY</h4>
            <NavList route={navRoutes.map(x => { return { ...x, href: `/app/${x.href}`}})} />
            <h4 className="text-neutral-400 text-xs mt-[2vh]">COMMON</h4>
            <NavList route={commonRoutes} />
            <NavList className="md:hidden" route={signOutMobileRoute} />
            
            

            <button onClick={navigateToProfile} className="grid grid-cols-[1fr_2.8fr] text-left mt-auto mb-5 lg:mb-6 gap-2 relative">
              <figure className="bg-gray-200 w-full h-auto aspect-square rounded-lg overflow-hidden relative outline outline-1 outline-zinc-300 outline-offset-1">
                { loggInUser?.picture && <Image src={loggInUser?.picture} fill className="object-cover object-center" alt={`${loggInUser?.given_name} ${loggInUser?.family_name}`} /> }
              </figure>
              <div className="flex flex-col gap-1 justify-evenly h-full">
                <h4 className="font-medium text-zinc-700">{loggInUser?.name}</h4>
                <p className="text-zinc-400 text-xs leading-[1.7ch] font-light">{loggInUser?.email}</p>
              </div>
              {/* <button className="absolute top-0 right-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              </button> */}
            </button>
          </aside>
        )
      }
      
      <div className="w-full relative bg-gray-100 !overflow-scroll min-h-[100dvh] max-h-[100dvh] grid grid-rows-[max-content_1fr]">
        <DashboardNav />
        <div className="md:has-[main]:p-3 xl:has-[main]:p-4 [&>*]:max-w-[3000px] [&>*]:mx-auto">
          {children}
        </div>
        { !isNotificationModalHidden && <div onClick={() => dispatch(sharedSlice.actions.hideNotificationModal())} className="animate-fade-in z-[4] bg-black/20 cursor-pointer backdrop-blur-sm absolute top-0 left-0 h-full w-full p-3 md:p-4 lg:p-5">
          <NotificationModal />
        </div> }
      </div>
    </div>
  ) 
}

AppLayout.displayName = "AppLayout";
export default AppLayout;
// export default WithAuth(AppLayout)