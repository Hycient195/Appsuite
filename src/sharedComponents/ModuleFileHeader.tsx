import { usePathname } from "next/navigation";
import { ChevronRight, ExportIcon, HamburgerIcon, HouseIcon, ImportIcon, LogoAndTextWhite, LogoWhite, PlusIcon, RedoIcon, UndoIcon } from "./CustomIcons";
import { ChangeEventHandler, MouseEventHandler, useEffect, useState } from "react";
import { ResponsiveTextInput } from "./FormInputs";
import sharedSlice from "@/redux/slices/shared.slice";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { LinearProgress } from "@mui/material";
import { format } from "date-fns";
import api from "@/redux/api";
import { TMimeTypes } from "@/types/shared.types";
import { Toast } from "./utilities/Toast";
import useAutoSave from "@/sharedHooks/useAutoSave";

interface IProps {
  moduleName: string;
  fileName: string;
  isSaving: boolean;
  isSavingSuccess: boolean;
  isSavingError: boolean;
  // setFileName: React.Dispatch<React.SetStateAction<string>>
  setFileName: ChangeEventHandler<HTMLTextAreaElement|HTMLInputElement>
  subtitle: string;
  handleInitiateCreateFile: () => void;
  mimeType?: TMimeTypes;
  folderId?: string;
  className?: string;
  handleImport?: ChangeEventHandler<HTMLInputElement>;
  initiateImport?: MouseEventHandler
  handleExport?: () => void;
  redo?: () => void;
  undo?: () => void;
  canRedo?: boolean
  canUndo?: boolean;
  modifiedTime?: string;
  extraControls?: React.ReactNode
}

