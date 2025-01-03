import { INavRoute } from "../_constants/navRoutes";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { UnknownAction } from "@reduxjs/toolkit";
import sharedSlice from "@/redux/slices/shared.slice";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

interface IProps {
  route: Array<INavRoute>,
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
  className?: string;
}

export const NavList = ({ route, setIsOpen, className }: IProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const highlightActive = (arg: string): boolean => pathname.includes(arg);

  const handleRouteClick = (item: INavRoute): void => {
    if (item.action) {
      dispatch(item.action() as unknown as UnknownAction);
    } else {
      dispatch(sharedSlice.actions.hideNotificationModal());
      router.push(`${item.href}${(item?.subRoutes && item?.subRoutes[0]?.href) ? `/${item?.subRoutes[0]?.href}` : ""}`);
    }
    if (setIsOpen) setIsOpen(false);
  }
  
  return (
    <ul className={`flex flex-col gap-y-2.5 mb-[2vh mt-2 ${className}`}>
      {
        route.map((item: INavRoute, index: number) => (
          <li key={index} className={`border-l- ${highlightActive(item.href) ? "border-l-[#FF4512]" : "border-l-white"}`}>
            {/* <Link to={`${item.href}${(item?.subRoutes && item?.subRoutes[0]?.href) ? `/${item?.subRoutes[0]?.href}` : ""}`} onClick={() => {setIsOpen && setIsOpen(false)}} className={`flex rounded-md flex-row py-2.5 items-center gap-2  hover:text-customRed-600  hover:bg-customRed-50 ${highlightActive(item.href) ? "text-zinc-700" : "text-zinc-500/70"}`}> */}
            <button onClick={() => handleRouteClick(item)} className={`flex rounded-md w-full flex-row py-2.5 px-3 items-center gap-2  hover:text-customRed-600  hover:bg-customRed-50 ${highlightActive(item.href) ? "text-white bg-slate-700" : "text-slate-400"}`}>
              <span className={`flex relative rounded-md items-center flex-row gap-2.5 duration-700 font-medium`}>
                {/* <div className={`${highlightActive(item.href) && "bg-primary border"} h-5 w-1.5 animate-fade-in absolute -left-3 rounded-lg`}></div> */}
                {item.icon}<p className="text-base font-medium">{item.text}</p>
              </span>
              </button>
          </li>
        ))
      }
    </ul>
  )
}