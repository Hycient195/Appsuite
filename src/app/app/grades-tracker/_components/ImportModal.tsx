import { useModalContext } from "@/sharedComponents/CustomModal";
import { Radio } from "@mui/material";
import {  ChangeEvent, useState } from "react";
// import { useFinanceTrackerContext } from "../../_contexts/financeTrackerContext";
import { handleInputChange, handleUpdateStateProperty } from "@/utils/miscelaneous";
import { AnimatePresence, motion } from "motion/react";
import { FormText } from "@/sharedComponents/FormInputs";
import { Toast } from "@/sharedComponents/utilities/Toast";
import { useGradesTrackerContext } from "../_contexts/gradesTrackerContext";

export interface IFinanceTrackerExportOptions {
  importType: "CURRENT_PAGE"|"ENTIRE_DOCUMENT"|"SPECIFIC_PAGE"|""
  importFormat: "CSV"|"JSON"|"",
  customOptions: { page: string }
}

export default function GradesTrackerImportModal() {
  const { handleModalClose, modalData, } = useModalContext<any>();
  const { importCSV, handleCSVImport, pages } = useGradesTrackerContext()

  const [ importOptions, setImportOptions ] = useState<IFinanceTrackerExportOptions>({
    importType: "", importFormat: "CSV", customOptions: { page: "" }
  });
  
  const importTypes = [ { text: `The current Page (page ${modalData?.currentPage + 1})`, value: "CURRENT_PAGE", }, { text: `The entire document`, value: "ENTIRE_DOCUMENT", }, { text: "A specific page", value: "SPECIFIC_PAGE"} ]
  const importFormats = [ { text: "CSV", value: "CSV", } ];


  const onCustomValueBlur = () => {
    if ((importOptions?.customOptions?.page && (Number(importOptions?.customOptions?.page) <= 0 || Number(importOptions?.customOptions?.page) >= pages?.length))) {
      handleUpdateStateProperty(importOptions, setImportOptions, "", "customOptions.page");
      handleUpdateStateProperty(importOptions, setImportOptions, "", "importType");
      Toast("error", "Value out of range");
    }
  };
  
  const importMap = {
    CSV: {
      ENTIRE_DOCUMENT: (e: ChangeEvent<HTMLInputElement>) => {
        handleCSVImport(e)
      },
      CURRENT_PAGE: (e: ChangeEvent<HTMLInputElement>) => {
        handleCSVImport(e, modalData?.currentPage)
      },
      SPECIFIC_PAGE: (e: ChangeEvent<HTMLInputElement>) => {
        if (importOptions?.importType === "SPECIFIC_PAGE" && importOptions?.customOptions?.page === "") {
          handleUpdateStateProperty(importOptions, setImportOptions, "", "importType");
          Toast("error", "Invalid page number");
          return;
        }
        handleCSVImport(e, (Number(importOptions?.customOptions?.page) - 1))
      }
    },
    JSON: {
      ENTIRE_DOCUMENT: () => {

      },
      CURRENT_PAGE: () => {

      },
      SPECIFIC_PAGE: () => {

      }
    }
  };

  const handleExport = (e: ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    importMap[importOptions.importFormat][importOptions.importType](e);
    handleModalClose();
  }

  return (
    <form className="flex flex-col gap-3 max-h-[97dvh] -mx-0.5 px-px overflow-y-auto">
      <h2 className="text-xl font-medium text-slate-800">Import</h2>
      <div className="flex flex-col bg-white z-[30] gap-2">
        <p className="text-slate-500 mt-1  ">Choose the format you would like to import</p>
        <div className="flex flex-col bg-white gap-2 lg:gap-3">
          {
            importFormats.map((each) => (
              <label htmlFor={each.value} key={each.text} className={`rounded-lg cursor-pointer spread-out text-slate-700 font-medium border duration-500 border-slate-300 px-4 py-3 lg:py-4 ${importOptions.importFormat === each.value && "bg-slate-100 ring-1 ring-primary"}`}>
                <span className="">{each.text}</span>
                <Radio onChange={(e) => setImportOptions({ ...importOptions, importFormat: each.value as typeof importOptions.importFormat})} checked={importOptions.importFormat === each.value} id={each.value} className="!p-0 !text-inherit" />
              </label>
            ))
          }
        </div>
     </div>
      <p className="text-slate-500">What page(s) does your import replace?</p>
      <div className="flex flex-col">
        <div className="flex flex-col gap-2 lg:gap-3">
          {
            importTypes.map((each) => (
              <label htmlFor={each.value} key={each.text} className={`rounded-lg cursor-pointer spread-out duration-500 text-slate-700 font-medium border border-slate-300 px-4 py-3 lg:py-4 ${importOptions.importType === each.value && "bg-slate-100 ring-1 ring-primary"}`}>
                <span className="">{each.text}</span>
                <Radio onChange={(e) => setImportOptions({ ...importOptions, importType: each.value as typeof importOptions.importType})} checked={importOptions.importType === each.value} id={each.value} className="!p-0 !text-inherit" />
              </label>
            ))
          }
        </div>
        <AnimatePresence>
          {
            importOptions.importType === "SPECIFIC_PAGE"
            && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                layout
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className=""
              >
                <div className="mt-2 overflow-hidden">
                  <FormText required value={importOptions?.customOptions?.page} name={`customOptions.page`} type="number" onBlur={onCustomValueBlur} onChange={(e) => handleInputChange(e, importOptions, setImportOptions)} placeholder="Specify page number" inputClassName="max-md:placeholder:!text-sm" />
                </div>
              </motion.div>
            )
          }
        </AnimatePresence>
      </div>
      
      
      <div className="grid grid-cols-2 gap-3 mt-1 z-[1] bg-white">
        <button onClick={handleModalClose} type="button" className="btn-large bg-white border border-zinc-200 text-primary">Cancel</button>
        <label htmlFor="file-input" className={`btn-large ${(!importOptions?.importType || !importOptions?.importFormat) ? "bg-zinc-300 cursor-not-allowed" : "bg-primary" }  text-white `}>Import <input type="file" id="file-input" accept={`.${importOptions?.importFormat?.toLowerCase()}`} className="hidden" disabled={!importOptions?.importType || !importOptions?.importFormat} onChange={handleExport} /></label>
      </div>
    </form>
  )
}