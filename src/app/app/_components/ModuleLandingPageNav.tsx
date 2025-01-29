"use client";

import { useAppDispatch } from "@/redux/hooks/hooks";
import sharedSlice from "@/redux/slices/shared.slice";
import { LogoWhite } from "@/sharedComponents/CustomIcons";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface IProps {
  className?: string;
  moduleName?: string;
}

export default function ModuleLandingPageNav({ className, moduleName }: IProps) {
  const dispatch = useAppDispatch();
  const [hasFired, sethasFired] = useState<boolean>(false);

  const handleShowMobileSideNav = () => {
    dispatch(sharedSlice.actions.showMobileSidebar());
  };

  useEffect(() => {
    if (hasFired) handleShowMobileSideNav();
    sethasFired(false);
  }, [hasFired]);

  return (
    <div
      className={`!w-full z-[2] sticky top-0 pt-6  md:pt-8 lg:pt-12 px-3 ${className}`}
      
    >
      <motion.nav
      initial={{ width: 60 }} // Start with 0 width
      animate={{ width: "100%" }} // Animate to full width
      transition={{
        duration: 0.6, // Adjust the duration of the animation
        ease: "easeInOut", // Choose the easing function
        bounce: 0.5,
        stiffness: 50,
        bounceDamping: 0
      }}
      className="w-max mx-auto">
        <div className="flex max-w-screen-md mx-auto gap-10 justify-between items-center overflow-hidden px-12 w-full text-base text-blue-100 whitespace-nowrap bg-primary max-md:min-h-[55px] md:min-h-[64px] rounded-full max-md:px-5 max-md:max-w-full">
          <div className="text-lg text-slate-100 font-semibold line-in">
            <LogoWhite />
            {moduleName}
          </div>
          <button onClick={() => sethasFired(true)} className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="27"
              height="27"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M4 9q-.425 0-.712-.288T3 8V6q0-.425.288-.712T4 5h2q.425 0 .713.288T7 6v2q0 .425-.288.713T6 9zm5 0q-.425 0-.712-.288T8 8V6q0-.425.288-.712T9 5h11q.425 0 .713.288T21 6v2q0 .425-.288.713T20 9zm0 5q-.425 0-.712-.288T8 13v-2q0-.425.288-.712T9 10h11q.425 0 .713.288T21 11v2q0 .425-.288.713T20 14zm0 5q-.425 0-.712-.288T8 18v-2q0-.425.288-.712T9 15h11q.425 0 .713.288T21 16v2q0 .425-.288.713T20 19zm-5 0q-.425 0-.712-.288T3 18v-2q0-.425.288-.712T4 15h2q.425 0 .713.288T7 16v2q0 .425-.288.713T6 19zm0-5q-.425 0-.712-.288T3 13v-2q0-.425.288-.712T4 10h2q.425 0 .713.288T7 11v2q0 .425-.288.713T6 14z"
              />
            </svg>
          </button>
        </div>
      </motion.nav>
    </div>
  );
}

// "use client"

// import { useAppDispatch } from "@/redux/hooks/hooks"
// import sharedSlice from "@/redux/slices/shared.slice";
// import { LogoWhite } from "@/sharedComponents/CustomIcons";
// import { useEffect, useState } from "react";

// interface IProps {
//   className?: string
// }
// export default function ModuleLandingPageNav({ className }: IProps) {
//   const dispatch = useAppDispatch();
//   const [ hasFired, sethasFired ] = useState<boolean>(false)

//   const handleShowMobileSideNav = () => {
   
//     dispatch(sharedSlice.actions.showMobileSidebar())
//   }

//   useEffect(() => {
//     if (hasFired) handleShowMobileSideNav();
//     sethasFired(false)
//   }, [ hasFired, ])
  
//   return (
//     <div className={`!w-full z-[2] sticky top-0 pt-6 bg-white md:pt-8 lg:pt-12 px-3 ${className}`}>
//       <nav className="flex  max-w-screen-md mx-auto gap-10 justify-between items-center px-12 w-full text-base text-blue-100 whitespace-nowrap bg-primary max-md:min-h-[55px] md:min-h-[64px] rounded-[33px] max-md:px-5 max-md:max-w-full">
//         <div className="text-lg text-slate-100 font-semibold line-in"><LogoWhite />Finance Tracker</div>
//         <button onClick={() => sethasFired(true)} className="">
//           <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24"><path fill="currentColor" d="M4 9q-.425 0-.712-.288T3 8V6q0-.425.288-.712T4 5h2q.425 0 .713.288T7 6v2q0 .425-.288.713T6 9zm5 0q-.425 0-.712-.288T8 8V6q0-.425.288-.712T9 5h11q.425 0 .713.288T21 6v2q0 .425-.288.713T20 9zm0 5q-.425 0-.712-.288T8 13v-2q0-.425.288-.712T9 10h11q.425 0 .713.288T21 11v2q0 .425-.288.713T20 14zm0 5q-.425 0-.712-.288T8 18v-2q0-.425.288-.712T9 15h11q.425 0 .713.288T21 16v2q0 .425-.288.713T20 19zm-5 0q-.425 0-.712-.288T3 18v-2q0-.425.288-.712T4 15h2q.425 0 .713.288T7 16v2q0 .425-.288.713T6 19zm0-5q-.425 0-.712-.288T3 13v-2q0-.425.288-.712T4 10h2q.425 0 .713.288T7 11v2q0 .425-.288.713T6 14z"/></svg>
//         </button>
//       </nav>
//     </div>
//   )
// }