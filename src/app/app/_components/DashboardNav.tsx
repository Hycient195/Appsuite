"use client"

import { memo, useEffect, MouseEvent } from "react";
import { Badge, MenuItem, Select } from "@mui/material";
import { ISubRoute, navRoutes } from "../_constants/navRoutes";
import { useAppSelector } from "@/redux/hooks/hooks";
import { destroyCookie } from "nookies";
import authSlice from "@/redux/slices/auth.slice";
import { useDispatch } from "react-redux";
import slices from "@/redux/slices";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { googleLogout } from "@react-oauth/google";
// import { ILoggedInUser } from "@/types/shared.types";

const DashboardNav = memo(() => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  // const loggedInUser: ILoggedInUser = parseCookies()?.asUserProfile ? JSON.parse(parseCookies()?.asUserProfile) : {};

  const rootPath = "/" + pathname?.split(/\//g)[1] + "/" +  pathname?.split(/\//g)[2];

  const navContent = useAppSelector((rootState) => rootState?.sharedSlice.navContent);

  useEffect(() => {
    dispatch(slices.sharedSlice.actions.hideMobileSidebar());
  }, [ pathname, dispatch ]);

  const handleNavigateToSubSection = (arg: string): void => {
    // router.push(`${rootPath}/${arg}`);
    router.push(arg);
  };

  const showNotifications = (): void => {
    dispatch(slices.sharedSlice.actions.showNotificationModal());
  };

  
  const toggleSidebarOnMobile = (e: MouseEvent): void => {
    e.stopPropagation();
    dispatch(slices.sharedSlice.actions.toggleMobileSidebar());
  }

  const handleSignOut = (): void => {
    window.location.assign("/sign-in");
    authSlice.actions.clearCredentials();
    destroyCookie({ }, "asAccessToken", { path: "/"});
    destroyCookie({ }, "asRefreshToken", { path: "/"});
    destroyCookie({ }, "asUserProfile", { path: "/"});
    googleLogout();
  };

  console.log(rootPath)

  return (
    // {/* A React Portal and also placeholder element Used to Render content outside DOM Heirachy */}
    <nav id="navbar-portal" className="w-full z-[4] sticky top-0 grid grid-cols-[max-content_1fr_max-content_max-content] bg-white justify-betwee gap-1.5 lg:gap-3 px-3 md:px-4 xl:px-6 shadow items-center">
      <Link href="/sign-up" className="py-4 -translate-x- lg:hidden flex flex-row items-center gap-x-1">
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
        <h2 className="text-xl max-md:hidden font-sans font-semibold tracking-wide">APP SUITE</h2>
      </Link>

      {
        !navContent.isHidden
        && (
          <>
            <div className="w-ful no-scrollbar max-w-[calc(100vw-160px)] md:max-w-[calc(100vw-170px)] lg:max-w-[calc(100vw-(clamp(250px,20vw,270px)+170px))] overflow-x-auto">
              {
                navRoutes.find(x => x.href === rootPath)?.subRoutes &&
                (
                  <div className="flex flex-row w-max items-center gap-3 md:gap-4 lg:gap-5">
                    {
                      navRoutes.find(x => x.href === rootPath)?.subRoutes?.map((subRoute: ISubRoute) => (
                        <button onClick={() => handleNavigateToSubSection(subRoute.href)} key={subRoute.href} className={`px- py-4 md:py-5 relative flex flex-row font-medium text-black/80 items-center gap-1  ${(pathname?.split(/\//g)[3] === subRoute?.href?.split(/\//g)[0]) ? "border-l-black" : "border-l-white"}`}>
                          <div className={`${(pathname?.split(/\//g)[3] === subRoute?.href?.split(/\//g)[0]) && "bg-black"} h-3.5 w-1 rounded-full`}></div>
                          {subRoute?.icon && subRoute?.icon}
                          {subRoute.text}
                        </button>
                      ))
                    }
                  </div>
                )
              }
            </div>
          </>
        )
      }
      {/* A React Portal and also placeholder element Used to Render content outside DOM Heirachy */}
      {/* <div  className="placeholder-element bg- w-ful bg-yellow-500"></div> */}

      {/* <div className="placeholder-element invisible py-4 md:py-5">m</div> */}

      {/* Mobile menu toggle */}

      
      

      <ul id="dashboardNavPortal" className=" flex flex-row gap-2 order- items-center w-max ml-auto my-2">
        <li id="saveIconPosition" className="">
          {/* Save Icon is inserted using react portal teleportation */}
        </li>
        <li className="bg-zinc-100 max-md:hidden shadow-sm p-1 rounded-full flex flex-row items-center">
          <Badge className="m-l-2" badgeContent={0} color="error">
            <button onClick={showNotifications} className="h-[40px] w-[40px] rounded-full  flex items-center justify-center border bg-white border-slate-400/60 shado overflow-hidden">
              <svg width="15" height="19" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.8625 9.99625C11.5156 9.39875 11 7.70813 11 5.5C11 4.17392 10.4732 2.90215 9.53554 1.96447C8.59786 1.02678 7.32609 0.5 6.00001 0.5C4.67393 0.5 3.40216 1.02678 2.46447 1.96447C1.52679 2.90215 1.00001 4.17392 1.00001 5.5C1.00001 7.70875 0.483758 9.39875 0.136883 9.99625C0.0483021 10.1482 0.00134198 10.3207 0.000738316 10.4966C0.000134651 10.6724 0.0459089 10.8453 0.133445 10.9978C0.220981 11.1503 0.347183 11.277 0.499324 11.3652C0.651465 11.4534 0.824165 11.4999 1.00001 11.5H3.55063C3.66599 12.0645 3.97277 12.5718 4.41909 12.9361C4.86541 13.3004 5.42387 13.4994 6.00001 13.4994C6.57615 13.4994 7.13461 13.3004 7.58092 12.9361C8.02724 12.5718 8.33403 12.0645 8.44938 11.5H11C11.1758 11.4998 11.3484 11.4532 11.5005 11.365C11.6525 11.2768 11.7786 11.15 11.8661 10.9975C11.9536 10.845 11.9993 10.6722 11.9987 10.4964C11.998 10.3206 11.9511 10.1481 11.8625 9.99625ZM6.00001 12.5C5.6899 12.4999 5.38744 12.4037 5.13426 12.2246C4.88108 12.0455 4.68963 11.7924 4.58626 11.5H7.41376C7.31039 11.7924 7.11894 12.0455 6.86576 12.2246C6.61258 12.4037 6.31012 12.4999 6.00001 12.5ZM1.00001 10.5C1.48126 9.6725 2.00001 7.755 2.00001 5.5C2.00001 4.43913 2.42144 3.42172 3.17158 2.67157C3.92173 1.92143 4.93914 1.5 6.00001 1.5C7.06087 1.5 8.07829 1.92143 8.82843 2.67157C9.57858 3.42172 10 4.43913 10 5.5C10 7.75312 10.5175 9.67062 11 10.5H1.00001Z" fill="#333132"/>
              </svg>
            </button>
          </Badge>

          <Select
            // displayEmpty
            itemID="location"
            defaultValue={0}
            value={0}
            className="[&>*]:!py-0 max-md:!hidden [&>*]:!px-0 [&>*]:!border-none  pr-2 font-semibold text-md text-zinc-600 min-w-[50px]"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Age"
          >
            {/* <MenuItem className="!p-0 !hidden" value={0}>{loggedInUser?.fullName}</MenuItem> */}
            <MenuItem onClick={() => router.push("/settings/user-profile")} className="font-semibold text-zinc-600">Settings</MenuItem>
            <MenuItem className="font-semibold text-zinc-600 !p-0"><a href="mailto:onyeukwuhycient@gmail.com" className="!px-4 !py-2 w-full">Contact Support</a></MenuItem>
            <MenuItem onClick={handleSignOut} className="font-semibold text-zinc-600">Sign Out</MenuItem>
          </Select>
        </li>
      </ul>

      <button onClick={toggleSidebarOnMobile} className="block lg:hidden text-primary border border-primary/60 px-2 py-0.5 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      {/* <MobileNavMenuModal isOpen={isNavOpen} setIsOpen={setIsNavOpen} /> */}
    </nav>
  )
})

DashboardNav.displayName = "DashboardNav";
export default DashboardNav;