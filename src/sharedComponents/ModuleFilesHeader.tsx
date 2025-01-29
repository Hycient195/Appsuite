import { ChangeEventHandler } from "react";
import { ChevronRight, HouseIcon, ImportIcon, PlusIcon } from "./CustomIcons";

interface IProps {
  moduleName: string;
  subtitle?: string;
  handleInitiateCreateFile: () => void;
  handleImport?:( ChangeEventHandler<HTMLInputElement>)
  handleInitiateImport?: () => void;
}

export default function ModuleFilesHeader({ moduleName, subtitle, handleInitiateCreateFile, handleImport, handleInitiateImport }: IProps) {

  return (
    <section className="w-full spread-out gap-3 max-md:text-center max-md:justify-center flex-wrap">
      <div className="left flex flex-col gap-1">
        <div className="line-in md:gap-4 max-md:hidden lg:gap-5 text-sm">
          <HouseIcon />
          <ChevronRight className="!size-4" />
          <span className="text-slate-500">{moduleName}</span>
        </div>
        
        <h1 className="text-slate-900 text-2xl lg:text-3xl font-semibold mt-3 max-md:hidden">{moduleName}</h1>
        { subtitle && <p className="text-slate-500 max-md:text-sm">{subtitle}</p> }
      </div>
      <div className="right line-in gap-3">
        { handleInitiateImport && <button onClick={handleInitiateImport} className="btn text-primary bg-white border border-slate-200 0"><ImportIcon /> Import</button>}
        <button onClick={handleInitiateCreateFile} className="btn bg-primary text-white"><PlusIcon className="!size-5 !stroke-[2px]" /> Create New File</button>
      </div>
    </section>
  )
}