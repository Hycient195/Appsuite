import { INavRoute } from "../_constants/navRoutes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { UnknownAction } from "@reduxjs/toolkit";
import sharedSlice from "@/redux/slices/shared.slice";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Reorder, useDragControls } from "motion/react";

interface IProps {
  route: Array<INavRoute>,
  setRoutesState?: React.Dispatch<React.SetStateAction<Array<INavRoute>>>
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
  className?: string;
  reorderable?: boolean
}

export const NavList = ({ route, setIsOpen, className, setRoutesState, reorderable }: IProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const highlightActive = (arg: string): boolean => pathname.includes(arg);


  const isHalfVisible = useAppSelector((rootState) => rootState?.sharedSlice.sidebar.isHalfVisible);
  

  const handleRouteClick = (item: INavRoute): void => {
    if (item.action) {
      dispatch(item.action() as unknown as UnknownAction);
    } else {
      dispatch(sharedSlice.actions.hideNotificationModal());
      router.push(item.href);
      // router.push(`${item.href}${(item?.subRoutes && item?.subRoutes[0]?.href) ? `/${item?.subRoutes[0]?.href}` : ""}`); // Don't delete this line of code
    }
    if (setIsOpen) setIsOpen(false);
  }

  return (
    <Reorder.Group axis="y" values={route} onReorder={setRoutesState ? setRoutesState : () => null} className={`flex flex-col gap-y-1.5 md:gap-y-2 lg:gap-y-2.5 mb-[2vh mt-2 ${className}`}>
      {
        route.map((item: INavRoute, index: number) => (
          <Reorder.Item key={item.href} value={item} className={`border-l- ${highlightActive(item.href) ? "border-l-[#FF4512]" : "border-l-white"}`}>
            {/* <Link to={`${item.href}${(item?.subRoutes && item?.subRoutes[0]?.href) ? `/${item?.subRoutes[0]?.href}` : ""}`} onClick={() => {setIsOpen && setIsOpen(false)}} className={`flex rounded-md flex-row py-2.5 items-center gap-2  hover:text-customRed-600  hover:bg-customRed-50 ${highlightActive(item.href) ? "text-zinc-700" : "text-zinc-500/70"}`}> */}
            <button onClick={() => handleRouteClick(item)} title={item.text} className={`flex rounded-md w-full flex-row py-1.5 pl-3 items-center justify-between gap-2  hover:text-customRed-600  hover:bg-customRed-50 ${highlightActive(item.href) ? "text-white bg-slate-700" : "text-slate-400 bg-primary"}`}>
              <span className={`flex relative rounded-md items-center flex-row gap-2.5 duration-700 font-medium py-1.5`}>
                {/* <div className={`${highlightActive(item.href) && "bg-primary border"} h-5 w-1.5 animate-fade-in absolute -left-3 rounded-lg`}></div> */}
                {item.icon}
              </span>
              {
                !isHalfVisible
                 && (
                  <>
                    <p className="text-base font-medium mr-auto">{item.text}</p>
                    { reorderable &&
                      <div onClick={(e) => e.stopPropagation()}  className="reorder-handle p-2 text-slate-600 hover:text-slate-300 duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><circle cx="5.5" cy="2.5" r=".75"/><circle cx="5.5" cy="8" r=".75"/><circle cx="5.5" cy="13.5" r=".75"/><circle cx="10.496" cy="2.5" r=".75"/><circle cx="10.496" cy="8" r=".75"/><circle cx="10.496" cy="13.5" r=".75"/></g></svg>
                      </div>
                    }
                  </>
                 )
              }
            </button>
          </Reorder.Item>
        ))
      }
    </Reorder.Group>
  )
}