export default function ModuleFileHeader({ moduleName, isSaving, isSavingError, isSavingSuccess, mimeType, folderId, fileName, setFileName, subtitle, handleImport, initiateImport, handleInitiateCreateFile, modifiedTime, extraControls, className, ...props }: IProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const [ updateFileName, { isLoading: isUpdatingFileName, isSuccess: fileNameUpdateSuccess, isError: updateFileNameIsError } ] = api.commonApis.useRenameFolderAndPrimaryFileMutation();
  useAutoSave({
    autoSaveTrigger: fileName,
    functionTrigger: updateFileName,
    triggerFunctionArguments: { folderId: folderId as string, primaryFileMimeType: mimeType as TMimeTypes, newFileName: `${fileName}.${mimeType?.split("/")[1]}` },
    shouleExecuteTrigger: (!!mimeType && !!folderId),
    autoSaveInterval: 3000 
  });
  const [ hasFired, sethasFired ] = useState<boolean>(false);
  const [ lastSync, setLastSync ] = useState("");
  

  const handleShowMobileSideNav = () => {
    dispatch(sharedSlice.actions.showMobileSidebar());
  };

  // useEffect(() => {
  //   // console.log(folderId)
  //   // console.log(mimeType)
  //   // console.log(fileName)
  //   // console.log(`${fileName}.${mimeType?.split("/")[1]}`)
  //   if (mimeType && folderId) updateFileName({ folderId: folderId as string, primaryFileMimeType: mimeType, newFileName: `${fileName}.${mimeType?.split("/")[1]}` })
  // }, [fileName]);

  useEffect(() => {
    if (modifiedTime) setLastSync(modifiedTime)
  }, [ modifiedTime ])

  useEffect(() => {
    if (hasFired) handleShowMobileSideNav();
    sethasFired(false);
  }, [hasFired]);

  useEffect(() => {
    if (updateFileNameIsError || isSavingError) {
      Toast("error", "Last update unsucessful");
    }
  }, [ updateFileNameIsError, isSavingError ])

  // const handleShowMobileSidebar = () => {
  //   dispatch(sharedSlice.actions.showSidebar());
  // }

  return (
    <section className="sticky top-0 md:landscape:-top-14 lg:landscape:-top-7 md:top- lg:-top-7 flex flex-col z-[3]">
      <div className="p-3.5 bg-primary lg:hidden flex flex-col gap-4">
        <div className="spread-out !gap-5 text-slate-100">
          <div className="text-xl font-helvetica text-slate-100  line-in">
            <LogoWhite className="!size-7" />
            <span className="-mb-1 font-semibold">{moduleName}</span>
          </div>
          <button onClick={() => sethasFired(true)} className=""><HamburgerIcon className="!size-7" /></button>
        </div>
        {/* <div className="line-in md:gap-4 text-sm lg:hidden">
          <HouseIcon />
          <ChevronRight className="!size-4 text-slate-50" />
          <span className="text-slate-500 capitalize">{pathname?.split("/")?.[2]?.replace(/-/ig, " ")}</span>
          <ChevronRight className="!size-4 text-slate-50" />
          <span className="text-slate-100 capitalize">{fileName}</span>
        </div> */}
      </div>
      
      <div className={`w-full  bg-slate-100 max-w-[1100px] mx-auto flex flex-row max-lg:justify-between lg:grid lg:grid-cols-[1fr_max-content] border-b border-b-slate-300 gap-1 md:gap-x-3 max-md:text-center items-en flex-wrap pb-1.5 md:pb-2 pt-1 bg-tes px-3 lg:px-3 ${className}`}>
        <div className="line-in lg:col-span-2 md:gap-4 text-sm max-lg:hidden">
          <HouseIcon />
          <ChevronRight className="!size-4" />
          <span className="text-slate-500 capitalize">{pathname?.split("/")?.[2]?.replace(/-/ig, " ")}</span>
          <ChevronRight className="!size-4" />
          <span className="text-slate-500 capitalize">{fileName?.split(".")?.[0]}</span>
        </div>
        <div className="left grid grid-flow-row max-md:items-cente gap-1 bg-">
          <div className="grid b w-full overflow-x-auto">
            {/* <ResponsiveTextInput className="text-primary [&_*]:!w-max text-2xl font-semibold lg:mt-2 focus:ring-0 focus:outline-none" value={fileName} onChange={setFileName} /> */}
            <input placeholder="[ Document Title ]" className="text-primary text-2xl bg-transparent font-semibold lg:mt-2 focus:ring-0 focus:outline-none" value={fileName} onChange={setFileName} />
          </div>
          {/* <h1 className="text-primary text-2xl font-semibold mt-3 max-md:hidden">{fileName}</h1> */}
          <div className="overflow-x-auto no-scrollbar overflow-y-hidden w-full">
            <div className="line-in text-slate-700 lg:mt-2 !gap-4 text-sm w-max">
              <button onClick={props.undo} disabled={!props.canUndo} className={`line-in !gap-1 disabled:text-slate-400`}><UndoIcon className="!size-5" /> Undo</button>
              <button onClick={props.redo} disabled={!props.canRedo} className="line-in !gap-1 disabled:text-slate-400"><RedoIcon className="!size-5" /> Redo</button>
              { handleImport && <label htmlFor="import-input" className="line-in !gap-1 cursor-pointer"><ImportIcon className="!size-4" /> <input onChange={handleImport} id="import-input" className="hidden" type="file" /> Import</label> }
              { initiateImport && <button onClick={initiateImport} className="line-in !gap-1 cursor-pointer"><ImportIcon className="!size-4" /> Import</button> }
              <button onClick={props.handleExport} className="line-in !gap-1"><ExportIcon className="!size-4" /> Export</button>
              {extraControls}
            </div>
          </div>
          {/* <p className="text-slate-500 max-md:text-sm">{subtitle}</p> */}
        </div>
        <div className="right line-in bg-green-  max-lg:landscape:mt-auto">
          {/* <button onClick={handleImport} className="btn text-primary bg-white border border-slate-200 0"><ImportIcon /> Import</button> */}
          <div className="flex flex-col gap-1 relative flex-wrap items-center md:items-end">
            <button onClick={handleInitiateCreateFile} className="btn w-max bg-primary text-white max-lg:hidden"><PlusIcon className="!size-5 !stroke-[2px]" /> Create New Sheet</button>
            <p className="text-slate-400 text-sm">Last sync: <span className={`duration-500 ${(isSavingSuccess && fileNameUpdateSuccess) ? "text-green-600" : (isSavingError||updateFileNameIsError) ? "text-red-500" : "text-slate-600"}`}>{lastSync ? format(new Date(lastSync), "MMM dd, yyyy, hh:mm:ss a") : "Untracked"}</span></p>
            <LinearProgress color="inherit" className={`${!(isSaving || isUpdatingFileName) && "!hidden"} w-full text-primary !animate-fade-in !absolute -bottom-0.5 left-0`} />
          </div>
        </div>
      </div>
    </section>

  )
}