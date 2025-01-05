import { usePathname } from "next/navigation";
import { ChevronRight, HouseIcon, ImportIcon, PlusIcon } from "./CustomIcons";

interface IProps {
  fileName: string;
  subtitle: string;
  handleInitiateCreateFile: () => void;
  className?: string;
}

export default function ModuleFileHeader({ fileName, subtitle, handleInitiateCreateFile, className }: IProps) {
  const pathname = usePathname();
  const handleImport = () => {

  }
  return (
    <section className={`w-full spread-out gap-3 max-md:text-center max-md:justify-center flex-wrap py-3 md:px-2 lg:px-3 ${className}`}>
      <div className="left flex flex-col gap-1">
        <div className="line-in md:gap-4 max-md:hidden text-sm">
          <HouseIcon />
          <ChevronRight className="!size-4" />
          <span className="text-slate-500 capitalize">{pathname?.split("/")?.[2]?.replace(/-/ig, " ")}</span>
          <ChevronRight className="!size-4" />
          <span className="text-slate-500 capitalize">{fileName}</span>
        </div>
        
        <h1 className="text-slate-900 text-2xl font-semibold mt-3 max-md:hidden">{fileName}</h1>
        {/* <p className="text-slate-500 max-md:text-sm">{subtitle}</p> */}
      </div>
      <div className="right line-in gap-3">
        {/* <button onClick={handleImport} className="btn text-primary bg-white border border-slate-200 0"><ImportIcon /> Import</button> */}
        <div className="flex flex-col gap-2 flex-wrap items-end">
          <button onClick={handleInitiateCreateFile} className="btn w-max bg-primary text-white"><PlusIcon className="!size-5 !stroke-[2px]" /> Create New Sheet</button>
          <p className="text-slate-400 text-sm">Last sync: <span className="text-slate-600">3rd December 2024, 15:00:00</span></p>
        </div>
      </div>
    </section>
  )
}