import { getFoldersWithPrimaryFile } from "@/services/googleDriveService";
import { useModalContext } from "@/sharedComponents/CustomModal";
import { FormSelect, FormText } from "@/sharedComponents/FormInputs";
import { Checkbox, Radio } from "@mui/material";
import { useState } from "react";

export default function SheetExportModal() {
  const { handleModalClose } = useModalContext<Awaited<ReturnType<typeof getFoldersWithPrimaryFile>>[0]>();

  const [ exportOptions, setExportOptions ] = useState({
    exportType: "", exportFormt: "", customOptions: { type: "FROM", value: "" }
  })
  
  const exportTypes = [ { text: "Current Page", value: "CURRENT_PAGE", }, { text: "All Pages", value: "ALL_PAGES", }, { text: "Custom", value: "CUSTOM", }, ]
  const exportFormats = [ { text: "CSV", value: "CSV", }, { text: ".XLSX", value: "XLSX", }, { text: ".PDF", value: "PDF", }, ]
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-medium text-slate-800">Export</h2>
      <p className="text-slate-500">What are you exporting?</p>
      <div className="flex flex-col gap-2 lg:gap-3">
        {
          exportTypes.map((each) => (
            <label htmlFor={each.value} key={each.text} className={`rounded-lg cursor-pointer spread-out text-slate-700 font-medium border border-slate-300 px-4 py-3 lg:py-4 ${exportOptions.exportType === each.value && "bg-slate-100 ring-1 ring-primary"}`}>
              <span className="">{each.text}</span>
              <Radio onChange={(e) => setExportOptions({ ...exportOptions, exportType: each.value})} checked={exportOptions.exportType === each.value} id={each.value} className="!p-0" />
            </label>
          ))
        }
      </div>
      {
        exportOptions.exportType === "CUSTOM"
        && (
          <div className="grid grid-cols-[1FR_2FR] gap-3 mt-3">
            <FormSelect onChange={(e) => setExportOptions({ ...exportOptions, customOptions: { ...exportOptions.customOptions, type: e.target.value }}) } value={exportOptions.customOptions.type} options={[ { text: "From page", value: "FROM" }, { text: "Pages", value: "PAGES" }, ]} />
            {
              exportOptions.customOptions.type === "FROM" ?
              (
                <div className="grid grid-cols-2 gap-2">
                  <FormText placeholder="from" />
                  <FormText placeholder="to" />
                </div>
              )
              : (
                <FormText placeholder="Page numbers separated by commas (,)" />
              )
            }
           
          </div>
        )
      }
      <p className="text-slate-500 mt-1">Choose the Formats you would like to export</p>
      <div className="flex flex-col gap-2 lg:gap-3">
        {
          exportFormats.map((each) => (
            <label htmlFor={each.value} key={each.text} className={`rounded-lg cursor-pointer spread-out text-slate-700 font-medium border border-slate-300 px-4 py-3 lg:py-4 ${exportOptions.exportFormt === each.value && "bg-slate-100 ring-1 ring-primary"}`}>
              <span className="">{each.text}</span>
              <Radio onChange={(e) => setExportOptions({ ...exportOptions, exportFormt: each.value})} checked={exportOptions.exportFormt === each.value} id={each.value} className="!p-0" />
            </label>
          ))
        }
      </div>
      <FormText labelText="Specify alternative export name (optional)" />
      <div className="grid grid-cols-2 gap-3 mt-3">
        <button onClick={handleModalClose} type="button" className="btn-large bg-white border border-zinc-200 text-primary">Cancel</button>
        <button type="submit" className="btn-large bg-primary text-white">Export</button>
      </div>
    </section>
  )
}