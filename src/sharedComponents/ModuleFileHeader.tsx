import { usePathname } from "next/navigation";
import { ChevronRight, HamburgerIcon, HouseIcon, ImportIcon, LogoAndTextWhite, PlusIcon, RedoIcon, UndoIcon } from "./CustomIcons";
import { ChangeEventHandler, MouseEventHandler, useEffect, useState } from "react";
import { ResponsiveTextInput } from "./FormInputs";
import sharedSlice from "@/redux/slices/shared.slice";
import { useAppDispatch } from "@/redux/hooks/hooks";

interface IProps {
  fileName: string;
  // setFileName: React.Dispatch<React.SetStateAction<string>>
  setFileName: ChangeEventHandler<HTMLTextAreaElement>
  subtitle: string;
  handleInitiateCreateFile: () => void;
  className?: string;
  handleImport?: ChangeEventHandler<HTMLInputElement>;
  initiateImport?: MouseEventHandler
  handleExport?: () => void;
  redo?: () => void;
  undo?: () => void;
  canRedo?: boolean
  canUndo?: boolean
}

export default function ModuleFileHeader({ fileName, setFileName, subtitle, handleImport, initiateImport, handleInitiateCreateFile, className, ...props }: IProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

    const [hasFired, sethasFired] = useState<boolean>(false);
  

  const handleShowMobileSideNav = () => {
    dispatch(sharedSlice.actions.showMobileSidebar());
  };

  useEffect(() => {
    if (hasFired) handleShowMobileSideNav();
    sethasFired(false);
  }, [hasFired]);

  // const handleShowMobileSidebar = () => {
  //   dispatch(sharedSlice.actions.showSidebar());
  // }

  return (
    <section className="sticky -top-0 md:top- lg:-top-8 flex flex-col z-[3]">
      <div className="p-3 bg-primary lg:hidden flex flex-col gap-4">
        <div className="spread-out !gap-5 text-slate-100">
          <LogoAndTextWhite className="-translate-x-2" />
          <button onClick={() => sethasFired(true)} className=""><HamburgerIcon className="!size-7" /></button>
        </div>
        <div className="line-in md:gap-4 text-sm lg:hidden">
          <HouseIcon />
          <ChevronRight className="!size-4 text-slate-50" />
          <span className="text-slate-500 capitalize">{pathname?.split("/")?.[2]?.replace(/-/ig, " ")}</span>
          <ChevronRight className="!size-4 text-slate-50" />
          <span className="text-slate-100 capitalize">{fileName}</span>
        </div>
      </div>
      <div className={`w-full  bg-slate-100 max-w-[1100px] mx-auto spread-out border-b border-b-slate-200 gap-1 md:gap-3 max-md:text-center !items-end flex-wrap py-3 px-2 lg:px-3 ${className}`}>
        <div className="left flex flex-col max-md:items-cente gap-1">
          <div className="line-in md:gap-4 text-sm max-md:hidden">
            <HouseIcon />
            <ChevronRight className="!size-4" />
            <span className="text-slate-500 capitalize">{pathname?.split("/")?.[2]?.replace(/-/ig, " ")}</span>
            <ChevronRight className="!size-4" />
            <span className="text-slate-500 capitalize">{fileName}</span>
          </div>
          <ResponsiveTextInput className="text-primary text-2xl font-semibold lg:mt-2 focus:ring-0 focus:outline-none" value={fileName} onChange={setFileName} />
          {/* <h1 className="text-primary text-2xl font-semibold mt-3 max-md:hidden">{fileName}</h1> */}
          <div className="line-in text-slate-700 lg:mt-2 !gap-4 text-sm">
            <button onClick={props.undo} disabled={!props.canUndo} className={`line-in disabled:text-slate-400`}><UndoIcon className="!size-5" /> Undo</button>
            <button onClick={props.redo} disabled={!props.canRedo} className="line-in disabled:text-slate-400"><RedoIcon className="!size-5" /> Redo</button>
            { handleImport && <label htmlFor="import-input" className="line-in cursor-pointer"><ImportIcon className="!size-4" /> <input onChange={handleImport} id="import-input" className="hidden" type="file" /> Import</label> }
            { initiateImport && <button onClick={initiateImport} className="line-in cursor-pointer"><ImportIcon className="!size-4" /> Import</button> }
            <button onClick={props.handleExport} className="line-in"><ImportIcon className="!size-4" /> Export</button>
          </div>
          {/* <p className="text-slate-500 max-md:text-sm">{subtitle}</p> */}
        </div>
        <div className="right line-in gap-3">
          {/* <button onClick={handleImport} className="btn text-primary bg-white border border-slate-200 0"><ImportIcon /> Import</button> */}
          <div className="flex flex-col gap-2 flex-wrap items-center md:items-end">
            <button onClick={handleInitiateCreateFile} className="btn w-max bg-primary text-white max-md:hidden"><PlusIcon className="!size-5 !stroke-[2px]" /> Create New Sheet</button>
            <p className="text-slate-400 text-sm">Last sync: <span className="text-slate-600">3rd December 2024, 15:00:00</span></p>
          </div>
        </div>
      </div>
    </section>
    
  )
}