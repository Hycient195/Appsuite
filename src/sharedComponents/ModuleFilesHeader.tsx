import { ChangeEventHandler, useEffect, useState } from "react";
import { ChevronRight, HamburgerIcon, HouseIcon, ImportIcon, LogoWhite, PlusIcon } from "./CustomIcons";
import { useAppDispatch } from "@/redux/hooks/hooks";
import sharedSlice from "@/redux/slices/shared.slice";

interface IProps {
  moduleName: string;
  subtitle?: string;
  handleInitiateCreateFile: () => void;
  handleImport?:( ChangeEventHandler<HTMLInputElement>)
  handleInitiateImport?: () => void;
}

export default function ModuleFilesHeader({ moduleName, subtitle, handleInitiateCreateFile, handleImport, handleInitiateImport }: IProps) {
  const dispatch = useAppDispatch();

  const [ hasFired, sethasFired ] = useState<boolean>(false);
  
  const handleShowMobileSideNav = () => {
    dispatch(sharedSlice.actions.showMobileSidebar());
  };

  useEffect(() => {
    if (hasFired) handleShowMobileSideNav();
    sethasFired(false);
  }, [hasFired]);

  return (
    <section className="min-w-full w-f md:-mx-3 lg:mx-0 md:-mt-3 max-md:-mb-3 lg:mt-0 flex max-lg:place-self-stretch lg:justify-between place-self-cente spread-ou max-lg:bg-primary max-lg:p-3 px-2 gap-3 max-md:text-center max-md:justify-center flex-wrap">
      <div className="spread-out !gap-5 text-slate-100 lg:hidden py-2 w-full">
        <div className="text-xl font-helveti text-slate-100  line-in">
          <LogoWhite className="!size-7" />
          <span className="-mb-1 font-semibold">{moduleName}</span>
        </div>
        <button onClick={() => sethasFired(true)} className=""><HamburgerIcon className="!size-7" /></button>
      </div>

      <div className="left flex flex-col gap-1 bg-tes w-max">
        <div className="line-in md:gap-4 max-lg:hidden lg:gap-5 text-sm">
          <HouseIcon />
          <ChevronRight className="!size-4" />
          <span className="text-slate-500">{moduleName}</span>
        </div>
        
        <h1 className="text-slate-900 text-2xl lg:text-3xl font-semibold mt-3 max-lg:hidden">{moduleName}</h1>
        { subtitle && <p className="text-slate-500 max-md:text-sm max-lg:hidden">{subtitle}</p> }
      </div>
      <div className="right line-in gap-3 w-max bg-tes max-lg:ml-auto">
        { handleInitiateImport && <button onClick={handleInitiateImport} className="btn text-primary bg-white lg:border border-slate-200 0"><ImportIcon /> Import</button>}
        <button onClick={handleInitiateCreateFile} className="btn bg-primary max-lg:border max-lg:border-slate-400 text-white"><PlusIcon className="!size-5 !stroke-[2px]" /> Create New File</button>
      </div>
    </section>
  )
}