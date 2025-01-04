import { ChevronRight, HouseIcon, ImportIcon, PlusIcon } from "./CustomIcons";

export default function ModuleFilesHeader() {
  
  return (
    <section className="w-full spread-out gap-3 max-md:text-center max-md:justify-center flex-wrap">
      <div className="left flex flex-col gap-1">
        <div className="line-in md:gap-4 max-md:hidden lg:gap-5 text-sm">
          <HouseIcon />
          <ChevronRight className="!size-4" />
          <span className="text-slate-500">Finance Tracker</span>
        </div>
        
        <h1 className="text-slate-900 text-2xl lg:text-3xl font-semibold mt-3 max-md:hidden">Finance Tracker</h1>
        <p className="text-slate-500 max-md:text-sm">Track, manage and forecast your customers and orders.</p>
      </div>
      <div className="right line-in gap-3">
        <button className="btn text-primary bg-white border border-slate-200 0"><ImportIcon /> Import</button>
        <button className="btn bg-primary text-white"><PlusIcon /> Create New Sheet</button>
      </div>
    </section>
  )
}