"use client"

import { NavList } from "./_components/NavList";
import DashboardNav from "./_components/DashboardNav";
import { commonRoutes, navRoutes, signOutMobileRoute } from "./_constants/navRoutes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { useEffect, useState } from "react";
import { destroyCookie, parseCookies } from "nookies";
import authSlice from "@/redux/slices/auth.slice";
import sharedSlice from "@/redux/slices/shared.slice";
import NotificationModal from "./_components/NotificationModal";
import { ILoggedInUser } from "@/types/shared.types";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CloseIcon, LogoAndTextWhite, LogoWhite } from "@/sharedComponents/CustomIcons";
import { googleLogout } from "@react-oauth/google";
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
  const isHalfVisible = useAppSelector((rootState) => rootState?.sharedSlice.sidebar.isHalfVisible);

  const [ routesState, setRoutesState ] = useState(navRoutes);

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

  // const handleSignOut = (): void => {
  //   window.location.assign("/sign-in");
  //   authSlice.actions.clearCredentials();
  //   destroyCookie({ }, "asAccessToken", { path: "/"});
  //   destroyCookie({ }, "asRefreshToken", { path: "/"});
  //   destroyCookie({ }, "asUserProfile", { path: "/"});
  //   googleLogout();
  // };

  const handleTogglePeekSidebar = () => {
    dispatch(sharedSlice.actions.toggleSidebarPeek());
  }
  const hideMobildSideBar = () => {
    dispatch(sharedSlice.actions.hideMobileSidebar());
  }

  console.log(isMobileSidebarHidden)
  return (
    <div onClick={hideSidebarOnMobile} className={`grid bg-white fixed w-full grid-cols-1 ${!isSidebarHidden && "lg:grid-cols-[max-content_1fr]"} font-lexend`}>
      <div className={`${isMobileSidebarHidden && "hidden"} slide-wrapper lg:hidden h-[100dvh] w-screen left-0 bg-gray-700/30 backdrop-blur-sm absolute z-[5] animate-screen-slide-in-right`} />
      {
        !isSidebarHidden
        && (
          <aside className={`${isMobileSidebarHidden ? "hidden" : "flex "} ${isHalfVisible ? "w-20" : "w-[clamp(270px,20vw,280px)]"} max-lg:absolute bg-primary animate-slide-in-right max-lg:z-[5] max-lg:h-full max-lg:w-full max-lg:left-0 max-lg:top-0 text-white lg:flex flex-col px-4 lg:px-4 border-r border-r-slate-300 h-[100dvh] `}>
            
            
              <div className="spread-out w-full mb-3 lg:mb-6 mt-2 lg:mt-3">
                <Link href="/sign-in" className="py-4 flex flex-row items-centerm justify-cente gap-x-1  px-2 ">
                  { isHalfVisible ? <LogoWhite className="aspect-square w-auto h-8" /> : <LogoAndTextWhite className="aspect-[4/1] -translate-x-2 w-auto h-8" /> }
                </Link>
                <button onClick={hideMobildSideBar} className="p-1 text-slate-100 lg:hidden"><CloseIcon /></button>
              </div>
           
            {/* <h4 className="text-neutral-400 text-xs mt-[2vh]">PRIMARY</h4> */}
            {/* <NavList route={routesState.map(x => { return { ...x, href: `/app/${x.href}`}})} setRoutesState={setRoutesState} /> */}
            <NavList route={routesState} setRoutesState={setRoutesState} />
            {/* <h4 className="text-neutral-400 text-xs mt-[2vh]">COMMON</h4> */}
            <NavList route={commonRoutes} className="mt-auto" />
            <NavList className="md:hidden" route={signOutMobileRoute} />
            
            <div className="h-px bg-slate-500 w-full !my-4" />

            <div className={`grid ${isHalfVisible ? "grid-cols-[max-content] items-center justify-center " : "grid-cols-[max-content_1fr_max-content]"} text-left  mb-5 lg:mb-6 gap-2 lg:gap-4 relative`}>
              <figure onClick={navigateToProfile} className="bg-gray-200 w-auto h-10 aspect-square rounded-full overflow-hidden relative outline outline-1 outline-slate-400 outline-offset-1">
                { loggInUser?.picture && <Image src={loggInUser?.picture} fill className="object-cover object-center" alt={`${loggInUser?.given_name} ${loggInUser?.family_name}`} /> }
              </figure>
              {
                !isHalfVisible
                && <div className="flex flex-col gap-1 justify-evenly h-full">
                      <h4 className="font-medium text-slate-200">{loggInUser?.name}</h4>
                      <p className="text-slate-300 text-xs leading-[1.7ch] font-light">{loggInUser?.email}</p>
                  </div>
              }
              <button onClick={handleTogglePeekSidebar} className="flex justify-center max-lg:hidden">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5M13.3333 14.1667L17.5 10M17.5 10L13.3333 5.83333M17.5 10H7.5" stroke="#98A2B3" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </aside>
        )
      }
      
      <div className="w-full relative bg-gray-100 !overflow-scroll min-h-[100dvh] max-h-[100dvh] ">
        {/* <DashboardNav /> */}
        <div className="md:has-[main]:p-3 xl:has-[main]:p-4 [&>*]:max-w-[3000px] [&>*]:mx-auto h-full">
          {children}
        </div>
        { !isNotificationModalHidden && <div onClick={() => dispatch(sharedSlice.actions.hideNotificationModal())} className="animate-fade-in w-[calc(100vw-clamp(270px,20vw,280px))] z-[10] bg-black/20 cursor-pointer backdrop-blur-sm fixed top-0 right-0 h-full p-3 md:p-4 lg:p-5">
          <NotificationModal />
        </div> }
        {/* <MobileNav isMobileNavOpen={isMobileNavOpen} setIsMobileNavOpen={setIsMobileNavOpen} /> */}
      </div>
    </div>
  ) 
}

AppLayout.displayName = "AppLayout";
export default AppLayout;
// export default WithAuth(AppLayout)