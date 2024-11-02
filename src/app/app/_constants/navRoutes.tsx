import authSlice from "@/redux/slices/auth.slice";
import sharedSlice from "@/redux/slices/shared.slice";
import { googleLogout } from "@react-oauth/google";
import { destroyCookie } from "nookies";

export interface ISubRoute {
  text: string;
  href: string;
  icon?: JSX.Element
}

export interface INavRoute {
  text: string;
  href: string;
  icon: JSX.Element;
  action?: () => void;
  subRoutes?: ISubRoute[];
}

export type TUserType = ("LANDLORD"|"PROPERTY_MANAGER"|"TENANT")

const handleSignOut = (): void => {
  window.location.assign("/sign-in");
  authSlice.actions.clearCredentials();
  destroyCookie({ }, "asAccessToken", { path: "/"});
  destroyCookie({ }, "asRefreshToken", { path: "/"});
  destroyCookie({ }, "asUserProfile", { path: "/"});
  googleLogout();
};

export const signOutMobileRoute: INavRoute[] = [
  {
    text: "Sign Out",
    href: "/sign-out",
    action: handleSignOut,
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
    </svg>  
  }
]

export const commonRoutes: INavRoute[] = [
  {
    text: "Notifications",
    href: "/notifications",
    action: sharedSlice.actions.toggleNotificationModal,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="19px"
        width="19px"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8a6 6 0 0 0-12 0v5.4l-2 2.1v1.5h16v-1.5l-2-2.1V8z" />
        <path d="M13 20a1.6 1.6 0 0 1-3 0" />
      </svg>
    ),
    
  },
  {
    text: "Settings",
    href: "/settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.26362 3.06937H6.54321L6.74091 2.87166L8.89345 0.719124C8.92172 0.690871 8.96004 0.675 9 0.675C9.03996 0.675 9.07829 0.690872 9.10655 0.719124L11.2591 2.87166L11.4568 3.06937H11.7364H14.7799C14.8199 3.06937 14.8582 3.08524 14.8865 3.11351L15.3638 2.63621L14.8865 3.11351C14.9148 3.14177 14.9306 3.1801 14.9306 3.22007V6.26362V6.54321L15.1283 6.74091L17.2809 8.89345C17.2809 8.89348 17.2809 8.8935 17.2809 8.89353C17.3092 8.92178 17.325 8.96007 17.325 9C17.325 9.03993 17.3092 9.07823 17.2809 9.10648C17.2809 9.1065 17.2809 9.10652 17.2809 9.10655L15.1283 11.2591L14.9306 11.4568V11.7364V14.7799C14.9306 14.8199 14.9148 14.8582 14.8865 14.8865L15.3638 15.3638L14.8865 14.8865C14.8582 14.9148 14.8199 14.9306 14.7799 14.9306H11.7364H11.4568L11.2591 15.1283L9.10655 17.2809C9.10652 17.2809 9.1065 17.2809 9.10648 17.2809C9.07823 17.3092 9.03993 17.325 9 17.325C8.96007 17.325 8.92178 17.3092 8.89353 17.2809C8.8935 17.2809 8.89348 17.2809 8.89345 17.2809L6.74091 15.1283L6.54321 14.9306H6.26362H3.22007C3.1801 14.9306 3.14177 14.9148 3.11351 14.8865L2.63621 15.3638L3.11351 14.8865C3.08524 14.8582 3.06937 14.8199 3.06937 14.7799V11.7364V11.4568L2.87166 11.2591L0.719124 9.10655C0.690872 9.07829 0.675 9.03996 0.675 9C0.675 8.96004 0.690871 8.92172 0.719124 8.89345L2.87166 6.74091L3.06937 6.54321V6.26362V3.22007C3.06937 3.1801 3.08524 3.14177 3.11351 3.11351C3.14177 3.08524 3.1801 3.06937 3.22007 3.06937H6.26362ZM9 12.1521C9.83599 12.1521 10.6377 11.82 11.2289 11.2289C11.82 10.6377 12.1521 9.83599 12.1521 9C12.1521 8.16401 11.82 7.36226 11.2289 6.77112C10.6377 6.17998 9.83599 5.84789 9 5.84789C8.16401 5.84789 7.36226 6.17998 6.77112 6.77112C6.17998 7.36226 5.84789 8.16401 5.84789 9C5.84789 9.83599 6.17998 10.6377 6.77112 11.2289C7.36226 11.82 8.16401 12.1521 9 12.1521Z" stroke="#787878" strokeWidth="1.35"/>
    </svg>  
    ),
  },
];

export const navRoutes: INavRoute[] = [
  {
    text: "Balance Sheet",
    href: "balance-sheet",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="19px"
        width="19px"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    subRoutes: [
      {
        text: "Create Sheet",
        href: "create",
      },
      {
        text: "View Sheets",
        href: "files",
      },
    ]
  }
]