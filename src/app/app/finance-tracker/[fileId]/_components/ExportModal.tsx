import { getFoldersWithPrimaryFile } from "@/services/googleDriveService";
import { useModalContext } from "@/sharedComponents/CustomModal";
import { Checkbox, Radio } from "@mui/material";

export default function SheetExportModal() {
  const { handleModalClose } = useModalContext<Awaited<ReturnType<typeof getFoldersWithPrimaryFile>>[0]>();
  
  const exportType = [ { text: "Current Page", value: "", }, { text: "All Pages", value: "", }, ]
  const exportFormat = [ { text: "CSV", value: "", }, { text: ".XLSX", value: "", }, { text: ".PDF", value: "", }, ]
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-medium text-slate-800">Export</h2>
      <p className="text-slate-500">What are you exporting?</p>
      <div className="flex flex-col gap-2 lg:gap-3">
        {
          exportType.map((each) => (
            <div key={each.text} className={`rounded-lg spread-out text-slate-700 font-medium border border-slate-300 px-4 py-3 lg:py-4 `}>
              <span className="">{each.text}</span>
              <Radio className="!p-0" />
            </div>
          ))
        }
      </div>
      <p className="text-slate-500 mt-1">Choose the Formats you would like to export</p>
      <div className="flex flex-col gap-2 lg:gap-3">
        {
          exportFormat.map((each) => (
            <div key={each.text} className={`rounded-lg spread-out text-slate-700 font-medium border border-slate-300 px-4 py-3 lg:py-4`}>
              <span className="">{each.text}</span>
              <Radio className="!p-0" />
            </div>
          ))
        }
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <button onClick={handleModalClose} type="button" className="btn bg-white border border-zinc-200 text-primary">Cancel</button>
        <button type="submit" className="btn bg-primary text-white">Export</button>
      </div>
    </section>
  )
}